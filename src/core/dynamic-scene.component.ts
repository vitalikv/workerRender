import { GraphicsUtil, MaterialUtil, SceneUtil } from './public-api';
//import { DynamicSceneService } from './dynamic-scene.service';
import { InteractionLeafletLocalStorageService } from './interaction-leaflet-localstorage.service';

import { DynamicSceneBase } from './dynamic-scene.base';
import { MathUtils } from 'three';

//import { InitWorker } from './offscreenCanvas/init-worker.service';

export class DynamicSceneComponent extends DynamicSceneBase {
  public state = {
    loading: true,
  };
  public config = {
    get id(): string {
      // const storedId = sessionStorage.getItem('sceneSessionId');
      // if (!storedId) {
      //   const newId = MathUtils.generateUUID();
      //   sessionStorage.setItem('sceneSessionId', newId);
      //   return newId;
      // }
      // return storedId;

      return '1';
    },
    /**
     * Initial Camera position and target
     */
    camera: {
      position: {
        x: 0,
        y: 160.63104346005503,
        z: -160.63104346005503,
      },
      target: {
        x: 0,
        y: 1.8,
        z: 0,
      },
    },
    geometryLimit: {
      min: 1000,
      max: 50000,
      step: 1000,
      defaultValue: 5000,
      currentValue: 500,
    },
    farDistance: {
      min: 500,
      max: 1000,
      step: 50,
      defaultValue: 500,
      currentValue: 500,
    },
    nearDistance: {
      min: 0.01,
      max: 20,
      step: 0.01,
      defaultValue: 1,
      currentValue: 1,
      enabled: false,
    },
    angularSize: {
      min: 0.1,
      max: 0.5,
      step: 0.01,
      defaultValue: 0.2,
      currentValue: 0.00002,
    },
  };

  constructor() {
    super();
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  ngOnDestroy(): void {
    try {
      sessionStorage.removeItem('sceneSessionId');
    } catch (error) {
      console.error('Failed to remove sceneSessionId from sessionStorage:', error);
    }
  }

  public onClick(event: MouseEvent): void {
    //
    event.target === this.canvas ? (this.selectDirectionNav = false) : null;
    this.clickHandler();
  }

  public onContextmenu(event: MouseEvent): void {
    //
  }

  public onDblclick(event: MouseEvent): void {
    //
  }

  public viewChange() {
    this.selectDirectionNav = !this.selectDirectionNav;
  }

  public showConfirmationPopup() {
    this.selectDirectionNav = false;
    this.confirmationPopupVisible = true;
  }

  public hideConfirmationPopup() {
    this.confirmationPopupVisible = false;
  }

  public onMousemove(event: MouseEvent): void {
    this.mousemoveHandler(event);
  }
}
