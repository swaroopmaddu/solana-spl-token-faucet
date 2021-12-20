import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { SnackbarProvider } from 'notistack';
import WalletConnection from './WalletConnection';

ReactDOM.render(
  <React.StrictMode>
    <SnackbarProvider maxSnack={3}>
      <WalletConnection />
    </SnackbarProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
