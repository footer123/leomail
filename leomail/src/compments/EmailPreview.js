import '../index.css'
import React, {useState} from "react";
import ReactDOM from "react-dom/client";
import ConnectButton from "./ConnectButton";
import EmailContent from "./EmailContent";
import {content_root} from "./Config";
import RefreshButton from "./RefreshButton";
import ResizeMenu from "./ResizeMenu";





function PreViewList(pros) {
    const [selectIndex,setSelectIndex] = useState(-1)
    const changeSelected = (index,email) => {
      setSelectIndex(index)
        content_root.render(<EmailContent email={email}/>)
    }
    function EmailPreview(pros) {
        const email = pros.email;
        const name = email.name

        return (
            <div index={pros.index} onClick={()=>changeSelected(pros.index,pros.email)}
                 className={selectIndex===pros.index ? "email-preview-click" : "email-preview"}>
                <div className="subject">{email.subject}</div>
                {name && <div>{name}</div>}
                <div className="sender">{email.is_sender ? email.to :email.sender}</div>
            </div>
        )
    }


    const list = pros.email_list;
    if(!list){return }
    let list_view = []
    list.forEach((item,index)=>{
        list_view.push(<EmailPreview index={index} email={item}/>)
    })

    return (
        <div id="previewContent" className="preview" >

            <h2>Preview</h2>
            <RefreshButton eventBind="refreshPreviewEvent"/>
            <div id="email_contain">
                {list_view}

            </div>


            <ResizeMenu/>
        </div>
    )


}




export default PreViewList;
