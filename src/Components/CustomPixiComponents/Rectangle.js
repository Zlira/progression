import { CustomPIXIComponent } from "react-pixi-fiber"
import {Graphics} from "pixi.js"


const TYPE = "Rectangle";
export const behavior = {
  customDisplayObject: props => new Graphics(),
  customApplyProps: function(instance, oldProps, newProps) {
    let { fill, x, y, alpha, width, height } = newProps;
    alpha = alpha || 1
    instance.clear();
    instance.alpha = alpha
    instance.beginFill(fill);
    instance.drawRect(x, y, width, height);
    instance.endFill();
  }
};
export default CustomPIXIComponent(behavior, TYPE);