import React from 'react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { app_root} from "./Config";

import Launch from "./pages/Launch";

if(localStorage.getItem('hasLaunch'))
{
    app_root.render(<App/>)

}
else{
    app_root.render(<Launch/>)
    localStorage.setItem('hasLaunch','true')
}


reportWebVitals();
