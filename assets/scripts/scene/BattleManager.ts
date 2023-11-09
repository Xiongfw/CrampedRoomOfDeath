import { _decorator, Component, Node, UITransform, Vec2 } from 'cc';
import { TiledMapManager } from '../tile/TiledMapManager';
import { createUINode } from '../utils';
import levels, { Level } from '../level';
import { DataManager } from '../runtime/DataManager';
import { TILE_WIDTH, TILE_HEIGHT } from '../tile/TileManager';
import { EventManager } from '../runtime/EventManager';
import {
  DIRECTION_ENUM,
  ENTITY_STATE_ENUM,
  ENTITY_TYPE_ENUM,
  EVENT_ENUM,
  SPIKE_STATE_ENUM,
  SPIKE_TYPE_ENUM,
} from '../enum';
import { PlayerManager } from '../player/PlayerManager';
import { WoodenSkeletonManager } from '../woodenskeleton/WoodenSkeletonManager';
import { DoorManager } from '../door/DoorManager';
import { IronSkeletonManager } from '../ironskeleton/IronSkeletonManager';
import { BurstManager } from '../burst/BurstManager';
import { SpikeManager } from '../spike/SpikeManager';
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
      this.generateDoor();
      this.generateBurst();
      this.generateSpike();
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

  generateSpike() {
    const node = createUINode('Spike');
    const spikeManager = node.addComponent(SpikeManager);
    spikeManager.init({
      x: 2,
      y: -6,
      type: SPIKE_TYPE_ENUM.THREE,
      count: 0,
    });
    this.stage.addChild(node);
  }

  generateDoor() {
    const node = createUINode('Door');
    const doorManager = node.addComponent(DoorManager);
    doorManager.init();
    this.stage.addChild(node);
  }

  generateBurst() {
    const node = createUINode('Burst');
    const burstManager = node.addComponent(BurstManager);
    burstManager.init({
      x: 2,
      y: -5,
      type: ENTITY_TYPE_ENUM.BURST,
      direciton: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
    });
    DataManager.instance.bursts.push(burstManager);
    this.stage.addChild(node);
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
    playerManager
      .init({
        x: 2,
        y: -8,
        type: ENTITY_TYPE_ENUM.PLAYER,
        direciton: DIRECTION_ENUM.TOP,
        state: ENTITY_STATE_ENUM.IDLE,
      })
      .then(() => {
        EventManager.instance.emit(EVENT_ENUM.PLAYER_BORN);
      });
    DataManager.instance.player = playerManager;
    this.stage.addChild(node);
  }

  generateEnemies() {
    const enemy1 = createUINode('WoodenSkeleton');
    const woodenSkeletonManager = enemy1.addComponent(WoodenSkeletonManager);
    woodenSkeletonManager.init({
      x: 7,
      y: -6,
      type: ENTITY_TYPE_ENUM.SKELETON_WOODEN,
      direciton: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
    });
    DataManager.instance.enemies.push(woodenSkeletonManager);
    this.stage.addChild(enemy1);

    const enemy2 = createUINode('IronSkeleton');
    const ironSkeletonManager = enemy2.addComponent(IronSkeletonManager);
    ironSkeletonManager.init({
      x: 2,
      y: -2,
      type: ENTITY_TYPE_ENUM.SKELETON_IRON,
      direciton: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
    });

    DataManager.instance.enemies.push(ironSkeletonManager);
    this.stage.addChild(enemy2);
  }

  adaptPos() {
    const { mapRowCount, mapColumnCount } = DataManager.instance;
    const disX = (TILE_WIDTH * mapRowCount) / 2;
    const disY = (TILE_HEIGHT * mapColumnCount) / 2 + 100;

    this.stage.setPosition(-disX, disY);
  }
}
