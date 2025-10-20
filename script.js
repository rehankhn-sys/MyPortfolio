// Smooth scroll effect
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Simple contact form alert
document.querySelector('.contact-form').addEventListener('submit', function (e) {
  e.preventDefault();
  alert('Thank you for reaching out, Rehan will get back to you soon!');
  this.reset();
});

// Particle background animation
const particleCanvas = document.createElement('canvas');
particleCanvas.id = 'particleCanvas';
document.body.prepend(particleCanvas);
const ctx1 = particleCanvas.getContext('2d');

const waveCanvas = document.createElement('canvas');
waveCanvas.id = 'waveCanvas';
document.body.prepend(waveCanvas);
const ctx2 = waveCanvas.getContext('2d');

let particles = [];
const numParticles = 70;

function initParticles() {
  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;
  particles = [];
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * particleCanvas.width,
      y: Math.random() * particleCanvas.height,
      size: Math.random() * 3,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
    });
  }
}

function animateParticles() {
  ctx1.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
  ctx1.fillStyle = 'rgba(0, 188, 212, 0.8)';
  particles.forEach(p => {
    ctx1.beginPath();
    ctx1.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx1.fill();
    p.x += p.speedX;
    p.y += p.speedY;
    if (p.x < 0 || p.x > particleCanvas.width) p.speedX *= -1;
    if (p.y < 0 || p.y > particleCanvas.height) p.speedY *= -1;
  });
  requestAnimationFrame(animateParticles);
}

// Neon wave grid animation
let waveTime = 0;
function animateWaves() {
  waveCanvas.width = window.innerWidth;
  waveCanvas.height = window.innerHeight;
  ctx2.clearRect(0, 0, waveCanvas.width, waveCanvas.height);
  ctx2.strokeStyle = 'rgba(0, 188, 212, 0.2)';
  ctx2.lineWidth = 1;

  const gridSize = 40;
  for (let y = 0; y < waveCanvas.height; y += gridSize) {
    ctx2.beginPath();
    for (let x = 0; x < waveCanvas.width; x += gridSize) {
      const waveY = Math.sin((x + waveTime) * 0.02) * 8;
      ctx2.lineTo(x, y + waveY);
    }
    ctx2.stroke();
  }

  waveTime += 1.5;
  requestAnimationFrame(animateWaves);
}

window.addEventListener('resize', () => {
  initParticles();
});

initParticles();
animateParticles();
animateWaves();
