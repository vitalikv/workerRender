export type TerrainMatrix = {
  project: string,
  object_placement: string,
  crs: string,
  lod: number,
  path: string,
  model_date: string,
  id: number,
  opacity?: number;
  view: {
    position: {
      x: number,
      y: number,
      z: number,
    },
    rotation: {
      x: number,
      y: number,
      z: number,
    },
    scale: {
      x: number,
      y: number,
      z: number,
    },
  },
  geoserver_workspace: string,
  cgp_layer: string,
  square_below_zero: string,
  square_above_zero: string,
  volume_below_zero: string,
  volume_above_zero: string
};

export type TerrainMatrixList = Array<TerrainMatrix>;
