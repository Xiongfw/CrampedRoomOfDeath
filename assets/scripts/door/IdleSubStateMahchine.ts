import { AnimationClip } from 'cc';
import { State } from '../base/State';
import { StateMachine } from '../base/StateMachine';
import { DIRECTION_ENUM } from '../enum';
import { DirectionSubStateMachine } from '../base/DirectionSubStateMachine';

const BASE_URL = '/texture/door/idle';

export class IdleSubStateMahchine extends DirectionSubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm);
    this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm, `${BASE_URL}/top`));
    this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${BASE_URL}/top`));
    this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(fsm, `${BASE_URL}/left`));
    this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${BASE_URL}/left`));
  }
}
