import { _decorator, Component, Event } from 'cc';
import { EventManager } from '../runtime/EventManager';
import { EVENT_ENUM } from '../enum';
const { ccclass } = _decorator;

@ccclass('ControllerManager')
export class ControllerManager extends Component {
  handleCtrl(event: Event, direction: string) {
    EventManager.instance.emit(EVENT_ENUM.PLAYER_CTRL, direction);
  }
}
