import { _decorator } from 'cc';
import { EntityManager } from '../base/EntityManager';
import { ENTITY_TYPE_ENUM, DIRECTION_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM } from '../enum';
import { EventManager } from '../runtime/EventManager';
import { DoorStateMachine } from './DoorStateMachine';
import { DataManager } from '../runtime/DataManager';
import { IEntity } from '../level';
const { ccclass } = _decorator;

@ccclass('DoorManager')
export class DoorManager extends EntityManager {
  async init(params: IEntity) {
    this.fsm = this.addComponent(DoorStateMachine)!;
    await this.fsm.init();
    super.init(params);
    EventManager.instance.on(EVENT_ENUM.DOOR_OPEN, this.onOpen, this);
  }

  onDestroy(): void {
    super.onDestroy?.();
    EventManager.instance.off(EVENT_ENUM.DOOR_OPEN, this.onOpen);
  }

  onOpen() {
    const { enemies } = DataManager.instance;
    if (
      enemies.every((i) => i.state === ENTITY_STATE_ENUM.DEATH) &&
      this.state !== ENTITY_STATE_ENUM.DEATH
    ) {
      this.state = ENTITY_STATE_ENUM.DEATH;
    }
  }
}
