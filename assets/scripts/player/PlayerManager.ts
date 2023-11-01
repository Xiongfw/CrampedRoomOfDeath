import {
  _decorator,
  animation,
  Animation,
  AnimationClip,
  Component,
  Sprite,
  SpriteFrame,
  UITransform,
} from 'cc';
import { ResourceManager } from '../runtime/ResourceManager';
import { TILE_HEIGHT, TILE_WIDTH } from '../tile/TileManager';
import { EVENT_ENUM, INPUT_DIRECTION_ENUM } from '../enum';
import { EventManager } from '../runtime/EventManager';
const { ccclass } = _decorator;

const ANIMATION_SPEED = 1 / 8;

@ccclass('PlayerManager')
export class PlayerManager extends Component {
  x = 0;
  y = 0;
  targetX = 0;
  targetY = 0;
  private readonly speed = 1 / 10;

  start() {
    this.render();
    EventManager.instance.on(EVENT_ENUM.PLAYER_CTRL, this.move, this);
  }

  onDestroy(): void {
    EventManager.instance.off(EVENT_ENUM.PLAYER_CTRL, this.move);
  }

  update(): void {
    this.updateXY();
    this.node.setPosition(
      this.x * TILE_WIDTH - TILE_WIDTH * 1.5,
      this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5
    );
  }

  updateXY() {
    if (this.x < this.targetX) {
      this.x += this.speed;
    } else if (this.x > this.targetX) {
      this.x -= this.speed;
    }

    if (this.y < this.targetY) {
      this.y += this.speed;
    } else if (this.y > this.targetY) {
      this.y -= this.speed;
    }

    if (Math.abs(this.x - this.targetX) < 0.1 && Math.abs(this.y - this.targetY) < 0.1) {
      this.x = this.targetX;
      this.y = this.targetY;
    }
  }

  move(inputDirection: INPUT_DIRECTION_ENUM) {
    switch (inputDirection) {
      case INPUT_DIRECTION_ENUM.TOP:
        this.targetY += 1;
        break;
      case INPUT_DIRECTION_ENUM.BOTTOM:
        this.targetY -= 1;
        break;
      case INPUT_DIRECTION_ENUM.LEFT:
        this.targetX -= 1;
        break;
      case INPUT_DIRECTION_ENUM.RIGHT:
        this.targetX += 1;
        break;
    }
  }

  async render() {
    const sprite = this.addComponent(Sprite)!;
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;

    const uiTransform = this.getComponent(UITransform);
    uiTransform?.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4);
    // db://assets/resources/texture/player/idle/top/idle.plist
    const spriteFrames = await ResourceManager.instance.loadSpriteFrames(
      '/texture/player/idle/top'
    );

    const track = new animation.ObjectTrack();
    track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame');
    const keyFrames: [number, SpriteFrame][] = spriteFrames.map((item, index) => [
      ANIMATION_SPEED * index,
      item,
    ]);
    track.channel.curve.assignSorted(keyFrames);

    const animationClip = new AnimationClip('idle');
    animationClip.addTrack(track);
    animationClip.wrapMode = AnimationClip.WrapMode.Loop;
    animationClip.duration = keyFrames.length * ANIMATION_SPEED;

    const animationComp = this.addComponent(Animation)!;
    animationComp.defaultClip = animationClip;
    animationComp.play();
  }
}
