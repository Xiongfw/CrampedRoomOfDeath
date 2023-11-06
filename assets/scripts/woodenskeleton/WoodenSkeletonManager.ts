import { _decorator, Component, find } from 'cc';
import { EntityManager } from '../base/EntityManager';
import { ENTITY_TYPE_ENUM, DIRECTION_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM } from '../enum';
import { WoodenSkeletonStateMachine } from './WoodenSkeletonStateMachine';
import { EventManager } from '../runtime/EventManager';
import { DataManager } from '../runtime/DataManager';
const { ccclass } = _decorator;

@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends EntityManager {
  async init() {
    this.fsm = this.addComponent(WoodenSkeletonStateMachine)!;
    await this.fsm.init();
    super.init({
      x: 2,
      y: -5,
      type: ENTITY_TYPE_ENUM.SKELETON_WOODEN,
      direciton: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
    });
    EventManager.instance.on(EVENT_ENUM.PLAYER_BORN, this.onChangeDirection, this);
    EventManager.instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection, this);
    EventManager.instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack, this);
    EventManager.instance.on(EVENT_ENUM.ATTACK_ENEMY, this.onDeath, this);
  }

  onDestroy(): void {
    super.onDestroy?.();
    EventManager.instance.off(EVENT_ENUM.PLAYER_BORN, this.onChangeDirection);
    EventManager.instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection);
    EventManager.instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack);
    EventManager.instance.off(EVENT_ENUM.ATTACK_ENEMY, this.onDeath);
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

  onAttack() {
    const { player } = DataManager.instance;
    if (!player) {
      return;
    }
    const { x: playerX, y: playerY } = player;
    if (
      (playerX === this.x && Math.abs(playerY - this.y) <= 1) ||
      (playerY === this.y && Math.abs(playerX - this.x) <= 1)
    ) {
      this.state = ENTITY_STATE_ENUM.ATTACK;
      EventManager.instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.DEATH);
    }
  }

  onDeath() {
    this.state = ENTITY_STATE_ENUM.DEATH;
    EventManager.instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection);
    EventManager.instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack);
  }
}
