import { useReadContract, useWriteContract } from "wagmi";
import * as sancNftMarketPlaceInfo from '@/abi/SancNFTMarketPlace.json'
import { useEffect, useState } from "react";
import { readContract } from "wagmi/actions";
import { config } from "@/wagmi";
import { SANC_NFT_MARKET_PLACE_CONTRACT_ADDRESS } from "@/data/contract_infos";

export default function SancNFTMarketPlace(){
    const [nftItems,setNftItems] = useState<NftItem[]>([])
    const {writeContractAsync,data:hash,reset} = useWriteContract({config})

    useEffect(()=>{
        loadNfts()
    },[])

    async function buy(item:NftItem,amount:string){
       const txn = await writeContractAsync({
            address:SANC_NFT_MARKET_PLACE_CONTRACT_ADDRESS,
            abi:sancNftMarketPlaceInfo.abi,
            functionName:"buy",
            args:[0,item.NID],
            value: BigInt(parseFloat(amount) * (10**18))
        })
        console.log(txn,"NFT");
    }

    async function loadNfts(){
        const nfts:any = await readContract(config,{
            address:SANC_NFT_MARKET_PLACE_CONTRACT_ADDRESS,
            abi:sancNftMarketPlaceInfo.abi,
            functionName:"getListedNFTsOfSanctuary",
            args:[0]
        })
       const typed = Array.from(nfts).map((it)=> it as NftItem )
        setNftItems(typed)
    }

    return (<>{nftItems}</>)
}