import { UITransform, _decorator } from 'cc';
import { IEntity } from '../level';
import { BurstStateMachine } from './BurstStateMachine';
import { EntityManager } from '../base/EntityManager';
import { TILE_WIDTH, TILE_HEIGHT } from '../tile/TileManager';
import { EventManager } from '../runtime/EventManager';
import { ENTITY_STATE_ENUM, EVENT_ENUM } from '../enum';
import { DataManager } from '../runtime/DataManager';
const { ccclass } = _decorator;

@ccclass('BurstManager')
export class BurstManager extends EntityManager {
  async init(params: IEntity) {
    this.fsm = this.addComponent(BurstStateMachine)!;
    await this.fsm.init();

    super.init(params);

    const uiTransform = this.getComponent(UITransform);
    uiTransform?.setContentSize(TILE_WIDTH, TILE_HEIGHT);

    EventManager.instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onBurst, this);
  }

  protected onDestroy(): void {
    super.onDestroy?.();
    EventManager.instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onBurst);
  }

  update(): void {
    this.node.setPosition(this.x * TILE_WIDTH, this.y * TILE_HEIGHT);
  }

  onBurst() {
    if (this.state === ENTITY_STATE_ENUM.DEATH) {
      return;
    }
    const { player } = DataManager.instance;
    if (!player) {
      return;
    }
    const { x: playerX, y: playerY } = player;
    if (this.x === playerX && this.y === playerY && this.state === ENTITY_STATE_ENUM.IDLE) {
      this.state = ENTITY_STATE_ENUM.ATTACK;
    } else if (this.state === ENTITY_STATE_ENUM.ATTACK) {
      // 玩家位置没有改变
      if (this.x === playerX && this.y === playerY) {
        EventManager.instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.AIRDEATE);
      }
      this.state = ENTITY_STATE_ENUM.DEATH;
    }
  }
}
