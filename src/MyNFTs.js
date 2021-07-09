import { useEffect, useState } from "react";
import { connectWallet, mintNFT,BuyNFT } from "./utils/interact.js";
import { InspectNFT } from "./utils/interact_Annoucement.js";
import { create } from 'ipfs-http-client';
import NFT_Detail_MultiDisplay from './NFT_Detail_MultiDisplay';
const BufferList = require('bl/BufferList')

const client = create('/ip4/127.0.0.1/tcp/5001')


const MyNFTs = (props) => {
  return (
    <div  class="wrapper">
      <NFT_Detail_MultiDisplay  ID={props.ID1}></NFT_Detail_MultiDisplay>
      <NFT_Detail_MultiDisplay  ID={props.ID2}></NFT_Detail_MultiDisplay>
      <NFT_Detail_MultiDisplay  ID={props.ID3}></NFT_Detail_MultiDisplay>
      <NFT_Detail_MultiDisplay  ID={props.ID4}></NFT_Detail_MultiDisplay>
      <NFT_Detail_MultiDisplay  ID={props.ID5}></NFT_Detail_MultiDisplay>
      <NFT_Detail_MultiDisplay  ID={props.ID6}></NFT_Detail_MultiDisplay>
    </div>
  );
};

export default MyNFTs;
