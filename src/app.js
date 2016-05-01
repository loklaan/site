import './ga-analytics';
import './assets/base.global.css';

import React from 'react';
import {render} from 'react-dom';
import FontFaceObserver from 'fontfaceobserver';
import LandingPage from './components/landing-page';

const FONT_FAMILY = 'VT323';

const renderApp = (isFontReady) => render(
  <LandingPage isFontReady={isFontReady}/>,
  document.getElementById('root')
);

renderApp(false);

const font = new FontFaceObserver(FONT_FAMILY);
font.load()
  .then(() => renderApp(true))
  .catch(() => renderApp(true));

