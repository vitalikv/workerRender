import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import textureUrl from './assets/img/image-1.png';

export class InitScene {
  renderer = null;
  scene = null;
  camera = null;
  controls = null;
  domElement = null;
  cube = null;

  initCanvas1() {
    const canvas = document.querySelector('#scene1') as HTMLCanvasElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    //const pixelRatio = window.devicePixelRatio;

    this.init({ canvas, width, height });
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.renderFrame();

    this.domElement = this.renderer.domElement;
    const rect = this.domElement.getBoundingClientRect();
    this.renderer.domElement.addEventListener('mousedown', (event) => this.getClickedObject(event, this.camera, this.scene, rect));
  }

  // Инициализация сцены, камеры и рендерера
  init({ canvas, width, height }) {
    console.log(canvas);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

    //renderer.domElement.style.cssText = 'width: 50%; height: 100%;';

    //renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    //document.body.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 5, -5);
    camera.lookAt(new THREE.Vector3());

    scene.add(new THREE.HemisphereLight(0xffffff, 0x999999, 3));
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10).multiplyScalar(1);
    light.shadow.mapSize.setScalar(2048);
    light.shadow.bias = -1e-4;
    light.shadow.normalBias = 0.05;
    light.castShadow = true;
    scene.add(light);

    // Создание куба
    const geometry = new THREE.BoxGeometry();
    const textureLoader = new THREE.TextureLoader();
    //const texture = textureLoader.load(textureUrl);

    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.y = 0.5;
    scene.add(cube);

    //---
    const size = 30;
    const divisions = 30;

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    plane.position.x = -0.001;
    plane.rotation.set(Math.PI / 2, Math.PI, 0);
    plane.castShadow = true;
    plane.receiveShadow = true;
    scene.add(plane);

    const gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);

    // Обработка изменения размера окна
    // window.addEventListener('resize', () => {
    //   camera.aspect = width / height;
    //   camera.updateProjectionMatrix();
    //   renderer.setSize(width, height);
    // });

    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    //this.controls = controls;
    this.cube = cube;
  }

  renderFrame = () => {
    requestAnimationFrame(this.renderFrame);

    if (this.controls) this.controls.update();

    //this.cube.rotation.y = -Date.now() / 4000;
    this.renderer.render(this.scene, this.camera);
  };

  getClickedObject = (event, camera = this.camera, scene = this.scene, rect) => {
    // Создаем Raycaster
    const raycaster = new THREE.Raycaster();

    const mouse = new THREE.Vector2();

    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    let obj = null;

    if (intersects.length > 0) {
      obj = intersects[0].object;
    }

    console.log(888, obj);
    return obj;
  };
}
