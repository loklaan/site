import React from 'react';
import {autobind} from 'core-decorators';
import ParticlesSurface from './canvas/particles-surface';
import Clearer from './canvas/clearer';
import Dragger from './canvas/dragger';

const canvasStyle = {
  zIndex: '-1',
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  overflow: 'hidden',
  height: '100%',
  width: '100%',
};

class ParticlesBackground extends React.Component {
  static propTypes = {
    particles: React.PropTypes.number.isRequired,
    particleSpacing: React.PropTypes.number.isRequired,
    drags: React.PropTypes.bool
  };

  static defaultProps = {
    drags: false
  };

  componentWillReceiveProps(nextProps) {
    const lastProps = this.props;
    if (lastProps.particles !== nextProps.particles) {
      const particlesDiff = (lastProps.particles - nextProps.particles) * -1; // invert result for correct sign
      if (particlesDiff > 0) {
        this.surface.addParticles(particlesDiff, this.props.particleSpacing);
      } else {
        this.surface.removeParticles(particlesDiff * -1); // invert again for a positive int
      }
    }
  }

  @autobind
  mountParticles(node) {
    if (!node) return;
    const {
      clientWidth: width,
      clientHeight: height
    } = node;
    node.setAttribute('width', width.toString());
    node.setAttribute('height', height.toString());

    const ctx = node.getContext('2d');
    this.surface = new ParticlesSurface(ctx, width, height);
    if (this.props.drags) this.surface.entities.push(new Dragger(0.5));
    else this.surface.entities.push(new Clearer());
    this.surface.addParticles(this.props.particles, this.props.particleSpacing);
    this.surface.start();
  }

  render() {
    return (
      <canvas
        ref={this.mountParticles}
        style={canvasStyle}
        />
    );
  }

}

export default ParticlesBackground;
