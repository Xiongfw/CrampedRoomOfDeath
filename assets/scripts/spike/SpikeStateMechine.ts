import { _decorator, Animation } from 'cc';
import { ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, FSM_PARAMS_TYPE_NUM, PARAMS_NAME_NUM } from '../enum';
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
    this.params.set(ENTITY_TYPE_ENUM.SPIKES_ONE, getInitTriggerValue());
    this.params.set(ENTITY_TYPE_ENUM.SPIKES_TWO, getInitTriggerValue());
    this.params.set(ENTITY_TYPE_ENUM.SPIKES_THREE, getInitTriggerValue());
    this.params.set(ENTITY_TYPE_ENUM.SPIKES_FOUR, getInitTriggerValue());
  }

  initStateMachines() {
    this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_ONE, new SpikeOneSubStateMechine(this));
    this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_TWO, new SpikeTwoSubStateMechine(this));
    this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_THREE, new SpikeThreeSubStateMechine(this));
    this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_FOUR, new SpikeFourSubStateMechine(this));
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
