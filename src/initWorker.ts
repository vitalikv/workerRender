//import { scriptObject } from './worker';

export class InitWorker {
  init({ canvas }) {
    //const canvas = document.body.querySelector('#scene2') as HTMLCanvasElement;

    const offscreen = canvas.transferControlToOffscreen();
    const worker = new Worker(new URL('worker3.ts', import.meta.url), { type: 'module' });

    // const objectUrl = URL.createObjectURL(scriptObject);
    // const worker = new Worker(objectUrl);
    // URL.revokeObjectURL(objectUrl);

    worker.postMessage(
      {
        type: 'initScene',
        offscreen,
        width: canvas.clientWidth,
        height: canvas.clientHeight,
      },
      [offscreen]
    );

    canvas.addEventListener('pointerdown', (event) => {
      // worker.postMessage({
      //   type: 'mousedown',
      //   clientX: event.clientX,
      //   clientY: event.clientY,
      // });

      const pseudoPointerEvent = {
        pointerId: event.pointerId,
        pointerType: event.pointerType,
        clientX: event.clientX,
        clientY: event.clientY,
        buttons: event.buttons,
      };

      worker.postMessage({ type: 'pointerdown', payload: { event: pseudoPointerEvent } });
    });

    canvas.addEventListener('pointermove', (event) => {
      // worker.postMessage({
      //   type: 'mousemove',
      //   clientX: event.clientX,
      //   clientY: event.clientY,
      // });

      const pseudoPointerEvent = {
        pointerId: event.pointerId,
        pointerType: event.pointerType,
        clientX: event.clientX,
        clientY: event.clientY,
        movementX: event.movementX,
        movementY: event.movementY,
        buttons: event.buttons,
      };

      worker.postMessage({ type: 'pointermove', payload: { event: pseudoPointerEvent } });
    });

    canvas.addEventListener('pointerup', (event) => {
      // worker.postMessage({
      //   type: 'mouseup',
      //   clientX: event.clientX,
      //   clientY: event.clientY,
      // });

      const pseudoPointerEvent = {
        pointerId: event.pointerId,
        pointerType: event.pointerType,
      };

      worker.postMessage({ type: 'pointerup', payload: { event: pseudoPointerEvent } });
    });

    canvas.addEventListener('wheel', (event) => {
      // worker.postMessage({
      //   type: 'wheel',
      //   deltaY: event.deltaY,
      // });
    });

    canvas.addEventListener('click', (event) => {
      // const rect = canvas.getBoundingClientRect();
      // worker.postMessage({
      //   type: 'click',
      //   clientX: event.clientX,
      //   clientY: event.clientY,
      //   rect,
      // });
    });

    const onPointerDown = (event) => {
      const pseudoPointerEvent = {
        pointerId: event.pointerId,
        pointerType: event.pointerType,
        clientX: event.clientX,
        clientY: event.clientY,
        buttons: event.buttons,
      };

      canvas.ownerDocument.removeEventListener('pointermove', onPointerMove, { passive: false });
      canvas.ownerDocument.removeEventListener('pointerup', onPointerUp);

      canvas.ownerDocument.addEventListener('pointermove', onPointerMove, { passive: false });
      canvas.ownerDocument.addEventListener('pointerup', onPointerUp);

      worker.postMessage({ type: 'pointerdown', payload: { event: pseudoPointerEvent } });
    };

    const onPointerMove = (event) => {
      if (event.cancelable) event.preventDefault();

      const pseudoPointerEvent = {
        pointerId: event.pointerId,
        pointerType: event.pointerType,
        clientX: event.clientX,
        clientY: event.clientY,
        movementX: event.movementX,
        movementY: event.movementY,
        buttons: event.buttons,
      };

      worker.postMessage({ type: 'pointermove', payload: { event: pseudoPointerEvent } });
    };

    const onPointerUp = (event) => {
      const pseudoPointerEvent = {
        pointerId: event.pointerId,
        pointerType: event.pointerType,
      };

      worker.postMessage({ type: 'pointerup', payload: { event: pseudoPointerEvent } });
    };

    canvas.addEventListener('pointerdown', onPointerDown);
  }
}
