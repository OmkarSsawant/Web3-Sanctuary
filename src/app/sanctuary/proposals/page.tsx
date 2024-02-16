'use client'

import { config } from "@/wagmi"
import { useReadContract, useWriteContract } from "wagmi"

import { useEffect, useState } from "react"
import { readContract } from "wagmi/actions"
import * as sancNftMinterInfo from '@/abi/SancNFTMinter.json'
import { MINTER_CONTRACT_ADDRESS } from "@/data/contract_infos"
import Link from "next/link"
export default function SanctuaryProposals(){

    const [fundableProposals,setFundableProposals] = useState<Proposal[]>([])

    const {writeContractAsync,data:hash,reset} = useWriteContract({config})


    useEffect(()=>{
       loadProposals()
    },[])

    async function invest(proposal:Proposal,amount:string) {
        try{
            const txn = await writeContractAsync({
                address:MINTER_CONTRACT_ADDRESS,
                abi:sancNftMinterInfo.abi,
                functionName:"invest",
                args:[
                    0,//for now
                    proposal.PID 
                ],
                value: BigInt(parseFloat(amount) * (10**18))
            })
            
        }catch(e){}
    }
    
async function loadProposals() {
    const result:any = await readContract(config,{
        address:MINTER_CONTRACT_ADDRESS,
        abi :sancNftMinterInfo.abi ,
        functionName:"getFundableProposalsOf",
        args:[0]
    })
    
    let typed =Array.from(result).map<Proposal>((m)=>m as Proposal);
    setFundableProposals(typed)
}



return (<>
<Link href='/sanctuary/proposals/propose'>Upload Proposal</Link>
    {fundableProposals}
</>)


}

