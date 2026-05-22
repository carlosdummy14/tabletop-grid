const GRID_SIZE = 36;
const GRID_DIVISIONS = 12;

export function renderScene(ctx, canvas, corners, markers) {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBattlefield(ctx, corners);
  drawGrid(ctx, corners);
  drawCenterZone(ctx, corners);
  drawMarkers(ctx, corners, markers);
  drawCorners(ctx, corners);
}

function interpolate(p1, p2, t) {

  return {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t
  };
}

function projectPoint(corners, x, y) {

  const u = x / GRID_SIZE;
  const v = y / GRID_SIZE;

  const top = interpolate(corners[0], corners[1], u);
  const bottom = interpolate(corners[3], corners[2], u);

  return interpolate(top, bottom, v);
}

function drawBattlefield(ctx, corners) {

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

function drawGrid(ctx, corners) {

  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 1;

  for (let i = 0; i <= GRID_DIVISIONS; i++) {

    const t = i / GRID_DIVISIONS;

    const top = interpolate(corners[0], corners[1], t);
    const bottom = interpolate(corners[3], corners[2], t);

    ctx.beginPath();
    ctx.moveTo(top.x, top.y);
    ctx.lineTo(bottom.x, bottom.y);
    ctx.stroke();

    const left = interpolate(corners[0], corners[3], t);
    const right = interpolate(corners[1], corners[2], t);

    ctx.beginPath();
    ctx.moveTo(left.x, left.y);
    ctx.lineTo(right.x, right.y);
    ctx.stroke();
  }
}

function drawCenterZone(ctx, corners) {

  ctx.strokeStyle = 'rgba(0,255,0,0.8)';
  ctx.lineWidth = 2;

  const steps = 64;

  ctx.beginPath();

  for (let i = 0; i <= steps; i++) {

    const angle = (Math.PI * 2 * i) / steps;

    const x = 18 + Math.cos(angle) * 12;
    const y = 18 + Math.sin(angle) * 12;

    const p = projectPoint(corners, x, y);

    if (i === 0) {
      ctx.moveTo(p.x, p.y);
    } else {
      ctx.lineTo(p.x, p.y);
    }
  }

  ctx.stroke();
}

function drawMarkers(ctx, corners, markers) {

  markers.forEach(marker => {

    const p = projectPoint(corners, marker.x, marker.y);

    ctx.fillStyle = '#ffffff';

    ctx.beginPath();
    ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';

    ctx.fillText(marker.label, p.x, p.y - 16);
  });
}

function drawCorners(ctx, corners) {

  corners.forEach((corner, index) => {

    ctx.fillStyle = '#ff0000';

    ctx.beginPath();
    ctx.arc(corner.x, corner.y, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';

    ctx.fillText(index + 1, corner.x - 4, corner.y + 5);
  });
}