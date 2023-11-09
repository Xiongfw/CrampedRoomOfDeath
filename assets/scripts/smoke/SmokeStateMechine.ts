import { _decorator, Animation } from 'cc';
import { ENTITY_STATE_ENUM, FSM_PARAMS_TYPE_NUM, PARAMS_NAME_NUM } from '../enum';
import { StateMachine, getInitNumberValue, getInitTriggerValue } from '../base/StateMachine';
import { IdleSubStateMahchine } from './IdleSubStateMahchine';
import { State } from '../base/State';
import { SmokeManager } from './SmokeManager';
const { ccclass } = _decorator;

@ccclass('SmokeStateMechine')
export class SmokeStateMechine extends StateMachine {
  async init() {
    this.ani = this.addComponent(Animation)!;

    this.initParams();
    this.initStateMachines();
    this.initAnimationEvent();

    await Promise.all(this.waitingList);
  }

  initAnimationEvent() {
    this.ani.on(Animation.EventType.FINISHED, () => {
      const name = this.ani.defaultClip?.name;
      const whiteList = ['idle'];
      if (whiteList.some((v) => name?.includes(v))) {
        this.getComponent(SmokeManager)!.state = ENTITY_STATE_ENUM.DEATH;
      }
    });
  }

  initParams() {
    this.params.set(PARAMS_NAME_NUM.IDLE, getInitTriggerValue());
    this.params.set(PARAMS_NAME_NUM.DIRECTION, getInitNumberValue());
    this.params.set(PARAMS_NAME_NUM.DEATH, getInitTriggerValue());
  }

  initStateMachines() {
    this.stateMachines.set(PARAMS_NAME_NUM.IDLE, new IdleSubStateMahchine(this));
    this.stateMachines.set(PARAMS_NAME_NUM.DEATH, new State(this, '/texture/door/death'));
  }

  run() {
    let activedName = '';
    for (const [name, value] of this.params) {
      if (value.type === FSM_PARAMS_TYPE_NUM.TRIGGER && value.value) {
        activedName = name;
        break;
      }
    }
    if (activedName) {
      this.currentState = this.stateMachines.get(activedName);
    } else {
      this.currentState = this.currentState;
    }
  }
}
