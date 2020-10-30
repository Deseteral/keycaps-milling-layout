function getFormValues() {
  const values = {};

  ['xCount', 'yCount', 'keycapSize', 'spaceBetween', 'spaceFromX', 'spaceFromY'].forEach((id) => {
    values[id] = parseInt(document.querySelector(`#${id}`).value, 10);
  });

  values.basePosition = document.querySelector('input[name="basePosition"]:checked').value;

  return values;
}

function calculateMaterial() {
  const { xCount, yCount, keycapSize, spaceBetween, spaceFromX, spaceFromY } = getFormValues();

  const materialWidth = (xCount * keycapSize) + ((xCount - 1) * spaceBetween) + (2 * spaceFromX);
  const materialHeight = (yCount * keycapSize) + ((yCount - 1) * spaceBetween) + (2 * spaceFromY);

  const materialCenterX = (materialWidth / 2);
  const materialCenterY = (materialHeight / 2);

  return {
    width: materialWidth,
    height: materialHeight,
    centerX: materialCenterX,
    centerY: materialCenterY,
  };
}

function calculateKeys() {
  const { xCount, yCount, keycapSize, spaceBetween, spaceFromX, spaceFromY } = getFormValues();
  const material = calculateMaterial();

  const keys = [];

  for (let y = 0; y < yCount; y += 1) {
    for (let x = 0; x < xCount; x += 1) {
      const posX = (spaceFromX + (keycapSize / 2)) + (x * (keycapSize + spaceBetween));
      const posY = (spaceFromY + (keycapSize / 2)) + (y * (keycapSize + spaceBetween));

      const fromCenterX = (posX - material.centerX);
      const fromCenterY = (posY - material.centerY);

      keys.push({
        x: posX,
        y: posY,
        fromCenterX,
        fromCenterY,
        size: keycapSize,
      });
    }
  }

  return keys;
}

function calculate() {
  const material = calculateMaterial();
  const keys = calculateKeys();
  const { basePosition } = getFormValues();

  return {
    material,
    basePosition,
    keys,
  };
}

function rerender({ material, basePosition, keys }) {
  const RENDER_SCALE = 4;

  // clear
  const tileContainer = document.querySelector('#container');
  tileContainer.innerHTML = '';

  // render material
  tileContainer.style.width = `${material.width * RENDER_SCALE}px`;
  tileContainer.style.height = `${material.height * RENDER_SCALE}px`;

  document.querySelector('#materialHeight').innerHTML = `${material.width} mm`;
  document.querySelector('#materialWidth').innerHTML = `${material.height} mm`;

  // render keys
  keys.forEach((key) => {
    const el = document.createElement('div');
    el.className = 'tile';

    el.addEventListener('click', (ev) => ev.target.closest('.tile').classList.toggle('active'));

    el.style.left = `${(key.x - (key.size / 2)) * RENDER_SCALE}px`;
    el.style.top = `${(material.height - (key.y - (key.size / 2)) - key.size) * RENDER_SCALE}px`;
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
