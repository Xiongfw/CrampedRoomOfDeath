import { Singleton } from '../base/Singleton';
import { Tile } from '../level/index';

export class DataManager extends Singleton {
  static get instance() {
    return super.getInstance<DataManager>();
  }

  mapInfo: Tile[][] = [];
  mapRowCount: number = 0;
  mapColumnCount: number = 0;
  levelIndex: number = 1;

  reset() {
    (this.mapInfo = []), (this.mapRowCount = 0);
    this.mapColumnCount = 0;
  }
}
