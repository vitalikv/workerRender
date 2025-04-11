import { ACESFilmicToneMapping, PCFSoftShadowMap, WebGLRenderer } from 'three';
import { LinearToneMapping } from 'three/src/constants';
import { WebGLRendererParameters } from 'three/src/renderers/WebGLRenderer';

export class GraphicsUtil {
  readonly QUALITY_LOW = 0;
  readonly QUALITY_MEDIUM = 1;
  readonly QUALITY_HIGHT = 2;
  readonly QUALITY_REALISM = 3;

  public createWebGLRenderer(quality: number, canvas: HTMLCanvasElement): WebGLRenderer {
    const lowParams: WebGLRendererParameters = {
      antialias: false,
      precision: 'lowp',
      alpha: true,
      premultipliedAlpha: true,
      stencil: false,
      powerPreference: 'high-performance',
      depth: true,
      canvas: canvas,
      preserveDrawingBuffer: true,
    };

    const mediumParams: WebGLRendererParameters = {
      ...lowParams,
      antialias: true,
      precision: 'mediump',
    };

    const highParams: WebGLRendererParameters = {
      ...mediumParams,
      logarithmicDepthBuffer: true,
      precision: 'highp',
    };

    let params: WebGLRendererParameters;

    switch (quality) {
      case this.QUALITY_LOW:
        params = lowParams;
        break;
      case this.QUALITY_MEDIUM:
        params = mediumParams;
        break;
      case this.QUALITY_HIGHT:
      case this.QUALITY_REALISM:
        params = highParams;
        break;
      default:
        params = mediumParams;
    }

    const renderer = new WebGLRenderer(params);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    if (quality === this.QUALITY_LOW) {
      renderer.setPixelRatio(1);
    }

    if (quality === this.QUALITY_MEDIUM) {
      renderer.toneMapping = LinearToneMapping;
    }

    if (quality === this.QUALITY_HIGHT || quality === this.QUALITY_REALISM) {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.autoUpdate = false;
      renderer.shadowMap.type = PCFSoftShadowMap;
      renderer.toneMapping = ACESFilmicToneMapping;
    }

    return renderer;
  }
}
