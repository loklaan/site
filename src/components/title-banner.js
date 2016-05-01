import React from 'react';
import Navbar from './navbar';
import TypingText from './typing-text';

const bannerStyle = {
  padding: '2.5rem 1.5rem',
  display: 'inline-block',
  border: 'solid 5px #000',
  borderLeftWidth: '25px',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  minWidth: '50vw'
};

class Banner extends React.Component {
  render () {
    const {
      messages,
      once,
      typing,
      ...props
    } = this.props;

    return (
      <div style={bannerStyle} {...props}>
        <h1>LOCHLAN BUNN</h1>

        <Navbar/>

        <h2>
          <p>
            {typing ? <TypingText messages={messages} once={once} blinking/> : `${messages[0]}`}
          </p>
          <p>
            From Australia. {'<3'}
          </p>
        </h2>

      </div>
    );
  }
};

export default Banner;
