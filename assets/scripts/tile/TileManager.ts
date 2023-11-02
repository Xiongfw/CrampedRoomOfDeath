import { _decorator, Component, Sprite, SpriteFrame, UITransform } from 'cc';
import { TILE_TYPE_ENUM } from '../enum';
const { ccclass, property } = _decorator;

export const TILE_WIDTH = 55;
export const TILE_HEIGHT = 55;

@ccclass('TileManager')
export class TileManager extends Component {
  type: TILE_TYPE_ENUM | null = null;
  moveable = false;
  turnable = false;

  init(type: TILE_TYPE_ENUM, spriteFrame: SpriteFrame, i: number, j: number) {
    if (
      type == TILE_TYPE_ENUM.WALL_ROW ||
      type === TILE_TYPE_ENUM.WALL_COLUMN ||
      type === TILE_TYPE_ENUM.WALL_LEFT_BOTTOM ||
      type == TILE_TYPE_ENUM.WALL_LEFT_TOP ||
      type == TILE_TYPE_ENUM.WALL_RIGHT_BOTTOM ||
      type == TILE_TYPE_ENUM.WALL_RIGHT_TOP
    ) {
      this.moveable = false;
      this.turnable = false;
    } else if (
      type == TILE_TYPE_ENUM.CLIFF_CENTER ||
      type == TILE_TYPE_ENUM.CLIFF_LEFT ||
      type == TILE_TYPE_ENUM.CLIFF_RIGHT
    ) {
      this.moveable = false;
      this.turnable = true;
    } else {
      this.moveable = true;
      this.turnable = true;
    }

    const sprite = this.node.addComponent(Sprite);
    sprite.spriteFrame = spriteFrame;

    const uiTransform = this.getComponent(UITransform);
    uiTransform?.setContentSize(TILE_WIDTH, TILE_HEIGHT);

    this.node.setPosition(i * TILE_WIDTH, -j * TILE_HEIGHT);
  }
}
