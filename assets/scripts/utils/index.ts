import { Layers, Node, UITransform } from 'cc';

export function createUINode(name?: string) {
  const node = new Node(name);
  const uiTransform = node.addComponent(UITransform);
  uiTransform.setAnchorPoint(0, 1);
  node.layer = Layers.Enum.UI_2D;

  return node;
}
