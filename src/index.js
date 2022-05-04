import React from 'react';
import ReactDOM from 'react-dom';

import Raiz from './root/Raiz'
import { AuthContextProvider } from './context/Auth' 

ReactDOM.render(
    <AuthContextProvider>
        <Raiz />
    </AuthContextProvider>,
    document.getElementById('root')
);
