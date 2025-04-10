import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class CameraController {
  private camera;
  private controls;

  constructor(camera, offscreenCanvas) {
    this.camera = camera;
    this.controls = new OrbitControls(this.camera, offscreenCanvas);

    // Настройка параметров OrbitControls
    this.controls.enableDamping = true; // Включение инерции
    this.controls.dampingFactor = 0.05; // Фактор инерции
    this.controls.screenSpacePanning = false; // Панорамирование в пространстве экрана
    this.controls.minDistance = 1; // Минимальное расстояние до цели
    this.controls.maxDistance = 1000; // Максимальное расстояние до цели
    this.controls.maxPolarAngle = Math.PI / 2; // Ограничение угла наклона камеры

    // Дополнительные настройки, если необходимо
    this.controls.enableZoom = true; // Включение зума
    this.controls.enableRotate = true; // Включение вращения
    this.controls.enablePan = true; // Включение панорамирования
  }

  public update() {
    // Обновление контролов каждый кадр
    this.controls.update();
  }

  // Метод для установки цели, вокруг которой будет вращаться камера
  public setTarget(target) {
    this.controls.target.copy(target);
  }

  // Метод для изменения минимального и максимального расстояния до цели
  public setDistanceLimits(minDistance, maxDistance) {
    this.controls.minDistance = minDistance;
    this.controls.maxDistance = maxDistance;
  }

  // Метод для включения/выключения зума
  public enableZoom(enable) {
    this.controls.enableZoom = enable;
  }

  // Метод для включения/выключения вращения
  public enableRotate(enable) {
    this.controls.enableRotate = enable;
  }

  public enablePan(enable) {
    this.controls.enablePan = enable;
  }

  public reset() {
    this.controls.reset();
  }
}
