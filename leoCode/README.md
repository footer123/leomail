## Core Methods

 **init_base**  
 *Initialize the treasury and price list.*    
 
inputs  
`treasury`: 	*the treasury address*  
`price_list`: 	*the price list of domain nft*  

 outputs: *null*

    transition init_base (
        treasury:address,
        price_list:PriceList
    ) 

**set_black_list**  
*set user's blacklist*  

inputs   
`blacklist`: *the blacklists*    

 outputs: *null*
 
    transition set_black_list (blacklist:BlackList)

**enable_mailbox**  
*set the state of mailbox*   

inputs  
	`sender`: *the address will be enable*  
 
 outputs: *null*  

     transition enable_mailbox (sender:address)
**mint_nft**  
*mint domain nft,user can send mail with domain*

inputs  
	`domain`: *the domain will be init*  
	`payment`: *the payment of domain*  
	`treasury`: *the address of treasury*  
	`price`: *the price of domain*  
	`domain_length`: *domain length*  
 
 outputs  
 `NFT`:return the record of domain
 
    transition mint_nft (
    		domain:field,
    		payment:credits.leo/credits,
    		treasury: address,
    		price:u64,
    		domain_length:u8
		    ) -> NFT

**add_contact**  
*user can add contact by this* 

inputs  
	`sender`: *the caller*  
	`target`: *the address who will be add in sender's contact list*  
	`name`: *the name of target address*  
 
 outputs  
 `Contact`:return the record of contact

    transition add_contact(
		    sender:address,
		    target:address,
		    name:field
		    ) -> Contact


**send_msg**  
by this method,user can send mail to otherone.  

inputs  
	`sender`: *the sender address*  
	`receive`: *the target address who will receive the mail*  
	`mail`: *the mail content*  
	`msgid`: *the index of sender user's mail list*  
 
 outputs  
 `(Chat,Chat)`:return the record the sender and receiver

    transition send_msg (
    		sender:address,
    		receive:address,
    		mail:Mail,
    		msgid:u64
	    ) -> (Chat,Chat)
