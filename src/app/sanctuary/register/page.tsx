'use client'

import { MINTER_CONTRACT_ADDRESS } from "@/data/contract_infos";
import { config } from "@/wagmi";
import { useRouter } from "next/router";
import { useWriteContract } from "wagmi";
import * as sancNftMinterInfo from '@/abi/SancNFTMinter.json'

export default function RegisterSanctuary(){

    const {writeContractAsync,data:hash,reset} = useWriteContract({config})

    async function registerSanctuary(
         paymentsAccount:string,approvedProposers:string[],name:string, adr:string
    ) {

        const txn = await writeContractAsync({
            address:MINTER_CONTRACT_ADDRESS,
            abi:sancNftMinterInfo.abi,
            functionName:"registerSanctuary",
            args:[
               paymentsAccount,
               approvedProposers,
               name,
               adr
            ],
        })
        console.log(txn,'Sanctuary Registered');
        
        
    }

    return (<>
        
    </>)
}