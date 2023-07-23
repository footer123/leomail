# leomail

Leo Mail - Decentralized Email Platform

You can use leo mail here : https://leomail.cc

Leo Mail is an innovative decentralized email platform built on the Aleo blockchain's privacy protocol. This unique email application provides users with a secure, private, and decentralized email communication experience, aiming to protect users' personal information and data privacy.

![image](https://github.com/footer123/leomail/assets/137860233/50396970-112c-4a7a-b79b-7a063b9675e7)
*The communication principle of Leo Mail involves converting the content of emails into ASCII code and storing it on the Aleo network. The recipient can then decrypt the ASCII code to obtain the actual content of the email. Due to Aleo's privacy policies, only the sender and recipient can access the true content of the emails. **As it is currently in the demo version, it only supports ASCII characters, and the length of the email content cannot exceed 150 characters.***

Here is the core code:

    /* Leo Code */
    // the email content
    struct Email {
	    timestamp:u64,
	    sub_one:field, // subject part1
	    sub_two:field, // subject part2
	    content_one:field, // content part1....
	    content_two:field,
	    content_three:field,
	    content_four:field,
	    content_five:field,
	    content_six:field, // content part6
    }
    // email record
    record chat{
	    owner:address,
	    target:address,
	    email:Email,
	    msgid:u64,
	    is_sender:bool,
    }

    transition sendmsg (sender:address,receive:address,email:Email,msgid:u64) -> (chat,chat) {
		assert_eq(self.caller,sender );
	    let sender_chat:chat = chat {
	    owner:sender,
	    target:receive,
	    email:email,
	    is_sender:true,
	    msgid:msgid,
	    };
	    
	    let receive_chat:chat = chat {
	    owner:receive,
	    target:sender,
	    email:email,
	    msgid:msgid,
	    is_sender:false,
    };
    
    return (sender_chat,receive_chat) then finalize(sender,msgid);
    }
    
    finalize sendmsg (sender:address,msgid:u64) {
	    let count:u64 = Mapping::get_or_use(account_msg_count,sender,0u64);
	    assert_eq(msgid, count+1u64);
	    Mapping::set(account_msg_count,sender,msgid);
    }


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
   

![image](https://github.com/footer123/leomail/assets/137860233/22d3281a-b2e0-4b5d-81f5-f5977c230f7d)



**Leo Mail, as a practical application, adds value to the Aleo Network's ecosystem. It attracts more users and developers to join the Aleo Network's community, providing tangible benefits and user experiences to a broader audience.**
    
By developing applications like Leo Mail, the Aleo Network can better promote and adopt its blockchain technology. These applications attract more attention to the Aleo Network and help people understand and recognize the practical value of blockchain technology in everyday life.**
