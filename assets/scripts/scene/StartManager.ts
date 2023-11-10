import { _decorator, Component, director, Node } from 'cc';
import { FadeManager } from '../runtime/FadeManager';
import { SCENE_ENUM } from '../enum';
const { ccclass } = _decorator;

@ccclass('StartManager')
export class StartManager extends Component {
  protected onLoad(): void {
    FadeManager.instance.fadeOut(2);
    this.node.once(Node.EventType.TOUCH_END, () => {
      director.loadScene(SCENE_ENUM.BATTLE);
    });
  }
}
