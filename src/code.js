function calculate() {
  // get values from the form
  const values = {};
  ['xCount', 'yCount', 'keycapSize', 'spaceBetween', 'spaceFromX', 'spaceFromY'].forEach((id) => {
    values[id] = parseInt(document.querySelector(`#${id}`).value, 10);
  });

  const { xCount, yCount, keycapSize, spaceBetween, spaceFromX, spaceFromY } = values;
  const basePosition = document.querySelector('input[name="basePosition"]:checked').value;

  // calculate material size
  const materialWidth = (xCount * keycapSize) + ((xCount - 1) * spaceBetween) + (2 * spaceFromX);
  const materialHeight = (yCount * keycapSize) + ((yCount - 1) * spaceBetween) + (2 * spaceFromY);

  // calculate key positions
  const keys = [];

  const materialCenterX = (materialWidth / 2);
  const materialCenterY = (materialHeight / 2);

  for (let y = 0; y < yCount; y += 1) {
    for (let x = 0; x < xCount; x += 1) {
      const posX = (spaceFromX + (keycapSize / 2)) + (x * (keycapSize + spaceBetween));
      const posY = (spaceFromY + (keycapSize / 2)) + (y * (keycapSize + spaceBetween));

      const fromCenterX = (posX - materialCenterX);
      const fromCenterY = (posY - materialCenterY);

      keys.push({
        x: posX,
        y: posY,
        fromCenterX,
        fromCenterY,
        size: keycapSize,
      });
    }
  }

  return {
    materialWidth,
    materialHeight,
    basePosition,
    keys,
  };
}

function rerender({ materialWidth, materialHeight, basePosition, keys }) {
  const RENDER_SCALE = 4;

  // clear
  const tileContainer = document.querySelector('#container');
  tileContainer.innerHTML = '';

  // set material size
  tileContainer.style.width = `${materialWidth * RENDER_SCALE}px`;
  tileContainer.style.height = `${materialHeight * RENDER_SCALE}px`;

  document.querySelector('#materialHeight').innerHTML = `${materialWidth} mm`;
  document.querySelector('#materialWidth').innerHTML = `${materialHeight} mm`;

  // render keys
  keys.forEach((key) => {
    const el = document.createElement('div');
    el.className = 'tile';

    el.addEventListener('click', (ev) => ev.target.closest('.tile').classList.toggle('active'));

    el.style.left = `${(key.x - (key.size / 2)) * RENDER_SCALE}px`;
    el.style.top = `${(materialHeight - (key.y - (key.size / 2)) - key.size) * RENDER_SCALE}px`;
    el.style.width = `${key.size * RENDER_SCALE}px`;
    el.style.height = `${key.size * RENDER_SCALE}px`;

    const valX = (basePosition === 'center') ? key.fromCenterX : key.x;
    const valY = (basePosition === 'center') ? key.fromCenterY : key.y;
    el.innerHTML = `<div>X ${valX}</div><div>Y ${valY}</div>`;

    tileContainer.appendChild(el);
  });
}

function generate() {
  const data = calculate();
  rerender(data);
}

document.querySelector('#generate').addEventListener('click', () => generate());
document.addEventListener('DOMContentLoaded', () => generate());
