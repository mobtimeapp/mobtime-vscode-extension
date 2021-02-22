import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { VSCodeAPI } from './shared/eventTypes';
import { StoreProvider } from './StoreProvider';

declare var vscodeApi: ReturnType<VSCodeAPI>;
declare var storeData: string;

ReactDOM.render(
  <StoreProvider
    initialState={JSON.parse(unescape(storeData || '{}'))}
    vscodeApi={vscodeApi}
  >
    <App />
  </StoreProvider>,
  document.getElementById('root')
);