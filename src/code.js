const SCALE = 4;

function generate() {
  const tileContainer = document.querySelector('#container');
  tileContainer.innerHTML = '';

  const values = {};
  ['xCount', 'yCount', 'keycapSize', 'spaceBetween', 'spaceFromX', 'spaceFromY'].forEach(id => {
    values[id] = parseInt(document.querySelector(`#${id}`).value, 10);
  });

  const { xCount, yCount, keycapSize, spaceBetween, spaceFromX, spaceFromY } = values;

  // calculate container size
  const sizeX = (xCount * keycapSize) + ((xCount - 1) * spaceBetween) + (2 * spaceFromX);
  const sizeY = (yCount * keycapSize) + ((yCount - 1) * spaceBetween) + (2 * spaceFromY);

  tileContainer.style.width = `${sizeX * SCALE}px`;
  tileContainer.style.height = `${sizeY * SCALE}px`;

  document.querySelector('#materialHeight').innerHTML = `${sizeX} mm`;
  document.querySelector('#materialWidth').innerHTML = `${sizeY} mm`;

  // render tiles
  for (let y = 0; y < yCount; y++) {
    for (let x = 0; x < xCount; x++) {
      const posX = (x * (keycapSize + spaceBetween)) + spaceFromX;
      const posY = (y * (keycapSize + spaceBetween)) + spaceFromY;

      const el = document.createElement('div');
      el.className = 'tile';

      el.addEventListener('click', (ev) => ev.target.closest('.tile').classList.toggle('active'));

      el.style.left = `${posX * SCALE}px`;
      el.style.top = `${(sizeY - posY - keycapSize) * SCALE}px`;
      el.style.width = `${keycapSize * SCALE}px`;
      el.style.height = `${keycapSize * SCALE}px`;

      el.innerHTML = `<div>X ${posX}</div><div>Y ${posY}</div>`;

      tileContainer.appendChild(el);
    }
  }
}

document.querySelector('#generate').addEventListener('click', () => generate());
generate();
