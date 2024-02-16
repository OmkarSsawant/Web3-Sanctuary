'use client'

import { config } from "@/wagmi";
import { useEffect, useState } from "react";
import { readContract } from "wagmi/actions";
import * as sancNftMinterInfo from '@/abi/SancNFTMinter.json'
import { useWriteContract } from "wagmi";
import { MINER_CONTRACT_ADDRESS } from "@/data/contract_infos";
import Link from "next/link";

//TODO:Should direct transfer to dealer availed?
export default function SancDashboard(){
    const [totalFunds,setTotalFunds] = useState(0)
    const [commsionFunds,setCommisionFunds] = useState(0)
    const [donationFunds,setDonationFunds] = useState(0)
    const [fundedProposals,setCompletedProposals] = useState<Proposal[]>([])
    const {writeContractAsync,data:hash,reset} = useWriteContract({config})


    async function withdrawAllCrowdFunds() {
        const txn = await writeContractAsync({
            address:MINER_CONTRACT_ADDRESS,
            abi:sancNftMinterInfo.abi,
            functionName:"withdrawCrowFund",
            args:[0]})
            console.log(txn,"All Crowd Fund Withdrawed");
            
    }

   
    async function withdrawProposalGain(proposal:Proposal) {
        const txn = await writeContractAsync({
            address:MINER_CONTRACT_ADDRESS,
            abi:sancNftMinterInfo.abi,
            functionName:"withdrawProposalGain",
            args:[0,proposal.PID]})
            console.log(txn,`All Proposal  Fund Of ${proposal.name}  Withdrawed`);

    }

    useEffect(()=>{
        showFunds();
        loadCompletedProposals()
    },[]);

    async function  loadCompletedProposals() {
       const cps:any =  await readContract(config,
            {
                address:MINER_CONTRACT_ADDRESS,
                abi:sancNftMinterInfo.abi,
                functionName:'getComepletedProposalsOf',
                args:[0]
            }
        )
    let typed =Array.from(cps).map<Proposal>((m)=>m as Proposal);

        setCompletedProposals(typed)
    }

    async function showFunds() {
        try{
            const df = (await readContract(config,
                {
                    address:MINER_CONTRACT_ADDRESS,
                    abi:sancNftMinterInfo.abi,
                    functionName:'getCrowdFundOf',
                    args:[0]
                }
            ))as number
    
            const cf = (await readContract(config,
                {
                    address:MINER_CONTRACT_ADDRESS,
                    abi:sancNftMinterInfo.abi,
                    functionName:'getCommisionFundOf',
                    args:[0]
                }
            ))as number
            setTotalFunds((df+cf)/(10**18))
            setCommisionFunds(cf/(10**18))
            setDonationFunds(df/(10**18))
        }catch(e){
            console.error(e);
            console.log("only Access for Sanc Authorities");
            
        }
       
       
    }

    return (<>
    <Link href='/sanctuary/proposals'>Proposals</Link>
    {totalFunds},
    {commsionFunds},
    {donationFunds},
    {fundedProposals}
    </>)
}


