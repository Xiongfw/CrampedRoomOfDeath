import { SpriteFrame, resources } from 'cc';
import { Singleton } from '../base/Singleton';

export class ResourceManager extends Singleton {
  static get instance() {
    return super.getInstance<ResourceManager>();
  }

  loadSpriteFrames(dir: string) {
    return new Promise<SpriteFrame[]>((resolve, reject) => {
      resources.loadDir(dir, SpriteFrame, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        // 排序，避免做动画 顺序有问题
        data.sort((a, b) => {
          const aNum = Number(a.name.match(/\((\d+)\)/)?.[1]);
          const bNum = Number(b.name.match(/\((\d+)\)/)?.[1]);
          if (aNum && bNum) {
            return aNum - bNum;
          }
          return 0;
        });
        resolve(data);
      });
    });
  }
}
