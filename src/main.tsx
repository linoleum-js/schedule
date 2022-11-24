import React from 'react';
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux';
import App from './App'
import './index.css'

import store from '@/redux/store';


// TODO uncomment StrictMode
// TODO add .editorconfig
// TODO add linters
// TODO rename css vars? reorganize them?
// TODO global cursor while dragging
// TODO move all useEffect's to the bottom, read some articles
// TODO add split
// TODO remove lodash?
// TODO min container width, hours size?
// TODO add tutorial, list of what is possible
// TODO add new lines
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  // </React.StrictMode>
);
