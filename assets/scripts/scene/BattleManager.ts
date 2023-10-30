import { _decorator, Component, Node, UITransform, Vec2 } from 'cc';
import { TiledMapManager } from '../tile/TiledMapManager';
import { createUINode } from '../utils';
import levels, { Level } from '../level';
import { DataManager } from '../runtime/DataManager';
import { TILE_WIDTH, TILE_HEIGHT } from '../tile/TileManager';
const { ccclass } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {
  private level: Level | null = null;
  private stage!: Node;

  start() {
    this.generateStage();
    this.initLevel();
  }

  initLevel() {
    const level = levels[`level${1}`];
    if (level) {
      this.level = level;

      DataManager.instance.mapInfo = this.level.mapInfo;
      DataManager.instance.mapRowCount = this.level.mapInfo.length || 0;
      DataManager.instance.mapColumnCount = this.level.mapInfo[0].length || 0;

      this.generateTiledMap();
    }
  }

  generateStage() {
    this.stage = createUINode('Stage');
    this.node.addChild(this.stage);
  }

  generateTiledMap() {
    const tiledMap = createUINode('TiledMap');
    this.stage.addChild(tiledMap);
    tiledMap.addComponent(TiledMapManager);

    this.adaptPos();
  }

  adaptPos() {
    const { mapRowCount, mapColumnCount } = DataManager.instance;
    const disX = (TILE_WIDTH * mapRowCount) / 2;
    const disY = (TILE_HEIGHT * mapColumnCount) / 2 + 100;

    this.stage.setPosition(-disX, disY);
  }
}
