'use client';
import { config } from "@/wagmi"
import { useReadContract, useWriteContract } from "wagmi"
import * as sancNftMinterInfo from '@/abi/SancNFTMinter.json'
import { readContract } from "wagmi/actions"
import { MINTER_CONTRACT_ADDRESS } from "@/data/contract_infos"
import { create, globSource } from 'kubo-rpc-client'
import { useEffect, useState } from "react";

export default function ProposeProposal(){

    const {writeContractAsync,data:hash,reset} = useWriteContract({config})
    const [cid,setCID]  = useState("")

    async function uploadFile(f:File) {
        const kubo = create()
        setCID((await kubo.add(f)).cid.toString())
    }
    
   async function propose(proposal:Proposal) {
        try{
            const txn = await writeContractAsync({
                address:MINTER_CONTRACT_ADDRESS,
                abi:sancNftMinterInfo.abi,
                functionName:"uploadProposal",
                args:[
                    0,//for now
                    proposal.name,
                    proposal.importAddress,
                    proposal.poolAmount,
                    proposal.deadline,
                    proposal.animalDetails,
                    proposal.minAmount    
                ]
            })
            reset()
            const lastProposalId = await readContract(config,{
                address:MINTER_CONTRACT_ADDRESS,
                abi:sancNftMinterInfo.abi,
                functionName:"getLastProposalOf",
                args:[0]
            })

            const nftTxn = await writeContractAsync({
                address:MINTER_CONTRACT_ADDRESS,
                abi:sancNftMinterInfo.abi,
                functionName:"setNftDetails",
                args:[
                    0,//for now
                    lastProposalId,
                    proposal.nftPhoto,
                    proposal.rarity,
                    proposal.description,
                    proposal.nftOpenPrice
                ]
            })
            console.log("Proposal Successfully Uploaded");
            
    
        }catch(e){

        }
        
        

    }

    return (<>
    
    </>)
}