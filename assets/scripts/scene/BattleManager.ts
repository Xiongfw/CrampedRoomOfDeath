import { _decorator, Component, Node, UITransform, Vec2 } from 'cc';
import { TiledMapManager } from '../tile/TiledMapManager';
import { createUINode } from '../utils';
import levels, { Level } from '../level';
import { DataManager } from '../runtime/DataManager';
import { TILE_WIDTH, TILE_HEIGHT } from '../tile/TileManager';
import { EventManager } from '../runtime/EventManager';
import { EVENT_ENUM } from '../enum';
import { PlayerManager } from '../player/PlayerManager';
import { WoodenSkeletonManager } from '../woodenskeleton/WoodenSkeletonManager';
const { ccclass } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {
  private level: Level | null = null;
  private stage!: Node;

  start() {
    EventManager.instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this);

    this.generateStage();
    this.initLevel();
  }

  protected onDestroy(): void {
    EventManager.instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel);
  }

  initLevel() {
    const level = levels[`level${DataManager.instance.levelIndex}`];
    if (level) {
      this.level = level;

      this.clearLevel();

      DataManager.instance.mapInfo = this.level.mapInfo;
      DataManager.instance.mapRowCount = this.level.mapInfo.length || 0;
      DataManager.instance.mapColumnCount = this.level.mapInfo[0].length || 0;

      this.generateTiledMap();
      this.generateEnemies();
      this.generatePlayer();
    }
  }

  nextLevel() {
    DataManager.instance.levelIndex++;
    this.initLevel();
  }

  clearLevel() {
    this.stage.destroyAllChildren();
    DataManager.instance.reset();
  }

  generateStage() {
    this.stage = createUINode('Stage');
    this.node.addChild(this.stage);
  }

  generateTiledMap() {
    const tiledMap = createUINode('TiledMap');
    this.stage.addChild(tiledMap);
    const tiledMapManager = tiledMap.addComponent(TiledMapManager);
    tiledMapManager.init();

    this.adaptPos();
  }

  generatePlayer() {
    const node = createUINode('Player');
    const playerManager = node.addComponent(PlayerManager);
    playerManager.init();
    this.stage.addChild(node);
  }

  generateEnemies() {
    const node = createUINode('WoodenSkeleton');
    const woodenSkeletonManager = node.addComponent(WoodenSkeletonManager);
    woodenSkeletonManager.init();
    this.stage.addChild(node);
  }

  adaptPos() {
    const { mapRowCount, mapColumnCount } = DataManager.instance;
    const disX = (TILE_WIDTH * mapRowCount) / 2;
    const disY = (TILE_HEIGHT * mapColumnCount) / 2 + 100;

    this.stage.setPosition(-disX, disY);
  }
}
