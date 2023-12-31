import { Input, _decorator, input } from 'cc';
import {
  DIRECTION_ENUM,
  ENTITY_STATE_ENUM,
  ENTITY_TYPE_ENUM,
  EVENT_ENUM,
  INPUT_DIRECTION_ENUM,
} from '../enum';
import { EventManager } from '../runtime/EventManager';
import { PlayerStateMachine } from './PlayerStateMachine';
import { EntityManager } from '../base/EntityManager';
import { DataManager } from '../runtime/DataManager';
import { TileManager } from '../tile/TileManager';
import { IEntity } from '../level';
const { ccclass } = _decorator;

@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {
  targetX = 0;
  targetY = 0;
  isMoving = false;
  private readonly speed = 1 / 10;

  async init(params: IEntity) {
    this.fsm = this.addComponent(PlayerStateMachine)!;
    await this.fsm.init();
    super.init(params);
    this.targetX = this.x;
    this.targetY = this.y;

    EventManager.instance.on(EVENT_ENUM.PLAYER_CTRL, this.handleInput, this);
    EventManager.instance.on(EVENT_ENUM.ATTACK_PLAYER, this.onDeath, this);
  }

  onDestroy(): void {
    EventManager.instance.off(EVENT_ENUM.PLAYER_CTRL, this.handleInput);
    EventManager.instance.off(EVENT_ENUM.ATTACK_PLAYER, this.onDeath);
    super.onDestroy?.();
  }

  onDeath(state: ENTITY_STATE_ENUM) {
    this.state = state;
  }

  update(): void {
    this.updateXY();
    super.update();
  }

  updateXY() {
    if (this.x < this.targetX) {
      this.x += this.speed;
    } else if (this.x > this.targetX) {
      this.x -= this.speed;
    }

    if (this.y < this.targetY) {
      this.y += this.speed;
    } else if (this.y > this.targetY) {
      this.y -= this.speed;
    }

    // 防止人物鬼畜
    if (
      Math.abs(this.x - this.targetX) < 0.1 &&
      Math.abs(this.y - this.targetY) < 0.1 &&
      this.isMoving
    ) {
      this.isMoving = false;
      this.x = this.targetX;
      this.y = this.targetY;
      EventManager.instance.emit(EVENT_ENUM.PLAYER_MOVE_END);
    }
  }

  handleBlock(inputDirection: INPUT_DIRECTION_ENUM) {
    const { direction } = this;
    if (inputDirection === INPUT_DIRECTION_ENUM.TOP) {
      switch (direction) {
        case DIRECTION_ENUM.TOP:
          this.state = ENTITY_STATE_ENUM.BLOCKFRONT;
          break;
        case DIRECTION_ENUM.BOTTOM:
          this.state = ENTITY_STATE_ENUM.BLOCKBACK;
          break;
        case DIRECTION_ENUM.LEFT:
          this.state = ENTITY_STATE_ENUM.BLOCKLEFT;
          break;
        case DIRECTION_ENUM.RIGHT:
          this.state = ENTITY_STATE_ENUM.BLOCKRIGHT;
          break;
      }
    } else if (inputDirection === INPUT_DIRECTION_ENUM.LEFT) {
      switch (direction) {
        case DIRECTION_ENUM.LEFT:
          this.state = ENTITY_STATE_ENUM.BLOCKFRONT;
          break;
        case DIRECTION_ENUM.RIGHT:
          this.state = ENTITY_STATE_ENUM.BLOCKBACK;
          break;
        case DIRECTION_ENUM.TOP:
          this.state = ENTITY_STATE_ENUM.BLOCKLEFT;
          break;
        case DIRECTION_ENUM.BOTTOM:
          this.state = ENTITY_STATE_ENUM.BLOCKRIGHT;
          break;
      }
    } else if (inputDirection === INPUT_DIRECTION_ENUM.BOTTOM) {
      switch (direction) {
        case DIRECTION_ENUM.BOTTOM:
          this.state = ENTITY_STATE_ENUM.BLOCKFRONT;
          break;
        case DIRECTION_ENUM.TOP:
          this.state = ENTITY_STATE_ENUM.BLOCKBACK;
          break;
        case DIRECTION_ENUM.LEFT:
          this.state = ENTITY_STATE_ENUM.BLOCKLEFT;
          break;
        case DIRECTION_ENUM.RIGHT:
          this.state = ENTITY_STATE_ENUM.BLOCKRIGHT;
          break;
      }
    } else if (inputDirection === INPUT_DIRECTION_ENUM.RIGHT) {
      switch (direction) {
        case DIRECTION_ENUM.RIGHT:
          this.state = ENTITY_STATE_ENUM.BLOCKFRONT;
          break;
        case DIRECTION_ENUM.LEFT:
          this.state = ENTITY_STATE_ENUM.BLOCKBACK;
          break;
        case DIRECTION_ENUM.TOP:
          this.state = ENTITY_STATE_ENUM.BLOCKLEFT;
          break;
        case DIRECTION_ENUM.BOTTOM:
          this.state = ENTITY_STATE_ENUM.BLOCKRIGHT;
          break;
      }
    } else if (inputDirection === INPUT_DIRECTION_ENUM.TURNLEFT) {
      this.state = ENTITY_STATE_ENUM.BLOCKTURNLEFT;
    } else if (inputDirection === INPUT_DIRECTION_ENUM.TURNRIGHT) {
      this.state = ENTITY_STATE_ENUM.BLOCKTURNRIGHT;
    }
  }

  handleInput(inputDirection: INPUT_DIRECTION_ENUM) {
    // 正在移动
    if (this.isMoving) {
      return;
    }
    // 正在攻击
    if (this.state === ENTITY_STATE_ENUM.ATTACK) {
      return;
    }
    // 已经死亡
    if (this.state === ENTITY_STATE_ENUM.DEATH || this.state === ENTITY_STATE_ENUM.AIRDEATE) {
      return;
    }
    // 碰到墙
    if (this.willBlock(inputDirection)) {
      this.handleBlock(inputDirection);
      return;
    }
    const enemyId = this.willAttack(inputDirection);
    // 攻击敌人
    if (enemyId) {
      EventManager.instance.emit(EVENT_ENUM.ATTACK_ENEMY, enemyId);
      EventManager.instance.emit(EVENT_ENUM.DOOR_OPEN);
      return;
    }
    this.move(inputDirection);
  }

  willAttack(inputDirection: INPUT_DIRECTION_ENUM) {
    const { direction } = this;
    const { enemies } = DataManager.instance;
    for (const enemy of enemies) {
      if (enemy.state === ENTITY_STATE_ENUM.DEATH) {
        continue;
      }
      const { x: enemyX, y: enemyY } = enemy;
      if (
        inputDirection === INPUT_DIRECTION_ENUM.TOP &&
        direction === DIRECTION_ENUM.TOP &&
        this.x === enemyX &&
        this.y + 2 === enemyY
      ) {
        this.state = ENTITY_STATE_ENUM.ATTACK;
        return enemy.id;
      } else if (
        inputDirection === INPUT_DIRECTION_ENUM.BOTTOM &&
        direction === DIRECTION_ENUM.BOTTOM &&
        this.x === enemyX &&
        this.y - 2 === enemyY
      ) {
        this.state = ENTITY_STATE_ENUM.ATTACK;
        return enemy.id;
      } else if (
        inputDirection === INPUT_DIRECTION_ENUM.LEFT &&
        direction === DIRECTION_ENUM.LEFT &&
        this.x - 2 === enemyX &&
        this.y === enemyY
      ) {
        this.state = ENTITY_STATE_ENUM.ATTACK;
        return enemy.id;
      } else if (
        inputDirection === INPUT_DIRECTION_ENUM.RIGHT &&
        direction === DIRECTION_ENUM.RIGHT &&
        this.x + 2 === enemyX &&
        this.y === enemyY
      ) {
        this.state = ENTITY_STATE_ENUM.ATTACK;
        return enemy.id;
      }
    }

    return false;
  }

  move(inputDirection: INPUT_DIRECTION_ENUM) {
    EventManager.instance.emit(EVENT_ENUM.RECORD_STEP);
    switch (inputDirection) {
      case INPUT_DIRECTION_ENUM.TOP:
        this.targetY += 1;
        this.isMoving = true;
        this.showSmoke(DIRECTION_ENUM.TOP);
        break;
      case INPUT_DIRECTION_ENUM.BOTTOM:
        this.targetY -= 1;
        this.isMoving = true;
        this.showSmoke(DIRECTION_ENUM.BOTTOM);
        break;
      case INPUT_DIRECTION_ENUM.LEFT:
        this.targetX -= 1;
        this.isMoving = true;
        this.showSmoke(DIRECTION_ENUM.LEFT);
        break;
      case INPUT_DIRECTION_ENUM.RIGHT:
        this.targetX += 1;
        this.isMoving = true;
        this.showSmoke(DIRECTION_ENUM.RIGHT);
        break;
      case INPUT_DIRECTION_ENUM.TURNLEFT:
        this.state = ENTITY_STATE_ENUM.TURNLEFT;
        if (this.direction === DIRECTION_ENUM.TOP) {
          this.direction = DIRECTION_ENUM.LEFT;
        } else if (this.direction === DIRECTION_ENUM.LEFT) {
          this.direction = DIRECTION_ENUM.BOTTOM;
        } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
          this.direction = DIRECTION_ENUM.RIGHT;
        } else if (this.direction === DIRECTION_ENUM.RIGHT) {
          this.direction = DIRECTION_ENUM.TOP;
        }
        EventManager.instance.emit(EVENT_ENUM.PLAYER_MOVE_END);
        break;
      case INPUT_DIRECTION_ENUM.TURNRIGHT:
        this.state = ENTITY_STATE_ENUM.TURNRIGHT;
        if (this.direction === DIRECTION_ENUM.TOP) {
          this.direction = DIRECTION_ENUM.RIGHT;
        } else if (this.direction === DIRECTION_ENUM.RIGHT) {
          this.direction = DIRECTION_ENUM.BOTTOM;
        } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
          this.direction = DIRECTION_ENUM.LEFT;
        } else if (this.direction === DIRECTION_ENUM.LEFT) {
          this.direction = DIRECTION_ENUM.TOP;
        }
        EventManager.instance.emit(EVENT_ENUM.PLAYER_MOVE_END);
        break;
    }
  }

  showSmoke(direction: DIRECTION_ENUM) {
    EventManager.instance.emit(EVENT_ENUM.SHOW_SMOKE, this.x, this.y, direction);
  }

  // 判断是不是撞了
  willBlock(inputDirection: INPUT_DIRECTION_ENUM) {
    const { targetX: x, targetY: y, direction } = this;
    const { tileInfo } = DataManager.instance;
    switch (inputDirection) {
      case INPUT_DIRECTION_ENUM.TOP:
        return blockfront();
      case INPUT_DIRECTION_ENUM.LEFT:
        return blockleft();
      case INPUT_DIRECTION_ENUM.BOTTOM:
        return blockback();
      case INPUT_DIRECTION_ENUM.RIGHT:
        return blockright();
      case INPUT_DIRECTION_ENUM.TURNLEFT:
        return blockturnleft();
      case INPUT_DIRECTION_ENUM.TURNRIGHT:
        return blockturnright();
      default:
        return false;
    }

    function blockfront() {
      let playerNextTile: TileManager | null = null;
      let weaponeNextTile: TileManager | null = null;
      if (direction === DIRECTION_ENUM.TOP) {
        const playerNextY = y + 1;
        const weaponNextY = playerNextY + 1;
        playerNextTile = tileInfo[x][-playerNextY];
        weaponeNextTile = tileInfo[x][-weaponNextY];
      } else if (direction === DIRECTION_ENUM.LEFT) {
        const playerNextY = y + 1;
        const weaponNextX = x - 1;
        playerNextTile = tileInfo[x][-playerNextY];
        weaponeNextTile = tileInfo[weaponNextX][-playerNextY];
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        const playerNextY = y + 1;
        const weaponNextY = y - 1;
        playerNextTile = tileInfo[x][-playerNextY];
        weaponeNextTile = tileInfo[x][-weaponNextY];
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        const playerNextY = y + 1;
        const weaponNextX = x + 1;
        playerNextTile = tileInfo[x][-playerNextY];
        weaponeNextTile = tileInfo[weaponNextX][-playerNextY];
      }
      // 下一个tile 人物和武器都能走
      if (playerNextTile?.moveable && weaponeNextTile?.turnable) {
        // 可以移动
      } else {
        return true;
      }
    }
    function blockback() {
      let playerNextTile: TileManager | null = null;
      let weaponeNextTile: TileManager | null = null;
      if (direction === DIRECTION_ENUM.TOP) {
        const playerNextY = y - 1;
        const weaponNextY = y + 1;
        playerNextTile = tileInfo[x][-playerNextY];
        weaponeNextTile = tileInfo[x][-weaponNextY];
      } else if (direction === DIRECTION_ENUM.LEFT) {
        const playerNextY = y - 1;
        const weaponNextX = x - 1;
        playerNextTile = tileInfo[x][-playerNextY];
        weaponeNextTile = tileInfo[weaponNextX][-playerNextY];
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        const playerNextY = y - 1;
        const weaponNextY = playerNextY - 1;
        playerNextTile = tileInfo[x][-playerNextY];
        weaponeNextTile = tileInfo[x][-weaponNextY];
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        const playerNextY = y - 1;
        const weaponNextX = x + 1;
        playerNextTile = tileInfo[x][-playerNextY];
        weaponeNextTile = tileInfo[weaponNextX][-playerNextY];
      }
      // 下一个tile 人物和武器都能走
      if (playerNextTile?.moveable && weaponeNextTile?.turnable) {
        // 可以移动
      } else {
        return true;
      }
    }
    function blockleft() {
      let playerNextTile: TileManager | null = null;
      let weaponeNextTile: TileManager | null = null;
      if (direction === DIRECTION_ENUM.TOP) {
        const playerNextX = x - 1;
        const weaponNextY = y + 1;
        playerNextTile = tileInfo[playerNextX][-y];
        weaponeNextTile = tileInfo[playerNextX][-weaponNextY];
      } else if (direction === DIRECTION_ENUM.LEFT) {
        const playerNextX = x - 1;
        const weaponNextX = playerNextX - 1;
        playerNextTile = tileInfo[playerNextX][-y];
        weaponeNextTile = tileInfo[weaponNextX][-y];
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        const playerNextX = x - 1;
        const weaponNextY = y - 1;
        playerNextTile = tileInfo[playerNextX][-y];
        weaponeNextTile = tileInfo[playerNextX][-weaponNextY];
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        const playerNextX = x - 1;
        const weaponNextX = x + 1;
        playerNextTile = tileInfo[playerNextX][-y];
        weaponeNextTile = tileInfo[weaponNextX][-y];
      }
      // 下一个tile 人物和武器都能走
      if (playerNextTile?.moveable && weaponeNextTile?.turnable) {
        // 可以移动
      } else {
        return true;
      }
    }
    function blockright() {
      let playerNextTile: TileManager | null = null;
      let weaponeNextTile: TileManager | null = null;
      if (direction === DIRECTION_ENUM.TOP) {
        const playerNextX = x + 1;
        const weaponNextY = y + 1;
        playerNextTile = tileInfo[playerNextX][-y];
        weaponeNextTile = tileInfo[playerNextX][-weaponNextY];
      } else if (direction === DIRECTION_ENUM.LEFT) {
        const playerNextX = x + 1;
        const weaponNextX = x - 1;
        playerNextTile = tileInfo[playerNextX][-y];
        weaponeNextTile = tileInfo[weaponNextX][-y];
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        const playerNextX = x + 1;
        const weaponNextY = y - 1;
        playerNextTile = tileInfo[playerNextX][-y];
        weaponeNextTile = tileInfo[playerNextX][-weaponNextY];
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        const playerNextX = x + 1;
        const weaponNextX = playerNextX + 1;
        playerNextTile = tileInfo[playerNextX][-y];
        weaponeNextTile = tileInfo[weaponNextX][-y];
      }
      // 下一个tile 人物和武器都能走
      if (playerNextTile?.moveable && weaponeNextTile?.turnable) {
        // 可以移动
      } else {
        return true;
      }
    }
    function blockturnleft() {
      let nextX: number = 0;
      let nextY: number = 0;
      if (direction === DIRECTION_ENUM.TOP) {
        nextX = x - 1;
        nextY = y + 1;
      } else if (direction === DIRECTION_ENUM.LEFT) {
        nextX = x - 1;
        nextY = y - 1;
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        nextX = x + 1;
        nextY = y - 1;
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        nextX = x + 1;
        nextY = y + 1;
      }
      // 判断周边三块 tile
      if (
        tileInfo?.[x][-nextY].turnable &&
        tileInfo?.[nextX][-y].turnable &&
        tileInfo?.[nextX][-nextY].turnable
      ) {
        // 可以左转
      } else {
        return true;
      }
    }
    function blockturnright() {
      let nextX: number = 0;
      let nextY: number = 0;
      if (direction === DIRECTION_ENUM.TOP) {
        nextX = x + 1;
        nextY = y + 1;
      } else if (direction === DIRECTION_ENUM.LEFT) {
        nextX = x - 1;
        nextY = y + 1;
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        nextX = x - 1;
        nextY = y - 1;
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        nextX = x + 1;
        nextY = y - 1;
      }
      // 判断周边三块 tile
      if (
        tileInfo?.[x][-nextY].turnable &&
        tileInfo?.[nextX][-y].turnable &&
        tileInfo?.[nextX][-nextY].turnable
      ) {
        // 可以右转
      } else {
        return true;
      }
    }
  }
}
