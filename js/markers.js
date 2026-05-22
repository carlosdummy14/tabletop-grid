const GRID_SIZE = 36;
const CENTER_RADIUS = 12;
const MIN_DISTANCE = 1;
const PLAYER_DISTANCE = 12;

export function generateMarkers(totalPlayers = 3) {

  const markers = [];

  for (let player = 1; player <= totalPlayers; player++) {

    const first = generateValidMarker(markers);

    markers.push({
      ...first,
      player,
      label: `P${player}A`
    });

    const second = generateValidMarker(markers, first);

    markers.push({
      ...second,
      player,
      label: `P${player}B`
    });
  }

  return markers;
}

function generateValidMarker(markers, referenceMarker = null) {

  while (true) {

    const point = randomPointInsideCenter();

    let valid = true;

    for (const marker of markers) {

      const dist = distance(point, marker);

      if (dist < MIN_DISTANCE) {
        valid = false;
      }
    }

    if (referenceMarker) {

      const dist = distance(point, referenceMarker);

      if (dist <= PLAYER_DISTANCE) {
        valid = false;
      }
    }

    if (valid) {
      return point;
    }
  }
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

function distance(a, b) {

  const dx = a.x - b.x;
  const dy = a.y - b.y;

  return Math.sqrt(dx * dx + dy * dy);
}