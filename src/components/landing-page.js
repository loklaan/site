import React from 'react';
import ReactDOM from 'react-dom';
import {autobind} from 'core-decorators'
import Background from './background';
import Banner from './title-banner';
import MESSAGES from '../assets/messages.json';

const styles = {
  height: '100vh',
  width: '100vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const classes = [
  'textContainer'
].join(' ');

class LandingPage extends React.Component {
  static propTypes = {
    isFontReady: React.PropTypes.bool
  };

  constructor() {
    super();
    this.state = {
      backgroundReady: false
    };
  }

  @autobind
  setupBackgroundIn(component) {
    if (!component) return;
    const node = ReactDOM.findDOMNode(component);
    node.addEventListener('animationend', () => {
      const screenMiddleSize = Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2)); // pythagoras
      const particles = screenMiddleSize / 2; // pythagoras
      const particleSpacing = 14 * (1 + screenMiddleSize/10000*2); // pythagoras
      this.setState({
        backgroundReady: true,
        particles,
        particleSpacing
      });
    })
  }

  render() {
    return (
      <div style={styles}>
        {this.state.backgroundReady ?
          <Background
            particles={this.state.particles}
            particleSpacing={this.state.particleSpacing}
            drags
          /> :
          null}

        {this.props.isFontReady ?
          <Banner ref={this.setupBackgroundIn}
                  className={classes}
                  messages={MESSAGES}
                  once
          /> :
          null
        }
      </div>
    );
  }

}

export default LandingPage;
