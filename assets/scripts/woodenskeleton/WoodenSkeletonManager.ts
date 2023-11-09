import { _decorator } from 'cc';
import { ENTITY_STATE_ENUM, EVENT_ENUM } from '../enum';
import { WoodenSkeletonStateMachine } from './WoodenSkeletonStateMachine';
import { EventManager } from '../runtime/EventManager';
import { DataManager } from '../runtime/DataManager';
import { EnemyManager } from '../base/EnemyManager';
import { IEntity } from '../level';
const { ccclass } = _decorator;

@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends EnemyManager {
  async init(params: IEntity) {
    this.fsm = this.addComponent(WoodenSkeletonStateMachine)!;
    await this.fsm.init();
    super.init(params);
    EventManager.instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack, this);
  }

  onDestroy(): void {
    super.onDestroy?.();
    EventManager.instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack);
  }

  onAttack() {
    if (this.state === ENTITY_STATE_ENUM.DEATH) {
      return;
    }
    const { player } = DataManager.instance;
    if (!player) {
      return;
    }
    const { x: playerX, y: playerY } = player;
    if (
      (playerX === this.x && Math.abs(playerY - this.y) <= 1) ||
      (playerY === this.y && Math.abs(playerX - this.x) <= 1)
    ) {
      this.state = ENTITY_STATE_ENUM.ATTACK;
      EventManager.instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.DEATH);
    }
  }
}
