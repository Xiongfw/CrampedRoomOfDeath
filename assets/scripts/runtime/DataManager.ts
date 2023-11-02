import { Singleton } from '../base/Singleton';
import { Tile } from '../level/index';
import { TileManager } from '../tile/TileManager';

export class DataManager extends Singleton {
  static get instance() {
    return super.getInstance<DataManager>();
  }

  mapInfo: Tile[][] = [];
  tileInfo: TileManager[][] = [];
  mapRowCount: number = 0;
  mapColumnCount: number = 0;
  // 当前关卡索引
  levelIndex: number = 1;

  reset() {
    this.mapInfo = [];
    this.tileInfo = [];
    this.mapRowCount = 0;
    this.mapColumnCount = 0;
  }
}
