import * as THREE from 'three';
import { DynamicSceneComponent } from './core/dynamic-scene.component';
import CameraControls from 'camera-controls';
import { PseudoElement } from './core/camera/PseudoElement';

//CameraControls.install({ THREE });

// DOM element doesn't exist in WebWorker. use a virtual element in CameraControls instead.
//const pseudoElement = new PseudoElement();
let initScene;
let scene;
let camera;
let renderer;
let cameraControls;
let controls;
let pseudoElement;

self.onmessage = ({ data }) => {
  const { type, payload } = data;

  switch (type) {
    case 'initScene': {
      const { offscreen, x, y, width, height } = payload;
      offscreen.style = { width: '', height: '' };

      initScene = new DynamicSceneComponent();
      initScene.setCanvas({ canvas: offscreen, width: width, height: height });
      initScene.ngAfterViewInit();
      scene = initScene.scene;
      camera = initScene.camera;

      controls = initScene.getControls();
      pseudoElement = initScene.pseudoElement;
      //this.pseudoElement = this.initScene.fakeCanvas;

      break;
    }

    case 'resize': {
      const { x, y, width, height } = payload;
      pseudoElement.update(x, y, width, height);
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
      break;
    }

    case 'pointerdown': {
      const { event } = payload;
      pseudoElement.dispatchEvent({ type, ...event });
      break;
    }

    case 'pointermove':
    case 'pointerup': {
      const { event } = payload;
      pseudoElement.ownerDocument.dispatchEvent({ type, ...event });
      break;
    }

    case 'reset': {
      cameraControls.reset(true);
      break;
    }
  }

  // debug log
  self.postMessage(data.type);
};
