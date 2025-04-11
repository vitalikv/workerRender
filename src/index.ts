import { InitScene } from './initScene';
import { InitWorker } from './initWorker';

import { Base3dLevelComponent } from './core/base3dLevelComponent';
import { DynamicSceneComponent } from './core/dynamic-scene.component';

console.log('-------start');

class Start {
  init() {
    // const initScene = new InitScene();
    // initScene.initCanvas1();
    // const canvas = document.body.querySelector('#scene2') as HTMLCanvasElement;
    // const initWorker = new InitWorker();
    // initWorker.init({ canvas });

    //---
    // const initScene = new Base3dLevelComponent();
    // initScene.ngAfterViewInit();

    const initScene = new DynamicSceneComponent();
    initScene.ngAfterViewInit();
  }
}

const start = new Start();
start.init();
