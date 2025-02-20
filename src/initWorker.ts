export class InitWorker {
  init() {
    const canvas = document.body.querySelector('#scene2') as HTMLCanvasElement;

    const offscreen = canvas.transferControlToOffscreen();
    const worker = new Worker(new URL('worker2.ts', import.meta.url), { type: 'module' });
    worker.postMessage(
      {
        type: 'initScene',
        offscreen,
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

    canvas.addEventListener('click', (event) => {
      const rect = canvas.getBoundingClientRect();

      worker.postMessage({
        type: 'click',
        clientX: event.clientX,
        clientY: event.clientY,
        rect,
      });
    });
  }
}
