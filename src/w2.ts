import { start } from './index';

export class W2 {
  init() {
    const canvas = document.body.querySelector('#scene2') as HTMLCanvasElement;
    console.log(777, canvas);
    const offscreen = canvas.transferControlToOffscreen();
    const worker = new Worker(new URL('worker.ts', import.meta.url), { type: 'module' });
    worker.postMessage(
      {
        drawingSurface: offscreen,
        width: canvas.clientWidth,
        height: canvas.clientHeight,
      },
      [offscreen]
    );

    canvas.addEventListener('mousedown', (event) => {
      worker.postMessage({
        type: 'mousedown',
        clientX: event.clientX,
        clientY: event.clientY,
        //camera: start.getCamera(),
      });
    });

    canvas.addEventListener('mousemove', (event) => {
      worker.postMessage({
        type: 'mousemove',
        clientX: event.clientX,
        clientY: event.clientY,
      });
    });

    canvas.addEventListener('mouseup', (event) => {
      worker.postMessage({
        type: 'mouseup',
        clientX: event.clientX,
        clientY: event.clientY,
      });
    });

    canvas.addEventListener('wheel', (event) => {
      worker.postMessage({
        type: 'wheel',
        deltaY: event.deltaY,
      });
    });
  }
}
