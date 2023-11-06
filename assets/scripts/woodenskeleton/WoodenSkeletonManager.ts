import { _decorator, Component, find } from 'cc';
import { EntityManager } from '../base/EntityManager';
import { ENTITY_TYPE_ENUM, DIRECTION_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM } from '../enum';
import { WoodenSkeletonStateMachine } from './WoodenSkeletonStateMachine';
import { PlayerManager } from '../player/PlayerManager';
import { EventManager } from '../runtime/EventManager';
import { DataManager } from '../runtime/DataManager';
const { ccclass } = _decorator;

@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends EntityManager {
  async init() {
    this.fsm = this.addComponent(WoodenSkeletonStateMachine)!;
    await this.fsm.init();
    super.init({
      x: 7,
      y: -6,
      type: ENTITY_TYPE_ENUM.PLAYER,
      direciton: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
    });
    EventManager.instance.on(EVENT_ENUM.PLAYER_BORN, this.onChangeDirection, this);
    EventManager.instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection, this);
  }

  onDestroy(): void {
    super.onDestroy?.();
    EventManager.instance.off(EVENT_ENUM.PLAYER_BORN, this.onChangeDirection);
    EventManager.instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection);
  }

  onChangeDirection() {
    const { player } = DataManager.instance;
    if (!player) {
      return;
    }
    const { x: playerX, y: playerY } = player;
    const disX = Math.abs(this.x - playerX);
    const disY = Math.abs(this.y - playerY);

    // 人物在敌人的对角线不转
    if (disX === disY) {
      return;
    }
    let newDirection = this.direction;
    if (playerX >= this.x && playerY >= this.y) {
      // 进入第一象限
      newDirection = disX > disY ? DIRECTION_ENUM.RIGHT : DIRECTION_ENUM.TOP;
    } else if (playerX <= this.x && playerY >= this.y) {
      // 进入第二象限
      newDirection = disX > disY ? DIRECTION_ENUM.LEFT : DIRECTION_ENUM.TOP;
    } else if (playerX <= this.x && playerY <= this.y) {
      // 进入第三象限
      newDirection = disX > disY ? DIRECTION_ENUM.LEFT : DIRECTION_ENUM.BOTTOM;
    } else if (playerX >= this.x && playerY <= this.y) {
      // 进入第四象限
      newDirection = disX > disY ? DIRECTION_ENUM.RIGHT : DIRECTION_ENUM.BOTTOM;
    }
    // 避免动画重复播放
    if (newDirection !== this.direction) {
      this.direction = newDirection;
    }
  }
}
