import {EventEmitter} from "events";
import ReactDOM from "react-dom/client";
import {WalletHelper} from "./WalletHelper";
import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";

   export const leoWallet = new LeoWalletAdapter()
   export const walletHelper = new WalletHelper()
   export let current_box = 'inbox'
   export const emitter = new EventEmitter();
   export const program_id = 'leomailprov1.aleo'
   export const remote_base_url = 'https://explorer.hamp.app/api/v1/mapping/'
   export const set_currentBox = (box) => {
     current_box = box
   }
   export let right_root = null
   export let message_root = null
   export let content_root = null
   export let preview_root = null
   export let launch_root = null
   export const  app_root = ReactDOM.createRoot(document.getElementById('app'))
   export const init_roots = () => {
      right_root = ReactDOM.createRoot(document.getElementById('right-container'))
      message_root = ReactDOM.createRoot(document.getElementById('messagebox'))
      content_root = ReactDOM.createRoot(document.getElementById('content'))
      preview_root = ReactDOM.createRoot(document.getElementById('preview'))
   }
