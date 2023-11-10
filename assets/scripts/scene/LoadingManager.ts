import { _decorator, Component, director, Node, ProgressBar, resources } from 'cc';
import { FadeManager } from '../runtime/FadeManager';
import { SCENE_ENUM } from '../enum';
const { ccclass, property } = _decorator;

@ccclass('LoadingManager')
export class LoadingManager extends Component {
  @property(ProgressBar)
  progressBar!: ProgressBar;

  protected onLoad(): void {
    resources.preloadDir(
      'texture/ctrl',
      (finished, total) => {
        this.progressBar.progress = finished / total;
      },
      async () => {
        await FadeManager.instance.fadeIn(2);
        director.loadScene(SCENE_ENUM.START);
      }
    );
  }
}
