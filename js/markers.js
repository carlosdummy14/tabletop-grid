const TABLE_SIZE = 48;
const PLAY_AREA_SIZE = 36;

const PLAY_OFFSET = 6;

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

    const x = PLAY_OFFSET + (Math.random() * PLAY_AREA_SIZE);
    const y = PLAY_OFFSET + (Math.random() * PLAY_AREA_SIZE);

    const dx = x - 24;
    const dy = y - 24;

    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= 12) {
      return { x, y };
    }
  }
}

function distance(a, b) {

  const dx = a.x - b.x;
  const dy = a.y - b.y;

  return Math.sqrt(dx * dx + dy * dy);
}