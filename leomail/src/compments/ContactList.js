import React, {Component, useEffect, useState} from "react";
import {content_root, emitter, leoWallet, program_id, remote_base_url, walletHelper} from "../Config";
import ReactDOM from "react-dom/client";
import FoldersCompose from "./FoldersCompose";
import Pop from "./TranscationPop";
import {Transaction, WalletAdapterNetwork, WalletNotConnectedError} from "@demox-labs/aleo-wallet-adapter-base";
import RefreshButton from "./RefreshButton";
import ResizeMenu from "./ResizeMenu";


export class ContactList extends Component{
    constructor(pros) {
        super(pros);
        this.state = {'count':0,'contacts':[]}
    }



    render() {
        const {contacts} = this.state
        return (

            <div id="previewContent" className="preview" >

                <h2>Contacts</h2>
                <RefreshButton eventBind="refreshContactlist"/>
                <div id="email_contain">
                    <div>
                        <div onClick={() => this.addNewContact()} className="menu-button">
                            <img className="img_button" src='addcontact.png'/>
                               New Contact
                        </div>
                        <ul className="contact-list">
                            {contacts.length > 0 && contacts.map((item, index) => (
                                <li className="contact-item"  onClick={() => this.showContactDetails(item)}>{item.name}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <ResizeMenu/>
            </div>






        )
    }

    addNewContact(){
        const temp_contact = {'name':'','address':''}
        content_root.render(<ContactContent key={Date.now()} contact={temp_contact} editing={true} />)
    }
    showContactDetails = (contact)=>{

        content_root.render(<ContactContent key={Date.now()} contact={contact} editing={false} />)


    }
    componentDidMount() {
        // const { count } = this.state;
        // if(count === 0){
            this.get_contacts()
            this.setState((prevState) => ({
                count: prevState.count + 1,
            }));
        // }
        emitter.on('refreshContactlist',async ()=>{
            console.log('emit refreshContactlist ');
            this.get_contacts()

        })


    }

    componentWillUnmount() {

    }

    async get_contacts(){
        const contacts = await walletHelper.refreshContacts()
        console.log(contacts)

        this.setState({'contacts':contacts})
    }

    async get_contact_list(address) {
        if(!await walletHelper.connectWallet()) {return}

        const link_user_contact = remote_base_url+'list_program_mapping_values/'+program_id+'/user_contact'
        const link_contacts = remote_base_url+'list_program_mapping_values/'+program_id+'/contact'
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", link_user_contact, false ); // false 为同步请求
        xmlHttp.send( null );
        const response_user_contact = xmlHttp.responseText !== 'null' ? xmlHttp.responseText : null;
        xmlHttp.open( "GET", link_contacts, false ); // false 为同步请求
        xmlHttp.send( null );
        const response_contacts = xmlHttp.responseText !== 'null' ? xmlHttp.responseText : null;

        const all_user_contacts = JSON.parse(response_user_contact)
        const all_contacts = JSON.parse(response_contacts)
        if(all_user_contacts.length>0 && all_user_contacts.length === all_contacts.length){
            const user_contacts = all_user_contacts.filter(item=>{
                return item.value === leoWallet.publicKey
            })
            const temp_contacts = all_contacts.filter(item=>{
                return user_contacts.some((value) => value['key'] === item.key);
            })
            const origin_key =  temp_contacts.map(item=>item['key'])
            const origin_value = temp_contacts.map(item=>item['value'])
            const  origin_array = []
            for (let i = 0;  i<origin_value.length;i++ ) {
                const field = origin_key[i]
                const value = origin_value[i]
                const json = {'field':field,'value': value}
                origin_array.push(json)
            }
            let contacts = []
            origin_array.forEach(item=>{
                const split = item.value.split(',')
                const name = walletHelper.transfer_field_string(split[0].replace('{name:','').trim())
                const address = split[1].replace('account:','').replace('}','').trim()
                contacts.push({'field':item.field,'name':name,'address':address})
            })
            console.log(contacts)

            this.setState({'contacts':contacts})
            localStorage.setItem('contacts',JSON.stringify(contacts))// save to localStorage
        }
    }

}



function  ContactContent(pros) {
    const contact = pros.contact
    const [name,setName] = useState(contact.name)
    const [nameEditing,setNameEditing] = useState(pros.editing)
    const [nameErrorInput,setNameErrorInput] = useState(false)
    const [addressErrorInput,setAddressErrorInput] = useState(false)
    const [address,setAddress] = useState(contact.address)
    const regex = /^aleo[A-Za-z0-9]{59}$/;

    const handle_name_input = () => {
    }

    const handle_contact_delete = async () => {
        const transaction_id = await walletHelper.deleteContact(contact.record)
        if(transaction_id){
            content_root.render(<Pop transactionId={transaction_id}/>)
        }
        else{

        }
    }
    const handle_save_contact = async () => {
        if(name.trim().length === 0){
            setNameErrorInput(true)
            return
        }
        if(nameErrorInput||addressErrorInput){
            return;
        }
        let transaction_id = ''
        if(contact.record)
        {
            transaction_id = await walletHelper.updateContact(contact.record,address,name)
        }
        else{
            transaction_id = await walletHelper.addContact(address,name)
        }


        if(transaction_id){
            content_root.render(<Pop transactionId={transaction_id}/>)
        }
        else{

        }




    }
    const handle_name_input_changed = (e) => {
        let inputValue = e.target.value;
        if (inputValue.length > 25) {
            inputValue = inputValue.slice(0, 25); // 限制长度为100
        }
        const filteredValue = inputValue.replace(/[^\x00-\x7F]/g, ''); // 过滤非 ASCII 字符
        setName(filteredValue);
    }
    const handle_address_input_changed = (e) => {

        if (regex.test(e.target.value)) {
            setAddressErrorInput(false)
        } else {
            setAddressErrorInput(true)
        }
        setAddress(e.target.value)
    }
    const handle_name_edit_clicked = () => {
        setNameEditing(true)
    }
        return (

                <div id="contactdetails" className="contact-details">
                    <div className="content_top">
                        <div>
                            {
                                (pros.editing || nameEditing) && <div onClick={handle_save_contact} className="menu-button">
                                    <img className="img_button" src='save.png'/>
                                    Save
                                </div>
                            }
                            {
                                !pros.editing &&
                                <div onClick={handle_name_edit_clicked} className="menu-button">
                                    <img className="img_button" src='edit.png'/>
                                    Edit
                                </div>

                            }


                            {
                                !pros.editing && <div onClick={handle_contact_delete}  className="menu-button">
                                    <img className="img_button" src='remove.png'/>
                                    Delete
                                </div>
                            }

                        </div>

                    </div>

                    <img className="icon-img" src="defaulticon.png"/>
                    <h3>Contact Details</h3>
                    <h4>Name</h4>
                    {
                        !nameEditing && <div >{name}</div>
                    }

                    {
                        nameEditing && <input className={ nameErrorInput ? "error-input" : "input-item-edit" }
                                                onChange={handle_name_input_changed}
                                                onClick={handle_name_input}
                                              value={name}
                        />
                    }

                    <h4>Address</h4>
                    {
                        !nameEditing && <div>{contact.address}</div>
                    }


                    {
                        nameEditing && <input className={ addressErrorInput ? "error-input" : "input-item-edit" }
                                                onChange={handle_address_input_changed}
                                                value={address}
                                                onClick={handle_name_input}
                        />
                    }

                </div>



        )


}
