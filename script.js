const html = document.documentElement;
const canvas = document.getElementById("hero-lightpass");
const context = canvas.getContext("2d");

const frameCount = 240;
const currentFrame = index => (
  `./frames/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`
);

const preloadImages = () => {
  for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
  }
};

const img = new Image();
img.src = currentFrame(1);
canvas.width = 1158;
canvas.height = 770;
img.onload = function() {
  context.drawImage(img, 0, 0);
}

const updateImage = index => {
  img.src = currentFrame(index);
  context.drawImage(img, 0, 0);
}

window.addEventListener('scroll', () => {  
  const scrollTop = html.scrollTop;
  const maxScrollTop = html.scrollHeight - window.innerHeight;
  const scrollFraction = scrollTop / maxScrollTop;
  const frameIndex = Math.min(
    frameCount - 1,
    Math.ceil(scrollFraction * frameCount)
  );
  
  requestAnimationFrame(() => updateImage(frameIndex + 1));
});

preloadImages();

// --- CHATBOT LOGIC ---

const chatToggle = document.getElementById('chat-toggle');
const chatWidget = document.getElementById('chat-widget');
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatBody = document.getElementById('chat-body');

chatToggle.addEventListener('click', () => {
    chatWidget.style.display = chatWidget.style.display === 'flex' ? 'none' : 'flex';
});

const API_KEY = "YOUR_GEMINI_API_KEY"; // REPLACE THIS

async function getChatResponse(message) {
    const systemPrompt = `You are an assistant for Vignesh Arikrishnan. 
    Answer questions ONLY using this info: 
    Electronics & Comm Engineering student at Govt College Tirunelveli (Anna University). 
    Skills: Python, C, Embedded C, Arduino, ThingsBoard, Networking, IoT. 
    CGPA: 84%. Projects: Obstacle Avoidance Robot (Arduino), AQI Sensor Simulation. 
    Email: vignesharikrishnanacmv@gmail.com. Phone: 8015547704.
    If the answer isn't here, say "I'm sorry, I don't have that information."`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt + "\n\nUser Question: " + message }] }]
            })
        });
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        return "Offline. Please try again later.";
    }
}

sendBtn.addEventListener('click', async () => {
    const text = userInput.value;
    if (!text) return;

    chatBody.innerHTML += `<div class="user-msg">${text}</div>`;
    userInput.value = '';
    
    const response = await getChatResponse(text);
    chatBody.innerHTML += `<div class="bot-msg">${response}</div>`;
    chatBody.scrollTop = chatBody.scrollHeight;
});
