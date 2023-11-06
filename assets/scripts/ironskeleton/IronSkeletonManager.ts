import { _decorator } from 'cc';
import { EnemyManager } from '../base/EnemyManager';
import { Entity } from '../level';
import { IronSkeletonStateMachine } from './IronSkeletonStateMachine';
const { ccclass } = _decorator;

@ccclass('IronSkeletonManager')
export class IronSkeletonManager extends EnemyManager {
  async init(params: Entity) {
    this.fsm = this.addComponent(IronSkeletonStateMachine)!;
    await this.fsm.init();
    super.init(params);
  }
}
