import { _decorator, Animation } from 'cc';
import { FSM_PARAMS_TYPE_NUM, PARAMS_NAME_NUM, SPIKE_STATE_ENUM, SPIKE_TYPE_ENUM } from '../enum';
import { StateMachine, getInitNumberValue, getInitTriggerValue } from '../base/StateMachine';
import { SpikeOneSubStateMechine } from './SpikeOneSubStateMechine';
import { SpikeFourSubStateMechine } from './SpikeFourSubStateMechine';
import { SpikeTwoSubStateMechine } from './SpikeTwoSubStateMechine';
import { SpikeThreeSubStateMechine } from './SpikeThreeSubStateMechine';

const { ccclass } = _decorator;

@ccclass('SpikeStateMechine')
export class SpikeStateMechine extends StateMachine {
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
      const whiteList = ['attack'];
      if (whiteList.some((v) => name?.includes(v))) {
        this.setParams(PARAMS_NAME_NUM.IDLE, true);
      }
    });
  }

  initParams() {
    this.params.set(PARAMS_NAME_NUM.SPIKE_STATE, getInitNumberValue());
    this.params.set(SPIKE_TYPE_ENUM.ONE, getInitTriggerValue());
    this.params.set(SPIKE_TYPE_ENUM.TWO, getInitTriggerValue());
    this.params.set(SPIKE_TYPE_ENUM.THREE, getInitTriggerValue());
    this.params.set(SPIKE_TYPE_ENUM.FOUR, getInitTriggerValue());
  }

  initStateMachines() {
    this.stateMachines.set(SPIKE_TYPE_ENUM.ONE, new SpikeOneSubStateMechine(this));
    this.stateMachines.set(SPIKE_TYPE_ENUM.TWO, new SpikeTwoSubStateMechine(this));
    this.stateMachines.set(SPIKE_TYPE_ENUM.THREE, new SpikeThreeSubStateMechine(this));
    this.stateMachines.set(SPIKE_TYPE_ENUM.FOUR, new SpikeFourSubStateMechine(this));
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
