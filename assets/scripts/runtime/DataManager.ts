import { EnemyManager } from '../base/EnemyManager';
import { Singleton } from '../base/Singleton';
import { BurstManager } from '../burst/BurstManager';
import { Tile } from '../level/index';
import { PlayerManager } from '../player/PlayerManager';
import { TileManager } from '../tile/TileManager';

export class DataManager extends Singleton {
  static get instance() {
    return super.getInstance<DataManager>();
  }

  mapInfo: Tile[][] = [];
  tileInfo: TileManager[][] = [];
  mapRowCount: number = 0;
  mapColumnCount: number = 0;
  player: PlayerManager | null = null;
  enemies: EnemyManager[] = [];
  bursts: BurstManager[] = [];
  // 当前关卡索引
  levelIndex: number = 1;

  reset() {
    this.mapInfo = [];
    this.tileInfo = [];
    this.player = null;
    this.enemies = [];
    this.bursts = [];
    this.mapRowCount = 0;
    this.mapColumnCount = 0;
  }
}
