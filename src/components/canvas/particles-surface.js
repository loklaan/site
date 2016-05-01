import _ from 'lodash';
import {autobind} from 'core-decorators';
import PoissonDiscSampler from 'poisson-disc-sampler';
import Store from '../../store';
import EntitySurface from './surface';
import Particle from './particle';
import utils from './utils';
import * as C from './constants';

const DEFAULT_OPTIONS = {
  [C.DRAWS_TO_SKIP]: 20, // frames to skip
  [C.PARTICLE_GROWTH_RATE]: 8, // Multiplied with the additive delta, from the beginning of particle growth

  [C.PARTICLE_DISTANCE]: 18, // any number
  [C.PARTICLE_HUE]: 0, // 0 - 359
  [C.PARTICLE_SATURATION]: 0, // 0 - 100%
  [C.PARTICLE_LIGHTING]: 0, // 0 - 100%
  [C.PARTICLE_JITTER_DIST]: 1, // px
  [C.PARTICLE_BLINK_RATE]: 0.2, // 0 - 1
  [C.PARTICLE_SIZE_MIN]: 3, // px
  [C.PARTICLE_SIZE_MAX]: 7 // px
};

class ParticlesSurface extends EntitySurface {
  constructor(ctx, width, height) {
    super(ctx, width, height);
    this.store = new Store();
    _.each(DEFAULT_OPTIONS, (val, key) => this.store.set(key, val));

    this.amountToSkip = this.store.get(C.DRAWS_TO_SKIP);
  }

  @autobind
  addParticles(count, distance) {
    const sampler = PoissonDiscSampler(this.width, this.height, distance);
    const timestamper = () => +(new Date());

    return new Promise(resolve => {
      let index = 0;
      const addParticle = () => {
        const sample = sampler();
        if (!sample || index >= count) {
          return resolve();
        } else {
          const [ x, y ] = sample;
          const sideLength = utils.inRange(
            this.store.get(C.PARTICLE_SIZE_MIN),
            this.store.get(C.PARTICLE_SIZE_MAX)
          );

          this.entities.push(
            new Particle({
              width: sideLength,
              height: sideLength,
              x: x,
              y: y,
              store: this.store
            })
          );

          if (count > index) {
            index++;
            setTimeout(addParticle, 5);
          }
        }
      };

      addParticle();
    });
  }

  @autobind
  removeParticles(count) {
    const end = this.entities.length < count ? 0 :
      this.entities.length - count;
    this.entities = _.slice(this.entities, 0, end);
  }

}

export default ParticlesSurface;
