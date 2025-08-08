const container = document.querySelector('.container');
const startScreen = document.getElementById('start-screen');
const audio = document.getElementById('bg-audio');
const volumeSlider = document.getElementById('volume');

// Verifica se é tela pequena para desativar efeito 3D em toque
const isSmallScreen = window.innerWidth <= 768;

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;
const maxRotation = 40; // efeito mais intenso

function lerp(start, end, t) {
  return start + (end - start) * t;
}

if (!isSmallScreen) {
  container.addEventListener('mousemove', (e) => {
    const { width, height, left, top } = container.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    targetX = ((y / height) - 0.5) * maxRotation;
    targetY = ((x / width) - 0.5) * maxRotation;
  });

  container.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
  });

  function animate() {
    currentX = lerp(currentX, targetX, 0.1);
    currentY = lerp(currentY, targetY, 0.1);

    container.style.transform = `rotateX(${-currentX}deg) rotateY(${currentY}deg)`;

    requestAnimationFrame(animate);
  }
  animate();
}

// Start-screen fade-out e play áudio
startScreen.addEventListener('click', () => {
  startScreen.classList.add('fade-out');  // dispara a animação CSS
  setTimeout(() => {
    startScreen.style.display = 'none'; // esconde a tela após a animação
    if(audio) audio.play();             // toca áudio
  }, 200); // tempo igual à duração da animação
});

// Controle de volume do áudio
volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value;
});

// Força autoplay do vídeo (pode ajudar em alguns browsers)
document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('bg-video');
  if (video) {
    video.muted = true;
    video.play().catch(err => {
      console.warn('Autoplay do vídeo falhou:', err);
    });
  }
});

// Partículas lentas e visíveis apenas dentro das letras
const canvas = document.getElementById("particles-canvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", () => {
  resizeCanvas();
  createParticles(60);
});

function createParticles(count) {
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.2 + 0.3,
      speedY: Math.random() * 0.3 + 0.1, // bem lento
      opacity: Math.random() * 0.5 + 0.5,
    });
  }
}
createParticles(60);

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Define texto como "máscara de recorte"
  ctx.save();
  const text = "romankingkkj";
  const fontSize = canvas.height * 0.8;
  ctx.font = `bold ${fontSize}px 'Segoe UI', sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  ctx.beginPath();
  ctx.fillText(text, centerX, centerY);
  ctx.clip(); // tudo que for desenhado agora só aparece dentro do texto

  for (let p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
    ctx.fill();
    p.y += p.speedY;
    if (p.y > canvas.height) {
      p.y = 0;
      p.x = Math.random() * canvas.width;
    }
  }

  ctx.restore(); // remove o recorte

  requestAnimationFrame(drawParticles);
}
drawParticles();


