import { _decorator } from 'cc';
import { EntityManager } from '../base/EntityManager';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM } from '../enum';
import { EventManager } from '../runtime/EventManager';
import { DataManager } from '../runtime/DataManager';
import { IEntity } from '../level';
const { ccclass } = _decorator;

@ccclass('EnemyManager')
export class EnemyManager extends EntityManager {
  async init(params: IEntity) {
    super.init(params);
    EventManager.instance.on(EVENT_ENUM.PLAYER_BORN, this.onChangeDirection, this);
    EventManager.instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection, this);
    EventManager.instance.on(EVENT_ENUM.ATTACK_ENEMY, this.onDeath, this);
  }

  onDestroy(): void {
    super.onDestroy?.();
    EventManager.instance.off(EVENT_ENUM.PLAYER_BORN, this.onChangeDirection);
    EventManager.instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection);
    EventManager.instance.off(EVENT_ENUM.ATTACK_ENEMY, this.onDeath);
  }

  onChangeDirection() {
    if (this.state === ENTITY_STATE_ENUM.DEATH) {
      return;
    }
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

  onDeath(id: string) {
    if (this.state === ENTITY_STATE_ENUM.DEATH) {
      return;
    }
    if (this.id === id) {
      this.state = ENTITY_STATE_ENUM.DEATH;
    }
  }
}
