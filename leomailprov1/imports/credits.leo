program credits.aleo {

    mapping account: address => u64;

    record credits {
        owner: address,
        microcredits: u64,
    }

    transition transfer_private(a1: credits, a2: address, a3: u64) -> (credits, credits) {
        let r1 : credits = credits{
            owner:a1.owner,
            microcredits:5u64,
        };
        let r2 : credits = credits{
            owner:a2,
            microcredits:5u64,
        };

        return (r1,r2);
    }



}