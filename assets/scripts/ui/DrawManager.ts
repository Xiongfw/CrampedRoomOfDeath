import {
  _decorator,
  BlockInputEvents,
  Color,
  Component,
  game,
  Graphics,
  UITransform,
  view,
} from 'cc';
const { ccclass } = _decorator;

const SCREEN_WIDTH = view.getVisibleSize().width;
const SCREEN_HEIGHT = view.getVisibleSize().height;

export const DEFAULT_DURATION = 1;

export enum FADE_STATE_ENUM {
  IDLE = 'IDLE',
  FADE_IN = 'FADE_IN',
  FADE_OUT = 'FADE_OUT',
}

@ccclass('DrawManager')
export class DrawManager extends Component {
  private ctx!: Graphics;
  private blockInputEvents!: BlockInputEvents;
  private state = FADE_STATE_ENUM.IDLE;
  private curTime = 0;
  private duration = DEFAULT_DURATION;
  private fadeResolve?: (value: unknown) => void;

  init() {
    this.blockInputEvents = this.addComponent(BlockInputEvents)!;
    this.ctx = this.addComponent(Graphics)!;
    const uiTransform = this.getComponent(UITransform);
    uiTransform?.setAnchorPoint(0.5, 0.5);
    uiTransform?.setContentSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.setAlpha(1);
  }

  update(dt: number): void {
    if (this.state === FADE_STATE_ENUM.IDLE) {
      return;
    }
    this.curTime += dt;
    const percent = this.curTime / this.duration;
    switch (this.state) {
      case FADE_STATE_ENUM.FADE_IN:
        if (percent < 1) {
          this.setAlpha(percent);
        } else {
          this.setAlpha(1);
          this.state = FADE_STATE_ENUM.IDLE;
          this.fadeResolve?.(null);
        }
        break;
      case FADE_STATE_ENUM.FADE_OUT:
        if (percent < 1) {
          this.setAlpha(1 - percent);
        } else {
          this.setAlpha(0);
          this.state = FADE_STATE_ENUM.IDLE;
          this.fadeResolve?.(null);
        }
        break;
    }
  }

  setAlpha(percent: number) {
    this.ctx.clear();
    this.ctx.rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    this.ctx.fillColor = new Color(0, 0, 0, 255 * percent);
    this.ctx.fill();
    this.blockInputEvents.enabled = percent === 1;
  }

  async fadeIn(duration = DEFAULT_DURATION) {
    this.curTime = 0;
    this.duration = duration;
    this.setAlpha(0);
    this.state = FADE_STATE_ENUM.FADE_IN;
    return new Promise((resolve) => {
      this.fadeResolve = resolve;
    });
  }

  async fadeOut(duration = DEFAULT_DURATION) {
    this.curTime = 0;
    this.duration = duration;
    this.setAlpha(1);
    this.state = FADE_STATE_ENUM.FADE_OUT;
    return new Promise((resolve) => {
      this.fadeResolve = resolve;
    });
  }
}
