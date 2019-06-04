import { CustomPIXIComponent } from "react-pixi-fiber"
import {Graphics} from "pixi.js"


const TYPE = "Rectangle";
export const behavior = {
  customDisplayObject: props => new Graphics(),
  customApplyProps: function(instance, oldProps, newProps) {
    const { fill, x, y, width, height } = newProps;
    instance.clear();
    instance.beginFill(fill);
    instance.drawRect(x, y, width, height);
    instance.endFill();
  }
};
export default CustomPIXIComponent(behavior, TYPE);