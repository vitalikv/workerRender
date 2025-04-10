import { InitScene } from './initScene';
import { InitWorker } from './initWorker';

console.log('-------start');

class Start {
  init() {
    const initScene = new InitScene();
    initScene.initCanvas1();

    const canvas = document.body.querySelector('#scene2') as HTMLCanvasElement;
    const initWorker = new InitWorker();
    initWorker.init({ canvas });
  }
}

const start = new Start();
start.init();
