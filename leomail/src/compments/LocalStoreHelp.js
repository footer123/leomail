import {leoWallet, program_id, remote_base_url, walletHelper} from "../Config";


const add_sending_mail = (transactionId,mail) => {
  const queueing = localStorage.getItem('Sending')
  queueing[transactionId] = mail
  localStorage.setItem('Sending',queueing)
}


const get_sending_queue = () => {
    return localStorage.getItem('Sending')
}

const remove_sending_queue = (transactionId) => {
    const queueing = localStorage.getItem('Sending')
    queueing[transactionId] = null
    localStorage.setItem('Sending',queueing)
}


export const syncAllContacts = async () => {
    const response_user_contact = await fetch( remote_base_url +'/list_program_mapping_values/'+program_id+'/user_contact');
    const response_contact = await fetch( remote_base_url +'/list_program_mapping_values/'+program_id+'/contact');
    const user_contact_json = await response_user_contact.json();
    const contact_json = await response_contact.json();
    let all_contacts = []
    for (const item of user_contact_json) {
        const filters = contact_json.filter(sub=>sub.key === item.key)
        const value = JSON.parse(filters[0].value)
        all_contacts.push({'address':item.value,'detail':value})
    }
    localStorage.setItem('Contacts',JSON.stringify(all_contacts))


}

export const syncAllDomains = async () => {

    try{
        const response = await fetch( remote_base_url +'/list_program_mapping_values/'+program_id+'/total_nft');
        const domains = await response.json();

        localStorage.setItem('Domains',JSON.stringify(domains))
    }
    catch (e) {

    }

}


export const getDomainFromAddress = (address) => {
    const domainList = JSON.parse(localStorage.getItem('Domains'))
    const filterValue = domainList.filter(item=>item.value === address)
    if(filterValue.length>0){
        return ascii_to_string(filterValue[0].key)
    }
    return null

}


export const storeContactList = (contactList)=>{
    localStorage.setItem(leoWallet.publicKey+'Contacts',JSON.stringify(contactList))
}
export  const getContactByAddress= (address)=>{
    const contactListStr = localStorage.getItem(leoWallet.publicKey+'Contacts')
    if(!contactListStr){return ''}
    const contactList = JSON.parse(contactListStr)
    const contact = contactList.filter(item=>item.address === address)
    if(contact.length === 0){return  ''}
    return contact[0]
}

function ascii_to_string(field) {
    if(field === '0field.private'){return ''}
    const content = field.replace('field','').replace('.private','').replace('field.private','')
    let intArray = []
    for(let i=0;i<content.length/3;i++){
        intArray.push(content.substr(i*3,3)-100)

    }
    return String.fromCharCode(...intArray)
}


const getAddressFromDomain = (domain) => {
    const domainlList = localStorage.getItem('Domain')
    if(domainlList[domain] )
    {
        return domainlList[domain]
    }
}

const storeDomain = (domain,address) => {
    const domainlList = localStorage.getItem('Domain')
    domainlList[domain] = address
    localStorage.setItem('Domain',domainlList)
}



const refreshAddressFromDomain = async (domain) => {

    const field = walletHelper.stringToAscii(domain)+'field'
    const link_user_contact = 'https://vm.aleo.org/api/testnet3/program/'+program_id+'/mapping/total_nft/'+field

    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", link_user_contact, false ); // false 为同步请求
    xmlHttp.send( null );
    if (xmlHttp.responseText !== 'null'){
        return xmlHttp.responseText.replace(/"/g, '');
    }
    else{
        return  null
    }
}


