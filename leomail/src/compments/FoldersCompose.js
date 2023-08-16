import '../index.css'
import '../Config'
import {
    content_root,
    current_box,
    preview_root,
    emitter,
    leoWallet,
    set_currentBox,
    walletHelper,
    right_root
} from "../Config";
import React, {useEffect, useState} from "react";
import PreViewList from "./EmailPreview";
import {getContactByAddress, getDomainFromAddress} from "./LocalStoreHelp";


function FoldersCompose(pros) {
    const [name,setName] = useState('inbox')
    const changeFolder = async (folder) => {
        // 这里可以根据选中的 folder 做相应的操作
        console.log('Selected Folder:', folder);
        set_currentBox(folder)

        if(name !== folder){
            content_root.render(<div></div>)
        }
        setName(folder)
        await refreshPreview()
    }

    const refreshPreview = async () => {
        console.log('Start to Refresh preview')
        if(!await walletHelper.connectWallet()) {return}
        const type = current_box
        let temp_email_list = []
        if(type === 'drafts'){
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const value = localStorage.getItem(key);
                if(key.includes('drafts')){
                    temp_email_list.push(JSON.parse(value))
                }

            }
        }
        else{

            temp_email_list = await  walletHelper.refreshRecord(type)

        }
        if(type === 'inbox'){
            const welcome = {
                'to' : '(You) '+ leoWallet.publicKey,
                'subject':wellcome_subject,
                'content':wellcome_content,
                'is_sender':false,
                'type':'welcome',
                'sender':'Leo Mail Team',
                'key':Date.now()+''
            }
            temp_email_list.push(welcome)
        }

        const email_list = mix_local_contacts(temp_email_list)
        right_root.render('')
        preview_root.render(<PreViewList  email_list={email_list}/>)


    }





    useEffect(() => {
        setTimeout(() => {
            changeFolder('inbox')
        }, 2000);

        emitter.on('event_wallet_connected',async () => {
            console.log('emit event_wallet_connected ');
            if(leoWallet.publicKey){
                const subpri = leoWallet.publicKey.substr(0,16)
                const subend = leoWallet.publicKey.substr(leoWallet.publicKey.length-5,leoWallet.publicKey.length-1)
                document.getElementById('account').textContent = subpri+'····'+subend
            }
        });
        emitter.on('refreshPreviewEvent',async ()=>{
            console.log('emit refreshPreviewEvent ');
            await refreshPreview()
        })
        emitter.on('event_change_folder',async () => {
            console.log('emit event_change_folder ');
            await refreshPreview()
        });

        return () => {

        };
    }, []);


    return (
        <div className="folder-list">
            <div name={'inbox'} className={name==='inbox' ? 'folder-item-click' :'folder-item'} onClick={()=>changeFolder('inbox')}>Inbox</div>
            <div name={'sent'} className={name==='sent' ? 'folder-item-click' :'folder-item'} onClick={()=>changeFolder('sent')}>Sent</div>
            <div name={'drafts'} className={name==='drafts' ? 'folder-item-click' :'folder-item'} onClick={()=>changeFolder('drafts')}>Drafts</div>
            <div name={'trash'} className={name==='trash' ? 'folder-item-click' :'folder-item'} onClick={()=>changeFolder('trash')}>Trash</div>
        </div>
    )
}


function mix_local_contacts(emails) {
    try{
        let new_email_list = []
        emails.forEach(item=>{
            const new_item = item
            const contact = getContactByAddress((item.is_sender ? item.to : item.sender))
            const domain = getDomainFromAddress((item.is_sender ? item.to : item.sender))
            if(contact){
                new_item['name'] =  contact.name
            }
            if(domain){
                new_item['domain'] = domain + "@leomail.cc"
            }
            new_email_list.push(new_item)
        })

        return new_email_list
    }
    catch (e) {
        return  emails
    }

}


const wellcome_subject ='Welcome to Leo Mail - Your Decentralized Email Service'


var wellcome_content = 'Dear User,\n\nWelcome to Leo Mail! We are thrilled to have you on board as we revolutionize the email experience using the power of "Aleo Network". With our decentralized email service, you can enjoy enhanced privacy, security, and control over your communications. Say goodbye to centralized data storage and hello to a new era of trust and freedom.\n\nExperience seamless messaging while knowing that your personal information remains secure and inaccessible to unauthorized entities. Our innovative technology ensures end-to-end encryption and empowers you to take ownership of your data.\n\nWe are committed to providing you with a user-friendly interface, robust features, and exceptional support. Should you have any questions or need assistance, our dedicated team is here to help.\n\nThank you for choosing Leo Mail as your trusted decentralized email provider. Together, let\'s shape the future of communication.\n\nBest regards,\nLeo Mail Team';


export default FoldersCompose;
