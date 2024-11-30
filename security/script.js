const canvas = document.getElementById('cyberCanvas');
const ctx = canvas.getContext('2d');

// Resize canvas to fit window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let mouse = { x: undefined, y: undefined };

// Particle class for animation
class Particle {
  constructor(x, y, isMouse = false) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 3 + 2; // Particle size
    this.speedX = isMouse ? 0 : Math.random() * 2 - 1;
    this.speedY = isMouse ? 0 : Math.random() * 2 - 1;
    this.isMouse = isMouse;
    this.color = isMouse
      ? 'rgba(255, 99, 71, 1)' // Mouse particle color
      : `rgba(${Math.random() * 200 + 50}, 200, 255, 0.9)`; // Random colors for other particles
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = this.isMouse ? 40 : 20; // Glowing effect
    ctx.fill();
    ctx.closePath();
  }

  update() {
    if (!this.isMouse) {
      this.x += this.speedX;
      this.y += this.speedY;

      // Bounce off edges
      if (this.x <= 0 || this.x >= canvas.width) this.speedX *= -1;
      if (this.y <= 0 || this.y >= canvas.height) this.speedY *= -1;
    } else {
      this.x = mouse.x;
      this.y = mouse.y;
    }
  }
}

// Create particles for the background
function createParticles() {
  particles = [];
  const numParticles = 100; // Number of particles
  for (let i = 0; i < numParticles; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    particles.push(new Particle(x, y));
  }

  // Add a special particle for mouse movement
  particles.push(new Particle(mouse.x, mouse.y, true));
}

// Connect particles with glowing lines
function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 150})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
      }
    }
  }
}

// Animation loop
function animate() {
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#1a1a2e'); // Dark blue
  gradient.addColorStop(1, '#16213e'); // Dark navy
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });
  connectParticles();
  requestAnimationFrame(animate);
}

// Adjust canvas size dynamically
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  createParticles();
});

// Track mouse movement
window.addEventListener('mousemove', (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

// Initialize particles and start animation
createParticles();
animate();
