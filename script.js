// --- 1. SCROLL ANIMATION LOGIC ---
const canvas = document.getElementById("animation-canvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const frameCount = 240;
const currentFrame = index => (
  `frames/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`
);

const images = [];
const frameIndex = { frame: 0 };

// Preload images
for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

const render = () => {
  const scrollFraction = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  const index = Math.min(frameCount - 1, Math.floor(scrollFraction * frameCount));
  
  if (images[index]) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(images[index], 0, 0, canvas.width, canvas.height);
  }
};

window.addEventListener("scroll", render);
images[0].onload = render;

// --- 2. CHATBOT LOGIC ---
const SYSTEM_PROMPT = `
You are a career assistant for Vignesh Arikrishnan[cite: 1]. 
STRICT RULE: Answer ONLY using information from the following context:
- Education: Pursuing B.E.(E.C.E) at Government College of Engineering, Tirunelveli (2027).
- Technical Strengths: Python, C, Embedded C, Excel[cite: 7].
- Projects: Obstacle Avoidance Robot (Arduino), AQI Sensor Simulation (Python/ThingsBoard).
- Skills: Problem solving, quick learner, effective communicator[cite: 9].
- Languages: Tamil (Native), English (Professional)[cite: 19, 21].
If the user asks something NOT in this list, politely decline to answer.
`;

const API_KEY = "YOUR_GEMINI_API_KEY"; // Replace with your actual key

document.getElementById('send-btn').addEventListener('click', async () => {
    const inputField = document.getElementById('user-input');
    const userText = inputField.value;
    if (!userText) return;

    appendMessage('User', userText);
    inputField.value = '';

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: SYSTEM_PROMPT + "\nUser Question: " + userText }]
                }]
            })
        });

        const data = await response.json();
        const botText = data.candidates[0].content.parts[0].text;
        appendMessage('Bot', botText);
    } catch (error) {
        appendMessage('Bot', "Error connecting to AI.");
    }
});

function appendMessage(sender, text) {
    const history = document.getElementById('chat-history');
    const msg = document.createElement('div');
    msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
    history.appendChild(msg);
    history.scrollTop = history.scrollHeight;
}
