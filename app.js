const video = document.getElementById('video');
const canvas = document.getElementById('overlay');
const ctx = canvas.getContext('2d');

const startCameraBtn = document.getElementById('startCameraBtn');
const generateBtn = document.getElementById('generateBtn');
const resetCornersBtn = document.getElementById('resetCornersBtn');

// =========================================
// CONFIG
// =========================================

const GRID_SIZE = 36;
const GRID_DIVISIONS = 12;
const CENTER_RADIUS = 12;
const MIN_DISTANCE = 1;
const PLAYER_DISTANCE = 12;

// =========================================
// STATE
// =========================================

let markers = [];

let corners = [];

let draggingCorner = null;

// =========================================
// INITIALIZE
// =========================================

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  initializeCorners();

  render();
}

window.addEventListener('resize', resizeCanvas);

resizeCanvas();

// =========================================
// CAMERA
// =========================================

async function startCamera() {

  try {

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: {
          ideal: 'environment'
        }
      },
      audio: false
    });

    video.srcObject = stream;

  } catch (error) {

    alert('No se pudo abrir la cámara');

    console.error(error);
  }
}

startCameraBtn.addEventListener('click', startCamera);

// =========================================
// CORNERS
// =========================================

function initializeCorners() {

  const margin = 80;

  corners = [
    { x: margin, y: margin },
    { x: canvas.width - margin, y: margin },
    { x: canvas.width - margin, y: canvas.height - margin },
    { x: margin, y: canvas.height - margin }
  ];
}

resetCornersBtn.addEventListener('click', () => {
  initializeCorners();
  render();
});

// =========================================
// TOUCH + MOUSE
// =========================================

canvas.addEventListener('pointerdown', onPointerDown);
canvas.addEventListener('pointermove', onPointerMove);
canvas.addEventListener('pointerup', onPointerUp);
canvas.addEventListener('pointerleave', onPointerUp);

function onPointerDown(e) {

  const pos = getPointerPosition(e);

  corners.forEach((corner, index) => {

    const dist = distance(pos, corner);

    if (dist < 30) {
      draggingCorner = index;
    }
  });
}

function onPointerMove(e) {

  if (draggingCorner === null) return;

  const pos = getPointerPosition(e);

  corners[draggingCorner] = {
    x: pos.x,
    y: pos.y
  };

  render();
}

function onPointerUp() {
  draggingCorner = null;
}

function getPointerPosition(e) {

  const rect = canvas.getBoundingClientRect();

  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

// =========================================
// MARKERS
// =========================================

function generateMarkers() {

  markers = [];

  const totalPlayers = 3;

  for (let player = 1; player <= totalPlayers; player++) {

    let first = generateValidMarker();

    markers.push({
      ...first,
      player,
      label: `P${player}A`
    });

    let second = generateValidMarker(first);

    markers.push({
      ...second,
      player,
      label: `P${player}B`
    });
  }

  render();
}

function generateValidMarker(referenceMarker = null) {

  let valid = false;
  let point;

  while (!valid) {

    point = randomPointInsideCenter();

    valid = true;

    // Distancia mínima entre todos
    for (const marker of markers) {

      const dist = distance(point, marker);

      if (dist < MIN_DISTANCE) {
        valid = false;
      }
    }

    // Segunda marca del jugador >12
    if (referenceMarker) {

      const dist = distance(point, referenceMarker);

      if (dist <= PLAYER_DISTANCE) {
        valid = false;
      }
    }
  }

  return point;
}

function randomPointInsideCenter() {

  while (true) {

    const x = Math.random() * GRID_SIZE;
    const y = Math.random() * GRID_SIZE;

    const dx = x - 18;
    const dy = y - 18;

    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= CENTER_RADIUS) {

      return { x, y };
    }
  }
}

generateBtn.addEventListener('click', generateMarkers);

// =========================================
// RENDER
// =========================================

function render() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBattlefield();

  drawGrid();

  drawCenterZone();

  drawMarkers();

  drawCorners();
}

// =========================================
// PERSPECTIVE HELPERS
// =========================================

function interpolate(p1, p2, t) {

  return {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t
  };
}

function projectPoint(x, y) {

  const u = x / GRID_SIZE;
  const v = y / GRID_SIZE;

  const top = interpolate(corners[0], corners[1], u);
  const bottom = interpolate(corners[3], corners[2], u);

  return interpolate(top, bottom, v);
}

// =========================================
// DRAW BATTLEFIELD
// =========================================

function drawBattlefield() {

  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(corners[0].x, corners[0].y);
  ctx.lineTo(corners[1].x, corners[1].y);
  ctx.lineTo(corners[2].x, corners[2].y);
  ctx.lineTo(corners[3].x, corners[3].y);
  ctx.closePath();
  ctx.stroke();
}

// =========================================
// DRAW GRID
// =========================================

function drawGrid() {

  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 1;

  for (let i = 0; i <= GRID_DIVISIONS; i++) {

    const t = i / GRID_DIVISIONS;

    // Verticales
    const top = interpolate(corners[0], corners[1], t);
    const bottom = interpolate(corners[3], corners[2], t);

    ctx.beginPath();
    ctx.moveTo(top.x, top.y);
    ctx.lineTo(bottom.x, bottom.y);
    ctx.stroke();

    // Horizontales
    const left = interpolate(corners[0], corners[3], t);
    const right = interpolate(corners[1], corners[2], t);

    ctx.beginPath();
    ctx.moveTo(left.x, left.y);
    ctx.lineTo(right.x, right.y);
    ctx.stroke();
  }
}

// =========================================
// DRAW CENTER ZONE
// =========================================

function drawCenterZone() {

  ctx.strokeStyle = 'rgba(0,255,0,0.8)';
  ctx.lineWidth = 2;

  const steps = 64;

  ctx.beginPath();

  for (let i = 0; i <= steps; i++) {

    const angle = (Math.PI * 2 * i) / steps;

    const x = 18 + Math.cos(angle) * 12;
    const y = 18 + Math.sin(angle) * 12;

    const p = projectPoint(x, y);

    if (i === 0) {
      ctx.moveTo(p.x, p.y);
    } else {
      ctx.lineTo(p.x, p.y);
    }
  }

  ctx.stroke();
}

// =========================================
// DRAW MARKERS
// =========================================

function drawMarkers() {

  markers.forEach(marker => {

    const p = projectPoint(marker.x, marker.y);

    let color = '#ffffff';

    if (marker.player === 1) color = '#ff4444';
    if (marker.player === 2) color = '#4488ff';
    if (marker.player === 3) color = '#44ff88';

    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';

    ctx.fillText(marker.label, p.x, p.y - 16);
  });
}

// =========================================
// DRAW CORNERS
// =========================================

function drawCorners() {

  corners.forEach((corner, index) => {

    ctx.fillStyle = '#ff0000';

    ctx.beginPath();
    ctx.arc(corner.x, corner.y, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';

    ctx.fillText(index + 1, corner.x, corner.y + 5);
  });
}

// =========================================
// UTILS
// =========================================

function distance(a, b) {

  const dx = a.x - b.x;
  const dy = a.y - b.y;

  return Math.sqrt(dx * dx + dy * dy);
}

// =========================================
// START
// =========================================

render();