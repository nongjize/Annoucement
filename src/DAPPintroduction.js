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
     <br></br>
     <br></br>
     <br></br>
      <p>
        如果您准备公布您的创意作品、文章、研究等成果，为防止成果被抄袭，您需要先找一个地方声明您的版权。。。。
      </p>
      <br></br>
      <p>
        在这里，通过简单的操作即可在“数据永不可篡改”的区块链上声明您的版权，还可以将您的版权作为NFT在区块链上标价拍卖转让。。。。。
      </p>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      
      <h2> {TotalNFTss&&("当前已经发布版权NFT一共: "+TotalNFTss+"枚 （一枚NFT表示一个版权）")} </h2>
    </div>
  );
};

export default DAPPintroduction;
