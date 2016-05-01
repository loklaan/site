import {autobind, decorate} from 'core-decorators';
import {memoize} from 'lodash';
import utils from './utils';
import * as C from './constants';

class Particle {
  constructor(options) {
    const {
      width,
      height,
      x,
      y,
      store
    } = options;

    this.store = store;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.isDimming = true;
    this.colorVariants = {
      h: -(Math.random() * 5),
      s: -(Math.random() * 5),
      l: 0
    };
  }

  @decorate(memoize)
  getLatestColors(hue, sat, light) {
    return {
      h: hue + this.colorVariants.h,
      s: sat + this.colorVariants.s,
      l: light + this.colorVariants.l
    };
  }

  @decorate(memoize)
  getHslaString(h, s, l, a) {
    return `hsla(${h}, ${s}%, ${l}%, ${a})`;
  }

  @autobind
  update() {
    this.updateColor();
    this.jitterCenter();
  }

  @autobind
  draw(ctx) {
    ctx.fillStyle = this.getHslaString(
      this.color.h,
      this.color.s,
      this.color.l,
      this.color.a
    );

    ctx.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
  }

  @autobind
  processBlink() {
    if (this.color.a >= 1) {
      this.isDimming = true;
    } else if (this.color.a <= 0) {
      this.isDimming = false;
    }

    this.color.a += (this.isDimming ? -1 : 1) * this.store.get(C.PARTICLE_BLINK_RATE);
  }

  @autobind
  jitterCenter() {
    this.x += Math.round(
      utils.randomSign() * utils.zeroTo(this.store.get(C.PARTICLE_JITTER_DIST))
    );

    this.y += Math.round(
      utils.randomSign() * utils.zeroTo(this.store.get(C.PARTICLE_JITTER_DIST))
    );
  }

  @autobind
  updateColor() {
    const color = this.getLatestColors(
      this.store.get(C.PARTICLE_HUE),
      this.store.get(C.PARTICLE_SATURATION),
      this.store.get(C.PARTICLE_LIGHTING)
    );

    this.color = Object.assign({}, this.color, color, {a: this.color && this.color.a || 1});

    this.processBlink();
  }
}

export default Particle;
