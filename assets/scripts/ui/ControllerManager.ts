import { _decorator, Component } from 'cc';
import { EventManager } from '../runtime/EventManager';
import { EVENT_ENUM } from '../enum';
const { ccclass } = _decorator;

@ccclass('ControllerManager')
export class ControllerManager extends Component {
  handleCtrl() {
    EventManager.instance.emit(EVENT_ENUM.NEXT_LEVEL);
  }
}
