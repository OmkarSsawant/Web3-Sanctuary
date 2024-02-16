import { config } from "@/wagmi"
import { useReadContract, useWriteContract } from "wagmi"
const MINER_CONTRACT_ADDRESS:`0x${string}` =`0x`
import * as sancNftMinterInfo from '@/abi/SancNFTMinter.json'
import { readContract } from "wagmi/actions"
function ProposeProposal(){

    const {writeContractAsync,data:hash,reset} = useWriteContract({config})

   async function propose(proposal:Proposal) {

    /*
  uint _sancId,
        string memory _name,
        string memory _importAddress,
        uint _poolAmount,
        uint _deadline,
        string memory _animalDetails,
        uint _minAmount
    */
        try{
            const txn = await writeContractAsync({
                address:MINER_CONTRACT_ADDRESS,
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
                address:MINER_CONTRACT_ADDRESS,
                abi:sancNftMinterInfo.abi,
                functionName:"getLastProposalOf",
                args:[0]
            })

            const nftTxn = await writeContractAsync({
                address:MINER_CONTRACT_ADDRESS,
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