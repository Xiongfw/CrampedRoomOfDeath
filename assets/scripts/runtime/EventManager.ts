import { Singleton } from '../base/Singleton';

export class EventManager extends Singleton {
  static get instance() {
    return super.getInstance<EventManager>();
  }
  private _eventDic = new Map<string, Array<{ fun: Function; context?: unknown }>>();

  on(eventName: string, fun: Function, context?: unknown) {
    const funs = this._eventDic.get(eventName);
    if (funs) {
      funs.push({ fun, context });
    } else {
      this._eventDic.set(eventName, [{ fun, context }]);
    }
  }

  off(eventName: string, fun: Function) {
    const funs = this._eventDic.get(eventName);
    if (funs) {
      const index = funs.findIndex((item) => item.fun === fun);
      index !== -1 && funs.splice(index, 1);
    }
  }

  emit(eventName: string, data?: unknown) {
    const funs = this._eventDic.get(eventName);
    if (funs) {
      funs.forEach(({ fun, context }) => {
        fun.apply(context, data);
      });
    }
  }
}
