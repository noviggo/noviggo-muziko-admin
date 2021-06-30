import './App.scss';

import { ThemeProvider, unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core';
import { createBrowserHistory } from 'history';
import { ConfirmProvider } from 'material-ui-confirm';
import React from 'react';
import { Router } from 'react-router-dom';

import DeviceSnackbar from './components/DeviceSnackbar';
import FoldersTable from './components/FoldersTable';
import { DeviceConnectionProvider } from './contexts/deviceConnectionContext';
import colors from './styles/colors.module.scss';

export const history = createBrowserHistory();

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: colors.blue,
    },
    secondary: {
      main: colors.primary,
    },
  },
});

function App() {
  return (
    <Router history={history}>
      <ThemeProvider theme={theme}>
        <DeviceConnectionProvider>
          <ConfirmProvider>
            <FoldersTable />
            <DeviceSnackbar />
          </ConfirmProvider>
        </DeviceConnectionProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
