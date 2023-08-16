// EmailCompose.js

import React, { useState } from 'react';
import './EmailCompose.css'
import {LeoWalletAdapter} from "@demox-labs/aleo-wallet-adapter-leo";
import {Transaction, WalletAdapterNetwork, WalletNotConnectedError} from "@demox-labs/aleo-wallet-adapter-base";
import {content_root, leoWallet, message_root, program_id, walletHelper} from "../Config";
import TranscationPop from "./TranscationPop";
import Pop from "./TranscationPop";
import MessageBox from "./MessageBox";

function EmailCompose(pros) {
    const old_email = pros.email ? pros.email:"";
    const [recipient, setRecipient] = useState(old_email.to);
    const [subject, setSubject] = useState(old_email.subject);
    const [content, setContent] = useState(old_email.content);
    const [progress,setProgress] = useState(0)
    const [tranctionState,setTranctionState] = useState('')
    const [addressErrorInput,setAddressErrorInput] = useState(false)
    const regex = /^aleo[A-Za-z0-9]{59}$/;
    const regex_domain = /^[a-z0-9]+@leomail\.cc/;


    const handleRecipientChange = (e) => {

        if (regex.test(e.target.value) || regex_domain.test(e.target.value)) {
            setAddressErrorInput(false)
        } else {
            setAddressErrorInput(true)
        }
        const filteredValue = e.target.value.replace(/[^\x00-\x7F]/g, ''); // 过滤非 ASCII 字符
        setRecipient(filteredValue)

    };

    const handleSubjectChange = (e) => {
        let inputValue = e.target.value;
        if (inputValue.length > 120) {
            inputValue = inputValue.slice(0, 120); // 限制长度为100
        }
        const encoder = new TextEncoder();
        if(encoder.encode(inputValue).length>500){
            return
        }

       // const filteredValue = inputValue.replace(/[^\x00-\x7F]/g, ''); // 过滤非 ASCII 字符
        setSubject(inputValue);
    };

    const handleContentChange = (e) => {
        let inputValue = e.target.value;
        if (inputValue.length > 500) {
            inputValue = inputValue.slice(0, 500); // 限制长度为150
        }
        const encoder = new TextEncoder();
        if(encoder.encode(inputValue).length>500){
            return
        }


        //const filteredValue = inputValue.replace(/[^\x00-\x7F]/g, ''); // 过滤非 ASCII 字符
        setContent(inputValue);
    };

    const getDomainAddress = (domain) => {
        const field = walletHelper.stringToAscii(domain)+'field'
        const link_user_contact = 'https://vm.aleo.org/api/testnet3/program/'+program_id+'/mapping/total_nft/'+field

        const xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", link_user_contact, false ); // false 为同步请求
        xmlHttp.send( null );
        if (xmlHttp.responseText !== 'null'){
          return xmlHttp.responseText
        }
        else{
           return  null
        }
    }
    const handleSendClick = async  () => {
        if(addressErrorInput){return}
        if(!await walletHelper.connectWallet()) {return}
        let address = recipient
        if(recipient.includes("@leomail.cc")){
            address = getDomainAddress(recipient.replace('@leomail.cc','')).replace(/"/g, '');
        }
        if(!address || address==='null'){
            message_root.render(<MessageBox key={Date.now()+''} title="Info" content={"Can't get the address of " + recipient} />)
            return
        }

        if(!content || !subject){
            alert("parameters can not be null")
            return}
        if(recipient.length===0
            || subject.length === 0
            || content.length===0){
            alert("parameters can not be null")
            return
        }
        const to_address = address;
        const as_subject = walletHelper.stringToInt(subject)
        const as_content = walletHelper.stringToInt(content)
        let sub_utf_string = as_subject.map(item=>(item+100).toString()).join('');
        let content_utf_string = as_content.map(item=>(item+100).toString()).join('');

        let subject_group = get_utf_380_string(sub_utf_string);
        let content_group = get_utf_1520_string(content_utf_string);


        const email = {
            'timestamp':Date.now()+'u64',
            'subject':subject_group,
            'content':content_group,
        }


        const old_msg_id = (await get_current_msg_id(leoWallet.publicKey)).replace(/"/g, '').replace('u64','')
        const new_msg_id = (+old_msg_id+1)+'u64'
        const email_string = JSON.stringify(email).replace(/"/g, '')
        const inputs = [leoWallet.publicKey,to_address,email_string,new_msg_id];
        const transaction = Transaction.createTransaction(
            leoWallet.publicKey,
            WalletAdapterNetwork.Testnet,
            program_id,
            'send_msg',
            inputs,
            '3000000'
        );
        try{
            const transtionid = await leoWallet.requestTransaction(transaction)

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
                        placeholder="Currently supporting a maximum of 500 characters..."
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


function padding_string(){

}


function get_utf_1520_string(content_string){
    const count = Math.trunc(content_string.length/375) + (content_string.length%375 > 0 ? 1 : 0);
    let content_group = Array(4).fill( {
        'part1':'0field',
        'part2':'0field',
        'part3':'0field',
        'part4':'0field',
        'part5':'0field',
    });
    let sub_array = content_string;
    for (let i=0;i<count; i++) {
        let value = ''
        if(sub_array.length>=375){
            value = sub_array.substring(0,375);
            sub_array = sub_array.substr(375);
        }
        else{
            value = sub_array
        }
        content_group[i] = get_utf_380_string(value)

    }
    return {
        'part1':content_group[0],
        'part2':content_group[1],
        'part3':content_group[2],
        'part4':content_group[3],
    }

}

function get_utf_380_string(content_string) {
    let content_group = Array(5).fill('0field');

    const count = Math.trunc(content_string.length/75) + (content_string.length%75 > 0 ? 1 : 0);
    let sub_content = content_string;
    for (let i=0;i<count; i++) {
        let value = ''
        if(sub_content.length>=75){
            value = sub_content.substring(0,75);
            sub_content = sub_content.substr(75);
        }
        else{
            value = sub_content
        }
        content_group[i] = value+'field';

    }
    return {
        'part1':content_group[0],
        'part2':content_group[1],
        'part3':content_group[2],
        'part4':content_group[3],
        'part5':content_group[4],
    }
}


async function get_current_msg_id(address) {

    const link_blacklist = 'https://vm.aleo.org/api/testnet3/program/'+program_id+'/mapping/account_msg_count/'+address
    const response = await fetch( link_blacklist);
    let textValue = await response.json();

    return textValue ? textValue : '0u64'
}
export default EmailCompose;
