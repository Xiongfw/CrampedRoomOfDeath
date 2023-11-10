import { _decorator, Component, Node } from 'cc';
import { TiledMapManager } from '../tile/TiledMapManager';
import { createUINode } from '../utils';
import levels, { ILevel } from '../level';
import { DataManager } from '../runtime/DataManager';
import { TILE_WIDTH, TILE_HEIGHT } from '../tile/TileManager';
import { EventManager } from '../runtime/EventManager';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../enum';
import { PlayerManager } from '../player/PlayerManager';
import { WoodenSkeletonManager } from '../woodenskeleton/WoodenSkeletonManager';
import { DoorManager } from '../door/DoorManager';
import { IronSkeletonManager } from '../ironskeleton/IronSkeletonManager';
import { BurstManager } from '../burst/BurstManager';
import { SpikeManager } from '../spike/SpikeManager';
import { SmokeManager } from '../smoke/SmokeManager';
import { FadeManager } from '../runtime/FadeManager';
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

  async initLevel() {
    const level = levels[`level${DataManager.instance.levelIndex}`];
    if (level) {
      await FadeManager.instance.fadeIn();

      this.level = level;

      this.clearLevel();

      DataManager.instance.mapInfo = this.level.mapInfo;
      DataManager.instance.mapRowCount = this.level.mapInfo.length || 0;
      DataManager.instance.mapColumnCount = this.level.mapInfo[0].length || 0;

      await Promise.all([
        this.generateTiledMap(),
        this.generateEnemies(),
        this.generateDoor(),
        this.generateBurst(),
        this.generateSpike(),
        this.generateSmoke(),
        this.generatePlayer(),
      ]);

      await FadeManager.instance.fadeOut();
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

  async generateSmoke() {
    const node = createUINode('Smoke');
    this.stage.addChild(node);

    const smokeManager = node.addComponent(SmokeManager);
    await smokeManager.init({
      x: 0,
      y: 0,
      type: ENTITY_TYPE_ENUM.SMOKE,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.DEATH,
    });
  }

  async generateSpike() {
    const { spikes } = this.level;
    for (const spike of spikes) {
      const node = createUINode('Burst');
      this.stage.addChild(node);

      const spikeManager = node.addComponent(SpikeManager);
      await spikeManager.init({ ...spike, y: -spike.y });
    }
  }

  async generateDoor() {
    const { door } = this.level;
    const node = createUINode('Door');
    this.stage.addChild(node);

    const doorManager = node.addComponent(DoorManager);
    await doorManager.init({ ...door, y: -door.y });

    DataManager.instance.door = doorManager;
  }

  async generateBurst() {
    const { bursts } = this.level;
    const promiseList: Promise<void>[] = [];
    for (const burst of bursts) {
      const node = createUINode('Burst');
      this.stage.addChild(node);

      const burstManager = node.addComponent(BurstManager);
      const promise = burstManager.init({ ...burst, y: -burst.y });
      promiseList.push(promise);
      DataManager.instance.bursts.push(burstManager);
    }
    await Promise.all(promiseList);
  }

  async generateTiledMap() {
    const tiledMap = createUINode('TiledMap');
    this.stage.addChild(tiledMap);
    const tiledMapManager = tiledMap.addComponent(TiledMapManager);
    await tiledMapManager.init();

    this.adaptPos();
  }

  async generatePlayer() {
    const { player } = this.level;
    const node = createUINode('Player');
    this.stage.addChild(node);

    const playerManager = node.addComponent(PlayerManager);
    await playerManager.init({ ...player, y: -player.y });
    DataManager.instance.player = playerManager;
    EventManager.instance.emit(EVENT_ENUM.PLAYER_BORN);
  }

  async generateEnemies() {
    const { enemies } = this.level;
    const promiseList: Promise<void>[] = [];
    for (const enemy of enemies) {
      const node = createUINode('Enemy');
      this.stage.addChild(node);

      const enemyManager = node.addComponent(
        enemy.type === ENTITY_TYPE_ENUM.SKELETON_IRON ? IronSkeletonManager : WoodenSkeletonManager
      );
      const promise = enemyManager.init({ ...enemy, y: -enemy.y });
      promiseList.push(promise);
      DataManager.instance.enemies.push(enemyManager);
    }
    await Promise.all(promiseList);
  }

  adaptPos() {
    const { mapRowCount, mapColumnCount } = DataManager.instance;
    const disX = (TILE_WIDTH * mapRowCount) / 2;
    const disY = (TILE_HEIGHT * mapColumnCount) / 2 + 100;

    this.stage.setPosition(-disX, disY);
  }
}
