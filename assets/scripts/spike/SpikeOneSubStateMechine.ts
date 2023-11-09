import { State } from '../base/State';
import { StateMachine } from '../base/StateMachine';
import { PARAMS_NAME_NUM, SPIKE_STATE_ENUM, SPIKE_STATE_ORDER_ENUM } from '../enum';
import { SubStateMachine } from '../base/SubStateMachine';

const BASE_URL = '/texture/spikes/spikesone';

export class SpikeOneSubStateMechine extends SubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm);
    this.stateMachines.set(SPIKE_STATE_ENUM.ZERO, new State(fsm, `${BASE_URL}/zero`));
    this.stateMachines.set(SPIKE_STATE_ENUM.ONE, new State(fsm, `${BASE_URL}/one`));
    this.stateMachines.set(SPIKE_STATE_ENUM.TWO, new State(fsm, `${BASE_URL}/two`));
  }

  run() {
    const value = this.fsm.getParams(PARAMS_NAME_NUM.SPIKE_STATE)?.value;
    this.currentState = this.stateMachines.get(SPIKE_STATE_ORDER_ENUM[value as number]);
  }
}
