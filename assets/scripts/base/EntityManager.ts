import { _decorator, Component, Sprite, UITransform } from 'cc';
import { TILE_HEIGHT, TILE_WIDTH } from '../tile/TileManager';
import {
  DIRECTION_ENUM,
  DIRECTION_ORDER_ENUM,
  ENTITY_STATE_ENUM,
  ENTITY_TYPE_ENUM,
  PARAMS_NAME_NUM,
} from '../enum';
import { Entity } from '../level';
import { StateMachine } from './StateMachine';
const { ccclass } = _decorator;

@ccclass('EntityManager')
export class EntityManager extends Component {
  x = 0;
  y = 0;
  fsm!: StateMachine;
  private _direction!: DIRECTION_ENUM;
  private _state!: ENTITY_STATE_ENUM;
  private type!: ENTITY_TYPE_ENUM;

  get direction() {
    return this._direction;
  }

  set direction(value) {
    this._direction = value;
    this.fsm.setParams(PARAMS_NAME_NUM.DIRECTION, DIRECTION_ORDER_ENUM[value]);
  }

  get state() {
    return this._state;
  }

  set state(value) {
    this._state = value;
    this.fsm.setParams(value, true);
  }

  async init(params: Entity) {
    const sprite = this.addComponent(Sprite)!;
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;

    const uiTransform = this.getComponent(UITransform);
    uiTransform?.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4);

    this.x = params.x;
    this.y = params.y;
    this.direction = params.direciton;
    this.state = params.state;
    this.type = params.type;
  }

  update(): void {
    this.node.setPosition(
      this.x * TILE_WIDTH - TILE_WIDTH * 1.5,
      this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5
    );
  }
}
