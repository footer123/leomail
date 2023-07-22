import React, {useEffect, useState} from 'react';
import './MessageBox.css'
import {emitter, leoWallet, message_root} from "./Config";

const MessageBox = ({ title, content,url }) => {
    const [showMessageBox, setShowMessageBox] = useState(true);

    const handleClose = () => {
        setShowMessageBox(false);
    };

    return showMessageBox ? (
        <div className="message-box-container">
            <div className="message-box">
                <div className="message-box-header">
                    <h2>{title}</h2>
                    <button onClick={handleClose}>X</button>
                </div>
                <div className="message-box-content">{content}</div>
                {
                    url && <a className="a" href={url} target='_blank'>Leo Wallet</a>
                }

            </div>
        </div>
    ) : null;
};

export default MessageBox;
