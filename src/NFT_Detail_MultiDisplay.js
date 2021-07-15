import { useEffect, useState } from "react";
import { connectWallet, mintNFT,BuyNFT } from "./utils/interact.js";
import { InspectNFT } from "./utils/interact_Annoucement.js";
import { create } from 'ipfs-http-client';
import NFT_query from './NFT_query';
import Popup from './utils/Popup';
const BufferList = require('bl/BufferList')

const client = create('/ip4/127.0.0.1/tcp/5001')
const NFT_Detail_MultiDisplay = (props) => {
  const [haveResult, sethaveResult] = useState(false);
  const [SearchResult,setSearchResult]=useState("");//查询结果
  const [SalePrice,setSalePrice]=useState("");//价格
  const [ResultMatedataCID,setResultMatedataCID]=useState("");//URI链接
  const [TotalNFT,setTotalNFT]=useState("");//当前NFT总量
  const [ResultName, updateResultName] = useState(``)
  const [ResultAssetCID, updateResultAssetCID] = useState(``)
  const [ResultDescription, updateResultDescription] = useState(``)//Owner
  //const [Owner, updateOwner] = useState(``)//Owner

  const [isInspectWindowOpen, setIsInspectWindowOpen] = useState(false);
  const toggleInspectPopup = () => { setIsInspectWindowOpen(!isInspectWindowOpen);}

  useEffect(async function RefreshMyNFTs_info() {onNFT_search_Pressed();},[] );

  const onNFT_search_Pressed = async () => 
  {
    const { success,TheSalePrice_,MatedataCID_,TotalNFT_} = await InspectNFT(props.ID);
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
      
    } 
  };
  //onNFT_search_Pressed();//
  return (
    <div >
      { 
        (!haveResult? ( <span>无</span>) : 
          (
          <div >
             <div onClick={toggleInspectPopup}>
              <p> {ResultName} </p>
              <p> { ResultAssetCID && ( <img src={`http://127.0.0.1:8080/ipfs/${ResultAssetCID}` } width="300px" />)} </p>
            </div>
            {isInspectWindowOpen && <Popup content={<NFT_query  ID={props.ID}/>} handleClose={toggleInspectPopup}/>}
          </div>
          )    
        ) 
      }
   </div>
  );
};

export default NFT_Detail_MultiDisplay;
