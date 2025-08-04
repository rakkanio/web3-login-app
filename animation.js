const canvas = document.getElementById('lines');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', () => {
  resizeCanvas();
  createDrops();
});

// Umbrella arc closer to logo (tighter protection zone)
const UMBRELLA_CENTER = () => ({
  x: canvas.width / 2,
  y: canvas.height / 2 + 10
});
const UMBRELLA_RADIUS = () => canvas.width * 0.17; // ⬅️ tighter arc

function isInsideUmbrella(x, y) {
  const { x: cx, y: cy } = UMBRELLA_CENTER();
  const dx = x - cx;
  const dy = y - cy;
  return dy < 0 && dx * dx + dy * dy <= UMBRELLA_RADIUS() ** 2;
}

class Drop {
  constructor(x) {
    this.reset(x);
  }

  reset(x = Math.random() * canvas.width) {
    this.x = x;
    this.y = Math.random() * -canvas.height;
    this.speed = 6 + Math.random() * 2.5;
    this.width = 1.8 + Math.random();
    this.length = 8 + Math.random() * 5;
    this.opacity = 1;
    this.state = 'falling';
  }

  update() {
    if (this.state === 'falling') {
      const nextY = this.y + this.speed;
      if (isInsideUmbrella(this.x, nextY)) {
        this.state = 'fading';
      } else {
        this.y = nextY;
      }
    } else if (this.state === 'fading') {
      this.opacity -= 0.05;
    }

    if (this.opacity <= 0) {
      this.reset();
    }
  }

  draw() {
    ctx.beginPath();
    ctx.ellipse(
      this.x,
      this.y,
      this.width / 2,
      this.length / 2,
      0,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.7})`;
    ctx.shadowColor = `rgba(255, 255, 255, ${this.opacity * 0.5})`;
    ctx.shadowBlur = 4;
    ctx.fill();
  }
}

let drops = [];
function createDrops() {
  drops = Array.from({ length: 250 }, () =>
    new Drop(Math.random() * canvas.width)
  );
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drops.forEach(drop => {
    drop.update();
    drop.draw();
  });
  requestAnimationFrame(animate);
}

createDrops();
animate();