// import { MatSelectChange } from '@angular/material/select';

import { TerrainMatrix } from './terrain-matrix.model';

import { GraphicsUtil, MaterialUtil, SceneUtil } from './public-api';
//import { InteractionLeafletLocalStorageService } from './interaction-leaflet-localstorage.service';
import { GraphicsQualityModel } from './graphics-quality.model';

import { AmbientLight, Camera, Clock, Color, DirectionalLight, EventListener, Light, Object3D, OrthographicCamera, PerspectiveCamera, Raycaster, Scene, Vector2, Vector3, WebGLInfo, WebGLRenderer } from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { TransformControls, TransformControlsEventMap } from 'three/examples/jsm/controls/TransformControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { BleachBypassShader } from 'three/examples/jsm/shaders/BleachBypassShader';
import { ColorCorrectionShader } from 'three/examples/jsm/shaders/ColorCorrectionShader';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader';
import { MapControls } from 'three/examples/jsm/controls/MapControls';
import CameraControls from 'camera-controls';

export class Base3dLevelComponent {
  protected canvasRef;

  public canvas;
  public width = 0;
  public height = 0;
  protected renderer: WebGLRenderer;
  protected composer: EffectComposer;
  protected camera: PerspectiveCamera | OrthographicCamera;
  protected scene: Scene;
  protected controls: MapControls | CameraControls;
  protected trackControls: TrackballControls;
  protected lights: Light[];
  protected mainLight: DirectionalLight;
  protected clock: Clock;
  public qualityModel: GraphicsQualityModel;
  public stats: WebGLInfo;

  // вспомогательные свойства для навигации камеры через левую панель инструментов
  public cameraRigType: string;
  public selectDirectionNav: boolean;
  public navigateButtonsAction = {
    direction: '',
    state: false,
  };
  public raycast: Raycaster;
  public mouse: Vector2;
  public fixPointer: Vector2;
  public cameraTarget: Vector3;
  public fixPointerState: boolean;
  public confirmationPopupVisible = false;

  // сайднавы
  public isRightSideNavOpen: boolean;
  public isLeftSideNavOpen: boolean;

  public selectedCameraPosition: number;

  //layers transformation
  protected transformControls: TransformControls;
  public transformingObject: Object3D;
  protected oldMatrix: TerrainMatrix;

  protected sceneUtil = new SceneUtil();
  protected materialUtil = new MaterialUtil();
  protected graphicsUtil = new GraphicsUtil();
  //protected localStorageService = new InteractionLeafletLocalStorageService();

  constructor() {
    //this.ngOnInit();
    this.qualityModel = { quality: 2 };
    this.raycast = new Raycaster();
    this.mouse = new Vector2();
    this.fixPointer = new Vector2((758 / this.width) * 2 - 1, -(453 / this.height) * 2 + 1);
    this.fixPointerState = false;
    this.cameraRigType = 'none';
    this.selectDirectionNav = false;
  }

  // ngOnInit(): void {
  //   this.qualityModel = this.localStorageService.getGraphicsQuality();
  //   if (!this.qualityModel) {
  //     this.qualityModel = new GraphicsQualityModel();
  //     this.qualityModel.quality = 1;
  //     this.localStorageService.setGraphicsQuality(this.qualityModel);
  //   }
  // }

  ngAfterViewInit(): void {
    this.qualityModel.quality = this.graphicsUtil.QUALITY_HIGHT;
    this.createLevel();
    this.onResize(null); //костыль для ресайза canvas
  }

  setCanvas({ canvas, width, height }) {
    this.canvas = canvas;
    this.width = width;
    this.height = height;
  }

  createLevel(): void {
    this.initScene();
    this.initRenderer();
    this.initClock();
    this.initCamera();
    this.initLights();
    this.initControls();
    this.initPostprocessing();
    this.initLevel();
    this.afterInit();
  }

  ngOnDestroy(): void {
    this.destroyLevel();
  }

  public getQualityList(): string[] {
    const list: string[] = [];
    list[this.graphicsUtil.QUALITY_LOW] = 'Низкое';
    list[this.graphicsUtil.QUALITY_MEDIUM] = 'Среднее';
    list[this.graphicsUtil.QUALITY_HIGHT] = 'Высокое';

    return list;
  }

  public onQualityChange(event): void {
    this.qualityModel.quality = event.value;
    //this.localStorageService.setGraphicsQuality(this.qualityModel);
    //this.destroyLevel();
    //this.createLevel();
    //window.location.reload();
    //TODO: спросить как обновить компонент
  }

  // protected get canvas(): HTMLCanvasElement {
  //   const canvas = document.querySelector('#scene1') as HTMLCanvasElement;
  //   return canvas;
  // }

  protected initClock(): void {
    this.clock = new Clock();
  }

  protected initScene(): void {
    this.scene = new Scene();
    this.scene.background = new Color(0xe0ffff);
  }

  protected initCamera(): void {
    this.camera = new PerspectiveCamera(45, this.width / this.height, 1, 500000);
    this.camera.position.set(110.36692165552938, 266.4496785841341, -0.18129580242442858);
    this.camera.rotation.set(-1.5714767396045877, 0.39269852285416285, 1.5725743319504473);
    //TODO: спросить дизайнера начальное положение камеры
  }

  protected initRenderer(): void {
    this.renderer = this.graphicsUtil.createWebGLRenderer(this.qualityModel.quality, this.canvas, this.width, this.height);
    this.renderer.setClearColor(new Color(0xefd1b5));
  }

  protected initPostprocessing(): void {
    const renderModel = new RenderPass(this.scene, this.camera);
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderModel);

    if (this.qualityModel.quality === this.graphicsUtil.QUALITY_HIGHT) {
      const effectBleach = new ShaderPass(BleachBypassShader);
      const effectColor = new ShaderPass(ColorCorrectionShader);
      const effectFXAA = new ShaderPass(FXAAShader);
      const gammaCorrection = new ShaderPass(GammaCorrectionShader);

      effectFXAA.uniforms['resolution'].value.set(1 / this.width, 1 / this.height);
      effectBleach.uniforms['opacity'].value = 0.1;
      effectColor.uniforms['powRGB'].value.set(1.4, 1.45, 1.45);
      effectColor.uniforms['mulRGB'].value.set(1.1, 1.1, 1.1);

      this.composer.addPass(effectFXAA);
      this.composer.addPass(effectBleach);
      this.composer.addPass(effectColor);
      this.composer.addPass(gammaCorrection);
    }
  }

  protected initControls(): void {
    this.controls = new MapControls(this.camera, this.canvas);
    this.controls.maxDistance = 600;
    this.controls.minDistance = 80;
    this.controls.maxPolarAngle = Math.PI / 4;
    this.controls.minPolarAngle = Math.PI / 8;
    this.controls.update();

    const onDraggingChange: EventListener<TransformControlsEventMap['dragging-changed'], string, TransformControls> = (event) => {
      this.controls.enabled = !event.value;
    };

    this.transformControls = new TransformControls(this.camera, this.canvas);
    this.transformControls.addEventListener('dragging-changed', onDraggingChange);
    //this.scene.add(this.transformControls);
  }

  protected initLevel(): void {
    //throw new Error('method initLevel not implemented yet');
  }

  protected initLights(): void {
    this.lights = [];

    if (this.qualityModel.quality === this.graphicsUtil.QUALITY_HIGHT) {
      const light = new DirectionalLight(0xffffff, 1);
      this.lights.push(light);
      this.mainLight = light;
    }

    this.lights.push(new AmbientLight(0xffffff, 1));

    this.lights.forEach((entry: Light) => {
      this.scene.add(entry);
    });
  }

  protected afterInit(): void {
    this.animate();
  }

  public onResize(event: Event): void {
    return;
    const rect = this.renderer.domElement.parentElement.getBoundingClientRect();

    if (this.camera instanceof PerspectiveCamera || this.camera instanceof OrthographicCamera) {
      this.camera['aspect'] = rect.width / rect.height;
      this.camera.updateProjectionMatrix();
    }

    this.renderer.setSize(rect.width, rect.height);
  }

  public getCamera(): Camera {
    return this.camera;
  }

  public getRenderer(): WebGLRenderer {
    return this.renderer;
  }

  public getControls() {
    return this.controls;
  }

  public getScene(): Scene {
    return this.scene;
  }

  protected animate(): void {
    requestAnimationFrame(() => {
      this.animate();
    });
    this.render();

    this.stats = this.renderer.info;
  }

  protected render(): void {
    this.beforeRender();
    if (this.mainLight) {
      this.mainLight.position.copy(this.camera.position);
    }
    this.composer.render();
  }

  protected beforeRender(): void {
    //throw new Error('method beforeRender not implemented yet');
  }

  protected destroyLevel(): void {
    this.sceneUtil.clearScene(this.scene);
  }

  // метод блокировки указателя мыши
  public handleChangeLock(type): void {
    this.cameraRigType = type;
    this.canvas.requestPointerLock();
    this.pointerLockChange();
    this.fixPointerState = true;
  }

  // метод управления камерой через левые инструменты навигации UI
  public pointerLockChange(): void {}

  // метод установки цели при передвижении камеры с помощью левой панели инструментов навигации UI
  public setCameraTatget(): void {
    this.raycast.setFromCamera(this.fixPointer, this.camera);
    if (this.raycast.intersectObject(this.scene)[0]) {
      this.cameraTarget = this.raycast.intersectObject(this.scene)[0].point;
    }
  }

  // метод установки камеры в фиксированную позицию с помощью навигации UI
  public setCameraToSidePosition(side: number): void {}

  public pointerClose(): void {
    this.fixPointerState = false;
  }

  protected changeZoomControl() {}
}
