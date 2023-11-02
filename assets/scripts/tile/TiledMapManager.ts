import { _decorator, Component, randomRangeInt } from 'cc';
import { TileManager } from './TileManager';
import { createUINode } from '../utils';
import { DataManager } from '../runtime/DataManager';
import { ResourceManager } from '../runtime/ResourceManager';
const { ccclass } = _decorator;

@ccclass('TiledMapManager')
export class TiledMapManager extends Component {
  async init() {
    const { mapInfo } = DataManager.instance;
    DataManager.instance.tileInfo = [];
    const spriteFrames = await ResourceManager.instance.loadSpriteFrames('/texture/tile');
    for (let i = 0; i < mapInfo.length; i++) {
      const column = mapInfo[i];
      DataManager.instance.tileInfo[i] = [];
      for (let j = 0; j < column.length; j++) {
        const tile = column[j];
        if (tile.src === null || tile.type === null) {
          continue;
        }

        const tileNode = createUINode(`tile${tile.src}`);
        const tileManager = tileNode.addComponent(TileManager);
        let num = tile.src;
        if ([1, 5, 9].indexOf(num) !== -1 && i % 2 === 0 && j % 2 === 0) {
          num += randomRangeInt(0, 3);
        }
        const imgSrc = `tile (${num})`;
        const spriteFrame = spriteFrames.find((i) => i.name === imgSrc) || spriteFrames[0];
        tileManager.init(tile.type, spriteFrame, i, j);
        DataManager.instance.tileInfo[i][j] = tileManager;

        tileNode.setParent(this.node);
        // await this.sleep();
      }
    }
  }

  sleep() {
    return new Promise((resolve) => {
      setTimeout(resolve, 200);
    });
  }
}
