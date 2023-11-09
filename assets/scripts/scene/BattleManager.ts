import { _decorator, Component, Node } from 'cc';
import { TiledMapManager } from '../tile/TiledMapManager';
import { createUINode } from '../utils';
import levels, { ILevel } from '../level';
import { DataManager } from '../runtime/DataManager';
import { TILE_WIDTH, TILE_HEIGHT } from '../tile/TileManager';
import { EventManager } from '../runtime/EventManager';
import { ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../enum';
import { PlayerManager } from '../player/PlayerManager';
import { WoodenSkeletonManager } from '../woodenskeleton/WoodenSkeletonManager';
import { DoorManager } from '../door/DoorManager';
import { IronSkeletonManager } from '../ironskeleton/IronSkeletonManager';
import { BurstManager } from '../burst/BurstManager';
import { SpikeManager } from '../spike/SpikeManager';
const { ccclass } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {
  private level!: ILevel;
  private stage!: Node;

  start() {
    this.generateStage();
    this.initLevel();

    EventManager.instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this);
    EventManager.instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived, this);
  }

  protected onDestroy(): void {
    EventManager.instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel);
    EventManager.instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived);
  }

  checkArrived() {
    const { player, door } = DataManager.instance;
    if (!player || !door) {
      return;
    }
    if (door.state === ENTITY_STATE_ENUM.DEATH && player.x === door.x && player.y === door.y) {
      this.nextLevel();
    }
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
    const { spikes } = this.level;
    for (const spike of spikes) {
      const node = createUINode('Burst');
      const spikeManager = node.addComponent(SpikeManager);
      spikeManager.init({ ...spike, y: -spike.y });
      this.stage.addChild(node);
    }
  }

  generateDoor() {
    const { door } = this.level;
    const node = createUINode('Door');
    const doorManager = node.addComponent(DoorManager);
    doorManager.init({ ...door, y: -door.y });
    this.stage.addChild(node);
    DataManager.instance.door = doorManager;
  }

  generateBurst() {
    const { bursts } = this.level;
    for (const burst of bursts) {
      const node = createUINode('Burst');
      const burstManager = node.addComponent(BurstManager);
      burstManager.init({ ...burst, y: -burst.y });
      DataManager.instance.bursts.push(burstManager);
      this.stage.addChild(node);
    }
  }

  generateTiledMap() {
    const tiledMap = createUINode('TiledMap');
    this.stage.addChild(tiledMap);
    const tiledMapManager = tiledMap.addComponent(TiledMapManager);
    tiledMapManager.init();

    this.adaptPos();
  }

  generatePlayer() {
    const { player } = this.level;
    const node = createUINode('Player');
    const playerManager = node.addComponent(PlayerManager);
    playerManager.init({ ...player, y: -player.y }).then(() => {
      EventManager.instance.emit(EVENT_ENUM.PLAYER_BORN);
    });
    DataManager.instance.player = playerManager;
    this.stage.addChild(node);
  }

  generateEnemies() {
    const { enemies } = this.level;
    for (const enemy of enemies) {
      const node = createUINode('Enemy');
      const enemyManager = node.addComponent(
        enemy.type === ENTITY_TYPE_ENUM.SKELETON_IRON ? IronSkeletonManager : WoodenSkeletonManager
      );
      enemyManager.init({ ...enemy, y: -enemy.y });
      DataManager.instance.enemies.push(enemyManager);
      this.stage.addChild(node);
    }
  }

  adaptPos() {
    const { mapRowCount, mapColumnCount } = DataManager.instance;
    const disX = (TILE_WIDTH * mapRowCount) / 2;
    const disY = (TILE_HEIGHT * mapColumnCount) / 2 + 100;

    this.stage.setPosition(-disX, disY);
  }
}
