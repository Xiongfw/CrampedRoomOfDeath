import { _decorator, Component, director } from 'cc';
import { EventManager } from '../runtime/EventManager';
import { EVENT_ENUM } from '../enum';
const { ccclass } = _decorator;

@ccclass('MenuManager')
export class MenuManager extends Component {
  handleUndo() {
    EventManager.instance.emit(EVENT_ENUM.REVOKE_STEP);
  }

  handleRestart() {
    EventManager.instance.emit(EVENT_ENUM.RESTART_LEVEL);
  }

  handleOut() {
    EventManager.instance.emit(EVENT_ENUM.OUT_BATTLE);
  }
}
