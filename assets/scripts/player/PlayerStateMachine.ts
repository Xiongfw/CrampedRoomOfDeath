import { _decorator, AnimationClip, Component, Animation, SpriteFrame, debug } from 'cc';
import { FSM_PARAMS_TYPE_NUM, PARAMS_NAME_NUM } from '../enum';
import { State } from '../base/State';
import { StateMachine, getInitNumberValue, getInitTriggerValue } from '../base/StateMachine';
import { IdleSubStateMahchine } from './IdleSubStateMahchine';
import { TurnLeftSubStateMachine } from './TurnLeftSubStateMachine';
import { TurnRightSubStateMachine } from './TurnRightSubStateMachine';
import { BlockFrontSubStateMachine } from './BlockFrontSubStateMachine';
import { BlockTurnRightSubStateMachine } from './BlockTurnRightSubStateMachine';
import { BlockTurnLeftSubStateMachine } from './BlockTurnLeftSubStateMachine';
import { BlockBackSubStateMachine } from './BlockBackSubStateMachine';
import { BlockLeftSubStateMachine } from './BlockLeftSubStateMachine';
import { BlockRightSubStateMachine } from './BlockRightSubStateMachine';
const { ccclass } = _decorator;

@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends StateMachine {
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
      const whiteList = ['block', 'turn'];
      if (whiteList.some((v) => name?.includes(v))) {
        this.setParams(PARAMS_NAME_NUM.IDLE, true);
      }
    });
  }

  initParams() {
    this.params.set(PARAMS_NAME_NUM.IDLE, getInitTriggerValue());
    this.params.set(PARAMS_NAME_NUM.TURNLEFT, getInitTriggerValue());
    this.params.set(PARAMS_NAME_NUM.TURNRIGHT, getInitTriggerValue());
    this.params.set(PARAMS_NAME_NUM.BLOCKFRONT, getInitTriggerValue());
    this.params.set(PARAMS_NAME_NUM.BLOCKBACK, getInitTriggerValue());
    this.params.set(PARAMS_NAME_NUM.BLOCKLEFT, getInitTriggerValue());
    this.params.set(PARAMS_NAME_NUM.BLOCKRIGHT, getInitTriggerValue());
    this.params.set(PARAMS_NAME_NUM.BLOCKTURNLEFT, getInitTriggerValue());
    this.params.set(PARAMS_NAME_NUM.BLOCKTURNRIGHT, getInitTriggerValue());
    this.params.set(PARAMS_NAME_NUM.DIRECTION, getInitNumberValue());
  }

  initStateMachines() {
    this.stateMachines.set(PARAMS_NAME_NUM.IDLE, new IdleSubStateMahchine(this));
    this.stateMachines.set(PARAMS_NAME_NUM.TURNLEFT, new TurnLeftSubStateMachine(this));
    this.stateMachines.set(PARAMS_NAME_NUM.TURNRIGHT, new TurnRightSubStateMachine(this));
    this.stateMachines.set(PARAMS_NAME_NUM.BLOCKFRONT, new BlockFrontSubStateMachine(this));
    this.stateMachines.set(PARAMS_NAME_NUM.BLOCKBACK, new BlockBackSubStateMachine(this));
    this.stateMachines.set(PARAMS_NAME_NUM.BLOCKLEFT, new BlockLeftSubStateMachine(this));
    this.stateMachines.set(PARAMS_NAME_NUM.BLOCKRIGHT, new BlockRightSubStateMachine(this));
    this.stateMachines.set(PARAMS_NAME_NUM.BLOCKTURNLEFT, new BlockTurnLeftSubStateMachine(this));
    this.stateMachines.set(PARAMS_NAME_NUM.BLOCKTURNRIGHT, new BlockTurnRightSubStateMachine(this));
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
    // this.currentState = this.stateMachines.get(PARAMS_NAME_NUM.IDLE);
    // switch (this.currentState) {
    //   case this.stateMachines.get(PARAMS_NAME_NUM.TURNLEFT):
    //   case this.stateMachines.get(PARAMS_NAME_NUM.TURNRIGHT):
    //   case this.stateMachines.get(PARAMS_NAME_NUM.IDLE):
    //     // if (this.params.get(PARAMS_NAME_NUM.TURNLEFT)?.value) {
    //     //   this.currentState = this.stateMachines.get(PARAMS_NAME_NUM.TURNLEFT);
    //     // } else if (this.params.get(PARAMS_NAME_NUM.TURNRIGHT)?.value) {
    //     //   this.currentState = this.stateMachines.get(PARAMS_NAME_NUM.TURNRIGHT);
    //     // } else if (this.params.get(PARAMS_NAME_NUM.BLOCKFRONT)?.value) {
    //     //   this.currentState = this.stateMachines.get(PARAMS_NAME_NUM.BLOCKFRONT);
    //     // } else if (this.params.get(PARAMS_NAME_NUM.BLOCKTURNLEFT)?.value) {
    //     //   this.currentState = this.stateMachines.get(PARAMS_NAME_NUM.BLOCKTURNLEFT);
    //     // } else if (this.params.get(PARAMS_NAME_NUM.BLOCKTURNRIGHT)?.value) {
    //     //   this.currentState = this.stateMachines.get(PARAMS_NAME_NUM.BLOCKTURNRIGHT);
    //     // } else if (this.params.get(PARAMS_NAME_NUM.IDLE)?.value) {
    //     //   this.currentState = this.stateMachines.get(PARAMS_NAME_NUM.IDLE);
    //     // } else {
    //     //   // DIRECTION
    //     //   //  为了触发 setter
    //     //   this.currentState = this.currentState;
    //     // }
    //     break;
    //   default:
    //     this.currentState = this.stateMachines.get(PARAMS_NAME_NUM.IDLE);
    //     break;
    // }
  }
}
