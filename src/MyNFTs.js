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

  useEffect(async () => { //TODO: implement
    if (window.ethereum) { //if Metamask installed
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" }) //get Metamask wallet
        if (accounts.length) { //if a Metamask account is connected
          setConnectedStatus(true);
          setWallet(accounts[0]);
        } else {
          setConnectedStatus(false);
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      } catch {
        setConnectedStatus(false);
        setStatus(
          "🦊 Connect to Metamask using the top right button. " +
            walletAddress
        );
      }
    } 
  });



  const RefreshMyNFTs_info = async () => {
    const {success,TotalNFT_}=await TotalNFTsOfAddress(walletAddress);
    if (success)
    {
      setTotalNFTss(TotalNFT_);
      const totalNFT_int=parseInt(TotalNFT_);
      var NFTs=new Array();
      for(var i = 0; i <totalNFT_int; i++)
      {
        const {success_,TokenID_}=await TokenOfOwnerByIndex(walletAddress,parseInt(i));
        if(success_)
        {
          NFTs[i]=TokenID_;
        }
      }
      setNFT_arr(NFTs);
    }
  }

  RefreshMyNFTs_info();
  return (
    <div>
      <h1 id="title">{"我的(地址："+walletAddress+")NFT"}</h1>
      <p> {TotalNFTss&&("拥有NFT数量: "+TotalNFTss)} </p>
      <p>{NFT_arr&&( NFT_arr.forEach(element => { <p>{element}</p> }))}</p>
    </div>
  );
};

export default MyNFTs;
