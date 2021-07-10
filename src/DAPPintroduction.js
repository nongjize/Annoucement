import {  useState } from "react";
import NFT_Detail_MultiDisplay from './NFT_Detail_MultiDisplay';
import { TotalNFTs } from "./utils/interact_Annoucement.js";

const DAPPintroduction = (props) => {
  const [TotalNFTss, setTotalNFTss] = useState('');
  const RefreshNewestNFT = async () => {
    const {success,TotalNFT_}=await TotalNFTs();
    if (success&&parseInt(TotalNFT_)>=6)
    {
      setTotalNFTss(TotalNFT_);
    }
  }

  RefreshNewestNFT();
  return (
   <div className="Minter">
      <h1 id="title">发布声明</h1>
      <p>
        简介。。。。。。。。。。。。。。。。。。。。
      </p>
      <p> {TotalNFTss&&("目前共有NFT: "+TotalNFTss)} </p>
    </div>
  );
};

export default DAPPintroduction;
