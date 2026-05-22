import { startCamera } from './camera.js';
import { generateMarkers } from './markers.js';
import { renderScene } from './renderer.js';

const video = document.getElementById('video');
const canvas = document.getElementById('overlay');
const ctx = canvas.getContext('2d');

const startCameraBtn = document.getElementById('startCameraBtn');
const generateBtn = document.getElementById('generateBtn');
const resetCornersBtn = document.getElementById('resetCornersBtn');

let markers = [];

let corners = [];

let draggingCorner = null;

function initializeCorners() {

  const margin = 80;

  corners = [
    { x: margin, y: margin },
    { x: canvas.width - margin, y: margin },
    { x: canvas.width - margin, y: canvas.height - margin },
    { x: margin, y: canvas.height - margin }
  ];
}

function resizeCanvas() {

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  initializeCorners();

  render();
}

window.addEventListener('resize', resizeCanvas);

resizeCanvas();

function render() {
  renderScene(ctx, canvas, corners, markers);
}

startCameraBtn.addEventListener('click', () => {
  startCamera(video);
});

generateBtn.addEventListener('click', () => {

  markers = generateMarkers(3);

  render();
});

resetCornersBtn.addEventListener('click', () => {

  initializeCorners();

  render();
});

canvas.addEventListener('pointerdown', e => {

  const pos = getPointerPosition(e);

  corners.forEach((corner, index) => {

    const dx = pos.x - corner.x;
    const dy = pos.y - corner.y;

    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 30) {
      draggingCorner = index;
    }
  });
});

canvas.addEventListener('pointermove', e => {

  if (draggingCorner === null) return;

  const pos = getPointerPosition(e);

  corners[draggingCorner] = pos;

  render();
});

canvas.addEventListener('pointerup', () => {
  draggingCorner = null;
});

function getPointerPosition(e) {

  const rect = canvas.getBoundingClientRect();

  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

render();