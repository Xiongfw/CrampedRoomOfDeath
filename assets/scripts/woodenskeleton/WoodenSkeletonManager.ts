import { _decorator, Component } from 'cc';
import { EntityManager } from '../base/EntityManager';
import { ENTITY_TYPE_ENUM, DIRECTION_ENUM, ENTITY_STATE_ENUM } from '../enum';
import { WoodenSkeletonStateMachine } from './WoodenSkeletonStateMachine';
const { ccclass } = _decorator;

@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends EntityManager {
  async init() {
    this.fsm = this.addComponent(WoodenSkeletonStateMachine)!;
    await this.fsm.init();
    super.init({
      x: 7,
      y: -6,
      type: ENTITY_TYPE_ENUM.PLAYER,
      direciton: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
    });
  }
}
