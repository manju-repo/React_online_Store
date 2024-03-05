import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';
import store from './Store/index';
import './index.css';
import App from './App';
import {StrictMode} from 'react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   <StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </StrictMode>
);
