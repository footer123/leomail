program credits.aleo;

record credits:
    owner as address.private;
    microcredits as u64.private;


mapping account:
	key left as address.public;
	value right as u64.public;

function transfer_private:
    input r0 as credits.record;
    input r1 as address.private;
    input r2 as u64.private;
    cast r0.owner 5u64 into r3 as credits.record;
    cast r1 5u64 into r4 as credits.record;
    output r3 as credits.record;
    output r4 as credits.record;
