import { useEffect, useState } from "react";
import { connectWallet, mintNFT,BuyNFT } from "./utils/interact.js";
import { InspectNFT } from "./utils/interact_Annoucement.js";
import { create } from 'ipfs-http-client';
import NFT_Detail_MultiDisplay from './NFT_Detail_MultiDisplay';
import { TotalNFTsOfAddress,TokenOfOwnerByIndex } from "./utils/interact_Annoucement.js";
import My_NFT_query_one from "./My_NFT_query_one.js";
const BufferList = require('bl/BufferList')

const client = create('/ip4/127.0.0.1/tcp/5001')


const MyNFTs = (props) => {
  const [TotalNFTss, setTotalNFTss] = useState('');
  const [isConnected, setConnectedStatus] = useState(false);
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [NFT_arr, setNFT_arr] = useState(new Array());
  
  useEffect( 
    async function RefreshMyNFTs_info() 
    {
      const accounts = await window.ethereum.request({ method: "eth_accounts" })
      if (accounts.length) 
      { 
        var NFTs=new Array();
        setWallet(accounts[0]);
        const {success,TotalNFT_}=await TotalNFTsOfAddress(accounts[0]);
         if (success)
         {
           setTotalNFTss(TotalNFT_);
           const totalNFT_int=parseInt(TotalNFT_);
           for(var i = 0; i<totalNFT_int; i++)
           {
              const {success_,TokenID_}=await TokenOfOwnerByIndex(accounts[0],parseInt(i));
              if(success_){NFTs[i]=TokenID_;}
           }
           setNFT_arr(NFTs);
        }
      } 
    },
    []
  );
//{NFT_arr.map((number) =><li key={number.toString()}>{number}</li>)}
  return (
    <div >{
      
      (walletAddress==="" ? <span>请连接钱包</span> :
        (<div >
          <h1 id="title">{"我的(地址："+walletAddress+")NFT"}</h1>
          <p> {TotalNFTss&&("拥有NFT数量: "+TotalNFTss)} </p>
          <p>{status}</p>
          {NFT_arr.map((number) =><My_NFT_query_one key={number.toString()}  ID={number.toString()}/>)}
        </div>)
      )
      
      }
     
    </div>
  );
};

export default MyNFTs;
