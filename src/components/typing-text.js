import _ from 'lodash';
import React from 'react';

const TYPE_FORWARD_SPEED = 150;
const TYPE_BACKWARD_SPEED = 50;
const TYPE_PAUSE = 2000;
const BLINK_SPEED = 400;

class TypingText extends React.Component {
  static propTypes = {
    messages: React.PropTypes.arrayOf(React.PropTypes.string),
    blinking: React.PropTypes.bool,
    once: React.PropTypes.bool
  };

  static defaultProps = {
    blinking: false,
    once: false
  };

  constructor(props, ...args) {
    super(props, ...args);
    this.state = {
      messagesIndex: 0,
      textCharLength: _.get(props, 'messages[0].length') || 0,
      isCursorTransparent: false,
      streaming: false
    };
  }

  componentDidMount() {
    if (this.hasMounted) return;
    this.hasMounted = true;
    const self = this;

    const tickDown = () => {
      let nextCharLength = self.state.textCharLength - 1;
      if (0 > nextCharLength) {
        const index = (self.state.messagesIndex + 1) % self.props.messages.length;
        self.setState({
          messagesIndex: index
        });
        if (index === 0) {
          this.isLast = true; // stop the loop forever, once we've typed another message.
        }

        self.setState({
          streaming: false
        });
        setTimeout(tickUp, TYPE_FORWARD_SPEED);
      } else {
        self.setState({
          streaming: true,
          textCharLength: nextCharLength
        });

        setTimeout(tickDown, TYPE_BACKWARD_SPEED);
      }
    };

    const tickUp = () => {
      const text = self.props.messages[self.state.messagesIndex];
      let nextCharLength = self.state.textCharLength + 1;
      if (nextCharLength > text.length) {
        if (this.isLast) return;

        self.setState({
          streaming: false
        });
        setTimeout(tickDown, TYPE_PAUSE);
      } else {
        self.setState({
          streaming: true,
          textCharLength: nextCharLength
        });

        setTimeout(tickUp, TYPE_FORWARD_SPEED);
      }
    };

    const blink = () => {
      self.setState({
        isCursorTransparent: !self.state.isCursorTransparent
      });
      setTimeout(blink, BLINK_SPEED);
    };

    tickUp();
    blink();
  }

  render() {
    const text = this.props.messages[this.state.messagesIndex];
    if (!text) {
      console.warn(`Expected a message to be available at index ${this.state.messagesIndex}. Messages: ${this.props.messages}`);
    }

    return (
      <span>
        {`${text.slice(0, this.state.textCharLength)}`}
        <span>{this.props.blinking && this.state.isCursorTransparent && !this.state.streaming ? '\u00A0' : '_'}</span>
      </span>
    );
  }
}

export default TypingText;
