import {autobind} from 'core-decorators';

class Clearer {
  @autobind
  draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
  }
}

export default Clearer;
