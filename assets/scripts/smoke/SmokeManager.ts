import { _decorator } from 'cc';
import { IEntity } from '../level';
import { EntityManager } from '../base/EntityManager';
import { SmokeStateMechine } from './SmokeStateMechine';
import { EventManager } from '../runtime/EventManager';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM, INPUT_DIRECTION_ENUM } from '../enum';
import { DataManager } from '../runtime/DataManager';
const { ccclass } = _decorator;

@ccclass('SmokeManager')
export class SmokeManager extends EntityManager {
  async init(params: IEntity) {
    this.fsm = this.addComponent(SmokeStateMechine)!;
    await this.fsm.init();
    super.init(params);
    EventManager.instance.on(EVENT_ENUM.SHOW_SMOKE, this.onShowSmoke, this);
  }

  protected onDestroy(): void {
    EventManager.instance.off(EVENT_ENUM.SHOW_SMOKE, this.onShowSmoke);
  }

  onShowSmoke(playerX: number, playerY: number, inputDirection: DIRECTION_ENUM) {
    this.x = playerX;
    this.y = playerY;
    this.direction = inputDirection;
    this.state = ENTITY_STATE_ENUM.IDLE;
  }
}
