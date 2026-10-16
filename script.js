const $ = (id) => document.getElementById(id);

function celebrate() {
  const colors = ["#ff35d3", "#00f5ff", "#faff00", "#a855ff", "#ffffff"];
  const layer = $("confetti-layer");

  for (let i = 0; i < 100; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti";
    piece.style.left = Math.random() * 100 + "%";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = Math.random() * 0.8 + "s";
    piece.style.animationDuration = (1.8 + Math.random() * 1.8) + "s";
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    layer.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove());
  }

  $("counter").textContent = "🎉 GOLD MEDAL CELEBRATION ACTIVATED!";
}

$("celebrate").addEventListener("click", celebrate);
$("confettiBtn").addEventListener("click", celebrate);

$("surpriseBtn").addEventListener("click", () => {
  const surprise = $("surprise");
  surprise.classList.add("show");
  $("surpriseBtn").textContent = "MESSAGE UNLOCKED ❤️";
  surprise.scrollIntoView({ behavior: "smooth", block: "center" });
  celebrate();
});

let energy = 0;

$("energyBtn").addEventListener("click", () => {
  energy = Math.min(energy + 20, 100);
  $("energyValue").textContent = "Energy: " + energy + "%";

  if (energy === 100) {
    $("energyValue").textContent = "⚡ MAXIMUM CHAMPION POWER! ⚡";
    celebrate();
    energy = 0;
  }
});

const compliments = [
  "Praveen Uncle = LEGENDARY! 🌟",
  "The coolest uncle award goes to YOU! 🏆",
  "Uncle, you deserve a gold medal too! 🥇",
  "100% awesome. 0% boring. 😎",
  "Officially promoted to SUPER UNCLE! ⚡",
  "Warning: Too much awesomeness detected! 🚀"
];

$("complimentBtn").addEventListener("click", () => {
  const current = $("reaction").textContent;
  let options = compliments.filter((item) => item !== current);
  const message = options[Math.floor(Math.random() * options.length)];
  $("reaction").textContent = message;
});

const bubbleLayer = $("bubble-layer");

for (let i = 0; i < 24; i++) {
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.style.left = Math.random() * 100 + "%";
  bubble.style.animationDuration = (8 + Math.random() * 14) + "s";
  bubble.style.animationDelay = (-Math.random() * 15) + "s";
  const size = 4 + Math.random() * 12;
  bubble.style.width = size + "px";
  bubble.style.height = size + "px";
  bubbleLayer.appendChild(bubble);
}


// Neon Swim Challenge game (added without changing the original website features)
(() => {
  const canvas = document.getElementById("swimCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const $game = id => document.getElementById(id);
  const W = canvas.width, H = canvas.height;
  // Animated pixel-art swimmer sprite (keep swimmer-pixel.gif beside these files).
  const swimmerSprite = new Image();
  swimmerSprite.src = "swimmer-pixel.gif";

  let swimmer, medals, obstacles, bubbles;
  let score, lives, distance, frame, spawnMedal, spawnObstacle;
  let running = false, gameOver = false, animationId = null, lastTime = 0;
  let keys = {}, touchDirection = 0;

  function reset() {
    swimmer = { x: 115, y: H / 2, r: 18 };
    medals = [];
    obstacles = [];
    bubbles = [];
    score = 0; lives = 3; distance = 0; frame = 0;
    spawnMedal = 35; spawnObstacle = 100;
    gameOver = false;
    for (let i = 0; i < 24; i++) {
      bubbles.push({
        x: Math.random() * W, y: Math.random() * H,
        r: 1 + Math.random() * 3, speed: 0.5 + Math.random() * 1.5
      });
    }
    updateStats();
    draw();
  }

  function updateStats() {
    $game("gameScore").textContent = score;
    $game("gameLives").textContent = lives;
    $game("gameDistance").textContent = Math.floor(distance);
  }

  function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, W, H);
    gradient.addColorStop(0, "#081c3e");
    gradient.addColorStop(1, "#160c35");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);
    for (let y = 55; y < H; y += 75) {
      ctx.strokeStyle = "#00f5ff45";
      ctx.lineWidth = 2;
      ctx.setLineDash([12, 10]);
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    ctx.setLineDash([]);
    bubbles.forEach(b => {
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.strokeStyle = "#00f5ff75"; ctx.stroke();
    });
  }

  function drawSwimmer() {
    ctx.save();
    // A soft neon aura keeps the pixel-art sprite consistent with the game UI.
    ctx.shadowBlur = 22;
    ctx.shadowColor = "#00f5ff";
    const aura = ctx.createRadialGradient(swimmer.x, swimmer.y, 4, swimmer.x, swimmer.y, 56);
    aura.addColorStop(0, "#00f5ff45");
    aura.addColorStop(1, "#00f5ff00");
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(swimmer.x, swimmer.y, 56, 0, Math.PI * 2);
    ctx.fill();

    if (swimmerSprite.complete && swimmerSprite.naturalWidth > 0) {
      // The GIF animates automatically in the browser when drawn to canvas.
      ctx.shadowBlur = 12;
      ctx.shadowColor = "#ff35d3";
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(swimmerSprite, swimmer.x - 42, swimmer.y - 23, 84, 46);
      ctx.imageSmoothingEnabled = true;
    } else {
      // Fallback if the sprite file is missing: draw a visible neon swimmer marker.
      ctx.fillStyle = "#ff35d3";
      ctx.strokeStyle = "#00f5ff";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(swimmer.x, swimmer.y, 26, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#faff00";
      ctx.beginPath();
      ctx.arc(swimmer.x + 23, swimmer.y - 7, 7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawMedal(m) {
    ctx.save(); ctx.translate(m.x, m.y);
    ctx.shadowBlur = 16; ctx.shadowColor = "#faff00";
    ctx.fillStyle = "#faff00";
    ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#986500"; ctx.font = "bold 15px Arial";
    ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("★", 0, 1);
    ctx.restore();
  }

  function drawObstacle(o) {
    ctx.save(); ctx.shadowBlur = 12; ctx.shadowColor = "#ff35d3";
    ctx.fillStyle = "#ff35d3"; ctx.fillRect(o.x - 12, o.y - 17, 24, 34);
    ctx.strokeStyle = "#fff"; ctx.lineWidth = 2;
    ctx.strokeRect(o.x - 12, o.y - 17, 24, 34); ctx.restore();
  }

  function draw() {
    drawBackground();
    medals.forEach(drawMedal);
    obstacles.forEach(drawObstacle);
    drawSwimmer();
    if (!running && !gameOver) {
      ctx.fillStyle = "#fff"; ctx.textAlign = "center";
      ctx.font = "bold 23px Arial"; ctx.fillText("NEON SWIM CHALLENGE", W / 2, 35);
    }
    if (gameOver) {
      ctx.fillStyle = "#08051ddd"; ctx.fillRect(0, 0, W, H);
      ctx.textAlign = "center"; ctx.fillStyle = "#faff00";
      ctx.font = "bold 34px Arial"; ctx.fillText("RACE OVER!", W / 2, H / 2 - 15);
      ctx.fillStyle = "#00f5ff"; ctx.font = "bold 20px Arial";
      ctx.fillText("FINAL SCORE: " + score, W / 2, H / 2 + 25);
    }
  }

  function hit(a, b, radius) {
    return Math.hypot(a.x - b.x, a.y - b.y) < radius;
  }

  function endGame() {
    running = false; gameOver = true;
    $game("gameMessage").textContent = "🏁 RACE FINISHED! Score: " + score;
    cancelAnimationFrame(animationId); animationId = null; draw();
  }

  function update(dt) {
    frame += dt; distance += dt * 0.12;
    bubbles.forEach(b => {
      b.x -= b.speed * dt * 0.06;
      if (b.x < -5) { b.x = W + 5; b.y = Math.random() * H; }
    });

    const swimSpeed = 0.23 * dt;
    if (keys.ArrowUp || keys.w || touchDirection === -1) swimmer.y -= swimSpeed;
    if (keys.ArrowDown || keys.s || touchDirection === 1) swimmer.y += swimSpeed;
    swimmer.y = Math.max(28, Math.min(H - 28, swimmer.y));

    spawnMedal -= dt / 16.67;
    spawnObstacle -= dt / 16.67;
    if (spawnMedal <= 0) {
      medals.push({ x: W + 20, y: 40 + Math.random() * (H - 80) });
      spawnMedal = 50 + Math.random() * 55;
    }
    if (spawnObstacle <= 0) {
      obstacles.push({ x: W + 20, y: 35 + Math.random() * (H - 70) });
      spawnObstacle = Math.max(45, 100 - distance / 8) + Math.random() * 45;
    }

    const objectSpeed = (0.19 + Math.min(distance / 3000, 0.15)) * dt;
    medals.forEach(m => m.x -= objectSpeed);
    obstacles.forEach(o => o.x -= objectSpeed);

    medals = medals.filter(m => {
      if (hit(swimmer, m, 25)) {
        score += 10;
        $game("gameMessage").textContent = "✨ MEDAL COLLECTED! +10 POINTS";
        return false;
      }
      return m.x > -25;
    });

    obstacles = obstacles.filter(o => {
      if (hit(swimmer, o, 26)) {
        lives--;
        $game("gameMessage").textContent = "💥 OOPS! Watch out for obstacles!";
        return false;
      }
      return o.x > -25;
    });

    updateStats();
    if (lives <= 0) endGame();
  }

  function loop(now) {
    if (!running) return;
    const dt = Math.min(now - (lastTime || now), 32);
    lastTime = now;
    update(dt);
    draw();
    if (running) animationId = requestAnimationFrame(loop);
  }

  function startGame() {
    if (running) return;
    if (gameOver) reset();
    running = true; gameOver = false; lastTime = 0;
    $game("gameMessage").textContent = "🏊 SWIM, COLLECT, AND WIN!";
    cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(loop);
  }

  function pauseGame() {
    if (running) {
      running = false;
      cancelAnimationFrame(animationId); animationId = null;
      $game("gameMessage").textContent = "⏸ PAUSED — PRESS START TO CONTINUE";
    } else if (!gameOver) {
      startGame();
    }
  }

  $game("startSwim").addEventListener("click", startGame);
  $game("pauseSwim").addEventListener("click", pauseGame);
  $game("restartSwim").addEventListener("click", () => {
    running = false; cancelAnimationFrame(animationId); animationId = null;
    reset(); $game("gameMessage").textContent = "🔄 NEW RACE READY!";
  });

  $game("swimUp").addEventListener("pointerdown", e => {
    e.preventDefault(); touchDirection = -1;
  });
  $game("swimDown").addEventListener("pointerdown", e => {
    e.preventDefault(); touchDirection = 1;
  });
  ["swimUp", "swimDown"].forEach(id => {
    const btn = $game(id);
    ["pointerup", "pointercancel", "pointerleave"].forEach(event => {
      btn.addEventListener(event, () => touchDirection = 0);
    });
  });

  window.addEventListener("keydown", e => {
    if (["ArrowUp", "ArrowDown"].includes(e.key)) e.preventDefault();
    keys[e.key] = true;
  });
  window.addEventListener("keyup", e => { keys[e.key] = false; });
  window.addEventListener("blur", () => { keys = {}; touchDirection = 0; });

  reset();
})();
