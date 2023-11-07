import { _decorator, Animation } from 'cc';
import { FSM_PARAMS_TYPE_NUM, PARAMS_NAME_NUM } from '../enum';
import { StateMachine, getInitNumberValue, getInitTriggerValue } from '../base/StateMachine';
import { State } from '../base/State';

const { ccclass } = _decorator;

const BASE_URL = '/texture/burst';

@ccclass('BurstStateMachine')
export class BurstStateMachine extends StateMachine {
  async init() {
    this.ani = this.addComponent(Animation)!;

    this.initParams();
    this.initStateMachines();
    this.initAnimationEvent();

    await Promise.all(this.waitingList);
  }

  initAnimationEvent() {
    // this.ani.on(Animation.EventType.FINISHED, () => {
    //   const name = this.ani.defaultClip?.name;
    //   const whiteList = ['attack'];
    //   if (whiteList.some((v) => name?.includes(v))) {
    //     this.setParams(PARAMS_NAME_NUM.IDLE, true);
    //   }
    // });
  }

  initParams() {
    this.params.set(PARAMS_NAME_NUM.IDLE, getInitTriggerValue());
    this.params.set(PARAMS_NAME_NUM.ATTACK, getInitTriggerValue());
    this.params.set(PARAMS_NAME_NUM.DEATH, getInitTriggerValue());
  }

  initStateMachines() {
    this.stateMachines.set(PARAMS_NAME_NUM.IDLE, new State(this, `${BASE_URL}/idle`));
    this.stateMachines.set(PARAMS_NAME_NUM.ATTACK, new State(this, `${BASE_URL}/attack`));
    this.stateMachines.set(PARAMS_NAME_NUM.DEATH, new State(this, `${BASE_URL}/death`));
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
