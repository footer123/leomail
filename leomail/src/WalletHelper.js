import {Transaction, WalletAdapterNetwork, WalletNotConnectedError} from "@demox-labs/aleo-wallet-adapter-base";
import {content_root, emitter, leoWallet, message_root, program_id} from "./Config";
import MessageBox from "./compments/MessageBox";
import {storeContactList} from "./compments/LocalStoreHelp";

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

    disConnectWallet=async  ()=>{
        await leoWallet.disconnect()
        emitter.emit('event_wallet_disConnected')
    }

    updateMailBoxState=async (state)=>{
        await this.connectWallet()
        const inputs = [leoWallet.publicKey];
        const transaction = Transaction.createTransaction(
            leoWallet.publicKey,
            WalletAdapterNetwork.Testnet,
            program_id,
            state ? 'enable_mailbox':'disable_mailbox',
            inputs,
            1200000
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

    setBlackList=async (blacks)=>{
        await this.connectWallet()
        const inputs = [blacks];
        const transaction = Transaction.createTransaction(
            leoWallet.publicKey,
            WalletAdapterNetwork.Testnet,
            program_id,
            'set_black_list',
            inputs,
            1300000
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

    deleteContact = async (record)=>{
        await this.connectWallet()
        const inputs = [record];
        const transaction = Transaction.createTransaction(
            leoWallet.publicKey,
            WalletAdapterNetwork.Testnet,
            program_id,
            'remove_contact',
            inputs,
            '2000000'
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

    updateContact = async (record,target,name)=>{
        await this.connectWallet()
        const nameField = this.stringToAscii(name)+'field'
        const inputs = [record,target,nameField];
        const transaction = Transaction.createTransaction(
            leoWallet.publicKey,
            WalletAdapterNetwork.Testnet,
            program_id,
            'update_contact',
            inputs,
            300000
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
            500000
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

    refreshContacts = async () => {
        await this.connectWallet()
        try {
            const records = await leoWallet.requestRecords(program_id)
            let contactList = []
            records.forEach(value => {
                if (value.data.name && value.spent===false) {
                    const name = this.ascii_to_string(value.data.name)
                    const owner  = value.data.owner;
                    const target = value.data.target.replace('.private','');
                    contactList.push({
                        owner:owner,
                        address:target,
                        name:name,
                        record:value,
                    })
                }
            })

            return contactList;
        }
        catch (e) {
            message_root.render(<MessageBox key={Date.now()+''} title="Hello" content="Please Unlock your leo wallet"   /> )
            return  []
        }
    }

    refreshDomain = async ()=>{
        await this.connectWallet()
        try {
            const records = await leoWallet.requestRecords(program_id)
            let domainList = []
            records.forEach(value => {
                if (value.data.domain && value.spent===false) {
                    const domain = this.ascii_to_string(value.data.domain)
                    const owner  = value.data.owner;
                    domainList.push({domain:domain,owner:owner,record:value})
                }
            })

            return domainList;
        }
        catch (e) {
            message_root.render(<MessageBox key={Date.now()+''} title="Hello" content="Please Unlock your leo wallet"   /> )
            return  []
        }
    }



    refreshRecord = async (type) => {
        await this.connectWallet()

        try {
            const records = await leoWallet.requestRecords(program_id)
            let list = []
            let contactList = []
            let email_list;
            records.forEach(value => {
                if(value.data.mail){
                    let item = this.trans_chaindata_to_email(value)
                    item['type'] = type
                    list.push(item)
                }
                else if (value.data.name && value.spent===false) {
                    const name = this.ascii_to_string(value.data.name)
                    const owner  = value.data.owner;
                    const target = value.data.target.replace('.private','');
                    contactList.push({
                        owner:owner,
                        address:target,
                        name:name,
                        record:value,
                    })
                }
            })

            storeContactList(contactList)

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
                    return  item.is_sender === true && item.spent === false;
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

    transferDomain = async (target,domainRecord)=>{
        await this.connectWallet()
        const inputs = [
            target,
            domainRecord
        ];
        const transaction = Transaction.createTransaction(
            leoWallet.publicKey,
            WalletAdapterNetwork.Testnet,
            program_id,
            'transfer_nft',
            inputs,
            1500000
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
    burnDomain = async (domainRecord)=>{
        await this.connectWallet()
        const inputs = [
            domainRecord
        ];
        const transaction = Transaction.createTransaction(
            leoWallet.publicKey,
            WalletAdapterNetwork.Testnet,
            program_id,
            'burn_nft_private',
            inputs,
            2600000
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
    buyDomain = async (domain,price)=>{
        await this.connectWallet()
        try {
            const aleoRecords = await leoWallet.requestRecords('credits.aleo')
            const useRecords  = aleoRecords.filter(item=>{
                const credit = +item.data.microcredits.replace('u64.private','')
                return !item.spent &&  (credit-2000000) > (price*1000000)
            })
            const feeRecords = aleoRecords.filter(item=>{
                const credit = +item.data.microcredits.replace('u64.private','')
                return !item.spent &&  (credit-3000000) > 0
            })
            if(feeRecords.length < 2 ){
                message_root.render(<MessageBox key={Date.now()+''} title="Info"
                 content="You need at least two records, One use for mint nft, and the other one use for transaction fee."   />)
                return
            }
            if(useRecords.length === 0 ){
                message_root.render(<MessageBox key={Date.now()+''} title="Info" content="You don't have enough Aleo Credits..."   />)
                return
            }
            else if(aleoRecords.filter(item=>!item.spent).length < 2){
                message_root.render(<MessageBox key={Date.now()+''} title="Info" content="You must have at least 2 Records..."   />)
                return
            }


        const inputs = [
            this.stringToAscii(domain)+'field',
            useRecords[0],
            'aleo18gsh6a7gam3w2de8fk96a9m6cfm95lc3tt726uxwkr04yuw0758qj7n8vg',
            price*1000000+'u64',
            domain.length+'u8'
        ];
        const transaction = Transaction.createTransaction(
            leoWallet.publicKey,
            WalletAdapterNetwork.Testnet,
            program_id,
            'mint_nft',
            inputs,
            3700000
        );

            const transtionid = await leoWallet.requestTransaction(transaction)
            console.log(transtionid)
            return transtionid
        }
        catch (e) {
            return null
        }

    }

    trans_chaindata_to_email(chainData) {
        const chain_email = chainData['data']['mail']
        const is_sender = chainData['data']['is_sender'].replace('.private','').replace(/"/g, '') === 'true'
        const msg_id = chainData['data']['msgid'].replace('u64.private','')
        const owner = chainData['owner']
        const spent = chainData['spent']
        const target = chainData['data']['target'].replace('.private','')

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


        const subject = this.transfer_utf380_to_string(chain_email['subject'])
        const content = this.transfer_utf1520_to_string(chain_email['content'])


        const email = {
            'sender':is_sender ? owner : target,
            'to':is_sender ? target : owner,
            'subject':subject,
            'content':content,
            'time':time,
            'is_sender':is_sender,
            'msg_id':msg_id,
            'spent':spent,
            'record':chainData
        }
        console.log(email)
        return email;
    }

    transfer_utf1520_to_string(utf1520){
        let content = this.join_utf380(utf1520.part1)+this.join_utf380(utf1520.part2)
            +this.join_utf380(utf1520.part3)+this.join_utf380(utf1520.part4)
        return this.transfer_field_string(content);
    }



    join_utf380(utf380){
        let value = ''
        if(utf380.part1 !== '0field.private'){
            value += utf380.part1.replace('field.private','')
        }
        if(utf380.part2 !== '0field.private'){
            value += utf380.part2.replace('field.private','')
        }
        if(utf380.part3 !== '0field.private'){
            value += utf380.part3.replace('field.private','')
        }
        if(utf380.part4 !== '0field.private'){
            value += utf380.part4.replace('field.private','')
        }
        if(utf380.part5 !== '0field.private'){
            value += utf380.part5.replace('field.private','')
        }
        return value
    }
    transfer_utf380_to_string(utf380){
        return this.transfer_field_string(this.join_utf380(utf380));
    }

    transfer_field_string(field) {
        if(field === '0field.private'){return ''}
        const content = field.replace('field','').replace('.private','').replace('field.private','')
        let intArray = []
        for(let i=0;i<content.length/3;i++){
            intArray.push(content.substr(i*3,3)-100)

        }
        const textDecoder = new TextDecoder();
        const decodedString = textDecoder.decode(new Uint8Array(intArray));
        return decodedString
    }

    stringToAscii(str) {
        let asciiStr = '';
        for (let i = 0; i < str.length; i++) {
            let ascii = str.charCodeAt(i)+100;
            asciiStr = asciiStr + ascii.toString();
        }
        return asciiStr;
    }
    ascii_to_string(field) {
        if(field === '0field.private'){return ''}
        const content = field.replace('field','').replace('.private','').replace('field.private','')
        let intArray = []
        for(let i=0;i<content.length/3;i++){
            intArray.push(content.substr(i*3,3)-100)
        }
        return String.fromCharCode(...intArray)
    }

    stringToInt(str) {
        const encoder = new TextEncoder();
        return Array.from(encoder.encode(str));
    }



    utf8ToString(bytes) {
        const decoder = new TextDecoder();
        return decoder.decode(bytes);
    }
}



