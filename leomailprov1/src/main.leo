import credits.leo;

program leomailprov1.aleo {

    // it records the msg index of address
    mapping account_msg_count: address => u64;
    // nft address,  nft.locatl -> address
    mapping total_nft: field => address;
    // the treasury address and price list
    mapping treasury_store: u8 => address;
    // store the price list of nfts
    mapping price_store: u8 => u64;
    // store the user's blcok list
    mapping black_list_store: address => BlackList;
    // the mailbox state, 0u8: enable , 1u8:disable
    mapping mailbox_state_store: address => u8;

    // the maximum length of field is 76,
    // UTF8T380 means 76*5=380, maximum length is 380，but we don't need the last digits of each field
    // so the max number char is 76/3=25, (3 digits means a utf8 value) 
    // the maximum length of UTF8T380 is (25 * 5parts)=125
    // it is the utf8 code,Decimal value + 100, 
    // for example: the utf8 code of 'Hello' was '72 101 108 108 111', We plus 100 to every value
    // so the UTF8T380 code is '172 201 208 208 211'
    struct UTF8T380 {
        part1:field,
        part2:field,
        part3:field,
        part4:field,
        part5:field,
    }

    // 4 times UTF8T380 = 1520,maximum length is 1520/3=506
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

    struct PriceList {
        price3:u64,
        price4:u64,
        price5:u64,
        price6:u64,
        price7:u64,
        price8:u64,
        price_other:u64
    }

    struct BlackList {
        black1:address,
        black2:address,
        black3:address,
        black4:address,
        black5:address,
    }
    // mail record
    record Chat{
        owner:address, 
        target:address,
        mail:Mail,
        msgid:u64,
        is_sender:bool,
    }


    // nft record
    record NFT {
        owner:address,
        domain:field,
        data1:field,
        data2:field,
    }

    record Contact {
        owner: address,
        target:address,
        name:field,
    }
 
    transition init_base (
        treasury:address,
        price_list:PriceList
        ) {
        assert_eq(self.caller,aleo1xd2ta5syxj0n0q0347tejcsj95776tn8st5838pjn8fmrsfa5yzsnvj2h8);
        return then finalize(treasury,price_list);
    }
    finalize init_base (
        treasury:address,
        price_list:PriceList
        ) {
        treasury_store.set(0u8,treasury);
        price_store.set(3u8,price_list.price3);
        price_store.set(4u8,price_list.price4);
        price_store.set(5u8,price_list.price5);
        price_store.set(6u8,price_list.price6);
        price_store.set(7u8,price_list.price7);
        price_store.set(8u8,price_list.price8);
        price_store.set(9u8,price_list.price_other);
    }

    transition set_black_list (blacklist:BlackList) {
        return then finalize(self.caller,blacklist);
    }
    finalize set_black_list (sender:address,blacklist:BlackList) {
        black_list_store.set(sender,blacklist);
    }

    transition enable_mailbox (sender:address) {
        assert_eq(self.caller, sender);
        return then finalize(sender);
    }
    finalize enable_mailbox (sender:address) {
        mailbox_state_store.set(sender,0u8);
    }

    transition disable_mailbox (sender:address) {
        assert_eq(self.caller, sender);
        return then finalize(sender);
    }
    finalize disable_mailbox (sender:address) {
        mailbox_state_store.set(sender,1u8);
    }




    // NFT moudule
    transition mint_nft (
        domain:field,
        payment:credits.leo/credits,
        treasury: address,
        price:u64,
        domain_length:u8
        ) -> NFT {
            
        assert(domain_length > 2u8);

        let length : u8 = get_domain_length(domain);
        assert_eq(length,domain_length );
        
        let (out_treasury,out_buyer): (credits, credits) 
            = credits.leo/transfer_private(
                payment,
                treasury,
                price
            );

        let new_nft : NFT = NFT {
            owner:self.caller,
            domain:domain,
            data1:0field,
            data2:0field,
        };

        return new_nft then finalize(
            self.caller,
            domain,
            treasury,
            price,
            domain_length);
    }

    finalize mint_nft (
        owner:address,
        domain:field,
        treasury:address,
        price:u64,
        domain_length:u8
        ) {

        let local_treasury:address = treasury_store.get(0u8);
        assert_eq(local_treasury, treasury);

        let local_price:u64 = price_store.get(domain_length);
        assert(price >= local_price);

        let is_exist:bool = total_nft.contains(domain);
        assert(!is_exist);

        total_nft.set(domain,owner);
    }

    function get_domain_length (domain:field) -> u8 {
        let temp:field = 0field;
        let length:u8=1u8;

        for i: u8 in 0u8..9u8 {
            if(domain>temp){
                length = i+1u8;
                temp = (temp * 1000field) + 999field;
            }
        }
        return length;
    }

    transition transfer_nft (
        to:address,
        data:NFT
        ) -> NFT {

        return NFT {
            owner: to,
            domain:data.domain,
            data1:data.data1,
            data2:data.data2,
        } then finalize(self.caller,to,data.domain);
    }

    finalize transfer_nft (
        from:address,
        to:address,
        domain:field
        ) {

        let is_exist:bool = total_nft.contains(domain);
        assert(is_exist);

        total_nft.set(domain,to);
    }

    transition burn_nft_private (nftdata:NFT)-> bool {
        assert_eq(self.caller,nftdata.owner);
        return true then finalize(nftdata.domain);
    }

    finalize burn_nft_private (domain:field) {
        total_nft.remove(domain);
    }


    transition add_contact(
        sender:address,
        target:address,
        name:field
        ) -> Contact {
        assert_eq(self.caller,sender );
        assert_neq(target,sender );
        let new_contact:Contact = Contact{
            owner:sender,
            target:target,
            name:name,
        };
        
        return new_contact;
    }

    transition update_contact (
        old:Contact,
        new_target:address,
        new_name:field) -> Contact {
        return Contact {
            owner:old.owner,
            target:new_target,
            name:new_name,
        };
    }

    transition remove_contact(target:Contact){
        assert_eq(self.caller,target.owner );
    }
    

    transition send_msg (
        sender:address,
        receive:address,
        mail:Mail,
        msgid:u64
        ) -> (Chat,Chat) {
        
        assert_eq(self.caller,sender );
        let sender_chat:Chat = Chat {
            owner:sender,
            target:receive,
            mail:mail,
            is_sender:true,
            msgid:msgid,
        };

        let receive_chat:Chat = Chat {
            owner:receive,
            target:sender,
            mail:mail,
            msgid:msgid,
            is_sender:false,
        };

        return (sender_chat,receive_chat) 
                then finalize(sender,receive,msgid);
    }

    finalize send_msg (
        sender:address,
        target:address,
        msgid:u64
        ) {
        let state:u8= mailbox_state_store.get_or_use(sender,0u8);
        assert_eq(state,0u8);
        let count:u64 = account_msg_count.get_or_use(sender,0u64);
        assert_eq(msgid, count+1u64);
        //let default_address:address = BHP256::hash_to_address(1u8);
        let black_list : BlackList = black_list_store.get_or_use(target,BlackList{
            black1:aleo1wa04hyxkymezl5zcqucp3h3zlm52r9p7xryuentel8s88xcv6sqst8wz2t,
            black2:aleo1wa04hyxkymezl5zcqucp3h3zlm52r9p7xryuentel8s88xcv6sqst8wz2t,
            black3:aleo1wa04hyxkymezl5zcqucp3h3zlm52r9p7xryuentel8s88xcv6sqst8wz2t,
            black4:aleo1wa04hyxkymezl5zcqucp3h3zlm52r9p7xryuentel8s88xcv6sqst8wz2t,
            black5:aleo1wa04hyxkymezl5zcqucp3h3zlm52r9p7xryuentel8s88xcv6sqst8wz2t,
        });

        let isblacking :bool = 
            black_list.black1.eq(sender).or(
            black_list.black2.eq(sender)).or(
            black_list.black3.eq(sender)).or(
            black_list.black4.eq(sender).or(
            black_list.black5.eq(sender)));
            
        assert_eq(isblacking, false);
        account_msg_count.set(sender,msgid);
    }

   


    transition confirm_msg (content:Chat) {
        assert_eq(self.caller, content.owner);
    }

}