'use client'

import { MINER_CONTRACT_ADDRESS } from "@/data/contract_infos";
import { config } from "@/wagmi";
import { useRouter } from "next/router";
import { useWriteContract } from "wagmi";
import * as sancNftMinterInfo from '@/abi/SancNFTMinter.json'

export default function SanctuaryInfo({params}:{params:{slug:string}}){

    const {writeContractAsync,data:hash,reset} = useWriteContract({config})

    async function donate(amount:string) {
        console.log("Successfully Donated!",parseFloat(amount) * (10**18));

        const txn = await writeContractAsync({
            address:MINER_CONTRACT_ADDRESS,
            abi:sancNftMinterInfo.abi,
            functionName:"crowdFund",
            args:[
                parseInt(params.slug),//for now
            ],
            value: BigInt(parseFloat(amount) * (10**18))
        })
        console.log("Successfully Donated!",parseFloat(amount) * (10**18));
        
    }

    return (<>
    Info About Sanctuary[{params.slug}]
    <button onClick={ev=>{ev.preventDefault();donate("0.01")}}> Donate </button>
    </>)
}