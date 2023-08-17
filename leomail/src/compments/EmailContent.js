import React from "react";
import {content_root, leoWallet, walletHelper} from "../Config";
import EmailCompose from "./EmailCompose";
import Pop from "./TranscationPop";

export default  function EmailContent(pros) {
    const email = pros.email;
    const handle_reply = () => {
        const temp_email = {'to':email.sender}
        content_root.render(<EmailCompose email={temp_email}/>);
    }
    const hand_edit = () => {
        content_root.render(<EmailCompose email={email}/>);
    }
    const handle_trash = async () => {
        if(window.confirm('Confirm to move?')){
            try{
                const transtionid =  await walletHelper.confirmRecord(email.record)
                if(transtionid){
                    content_root.render(<Pop transactionId={transtionid}/>)
                }
            }
            catch (e) {

            }
        }


    }
    const handle_delete = () => {
        if(window.confirm('Confirm to delete it?')){
            localStorage.removeItem(email.key)
            content_root.render(<div></div>);
        }

    }

    const sub_sender1 = ()=>{
        if(email.name || email.domain){
            let substr=''
            substr = email.is_sender ? 'To: ' : 'From: '
            if(email.name){
                substr += email.name
            }
            if(email.domain){
                substr += ' ('+email.domain+') '
            }
            return substr
        }
        return ''
    }
    const sub_sender2 = () => {
        if(!email.name && !email.domain){
            let substr=''
            substr = email.is_sender ? 'To: ' : 'From: '
            substr+= email.is_sender ? email.to : email.sender
            return substr
        }
        return  email.is_sender ? email.to : email.sender

    }
    const subsender1 = sub_sender1()
    const subsender2 = sub_sender2()
    return (

        <div className="content">
            <div className="content_top">
                <div >
                    {(email.type === 'inbox') &&
                    <div onClick={handle_reply} className="menu-button">
                        <img className="img_button" src={'replay.png'}/>
                        Replay
                    </div>
                    }
                    {(email.type === 'sent' || email.type === 'drafts') &&
                    <div onClick={hand_edit} className="menu-button">
                        <img className="img_button" src={'edit.png'}/>
                        Edit Again
                    </div>
                    }
                    {(email.type === 'sent' || email.type === 'inbox') &&
                    <div onClick={handle_trash} className="menu-button">
                        <img className="img_button" src={'delete.png'}/>
                        Move to trash
                    </div>}

                    {(email.type === 'drafts') &&
                        <div onClick={handle_delete} className="menu-button">
                        <img className="img_button" src={'remove.png'}/>
                        Delete
                        </div>
                    }

                </div>
            </div>
            <div className="header">
                <div className="subject">{email.subject}</div>
                <div className="sub_sender">{subsender1}</div>
                <div className="sub_sender">{subsender2}</div>
                <div className="timestamp">{email.time}</div>
            </div>
            <div className="sub-content">
                <div style={{maxWidth:'780px',whiteSpace: 'pre-line'}}>{email.content}</div>
            </div>
        </div>

    )
}
