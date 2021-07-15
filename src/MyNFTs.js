import { useEffect, useState } from "react";
import { connectWallet, mintNFT,BuyNFT } from "./utils/interact.js";
import { InspectNFT } from "./utils/interact_Annoucement.js";
import { create } from 'ipfs-http-client';
import NFT_Detail_MultiDisplay from './NFT_Detail_MultiDisplay';
import { TotalNFTsOfAddress,TokenOfOwnerByIndex } from "./utils/interact_Annoucement.js";
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
      const accounts = await window.ethereum.request({ method: "eth_accounts" }) //get Metamask wallet
      if (accounts.length) { 
        var NFTs=new Array();
        setWallet(accounts[0]);
        console.log("mmmmmmmmmmmmmmmmmmmyyyyyyyyyyyyyyy:"+accounts[0]);
        const {success,TotalNFT_}=await TotalNFTsOfAddress(accounts[0]);
         if (success)
         {
           setTotalNFTss(TotalNFT_);
          const totalNFT_int=parseInt(TotalNFT_);
         
         for(var i = 0; i<totalNFT_int; i++)
         {
           const {success_,TokenID_}=await TokenOfOwnerByIndex(accounts[0],parseInt(i));
           if(success_)
           {
             NFTs[i]=TokenID_;
           }
           console.log("2kkkkkkkkkkkkkkkkkkkkkkkkkk：：："+NFTs[i]);
         }
        setNFT_arr(NFTs);
        }
      } 
    },
    []
  );

  //const listItems = ;
  return (
    <div >
      <h1 id="title">{"我的(地址："+walletAddress+")NFT"}</h1>
      <p> {TotalNFTss&&("拥有NFT数量: "+TotalNFTss)} </p>
      <p>{status}</p>
      <p>
     {NFT_arr.map((number) =><li key={number.toString()}>{number}</li>)}
      </p>
    </div>
  );
};

export default MyNFTs;
