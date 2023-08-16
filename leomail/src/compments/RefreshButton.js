import React, { useState } from 'react';
import './EmailCompose.css'
import {LeoWalletAdapter} from "@demox-labs/aleo-wallet-adapter-leo";
import {Transaction, WalletAdapterNetwork, WalletNotConnectedError} from "@demox-labs/aleo-wallet-adapter-base";
import ReactDOM from "react-dom/client";
import PreViewList from "./EmailPreview";
import '../WalletHelper'
import {WalletHelper} from "../WalletHelper";

import {current_box, emitter, leoWallet, walletHelper} from "../Config";
import {EventEmitter} from "events";


function RefreshButton(pros) {
    let event = pros.eventBind
    const [isRotating, setRotating] = useState(false);

    const startRotation = async () => {

        setRotating(true);
        setTimeout(() => {
            setRotating(false);
        }, 2000);
        emitter.emit(event)
    };




    return (
        <div id="refresh_button" className={`refresh-button ${isRotating ? 'rotate-animation' : ''}`} onClick={startRotation}>
            <img className="img_button" src={'refresh.png'} />
        </div>
)
}


export default RefreshButton
