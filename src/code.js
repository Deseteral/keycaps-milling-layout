function calculate() {
  // get values from the form
  const values = {};
  ['xCount', 'yCount', 'keycapSize', 'spaceBetween', 'spaceFromX', 'spaceFromY'].forEach((id) => {
    values[id] = parseInt(document.querySelector(`#${id}`).value, 10);
  });

  const { xCount, yCount, keycapSize, spaceBetween, spaceFromX, spaceFromY } = values;

  // calculate material size
  const materialWidth = (xCount * keycapSize) + ((xCount - 1) * spaceBetween) + (2 * spaceFromX);
  const materialHeight = (yCount * keycapSize) + ((yCount - 1) * spaceBetween) + (2 * spaceFromY);

  // calculate key positions
  const keys = [];

  for (let y = 0; y < yCount; y += 1) {
    for (let x = 0; x < xCount; x += 1) {
      const posX = (spaceFromX + (keycapSize / 2)) + (x * (keycapSize + spaceBetween));
      const posY = (spaceFromY + (keycapSize / 2)) + (y * (keycapSize + spaceBetween));

      keys.push({
        x: posX,
        y: posY,
        size: keycapSize,
      });
    }
  }

  return {
    materialWidth,
    materialHeight,
    keys,
  };
}

function rerender({ materialWidth, materialHeight, keys }) {
  const SCALE = 4;

  // clear
  const tileContainer = document.querySelector('#container');
  tileContainer.innerHTML = '';

  // set material size
  tileContainer.style.width = `${materialWidth * SCALE}px`;
  tileContainer.style.height = `${materialHeight * SCALE}px`;

  document.querySelector('#materialHeight').innerHTML = `${materialWidth} mm`;
  document.querySelector('#materialWidth').innerHTML = `${materialHeight} mm`;

  // render keys
  keys.forEach((key) => {
    const el = document.createElement('div');
    el.className = 'tile';

    el.addEventListener('click', (ev) => ev.target.closest('.tile').classList.toggle('active'));

    el.style.left = `${(key.x - (key.size / 2)) * SCALE}px`;
    el.style.top = `${(materialHeight - (key.y - (key.size / 2)) - key.size) * SCALE}px`;
    el.style.width = `${key.size * SCALE}px`;
    el.style.height = `${key.size * SCALE}px`;

    el.innerHTML = `<div>X ${key.x}</div><div>Y ${key.y}</div>`;

    tileContainer.appendChild(el);
  });
}

function generate() {
  const data = calculate();
  rerender(data);
}

document.querySelector('#generate').addEventListener('click', () => generate());
document.addEventListener('DOMContentLoaded', () => generate());
