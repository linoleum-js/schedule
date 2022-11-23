import React from 'react';
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux';
import App from './App'
import './index.css'

import store from '@/redux/store';


// TODO uncomment StrictMode
// TODO add .editorconfig
// TODO add linters
// TODO remove assets
// TODO rename css vars? reorganize them?
// TODO hide scrollbar
// TODO global cursor while dragging
// TODO move all useEffect's to the bottom, read some articles
// TODO class names
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  // </React.StrictMode>
);
