import { OffscreenCanvas } from 'three';
import { InitScene } from './initScene';

let camera = null;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

self.onmessage = (message) => {
  const data = message.data;

  if (!data.type) {
    // const canvas = data.drawingSurface as OffscreenCanvas;

    const initScene = new InitScene();

    initScene.init({ canvas: data.drawingSurface, width: data.width, height: data.height });
    initScene.renderFrame();

    camera = initScene.camera;
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
};
