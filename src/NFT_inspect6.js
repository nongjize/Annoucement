import {  useEffect,useState } from "react";
import NFT_Detail_MultiDisplay from './NFT_Detail_MultiDisplay';
import { TotalNFTs } from "./utils/interact_Annoucement.js";
const NFT_inspect6 = (props) => {
  const [TotalNFTss, setTotalNFTss] = useState('');

  useEffect(async function RefreshMyNFTs_info(){RefreshNewestNFT();},[TotalNFTss]);

  const RefreshNewestNFT = async () => {
    const {success,TotalNFT_}=await TotalNFTs();
    if (success&&parseInt(TotalNFT_)>=6)
    {
      setTotalNFTss(TotalNFT_);
    }
  }

  return (
    <div>
      {TotalNFTss&&
        <div  className="wrapper">
          {<NFT_Detail_MultiDisplay  ID={TotalNFTss}/>}
          {<NFT_Detail_MultiDisplay  ID={(parseInt(TotalNFTss)-1).toString()}/>}
          {<NFT_Detail_MultiDisplay  ID={(parseInt(TotalNFTss)-2).toString()}/>}
          {<NFT_Detail_MultiDisplay  ID={(parseInt(TotalNFTss)-3).toString()}/>}
          {<NFT_Detail_MultiDisplay  ID={(parseInt(TotalNFTss)-4).toString()}/>}
          {<NFT_Detail_MultiDisplay  ID={(parseInt(TotalNFTss)-5).toString()}/>}
        </div>
      }
    </div>
  );
};

export default NFT_inspect6;
