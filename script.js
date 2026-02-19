const canvas = document.getElementById("animationCanvas");
const context = canvas.getContext("2d");

const frameCount = 240;
const images = [];
const imageSeq = {
    frame: 0
};

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Generate image path with 3-digit padding
function currentFrame(index) {
    const paddedIndex = String(index).padStart(3, '0');
    return `frames/ezgif-frame-${paddedIndex}.jpg`;
}

// Preload images
for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
}

// Draw image
function drawImage(img) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    const scale = Math.max(
        canvas.width / img.width,
        canvas.height / img.height
    );

    const x = (canvas.width / 2) - (img.width / 2) * scale;
    const y = (canvas.height / 2) - (img.height / 2) * scale;

    context.drawImage(
        img,
        x,
        y,
        img.width * scale,
        img.height * scale
    );
}

// Initial frame
images[0].onload = () => {
    drawImage(images[0]);
};

// Scroll animation
window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollFraction = scrollTop / maxScroll;
    const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
    );

    requestAnimationFrame(() => drawImage(images[frameIndex]));
});
