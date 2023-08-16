# leomail

Leo Mail - Decentralized Email Platform

You can use leo mail here : https://leomail.cc

Leo Mail is an innovative decentralized email platform built on the Aleo blockchain's privacy protocol. This unique email application provides users with a secure, private, and decentralized email communication experience, aiming to protect users' personal information and data privacy.

   
![image](https://github.com/footer123/leomail/assets/137860233/f23065dc-fbb9-4556-a28b-44296732b34b)


*The communication principle of Leo Mail involves converting the content of emails into UTF8 code and storing it on the Aleo network. The recipient can then decrypt the UTF8 code to obtain the actual content of the email. Due to Aleo's privacy policies, only the sender and recipient can access the true content of the emails. **As it is currently in the demo version, it only supports UTF8 characters, and the length of the email content cannot exceed 500 characters.***

**Key Features:**

 - Privacy Protection: Leo Mail prioritizes user privacy. Leveraging Aleo blockchain's privacy protocol and zero-knowledge proofs, all
   emails and attachments undergo strict encryption, ensuring that only
   the sender and ecipient can access their contents.
   
 - Decentralization: Running on the decentralized Aleo network, Leo Mail prevents any central authority from manipulating users' email   
   data. This means users have complete control over their email data   
   and identity, achieving a true decentralized email experience.

 - Secure Authentication: Leo Mail utilizes highly secure identity verification mechanisms, ensuring that only authorized users can   
   access and send emails. No need to worry about unauthorized access or
   identity impersonation risks.

 - User-Friendly: Designed with simplicity and intuitiveness, Leo Mail
   allows users to use the platform with ease. Whether for personal
   users or businesses, they can easily deploy Leo Mail for efficient
   email communication.
   



**Leo Mail, as a practical application, adds value to the Aleo Network's ecosystem. It attracts more users and developers to join the Aleo Network's community, providing tangible benefits and user experiences to a broader audience.**
    
By developing applications like Leo Mail, the Aleo Network can better promote and adopt its blockchain technology. These applications attract more attention to the Aleo Network and help people understand and recognize the practical value of blockchain technology in everyday life.**

# Core code

## Mappings:

  **account_msg_count**: *it records the msg index of address*
  
  `mapping account_msg_count: address => u64`
  
 **total_nft**: *key is ascii value  of domain + 100*
 
 `mapping total_nft: field => address`

  **treasury_store**: *store the treasury address* 
  
  `mapping treasury_store: u8 => address`

 **price_store**: *store the price list of nfts*
 
 `mapping price_store: u8 => u64`

**black_list_store**: *store the user's blcok list*

`mapping black_list_store: address => BlackList`

**mailbox_state_store** :*the mailbox state, 0u8: enable , 1u8:disable*

`mapping mailbox_state_store: address => u8`;

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

