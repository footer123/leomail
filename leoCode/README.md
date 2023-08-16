## Usage

**Install snarkOS**  
*detail: https://developer.aleo.org/testnet/getting_started/deploy_execute*

    git clone https://github.com/AleoHQ/snarkOS.git  
    cd snarkOS  
    git checkout testnet3  
    cargo install --path .

**Execute**  
*eg: enable_mailbox*
```
snarkos developer execute "leomailprov1.aleo" "enable_mailbox" "${your_address}" --private-key "${your_privateKey}" --query "https://vm.aleo.org/api" --broadcast "https://vm.aleo.org/api/testnet3/transaction/broadcast" --fee 1000000 --record "${RECORD}"
```

## Structs:

    // the maximum length of field is 76,
    // We use 75 of those digits to store data. Every 3 digitsrepresent a UTF-8 value,
    // so each "field" type can store up to 25 characters.
    // Since some characters have a UTF-8 value less than 100, resulting in a mismatch in 		length, 		  
    //we add 100 to each UTF-8 value.
    // for example: the utf8 code of 'Hello' was '72 101 108 108 111', We plus 100 to every value
    // so we store '172 201 208 208 211' into UTF8T380 
    // UTF8T380 means 76*5=380
    
    struct UTF8T380 {
        part1:field,
        part2:field,
        part3:field,
        part4:field,
        part5:field,
    }

    // 4 times UTF8T380 = 1520
    struct UTF8T1520 {
        part1:UTF8T380,
        part2:UTF8T380,
        part3:UTF8T380,
        part4:UTF8T380,
    }
    // the mail content
    struct Mail {
        timestamp:u64,
        subject:UTF8T380,
        content:UTF8T1520,
    }
	// the price list of domain
    struct PriceList {
        price3:u64,  // 3 digits
        price4:u64,  // 4 digits
        price5:u64,  // 5 digits
        price6:u64,  // 6 digits
        price7:u64,  // 7 digits
        price8:u64,  // 8 digits
        price_other:u64 // others
    }
	// the user's blacklist
    struct BlackList {
        black1:address,
        black2:address,
        black3:address,
        black4:address,
        black5:address,
    }

## Record  

**Chat**    
*This is the email record. Each record contains the sender and the recipient.*


    record Chat{
	    owner:address,
	    target:address,
	    mail:Mail,
	    msgid:u64,
	    is_sender:bool,
    
    }

  
  **Domain NFT**  
  *after user mint domain nft, we can get the value from mapping **total_nft***


    record NFT {
	    owner:address,
	    domain:field,
	    data1:field,
	    data2:field,
    }

  **Contact**  
*the user's contact record, we can get the contact list from record list*

    record Contact {
	    owner: address,
	    target:address,
	    name:field,
    }



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
