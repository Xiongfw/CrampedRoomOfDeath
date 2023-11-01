import {
  _decorator,
  animation,
  Animation,
  AnimationClip,
  Component,
  Sprite,
  SpriteFrame,
} from 'cc';
import { ResourceManager } from '../runtime/ResourceManager';
const { ccclass } = _decorator;

const ANIMATION_SPEED = 1 / 8;

@ccclass('PlayerManager')
export class PlayerManager extends Component {
  start() {
    this.init();
  }

  async init() {
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
