import { createElement } from 'react';
import ReactDOM from 'react-dom';

import '@emotion/react';

import App from './components/App';

const awesome = document.getElementById('awesome');
if (awesome !== null) {
  const reactRoot = document.createElement('div');
  reactRoot.id = 'react-root';
  awesome.appendChild(reactRoot);
  const rowsAbove = document.querySelectorAll('#awesome .dragarea > .custom').length;
  ReactDOM.render(createElement(App, { rowsAbove }), reactRoot);
}
