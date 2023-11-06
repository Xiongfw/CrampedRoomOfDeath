import { State } from '../base/State';
import { StateMachine } from '../base/StateMachine';

const BASE_URL = '/texture/door/death';

export class DeathSubStateMachine extends State {
  constructor(fsm: StateMachine) {
    super(fsm, `${BASE_URL}/death`);
  }
}
