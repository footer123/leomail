import {EventEmitter} from "events";
import ReactDOM from "react-dom/client";
import {WalletHelper} from "../WalletHelper";
import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";

   export const leoWallet = new LeoWalletAdapter()
   export const walletHelper = new WalletHelper(leoWallet)
   export let current_box = 'inbox'
   export const emitter = new EventEmitter();
   export const program_id = 'footeremailv3.aleo'
   export const remote_base_url = 'https://explorer.hamp.app/api/v1/mapping/'
   export const set_currentBox = (box) => {
     current_box = box
   }

   export const message_root = ReactDOM.createRoot(document.getElementById('messagebox'))
   export const content_root = ReactDOM.createRoot(document.getElementById('content'))
   export const preview_root = ReactDOM.createRoot(document.getElementById('preview'))
