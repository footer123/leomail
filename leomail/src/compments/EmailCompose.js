// EmailCompose.js

import React, { useState } from 'react';
import './EmailCompose.css'
import {LeoWalletAdapter} from "@demox-labs/aleo-wallet-adapter-leo";
import {Transaction, WalletAdapterNetwork, WalletNotConnectedError} from "@demox-labs/aleo-wallet-adapter-base";
import {content_root, leoWallet, program_id, walletHelper} from "./Config";
import TranscationPop from "./TranscationPop";
import Pop from "./TranscationPop";

function EmailCompose(pros) {
    const old_email = pros.email ? pros.email:"";
    const [recipient, setRecipient] = useState(old_email.to);
    const [subject, setSubject] = useState(old_email.subject);
    const [content, setContent] = useState(old_email.content);
    const [progress,setProgress] = useState(0)
    const [tranctionState,setTranctionState] = useState('')
    const [addressErrorInput,setAddressErrorInput] = useState(false)
    const regex = /^aleo[A-Za-z0-9]{59}$/;



    const handleRecipientChange = (e) => {

        if (regex.test(e.target.value)) {
            setAddressErrorInput(false)
        } else {
            setAddressErrorInput(true)
        }
        setRecipient(e.target.value)

    };

    const handleSubjectChange = (e) => {
        let inputValue = e.target.value;
        if (inputValue.length > 50) {
            inputValue = inputValue.slice(0, 100); // 限制长度为100
        }
        const filteredValue = inputValue.replace(/[^\x00-\x7F]/g, ''); // 过滤非 ASCII 字符
        setSubject(filteredValue);
    };

    const handleContentChange = (e) => {
        let inputValue = e.target.value;
        if (inputValue.length > 150) {
            inputValue = inputValue.slice(0, 150); // 限制长度为150
        }
        const filteredValue = inputValue.replace(/[^\x00-\x7F]/g, ''); // 过滤非 ASCII 字符
        setContent(filteredValue);
    };

    const handleSendClick = async  () => {
        if(addressErrorInput){return}
        if(!await walletHelper.connectWallet()) {return}

        // 在这里处理发送邮件的逻辑
        console.log('Recipient:', recipient);
        console.log('Subject:', subject);
        console.log('Content:', content);
        if(!recipient || !content || !subject){
            alert("parameters can not be null")
            return}
        if(recipient.length===0
            || subject.length === 0
            || content.length===0){
            alert("parameters can not be null")
            return
        }
        const to_address = recipient;
        const as_subject = walletHelper.stringToAscii(subject)
        const as_content = walletHelper.stringToAscii(content)
        let subject_group = get_push_group(as_subject,2);
        let content_group = get_push_group(as_content,6);
        console.log('subject'+subject_group)
        console.log('content'+content_group)
        const email = {
            'timestamp':Date.now()+'u64',
            'sub_one':subject_group[0],
            'sub_two':subject_group[1],
            'content_one':content_group[0],
            'content_two' :content_group[1],
            'content_three':content_group[2],
            'content_four':content_group[3],
            'content_five':content_group[4],
            'content_six':content_group[5],
        }


        const old_msg_id = (await get_current_msg_id(leoWallet.publicKey)).replace(/"/g, '').replace('u64','')
        const new_msg_id = (+old_msg_id+1)+'u64'
        const email_string = JSON.stringify(email).replace(/"/g, '')
        const inputs = [leoWallet.publicKey,to_address,email_string,new_msg_id];
        const transaction = Transaction.createTransaction(
            leoWallet.publicKey,
            WalletAdapterNetwork.Testnet,
            program_id,
            'sendmsg',
            inputs,
            '5000000'
        );
        try{
            const transtionid = await leoWallet.requestTransaction(transaction)
            console.log(transtionid)

            if(transtionid){
                content_root.render(<Pop transactionId={transtionid}/>)
            }

        }
        catch (e) {

        }



    };

    const handleDraftClick = async () => {
        if(window.confirm("Move to Drafts?")){
            const draft = {
                'to' : recipient,
                'subject':subject,
                'content':content,
                'is_sender':true,
                'type':'drafts',
                'key':'drafts'+Date.now()
            }
            localStorage.setItem(draft.key,JSON.stringify(draft))
            content_root.render(<div></div>)
        } else {
            // 用户点击了取消按钮
        }
    }

    return (
        <div className="content">
            <div className="compose-email">
                <div className="form-group">
                    <label htmlFor="recipient">To:</label>
                    <input
                        type="text"
                        id="recipient"

                        className= {addressErrorInput ? "error-form-control" : "form-control"}
                        placeholder="Aleo address"
                        value={recipient}
                        onChange={handleRecipientChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="subject">Subject:</label>
                    <input
                        type="text"
                        id="subject"
                        className="form-control"
                        placeholder="Subject"
                        value={subject}
                        onChange={handleSubjectChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="content">Content:</label>
                    <textarea
                        id="content"
                        className="form-control"
                        rows="8"
                        placeholder="Currently supporting a maximum of 150 characters..."
                        value={content}
                        onChange={handleContentChange}
                    ></textarea>
                </div>
                <div className="bottom">
                    <button className="btn btn-primary" onClick={handleSendClick}>
                        Send
                    </button>

                    <button className="btn btn-drafts" onClick={handleDraftClick}>
                        Move to Drafts
                    </button>

                </div>

            </div>
        </div>
    );
}







function get_push_group(content,defaut_length) {
    let content_group = Array(defaut_length).fill('0field');
    if(content.length<=75){
        content_group[0] = content+'field'
        return content_group;
    }

    const count = Math.trunc(content.length/75) + (content.length%75 > 0 ? 1 : 0);
    let sub_content = content;
    for (let i=0;i<count; i++) {
        let value = ''
        if(sub_content>=75){
            value = sub_content.substring(0,75);
            sub_content = sub_content.substr(75);
        }
        else{
            value = sub_content
        }
        content_group[i] = value+'field';

    }
    return content_group
}


async function get_current_msg_id(address) {
    const link = `https://explorer.hamp.app/api/v1/mapping/get_value/${program_id}/account_msg_count/`+address
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", link, false ); // false 为同步请求
    xmlHttp.send( null );
    const response = xmlHttp.responseText;
    return response !== 'null' ? response : '0u64'
}
export default EmailCompose;
