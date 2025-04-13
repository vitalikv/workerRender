import { Quaternion, Vector3 } from 'three';
import { DynamicSceneComponent } from './core/dynamic-scene.component';

class CanvasWorker {
  scene = null;
  camera = null;
  controls = null;
  isDragging = false;
  previousMousePosition = { x: 0, y: 0 };
  initScene = null;
  pseudoElement;

  constructor() {
    this.init();
  }

  init() {
    self.onmessage = this.handleMessage.bind(this);
  }

  handleMessage(message) {
    try {
      const data = message.data;

      switch (data.type) {
        case 'initScene':
          this.handleInit(data);
          break;

        case 'pointerdown': {
          const { event } = data.payload;
          this.pseudoElement.dispatchEvent({ type: data.type, ...event });

          break;
        }

        case 'pointermove':

        case 'pointerup': {
          const { event } = data.payload;
          this.pseudoElement.ownerDocument.dispatchEvent({ type: data.action, ...event });
          break;
        }

        case 'mousedown':
          this.handleMouseDown(data.clientX, data.clientY);
          break;

        case 'mousemove':
          this.handleMouseMove(data.clientX, data.clientY);
          break;

        case 'mouseup':
          this.handleMouseUp();
          break;

        case 'click':
          console.log(`${data.rect.width}`);
          this.getClickedObject({ clientX: data.clientX, clientY: data.clientY }, this.camera, this.scene, data.rect);
          break;

        default:
          console.log(`Unknown message type: ${data.type}`);
      }
    } catch (error) {
      console.error('Error in worker:', error);
    }
  }

  handleInit(data) {
    // this.initScene = new InitScene();
    // this.initScene.init({ canvas: data.offscreen, width: data.width, height: data.height });
    // this.initScene.renderFrame();

    // this.scene = this.initScene.scene;
    // this.camera = this.initScene.camera;
    // //this.controls = new CameraController(this.camera, data.offscreen);

    this.initScene = new DynamicSceneComponent();
    this.initScene.setCanvas({ canvas: data.offscreen, width: data.width, height: data.height });
    this.initScene.ngAfterViewInit();
    this.scene = this.initScene.scene;
    this.camera = this.initScene.camera;

    this.controls = this.initScene.getControls();
    this.pseudoElement = this.initScene.pseudoElement;
    //this.pseudoElement = this.initScene.fakeCanvas;
  }

  handleMouseDown(clientX, clientY) {
    this.isDragging = true;
    this.previousMousePosition = { x: clientX, y: clientY };
  }

  handleMouseMove(clientX, clientY) {
    if (this.isDragging && this.camera) {
      const deltaX = clientX - this.previousMousePosition.x;
      const deltaY = clientY - this.previousMousePosition.y;

      const quaternion = new Quaternion();
      quaternion.setFromAxisAngle(new Vector3(0, 1, 0), deltaX * 0.01);
      this.camera.quaternion.multiply(quaternion);

      quaternion.setFromAxisAngle(new Vector3(1, 0, 0), deltaY * 0.01);
      this.camera.quaternion.multiply(quaternion);

      this.previousMousePosition = { x: clientX, y: clientY };
    }
  }

  handleMouseUp() {
    this.isDragging = false;
  }

  getClickedObject(event, camera, scene, rect) {
    this.initScene.getClickedObject(event, camera, scene, rect);
  }
}

new CanvasWorker();
