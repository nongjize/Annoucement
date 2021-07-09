import { useEffect, useState } from "react";
import { connectWallet, mintNFT,BuyNFT } from "./utils/interact.js";
import { InspectNFT } from "./utils/interact_Annoucement.js";
import { create } from 'ipfs-http-client';
const BufferList = require('bl/BufferList')

const client = create('/ip4/127.0.0.1/tcp/5001')
const NFT_query = (props) => {

  const [status, setStatus] = useState("");
  

  const [haveResult, sethaveResult] = useState(false);
  const [NFT_ID_FOR_search, set_NFT_ID_FOR_search] = useState("");//id
  const [SearchResult,setSearchResult]=useState("");//查询结果
  const [SalePrice,setSalePrice]=useState("");//价格
  const [ResultMatedataCID,setResultMatedataCID]=useState("");//URI链接
  const [TotalNFT,setTotalNFT]=useState("");//当前NFT总量

  const [ThePriceAfterOwned,setThePriceAfterOwned]=useState("")

  const [ResultName, updateResultName] = useState(``)
  const [ResultAssetCID, updateResultAssetCID] = useState(``)
  const [ResultDescription, updateResultDescription] = useState(``)



  const onNFT_search_Pressed = async () => {
    const { success,SearchResult_,TheSalePrice_,MatedataCID_,TotalNFT_} = await InspectNFT(props.ID);
    setSearchResult( SearchResult_ );
    setSalePrice(TheSalePrice_);
    setResultMatedataCID(MatedataCID_);
    setTotalNFT(TotalNFT_);
    sethaveResult(success);

    for await (const file of client.get(MatedataCID_)) {
      console.log(file.path)

      const content = new BufferList()
      for await (const chunk of file.content) {
        content.append(chunk)
      }

      const strToObj = JSON.parse(content.toString())
      updateResultName(strToObj.name)
      updateResultAssetCID(strToObj.asset)
      updateResultDescription(strToObj.description)
    } };

  const onBuyNFTButtonPressed = async () => {
    const { status } = await BuyNFT(NFT_ID_FOR_search, SalePrice,ThePriceAfterOwned);
    setStatus(status);
  };
  onNFT_search_Pressed();

  return (
    //<div className="Minter">
    <div>
          <h1 id="title">{props.ID}</h1>
          <p id="status" style={{"whiteSpace":"pre"}} >{SearchResult}</p>
          <div>
            <p> {ResultName&&("名称: "+ResultName)} </p>
            <p> {ResultDescription&&("概述: "+ResultDescription)} </p>
            <p> { ResultAssetCID && ( <img src={`http://127.0.0.1:8080/ipfs/${ResultAssetCID}`} width="60px" />)} </p>
          </div>
          <div>
          {haveResult && 
          ((SalePrice==="0")? ( <span>此NFT不出售</span>) : 
            (
              <div>
                <input
                type="text"
                placeholder="The Price afer you owed,set zero means don't seal"
                onChange={(event) => setThePriceAfterOwned(event.target.value)}
              />
                <button id="ByuNFTButton" onClick={onBuyNFTButtonPressed}>Buy</button>
            </div>
            )    
          ) 
          }
          </div>
  </div>
  );
};

export default NFT_query;
