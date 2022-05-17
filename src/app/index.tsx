import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { MobtimeProvider } from './MobtimeProvider';
import { VSCodeAPI } from './shared/interfaces';

declare var vscodeApi: ReturnType<VSCodeAPI>;
// declare var storeData: string;

ReactDOM.render(
  <MobtimeProvider
    vscodeApi={vscodeApi}
  >
    <App />
  </MobtimeProvider>,
  document.getElementById('root')
);