export enum GraphicsQualityEnum {
  'LOW',
  'MEDIUM',
  'HIGH',
}
export class GraphicsQualityModel {
  quality: GraphicsQualityEnum;
}

export const DEFAULT_STATE: GraphicsQualityModel = {
  quality: GraphicsQualityEnum.MEDIUM,
};
