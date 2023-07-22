import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";
import {Transaction, WalletAdapterNetwork, WalletNotConnectedError} from "@demox-labs/aleo-wallet-adapter-base";
import {emitter, walletHelper} from "./Config";
import {useState} from "react";



function ConnectButton(pros) {
    let leoWallet = pros.leoWallet;
    const [state,setState] = useState(false)
    const connectToWallet = async () => {
        if(!await walletHelper.connectWallet()) {return}
        //await leoWallet.connect("VIEW_KEY_ACCESS", WalletAdapterNetwork.Testnet);

        alert('Connect Success');

    }
    emitter.on('event_wallet_connected',()=>{
        setState(true)
    })
    return(
        <div className="connect-button" onClick={connectToWallet}>
            {state ? "Connected" : "Connect"}
        </div>
    )
}

export default ConnectButton;

