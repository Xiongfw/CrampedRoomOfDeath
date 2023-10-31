import { TILE_TYPE_ENUM } from '../enum';
import level1 from './level1';
import level2 from './level2';

export type Tile = {
  src: number | null;
  type: TILE_TYPE_ENUM | null;
};

export type Level = {
  mapInfo: Tile[][];
};

const levels: Record<string, Level> = {
  level1,
  level2,
};

export default levels;
