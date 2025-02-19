import { InitScene } from './initScene';
import { W2 } from './w2';

console.log('-------start');

class Start {
  camera = null;

  init() {
    const initScene = new InitScene();
    initScene.initCanvas1();

    this.camera = initScene.camera;

    const w2 = new W2();
    w2.init();
  }

  getCamera() {
    return this.camera;
  }
}

const start = new Start();
start.init();

export { start };
