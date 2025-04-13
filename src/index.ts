import { InitScene } from './initScene';
import { InitWorker } from './initWorker';

import { Base3dLevelComponent } from './core/base3dLevelComponent';
import { DynamicSceneComponent } from './core/dynamic-scene.component';
import { InteractionLeafletLocalStorageService } from './core/interaction-leaflet-localstorage.service';
import { GraphicsQualityModel } from './core/graphics-quality.model';

console.log('-------start');

class Start {
  protected localStorageService = new InteractionLeafletLocalStorageService();

  init() {
    // const initScene = new InitScene();
    // initScene.initCanvas1();
    const canvas = document.body.querySelector('#scene1') as HTMLCanvasElement;
    const initWorker = new InitWorker();
    initWorker.init({ canvas });

    //---

    // const initScene = new DynamicSceneComponent();
    // const canvas = document.querySelector('#scene1') as HTMLCanvasElement;
    // const rect = canvas.getBoundingClientRect();
    // console.log(rect);
    // const width = canvas.clientWidth;
    // const height = canvas.clientHeight;
    // initScene.setCanvas({ canvas, width, height });
    // initScene.ngAfterViewInit();
  }
}

const start = new Start();
start.init();
