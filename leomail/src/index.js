import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import ConnectButton from "./compments/ConnectButton";
import EmailCompose from "./compments/EmailCompose";
import RefreshButton from "./compments/RefreshButton";
import FoldersCompose from "./compments/FoldersCompose";
import {WalletHelper} from "./WalletHelper";
import './compments/Config'
import {content_root, preview_root, leoWallet, walletHelper} from "./compments/Config";
import {ContactList} from "./compments/ContactList";



ReactDOM.createRoot(document.getElementById('connect')).render(<ConnectButton leoWallet={leoWallet}/>)
ReactDOM.createRoot(document.getElementById('folders')).render(<FoldersCompose/>)


document.getElementById('new_email').addEventListener('click',function (event) {
    content_root.render(<EmailCompose leoWallet={leoWallet}/>)
})

document.getElementById('contacts').addEventListener('click',function (event) {
    preview_root.render(<ContactList/>)
})

reportWebVitals();
