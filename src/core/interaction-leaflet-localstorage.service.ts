import { GraphicsQualityModel } from './graphics-quality.model';

export class InteractionLeafletLocalStorageService {
  readonly graphics_quality_key = 'graphic_quality';

  public setGraphicsQuality(model: GraphicsQualityModel): void {
    localStorage.setItem(this.graphics_quality_key, JSON.stringify(model));
  }

  public getGraphicsQuality(): GraphicsQualityModel {
    return {
      quality: JSON.parse(localStorage.getItem(this.graphics_quality_key)),
    };
  }
}
