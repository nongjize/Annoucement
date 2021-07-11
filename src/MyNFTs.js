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
  //const  state=persons:[{name:'小仙女',age:'18'},{name:'小玉',age:'18'},{name:'家璇',age:'18'}]；
  let res = [];
  const numbers = [1, 2, 3, 4, 5];

  // useEffect(async () => { //TODO: implement
  //   if (window.ethereum) { //if Metamask installed
  //     try {
  //       const accounts = await window.ethereum.request({ method: "eth_accounts" }) //get Metamask wallet
  //       if (accounts.length) { //if a Metamask account is connected
  //         setConnectedStatus(true);
  //         setWallet(accounts[0]);
  //       } else {
  //         setConnectedStatus(false);
  //         setStatus("🦊 Connect to Metamask using the top right button.");
  //       }
  //     } catch {
  //       setConnectedStatus(false);
  //       setStatus(
  //         "🦊 Connect to Metamask using the top right button. " +
  //           walletAddress
  //       );
  //     }
  //   } 
  // });



  const RefreshMyNFTs_info = async () => {
    const {success,TotalNFT_}=await TotalNFTsOfAddress(walletAddress);
    if (success)
    {
      setTotalNFTss(TotalNFT_);
      const totalNFT_int=parseInt(TotalNFT_);
      var NFTs=new Array();
      //for(var i = 0; i<5; i++)
      //{
        //const {success_,TokenID_}=await TokenOfOwnerByIndex(walletAddress,parseInt(i));
        //if(success_)
        //{
        //  NFTs[i]=TokenID_;
        //}
        //console.log("2kkkkkkkkkkkkkkkkkkkkkkkkkk");
        //console.log(i);
      //}
      //console.log("oooooooo    nly  one");

      setNFT_arr(NFTs);
    }
  }

  RefreshMyNFTs_info();
  console.log("ffffffffffff  nly  one");
  const listItems = NFT_arr.map((number) =><li key={number.toString()}>{number}</li>);
  return (
    <div>
      <h1 id="title">{"我的(地址："+walletAddress+")NFT"}</h1>
      <p> {TotalNFTss&&("拥有NFT数量: "+TotalNFTss)} </p>
      <p>
     {listItems}
      </p>
    </div>
  );
};

export default MyNFTs;
