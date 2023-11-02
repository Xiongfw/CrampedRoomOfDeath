import { AnimationClip, Sprite, SpriteFrame, animation } from 'cc';
import { ResourceManager } from '../runtime/ResourceManager';
import { StateMachine } from './StateMachine';

const ANIMATION_SPEED = 1 / 8;

export class State {
  private animationClip!: AnimationClip;

  constructor(
    private fsm: StateMachine,
    private path: string,
    private wrapMode = AnimationClip.WrapMode.Normal
  ) {
    this.init();
  }

  async init() {
    const promise = ResourceManager.instance.loadSpriteFrames(this.path);
    this.fsm.waitingList.push(promise);
    const spriteFrames = await promise;
    const track = new animation.ObjectTrack();
    track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame');
    const keyFrames: [number, SpriteFrame][] = spriteFrames.map((item, index) => [
      ANIMATION_SPEED * index,
      item,
    ]);
    track.channel.curve.assignSorted(keyFrames);
    this.animationClip = new AnimationClip(this.path);
    this.animationClip.addTrack(track);
    this.animationClip.wrapMode = this.wrapMode;
    this.animationClip.duration = keyFrames.length * ANIMATION_SPEED;
  }

  run() {
    this.fsm.ani.defaultClip = this.animationClip;
    this.fsm.ani.play();
  }
}
