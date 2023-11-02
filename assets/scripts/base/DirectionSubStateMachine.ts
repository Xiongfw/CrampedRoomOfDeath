import { SubStateMachine } from '../base/SubStateMachine';
import { DIRECTION_ORDER_ENUM, PARAMS_NAME_NUM } from '../enum';

export class DirectionSubStateMachine extends SubStateMachine {
  run(): void {
    const value = this.fsm.getParams(PARAMS_NAME_NUM.DIRECTION);
    if (value) {
      this.currentState = this.stateMachines.get(DIRECTION_ORDER_ENUM[value.value as number]);
    }
  }
}
