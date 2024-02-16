import { config } from "@/wagmi"
import { useReadContract, useWriteContract } from "wagmi"
const SANC_NFT_MARKET_PLACE_CONTRACT_ADDRESS:`0x${string}` =`0x`
import * as sancNftMarketPlaceInfo from '@/abi/SancNFTMarketPlace.json'
import { useEffect, useState } from "react"
import { readContract } from "wagmi/actions"

function SanctuaryProposals(){

    const [fundableProposals,setFundableProposals] = useState<Proposal[]>([])

    const {writeContractAsync,data:hash,reset} = useWriteContract({config})


    useEffect(()=>{
       loadProposals()
    },[])

    async function invest(proposal:Proposal,amount:string) {
        try{
            const txn = await writeContractAsync({
                address:SANC_NFT_MARKET_PLACE_CONTRACT_ADDRESS,
                abi:sancNftMarketPlaceInfo.abi,
                functionName:"invest",
                args:[
                    0,//for now
                    proposal.PID 
                ],
                value: BigInt(parseFloat(amount) * 10^18)
            })
            
        }catch(e){}
    }
    
async function loadProposals() {
    const result:any = await readContract(config,{
        address:SANC_NFT_MARKET_PLACE_CONTRACT_ADDRESS,
        abi :sancNftMarketPlaceInfo.abi ,
        functionName:"getFundableProposalsOf",
        args:[0]
    })
    
    let typed =Array.from(result).map<Proposal>((m)=>m as Proposal);
    setFundableProposals(typed)
}



return (<>
    {fundableProposals}
</>)


}

