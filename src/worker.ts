const workerScript = `
importScripts('./initScene.ts');

let camera = null;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

self.onmessage = (message) => {
  const data = message.data;

  if (data.type === 'initScene') {
    // const canvas = data.drawingSurface as OffscreenCanvas;

    console.log(555, data);
  } else {
    const { type, clientX, clientY } = data;

    switch (type) {
      case 'mousedown':
        isDragging = true;
        previousMousePosition = { x: clientX, y: clientY };
        break;

      case 'mousemove':
        if (isDragging) {
          const deltaX = clientX - previousMousePosition.x;
          const deltaY = clientY - previousMousePosition.y;

          camera.rotation.y += deltaX * 0.01;
          camera.rotation.x += deltaY * 0.01;

          previousMousePosition = { x: clientX, y: clientY };
        }
        break;

      case 'mouseup':
        isDragging = false;
        break;
    }
  }
};`;

export const scriptObject = new Blob([workerScript], {
  type: 'application/javascript',
});
