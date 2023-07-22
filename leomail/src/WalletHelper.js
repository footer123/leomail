import {Transaction, WalletAdapterNetwork, WalletNotConnectedError} from "@demox-labs/aleo-wallet-adapter-base";
import {content_root, emitter, leoWallet, message_root, program_id} from "./compments/Config";
import MessageBox from "./compments/MessageBox";

export class WalletHelper {


    connectWallet = async ()=>{
        try{
            const state = await leoWallet.connect("VIEW_KEY_ACCESS", WalletAdapterNetwork.Testnet);
            console.log(state)
            emitter.emit('event_wallet_connected')
            return true
        }
        catch (e) {
            console.log(e)
            if(leoWallet.readyState === "NotDetected"){
                const url =leoWallet.url
                console.log(message_root)
                message_root.render(<MessageBox key={Date.now()+''} title="Hello" content="Please install leo wallet"  url={url}  /> )
            }
            return false
        }

    }

    deleteContact = async (field)=>{
        await this.connectWallet()
        const inputs = [leoWallet.publicKey,field];
        const transaction = Transaction.createTransaction(
            leoWallet.publicKey,
            WalletAdapterNetwork.Testnet,
            program_id,
            'remove_contact',
            inputs,
            '3000000'
        );
        try{
            const transtionid = await leoWallet.requestTransaction(transaction)
            console.log(transtionid)
            return transtionid
        }
        catch (e) {
            console.log(e)
            return  null
        }
    }

    addContact = async (target,name)=>{
        await this.connectWallet()

        const namefield = this.stringToAscii(name)+'field'
        const inputs = [leoWallet.publicKey,target,namefield];
        const transaction = Transaction.createTransaction(
            leoWallet.publicKey,
            WalletAdapterNetwork.Testnet,
            program_id,
            'add_contact',
            inputs,
            '3000000'
        );
        try{
            const transtionid = await leoWallet.requestTransaction(transaction)
            console.log(transtionid)
            return transtionid
        }
        catch (e) {
            console.log(e)
            return  null
        }

    }
    refreshRecord = async (type) => {
        if (!leoWallet.publicKey) {
            await leoWallet.connect("VIEW_KEY_ACCESS", WalletAdapterNetwork.Testnet);
        }
        try {
            const records = await leoWallet.requestRecords(program_id)
            let list = []
            let email_list;
            records.forEach(value => {
                let item = this.trans_chaindata_to_email(value)
                item['type'] = type
                list.push(item)
            })
            if(type === 'all'){
                email_list = list;
            }
            else if(type === 'inbox'){
                email_list = list.filter(item=>{
                    return  item.is_sender === false;
                })
            }
            else if(type === 'sent'){
                email_list = list.filter(item=>{
                    return  item.is_sender === true;
                })
            }
            else if(type === 'trash'){
                email_list = list.filter(item=>{
                    return  item.spent === true;
                })
            }
            console.log(email_list)
            return email_list;
        }
        catch (e) {
            message_root.render(<MessageBox key={Date.now()+''} title="Hello" content="Please Unlock your leo wallet"   /> )
            return  []
        }


    }

    confirmRecord = async  (record)=>{
        const inputs = [record];
        const transaction = Transaction.createTransaction(
            leoWallet.publicKey,
            WalletAdapterNetwork.Testnet,
            program_id,
            'confirm_msg',
            inputs,
            '2000000'
        );
        try{
            const transtionid = await leoWallet.requestTransaction(transaction)
            console.log(transtionid)
            return transtionid
        }
        catch (e) {
            return null
        }

    }
    trans_chaindata_to_email(chainData) {
        const chain_email = chainData['data']['email']
        const is_sender = chainData['data']['is_sender'].replace('.private','').replace(/"/g, '') === 'true'
        const msg_id = chainData['data']['msgid'].replace('u64.private','')
        const owner = chainData['owner']
        const spent = chainData['spent']
        const to = chainData['data']['target'].replace('.private','')

        const date = new Date(+chain_email['timestamp'].replace('u64.private',''))
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };

        const time = new Intl.DateTimeFormat('en-US', options).format(date);


        const subject1 = this.transfer_field_string(chain_email['sub_one'])
        const subject2 = this.transfer_field_string(chain_email['sub_two'])
        const content1 = this.transfer_field_string(chain_email['content_one'])
        const content2 = this.transfer_field_string(chain_email['content_two'])
        const content3 = this.transfer_field_string(chain_email['content_three'])
        const content4 = this.transfer_field_string(chain_email['content_four'])
        const content5 = this.transfer_field_string(chain_email['content_five'])
        const content6 = this.transfer_field_string(chain_email['content_six'])

        const email = {
            'sender':owner,
            'to':to,
            'subject':subject1+subject2,
            'content':content1+content2+content3+content4+content5+content6,
            'time':time,
            'is_sender':is_sender,
            'msg_id':msg_id,
            'spent':spent,
            'record':chainData
        }
        console.log(email)
        return email;
    }


    transfer_field_string(field) {
        if(field === '0field.private'){return ''}
        const content = field.replace('field','').replace('.private','')
        let str_value = ''
        for(let i=0;i<content.length/3;i++){
            const char = String.fromCharCode(content.substr(i*3,3)-70)
            str_value += char
        }
        return str_value
    }

    stringToAscii(str) {
        let asciiStr = '';
        for (let i = 0; i < str.length; i++) {
            let ascii = str.charCodeAt(i)+70;
            asciiStr = asciiStr + ascii.toString();
        }
        return asciiStr;
    }
}



