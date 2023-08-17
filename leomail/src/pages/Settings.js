import React, {useEffect, useState} from 'react';
import './Settings.css';
import {app_root, emitter, leoWallet, message_root, program_id, remote_base_url, walletHelper} from "../Config";
import BlackList from "./BlackList";
import NftList from "./NftList";
import Launch from "./Launch";

const Settings = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [state,setState]  = useState(true)
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        getMailBoxState().then(value => {
            setState(value)
        })
    };


    const getMailBoxState = async () => {
        const mailStateLink = 'https://vm.aleo.org/api/testnet3/program/'+program_id+'/mapping/mailbox_state_store/'+leoWallet.publicKey
        const res = await fetch(mailStateLink)
        const json = await res.json()
        console.log('mailbox state' + json)
        if(json==='1u8'){
            return false
        }
        return true

    }

    const setMailBoxState =async (flag) => {
        if(state === flag){return}
        await walletHelper.connectWallet()
        walletHelper.updateMailBoxState(!state).then()
        setIsMenuOpen(!isMenuOpen);
    }

    const showBlackList = () => {
      message_root.render(<BlackList/>)
        setIsMenuOpen(!isMenuOpen);
    }
    const clearBlackList = async () => {
        const blacks = {
            "black1":"aleo1wa04hyxkymezl5zcqucp3h3zlm52r9p7xryuentel8s88xcv6sqst8wz2t",
            'black2':"aleo1wa04hyxkymezl5zcqucp3h3zlm52r9p7xryuentel8s88xcv6sqst8wz2t",
            'black3':"aleo1wa04hyxkymezl5zcqucp3h3zlm52r9p7xryuentel8s88xcv6sqst8wz2t",
            'black4':"aleo1wa04hyxkymezl5zcqucp3h3zlm52r9p7xryuentel8s88xcv6sqst8wz2t",
            'black5':"aleo1wa04hyxkymezl5zcqucp3h3zlm52r9p7xryuentel8s88xcv6sqst8wz2t",
        }
        const content = JSON.stringify(blacks).replace(/"/g, '')
        await walletHelper.setBlackList(content)
    }
    const showDomain = () => {
        message_root.render(<NftList/>)
        setIsMenuOpen(!isMenuOpen);
    }
    const disConnect = async () => {
        await  walletHelper.disConnectWallet()
        setIsMenuOpen(!isMenuOpen);
    }
    const aboutClick = () => {
        app_root.render(<Launch/>)
    }

    return (
        <div className="menu-container">
            <div className="setting-menu" >
                <img onClick={toggleMenu}  src="setting.png"/>
            </div>
            {isMenuOpen && (
                <div className="overlay" onClick={toggleMenu}></div>
            )}
            <div className={`menu ${isMenuOpen ? 'open' : ''}`}>
                <h2>Settings</h2>
                <h4>MailBox</h4>
                <div onClick={()=>setMailBoxState(true)}>{state ? 'Enabling...' : 'Enable'}</div>
                <div onClick={()=>setMailBoxState(false)}>{state ? 'Disable' : 'Disabling...'}</div>
                <h4>BlackList</h4>
                <div onClick={showBlackList}>Set Blacklist</div>
                <div onClick={clearBlackList}>Clear Blacklist</div>
                <h4>Domain NFT</h4>
                <div onClick={showDomain}>My Domain</div>
                <h4>About</h4>
                <div onClick={aboutClick}>About LeoMail</div>
                <div className='menu-disconnect' onClick={disConnect}>Disconnect</div>
            </div>

        </div>
    );
};

export default Settings;
