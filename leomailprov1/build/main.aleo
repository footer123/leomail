import credits.aleo;
program leomailprov1.aleo;


struct UTF8T380:
    part1 as field;
    part2 as field;
    part3 as field;
    part4 as field;
    part5 as field;

struct UTF8T1520:
    part1 as UTF8T380;
    part2 as UTF8T380;
    part3 as UTF8T380;
    part4 as UTF8T380;

struct Mail:
    timestamp as u64;
    subject as UTF8T380;
    content as UTF8T1520;

struct PriceList:
    price3 as u64;
    price4 as u64;
    price5 as u64;
    price6 as u64;
    price7 as u64;
    price8 as u64;
    price_other as u64;

struct BlackList:
    black1 as address;
    black2 as address;
    black3 as address;
    black4 as address;
    black5 as address;

record Chat:
    owner as address.private;
    target as address.private;
    mail as Mail.private;
    msgid as u64.private;
    is_sender as boolean.private;

record NFT:
    owner as address.private;
    domain as field.private;
    data1 as field.private;
    data2 as field.private;

record Contact:
    owner as address.private;
    target as address.private;
    name as field.private;


mapping account_msg_count:
	key left as address.public;
	value right as u64.public;


mapping total_nft:
	key left as field.public;
	value right as address.public;


mapping treasury_store:
	key left as u8.public;
	value right as address.public;


mapping price_store:
	key left as u8.public;
	value right as u64.public;


mapping black_list_store:
	key left as address.public;
	value right as BlackList.public;


mapping mailbox_state_store:
	key left as address.public;
	value right as u8.public;

function init_base:
    input r0 as address.private;
    input r1 as PriceList.private;
    assert.eq self.caller aleo1xd2ta5syxj0n0q0347tejcsj95776tn8st5838pjn8fmrsfa5yzsnvj2h8;

    finalize r0 r1;

finalize init_base:
    input r0 as address.public;
    input r1 as PriceList.public;
    set r0 into treasury_store[0u8];
    set r1.price3 into price_store[3u8];
    set r1.price4 into price_store[4u8];
    set r1.price5 into price_store[5u8];
    set r1.price6 into price_store[6u8];
    set r1.price7 into price_store[7u8];
    set r1.price8 into price_store[8u8];
    set r1.price_other into price_store[9u8];


function set_black_list:
    input r0 as BlackList.private;

    finalize self.caller r0;

finalize set_black_list:
    input r0 as address.public;
    input r1 as BlackList.public;
    set r1 into black_list_store[r0];


function enable_mailbox:
    input r0 as address.private;
    assert.eq self.caller r0;

    finalize r0;

finalize enable_mailbox:
    input r0 as address.public;
    set 0u8 into mailbox_state_store[r0];


function disable_mailbox:
    input r0 as address.private;
    assert.eq self.caller r0;

    finalize r0;

finalize disable_mailbox:
    input r0 as address.public;
    set 1u8 into mailbox_state_store[r0];


closure get_domain_length:
    input r0 as field;
    gt r0 0field into r1;
    add 0u8 1u8 into r2;
    mul 0field 1000field into r3;
    add r3 999field into r4;
    ternary r1 r2 1u8 into r5;
    ternary r1 r4 0field into r6;
    gt r0 r6 into r7;
    add 1u8 1u8 into r8;
    mul r6 1000field into r9;
    add r9 999field into r10;
    ternary r7 r8 r5 into r11;
    ternary r7 r10 r6 into r12;
    gt r0 r12 into r13;
    add 2u8 1u8 into r14;
    mul r12 1000field into r15;
    add r15 999field into r16;
    ternary r13 r14 r11 into r17;
    ternary r13 r16 r12 into r18;
    gt r0 r18 into r19;
    add 3u8 1u8 into r20;
    mul r18 1000field into r21;
    add r21 999field into r22;
    ternary r19 r20 r17 into r23;
    ternary r19 r22 r18 into r24;
    gt r0 r24 into r25;
    add 4u8 1u8 into r26;
    mul r24 1000field into r27;
    add r27 999field into r28;
    ternary r25 r26 r23 into r29;
    ternary r25 r28 r24 into r30;
    gt r0 r30 into r31;
    add 5u8 1u8 into r32;
    mul r30 1000field into r33;
    add r33 999field into r34;
    ternary r31 r32 r29 into r35;
    ternary r31 r34 r30 into r36;
    gt r0 r36 into r37;
    add 6u8 1u8 into r38;
    mul r36 1000field into r39;
    add r39 999field into r40;
    ternary r37 r38 r35 into r41;
    ternary r37 r40 r36 into r42;
    gt r0 r42 into r43;
    add 7u8 1u8 into r44;
    mul r42 1000field into r45;
    add r45 999field into r46;
    ternary r43 r44 r41 into r47;
    ternary r43 r46 r42 into r48;
    gt r0 r48 into r49;
    add 8u8 1u8 into r50;
    mul r48 1000field into r51;
    add r51 999field into r52;
    ternary r49 r50 r47 into r53;
    ternary r49 r52 r48 into r54;
    output r53 as u8;


function mint_nft:
    input r0 as field.private;
    input r1 as credits.aleo/credits.record;
    input r2 as address.private;
    input r3 as u64.private;
    input r4 as u8.private;
    gt r4 2u8 into r5;
    assert.eq r5 true;
    call get_domain_length r0 into r6;
    assert.eq r6 r4;
    call credits.aleo/transfer_private r1 r2 r3 into r7 r8;
    cast self.caller r0 0field 0field into r9 as NFT.record;
    output r9 as NFT.record;

    finalize self.caller r0 r2 r3 r4;

finalize mint_nft:
    input r0 as address.public;
    input r1 as field.public;
    input r2 as address.public;
    input r3 as u64.public;
    input r4 as u8.public;
    get treasury_store[0u8] into r5;
    assert.eq r5 r2;
    get price_store[r4] into r6;
    gte r3 r6 into r7;
    assert.eq r7 true;
    contains total_nft[r1] into r8;
    not r8 into r9;
    assert.eq r9 true;
    set r0 into total_nft[r1];


function transfer_nft:
    input r0 as address.private;
    input r1 as NFT.record;
    cast r0 r1.domain r1.data1 r1.data2 into r2 as NFT.record;
    output r2 as NFT.record;

    finalize self.caller r0 r1.domain;

finalize transfer_nft:
    input r0 as address.public;
    input r1 as address.public;
    input r2 as field.public;
    contains total_nft[r2] into r3;
    assert.eq r3 true;
    set r1 into total_nft[r2];


function burn_nft_private:
    input r0 as NFT.record;
    assert.eq self.caller r0.owner;
    output true as boolean.private;

    finalize r0.domain;

finalize burn_nft_private:
    input r0 as field.public;
    remove total_nft[r0];


function add_contact:
    input r0 as address.private;
    input r1 as address.private;
    input r2 as field.private;
    assert.eq self.caller r0;
    assert.neq r1 r0;
    cast r0 r1 r2 into r3 as Contact.record;
    output r3 as Contact.record;


function update_contact:
    input r0 as Contact.record;
    input r1 as address.private;
    input r2 as field.private;
    cast r0.owner r1 r2 into r3 as Contact.record;
    output r3 as Contact.record;


function remove_contact:
    input r0 as Contact.record;
    assert.eq self.caller r0.owner;


function send_msg:
    input r0 as address.private;
    input r1 as address.private;
    input r2 as Mail.private;
    input r3 as u64.private;
    assert.eq self.caller r0;
    cast r0 r1 r2 r3 true into r4 as Chat.record;
    cast r1 r0 r2 r3 false into r5 as Chat.record;
    output r4 as Chat.record;
    output r5 as Chat.record;

    finalize r0 r1 r3;

finalize send_msg:
    input r0 as address.public;
    input r1 as address.public;
    input r2 as u64.public;
    get.or_use mailbox_state_store[r1] 0u8 into r3;
    assert.eq r3 0u8;
    get.or_use account_msg_count[r0] 0u64 into r4;
    add r4 1u64 into r5;
    assert.eq r2 r5;
    cast aleo1wa04hyxkymezl5zcqucp3h3zlm52r9p7xryuentel8s88xcv6sqst8wz2t aleo1wa04hyxkymezl5zcqucp3h3zlm52r9p7xryuentel8s88xcv6sqst8wz2t aleo1wa04hyxkymezl5zcqucp3h3zlm52r9p7xryuentel8s88xcv6sqst8wz2t aleo1wa04hyxkymezl5zcqucp3h3zlm52r9p7xryuentel8s88xcv6sqst8wz2t aleo1wa04hyxkymezl5zcqucp3h3zlm52r9p7xryuentel8s88xcv6sqst8wz2t into r6 as BlackList;
    get.or_use black_list_store[r1] r6 into r7;
    is.eq r7.black1 r0 into r8;
    is.eq r7.black2 r0 into r9;
    or r8 r9 into r10;
    is.eq r7.black3 r0 into r11;
    or r10 r11 into r12;
    is.eq r7.black4 r0 into r13;
    is.eq r7.black5 r0 into r14;
    or r13 r14 into r15;
    or r12 r15 into r16;
    assert.eq r16 false;
    set r2 into account_msg_count[r0];


function confirm_msg:
    input r0 as Chat.record;
    assert.eq self.caller r0.owner;
