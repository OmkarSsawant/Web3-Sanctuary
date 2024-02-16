import { useEffect, useState } from "react"
import { useAccount, useWriteContract } from "wagmi"
import * as sancNftMarketPlaceInfo from '@/abi/SancNFTMarketPlace.json'
import { config } from "@/wagmi"
import { readContract } from "wagmi/actions"
import { SANC_NFT_MARKET_PLACE_CONTRACT_ADDRESS } from "@/data/contract_infos"

export function UserNfts() {
    const [listedNfts,setListedNFTs] = useState<NftItem[]>([])
    const [unListedNfts,setUnListedNFTs] = useState<NftItem[]>([])
    const {writeContractAsync,data:hash,reset} = useWriteContract({config})

    useEffect(()=>{
        loadNfts()
    },[])


    async function unListNFT(nftItem:NftItem) {
        const txn =  await  writeContractAsync({
            address:SANC_NFT_MARKET_PLACE_CONTRACT_ADDRESS,
            abi:sancNftMarketPlaceInfo.abi,
            functionName:'unlist',
            args:[0,nftItem.NID]
          })
          console.log("Unlisted NFT",txn);
          loadNfts()
    }

    async function reList(nftItem:NftItem,newPrice:string) {
      const txn =  await  writeContractAsync({
        address:SANC_NFT_MARKET_PLACE_CONTRACT_ADDRESS,
        abi:sancNftMarketPlaceInfo.abi,
        functionName:'list',
        args:[0,nftItem.NID]
      })
      console.log("Relisted NFT",txn);
      loadNfts()
      
    }

    async function loadNfts(){
        const nfts:any = await readContract(config,{
            address:SANC_NFT_MARKET_PLACE_CONTRACT_ADDRESS,
            abi:sancNftMarketPlaceInfo.abi,
            functionName:"getNftItemsOfOwner",
            args:[0]
        })
        const lnfts:NftItem[]=[]
        const ulnfts:NftItem[]=[]
        for(var e of Array.from(nfts)){
          const nftItem = e as NftItem
            if(nftItem.listed){
                lnfts.push(nftItem)
            }else{
                ulnfts.push(nftItem)
            }
        }
        setListedNFTs(lnfts)
        setUnListedNFTs(ulnfts)
    }

    return (<></>)
}