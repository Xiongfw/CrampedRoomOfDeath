import { RenderRoot2D, director, game } from 'cc';
import { Singleton } from '../base/Singleton';
import { DrawManager } from '../ui/DrawManager';
import { createUINode } from '../utils';

export class FadeManager extends Singleton {
  static get instance() {
    return super.getInstance<FadeManager>();
  }
  private _fader?: DrawManager;

  private get fader() {
    if (this._fader) {
      return this._fader;
    }

    const root = createUINode('Root');
    root.addComponent(RenderRoot2D);

    const fadeNode = createUINode('FadeNode');
    fadeNode.setParent(root);

    this._fader = fadeNode.addComponent(DrawManager);
    this._fader.init();

    director.addPersistRootNode(root);

    return this._fader;
  }

  fadeIn(duration?: number) {
    return this.fader.fadeIn(duration);
  }

  fadeOut(duration?: number) {
    return this.fader.fadeOut(duration);
  }
}
