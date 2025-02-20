import { InitScene } from './initScene';
import { InitWorker } from './initWorker';

console.log('-------start');

class Start {
  init() {
    const initScene = new InitScene();
    initScene.initCanvas1();

    const initWorker = new InitWorker();
    initWorker.init();
  }
}

const start = new Start();
start.init();
