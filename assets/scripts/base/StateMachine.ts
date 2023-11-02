import { _decorator, AnimationClip, Component, Animation, SpriteFrame } from 'cc';
import { FSM_PARAMS_TYPE_NUM, PARAMS_NAME_NUM } from '../enum';
import { State } from '../base/State';
import { SubStateMachine } from './SubStateMachine';
const { ccclass } = _decorator;

type ParamsValueType = boolean | number;

type ParamsValue = {
  type: FSM_PARAMS_TYPE_NUM;
  value: ParamsValueType;
};

export const getInitTriggerValue = () => ({ type: FSM_PARAMS_TYPE_NUM.TRIGGER, value: false });
export const getInitNumberValue = () => ({ type: FSM_PARAMS_TYPE_NUM.NUMBER, value: 0 });

@ccclass('StateMachine')
export abstract class StateMachine extends Component {
  private _currentState?: State | SubStateMachine;

  params: Map<string, ParamsValue> = new Map();
  stateMachines: Map<string, State | SubStateMachine> = new Map();
  ani!: Animation;
  waitingList: Array<Promise<SpriteFrame[]>> = [];

  getParams(paramsName: string) {
    return this.params.get(paramsName);
  }

  setParams(paramsName: string, value: ParamsValueType) {
    if (this.params.has(paramsName)) {
      this.params.get(paramsName)!.value = value;
      this.run();
      this.resetTrigger();
    }
  }

  get currentState() {
    return this._currentState;
  }

  set currentState(value) {
    this._currentState = value;
    this.currentState?.run();
  }

  resetTrigger() {
    for (const [_, value] of this.params) {
      if (value.type === FSM_PARAMS_TYPE_NUM.TRIGGER) {
        value.value = false;
      }
    }
  }

  abstract init(): Promise<void>;
  abstract run(): void;
}
