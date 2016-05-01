import {autobind} from 'core-decorators';

const REQ_KEY = Symbol('REQ_KEY');

class EntitySurface {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.isPaused = true;
    this.entities = [];
    this.amountToSkip = 0;
    this.skipped = 0;
    this.hasDoneFirstFrame = false;
    this[REQ_KEY] = null;
  }

  @autobind
  tick() {
    if (this.isPaused) {
      return;
    }

    if (this.hasDoneFirstFrame && typeof this.amountToSkip !== 'undefined' && this.skipped < this.amountToSkip) {
      this.skipped = this.skipped + 1;
    } else {
      this.hasDoneFirstFrame = true;
      this.skipped = 0;
      this.update();
      this.draw(this.ctx, this.width, this.height);
      console.timeEnd('animation end');
    }

    this[REQ_KEY] = window.requestAnimationFrame(this.tick);
  }

  @autobind
  start() {
    if (this.isPaused) {
      this.isPaused = false;
      this.tick();
    }
  }

  @autobind
  stop() {
    if (!this.isPaused) {
      this.isPaused = true;
      window.cancelAnimationFrame(this[REQ_KEY]);
    }
  }

  @autobind
  update() {
    this.entities.forEach((entity) => {
      entity.update && entity.update();
    });
  }

  @autobind
  draw(ctx, w, h) {
    this.entities.forEach((entity) => {
      entity.draw(ctx, w, h);
    });
  }

}

export default EntitySurface;
