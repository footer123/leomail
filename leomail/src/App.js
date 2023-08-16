import logo from './logo.svg';
import './App.css';
import ConnectButton from "./compments/ConnectButton";
import {content_root, emitter, init_roots, leoWallet, preview_root, right_root} from "./Config";
import FoldersCompose from "./compments/FoldersCompose";
import Settings from "./pages/Settings";
import {ContactList} from "./compments/ContactList";
import {useEffect} from "react";
import EmailCompose from "./compments/EmailCompose";
import MintContainer from "./compments/MintContainer";
import {syncAllDomains} from "./compments/LocalStoreHelp";

function App() {

    const newMailClick = ()=>{
        right_root.render('')
        content_root.render(<EmailCompose leoWallet={leoWallet}/>)

    }

    const mintNftClick = () => {
        right_root.render(<MintContainer/>)
    }
    const contactClick = () => {
        preview_root.render(<ContactList/>)
        content_root.render('')
        right_root.render('')
    }

    useEffect(() => {
        init_roots()
        syncAllDomains().then()
        return () => {

        };
    }, []);
  return (
      <div className="container">

        <div className="sidebar">
          <div className="menu-icon"><img className="ico-img-top" src="leo.png"/></div>
          <div className="menu-top">Leo-Mail</div>

          <div id="new_email" className="menu-item">
            <h2 onClick={newMailClick} className="menu-item-h2">New Mail</h2>
          </div>
          <div className="menu-item">
            <h2 onClick={contactClick} className="menu-item-h2" id="contacts">Contacts</h2>
            <div id="account" className="sub-menu">
              <div className="sub-menu-item">please connect wallet...</div>
            </div>
          </div>
          <div id="messagebox"></div>
          <div className="menu-item">
            <h2>Folders</h2>
            <div className="sub-menu">
              <div id="folders" className="folder-list">
                  <FoldersCompose/>
              </div>
            </div>
          </div>
          <div className="menu-item">
            <h3 onClick={mintNftClick} id="mintNft" className="menu-item-h2">Mint Domain NFT</h3>
          </div>
          <div id="connect">
              <ConnectButton leoWallet={leoWallet}/>
          </div>
          <div id='settings'>
              <Settings/>
          </div>
        </div>
        <div id="right-container" className="rightBar-container">
        </div>
        <div className="preview-contain" id="preview">
        </div>


        <div id="content" className="content">

        </div>
      </div>
  );
}

export default App;
