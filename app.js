const video = document.getElementById('video');

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