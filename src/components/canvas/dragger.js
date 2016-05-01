import {autobind} from 'core-decorators';

class Dragger {
  constructor(dragStepStrength = 0.8) {
    if (dragStepStrength < 0 || 1 < dragStepStrength) {
      throw new Error(`Dragger expected the dragStepStrength to be between 0 and 1.`);
    }
    this.strength = dragStepStrength;
  }

  @autobind
  draw(ctx, w, h) {
    ctx.fillStyle = `hsla(0, 0%, 100%, ${this.strength})`;
    ctx.fillRect(0, 0, w, h);
  }
}

export default Dragger;
