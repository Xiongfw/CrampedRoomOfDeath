import { TILE_TYPE_ENUM } from '../enum';
import level1 from './level1';

export type Tile = {
  src: number | null;
  type: TILE_TYPE_ENUM | null;
};

export type Level = {
  mapInfo: Tile[][];
};

const levels = {
  level1,
};

export default levels;
