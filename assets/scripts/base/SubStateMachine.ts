import { _decorator, AnimationClip, Component, Animation, SpriteFrame } from 'cc';
import { FSM_PARAMS_TYPE_NUM, PARAMS_NAME_NUM } from '../enum';
import { State } from '../base/State';
import { StateMachine } from './StateMachine';

export abstract class SubStateMachine {
  private _currentState?: State | null = null;
  stateMachines: Map<string, State> = new Map();

  constructor(public fsm: StateMachine) {}

  get currentState() {
    return this._currentState;
  }

  set currentState(value) {
    this._currentState = value;
    this.currentState?.run();
  }

  abstract run(): void;
}
