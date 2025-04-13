import { modelsPath } from './mocks/model';
import { Base3dLevelComponent } from './base3dLevelComponent';
import { Vector3, Box3, Group, PMREMGenerator, PerspectiveCamera, MathUtils, Color, CameraHelper } from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky';
import { InfiniteGridHelper } from './dp/InfiniteGridHelper';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { DebugEnvironment } from 'three/examples/jsm/environments/DebugEnvironment.js';
//import { DynamicSceneService } from './dynamic-scene.service';

import CameraControls from 'camera-controls';
import { PseudoElement } from './camera/PseudoElement';

import * as THREE from 'three';

export abstract class DynamicSceneBase extends Base3dLevelComponent {
  //abstract dynamicSceneService: DynamicSceneService;
  abstract state: {
    loading: boolean;
  };
  abstract config: {
    id: string;
    camera: {
      position: {
        x: number;
        y: number;
        z: number;
      };
      target: {
        x: number;
        y: number;
        z: number;
      };
    };
    geometryLimit: {
      currentValue: number;
    };
    farDistance: {
      currentValue: number;
    };
    nearDistance: {
      currentValue: number;
      enabled: boolean;
    };
    angularSize: {
      currentValue: number;
    };
  };
  public fakeCanvas;
  public pseudoElement = new PseudoElement();
  protected previousCameraPosition: Vector3 = new Vector3();
  protected isCameraChangeByWheel = false;
  protected isDisabledMainControls = false;
  private controlsDowndateHandler: () => void;
  private controlsUpdateHandler: () => void;
  private cameraHelper: CameraHelper | null = null;
  protected beforeRender(): void {
    //window['glsl_debug'] = this.renderer.info;
  }

  private group: Group;
  public meshesCount: number;

  protected initLevel(): void {
    this.initModel();
  }

  protected async initModel(): Promise<void> {
    // const dracoLoader = new DRACOLoader();

    // const decoderPath = ['https://www.gstatic.com/draco/v1/decoders/', '/assets/models_3d/libs/google/draco/'];

    // dracoLoader.setDecoderPath(decoderPath[0]);

    // const loader = new GLTFLoader().setDRACOLoader(dracoLoader);

    // const models = await Promise.all(modelsPath.map((path) => loader.loadAsync(path)));
    // this.group = new Group();

    // models.forEach((model) => {
    //   this.group.add(model.scene);
    // });

    // const bbox = new Box3().setFromObject(this.group);

    // this.group.position.set(88.31109, -1142.143, -1623.48);
    // this.group.rotation.set(1.570962, -0.00011, -0.61573);
    // this.group.scale.setScalar(102.1311);

    // this.scene.add(this.group);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.y = 0.5;
    this.scene.add(cube);

    this.group = new Group();
    this.group.add(cube);

    this.loadObj();

    this.scene.add(this.group);

    const plane1 = new InfiniteGridHelper(30, 30, new Color('#8C8C8C'), 8000);
    this.scene.add(plane1);

    const plane2 = new InfiniteGridHelper(120, 120, new Color('white'), 8000);
    this.scene.add(plane2);

    plane1.position.y = plane2.position.y = new Box3().setFromObject(this.group).min.y;

    const sky = new Sky();
    sky.scale.setScalar(450000);
    this.scene.add(sky);

    const sun = new Vector3();

    const turbidity = 2.8;
    const rayleigh = 0.2;
    const mieCoefficient = 0.052;
    const mieDirectionalG = 0.09;
    const elevation = 10;
    const azimuth = 180;
    const explosure = 1;

    const uniforms = sky.material.uniforms;
    uniforms['turbidity'].value = turbidity;
    uniforms['rayleigh'].value = rayleigh;
    uniforms['mieCoefficient'].value = mieCoefficient;
    uniforms['mieDirectionalG'].value = mieDirectionalG;

    const phi = MathUtils.degToRad(90 - elevation);
    const theta = MathUtils.degToRad(azimuth);

    sun.setFromSphericalCoords(1, phi, theta);

    uniforms['sunPosition'].value.copy(sun);

    const pmremGenerator = new PMREMGenerator(this.renderer);
    pmremGenerator.compileCubemapShader();

    const envScene = new DebugEnvironment();
    const generatedCubeRenderTarget = pmremGenerator.fromScene(envScene);
    this.scene.environment = generatedCubeRenderTarget.texture;
    // init dynamic scene service with the group
    // this.dynamicSceneService.init(this.group, this.scene);
    // this.state.loading = false;

    // this.dynamicSceneService.sendFrustumRequest({
    //   camera: this.camera as PerspectiveCamera,
    //   config: this.config,
    // });
  }

  protected initControls(): void {
    CameraControls.install({ THREE: THREE });

    this.pseudoElement.update(0, 0, this.width, this.height);
    this.controls = new CameraControls(this.camera, this.pseudoElement as any);
    this.controls.setTarget(this.config.camera.target.x, this.config.camera.target.y, this.config.camera.target.z);
    //this.camera.position.copy(new Vector3(this.config.camera.position.x, this.config.camera.position.y, this.config.camera.position.z));
    this.controls.setPosition(this.config.camera.position.x, this.config.camera.position.y, this.config.camera.position.z);
    this.controls.maxDistance = 1200;
    this.controls.minDistance = 0;
    this.controls.addEventListener('controlend', () => self.postMessage({ action: 'controlend' }));
    // this.fakeCanvas = {
    //   width: this.width, // ваши размеры
    //   height: this.height,
    //   style: { width: this.width, height: this.height },
    //   // addEventListener: () => {},
    //   // removeEventListener: () => {},
    //   clientWidth: this.width,
    //   clientHeight: this.height,
    //   getContext: () => {
    //     return this.canvas; // или другая заглушка
    //   },
    //   getBoundingClientRect: () => ({
    //     x: 0,
    //     y: 0,
    //     width: 849.5,
    //     height: 1315,
    //     top: 0,
    //     right: 849.5,
    //     bottom: 1315,
    //     left: 0,
    //   }),
    //   getRootNode: () => ({
    //     nodeType: 9, // DOCUMENT_NODE
    //     host: null,
    //     documentElement: {},
    //     contains: () => false,
    //     _listeners: {},
    //     addEventListener(type, listener) {
    //       if (!this._listeners[type]) this._listeners[type] = [];
    //       this._listeners[type].push(listener);
    //     },
    //     removeEventListener(type, listener) {
    //       if (!this._listeners[type]) return;
    //       this._listeners[type] = this._listeners[type].filter((l) => l !== listener);
    //     },
    //     dispatchEvent(event) {
    //       if (this._listeners[event.type]) {
    //         this._listeners[event.type].forEach((l) => l(event));
    //       }
    //       return true;
    //     },
    //   }),
    //   _listeners: {},
    //   addEventListener(type, listener) {
    //     if (!this._listeners[type]) this._listeners[type] = [];
    //     this._listeners[type].push(listener);
    //   },
    //   removeEventListener(type, listener) {
    //     if (!this._listeners[type]) return;
    //     this._listeners[type] = this._listeners[type].filter((l) => l !== listener);
    //   },
    //   dispatchEvent(event) {
    //     if (this._listeners[event.type]) {
    //       this._listeners[event.type].forEach((l) => l(event));
    //     }
    //     return true;
    //   },
    //   _pointerCapture: null,
    //   setPointerCapture(pointerId) {
    //     this._pointerCapture = pointerId;
    //   },
    //   releasePointerCapture(pointerId) {
    //     if (this._pointerCapture === pointerId) {
    //       this._pointerCapture = null;
    //     }
    //   },
    //   hasPointerCapture(pointerId) {
    //     return this._pointerCapture === pointerId;
    //   },
    // };

    // this.controls = new OrbitControls(this.camera, this.fakeCanvas as any);
    // this.controls.target.copy(new Vector3(this.config.camera.target.x, this.config.camera.target.y, this.config.camera.target.z));
    // this.camera.position.copy(new Vector3(this.config.camera.position.x, this.config.camera.position.y, this.config.camera.position.z));
    // this.controls.maxDistance = 1200;
    // this.controls.minDistance = 0;

    // this.controlsDowndateHandler = () => {
    //   if (this.cameraHelper) {
    //     this.cameraHelper.removeFromParent();
    //     this.cameraHelper.dispose();
    //   }
    //   this.cameraHelper = new CameraHelper(this.camera.clone());
    //   this.cameraHelper.position.copy(this.camera.position.clone());
    //   this.scene.add(this.cameraHelper);
    // };

    // this.controlsUpdateHandler = debounce(() => {
    //   try {
    //     // this.dynamicSceneService.sendFrustumRequest({
    //     //   camera: this.camera as PerspectiveCamera,
    //     //   config: this.config,
    //     // });
    //   } catch (error) {
    //     console.error('Failed to send frustum request:', error);
    //   }
    // }, 500);

    // // this.controls.addEventListener('start', this.controlsDowndateHandler);
    // // this.controls.addEventListener('end', this.controlsUpdateHandler);
    // this.controls.update();
  }

  protected clickHandler() {}

  protected mousemoveHandler(event: MouseEvent) {}

  public rightSideNavToggle(moduleOutput: boolean): void {
    this.isRightSideNavOpen = moduleOutput;
  }

  protected render() {
    super.render();
    this.meshesCount = this.group.children.length;

    const delta = this.clock.getDelta();

    this.controls.update(delta);
  }

  public destroy(): void {
    // if (this.controls && this.controlsUpdateHandler) {
    //   this.controls.removeEventListener('end', this.controlsUpdateHandler);
    // }
  }

  //---
  loadObj() {
    const loader = new GLTFLoader();
    loader.load(
      './assets/model/0019.005-AS.glb',
      (gltf) => {
        const gltfScene = gltf.scene.children[0];
        gltfScene.scale.setScalar(100);
        gltfScene.rotation.x = 1.571;

        const box = new THREE.Box3();
        box.setFromObject(gltfScene);
        box.getCenter(gltfScene.position).negate();
        gltfScene.updateMatrixWorld(true);

        gltfScene.position.y += 1;

        this.group.add(gltfScene);
        console.log(999, gltfScene);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.error('Error loading model', error);
      }
    );
  }
}

function debounce(callee: (...args: any) => void, timeoutMs: number) {
  let lastCall = 0;
  let lastCallTimer: NodeJS.Timeout | null = null;
  return function perform(...args: any) {
    let previousCall = lastCall;

    lastCall = Date.now();

    if (previousCall && lastCall - previousCall <= timeoutMs) {
      clearTimeout(lastCallTimer);
    }

    lastCallTimer = setTimeout(() => callee(...args), timeoutMs);
  };
}
