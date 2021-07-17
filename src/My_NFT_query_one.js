import { useEffect, useState } from "react";
import { connectWallet, mintNFT,BuyNFT } from "./utils/interact.js";
import { InspectNFT } from "./utils/interact_Annoucement.js";
import { create } from 'ipfs-http-client';
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey); 
const BufferList = require('bl/BufferList')

const client = create('/ip4/127.0.0.1/tcp/5001')
const My_NFT_query_one = (props) => {

  const [status, setStatus] = useState("");
  

  const [haveResult, sethaveResult] = useState(false);
  const [NFT_ID_FOR_search, set_NFT_ID_FOR_search] = useState("");//id
  const [SearchResult,setSearchResult]=useState("");//查询结果
  const [SalePrice,setSalePrice]=useState("");//价格
  const [ResultMatedataCID,setResultMatedataCID]=useState("");//URI链接
  const [TotalNFT,setTotalNFT]=useState("");//当前NFT总量

  const [ThePriceAfterOwned,setThePriceAfterOwned]=useState("")
  const [ConnectedAccount, setConnectedAccount] = useState(``)
  const [Owner, setOwner] = useState(``)

  const [ResultName, updateResultName] = useState(``)
  const [ResultAssetCID, updateResultAssetCID] = useState(``)
  const [ResultDescription, updateResultDescription] = useState(``)
  const [displayPriceInputfile, setdisplayPriceInputfile] = useState(false)

  useEffect(async function RefreshMyNFTs_info(){
    onNFT_search_Pressed();
    const accounts = await window.ethereum.request({ method: "eth_accounts" })
      if (accounts.length) 
      { 
        setConnectedAccount(web3.utils.toChecksumAddress(accounts[0]));
        console.log("连接账号："+web3.utils.toChecksumAddress(accounts[0]))
      }

  },[]);

  const onNFT_search_Pressed = async () => 
  {
    const { success,SearchResult_,TheSalePrice_,MatedataCID_,TotalNFT_,Owner_} = await InspectNFT(props.ID);
    setSearchResult( SearchResult_ );
    setSalePrice(TheSalePrice_);
    setResultMatedataCID(MatedataCID_);
    setTotalNFT(TotalNFT_);
    sethaveResult(success);
    setOwner(Owner_);
    console.log("所有者："+Owner_)

    for await (const file of client.get(MatedataCID_)) 
    {
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

  const onBuyNFTButtonPressed = async () => {
    const { status } = await BuyNFT(NFT_ID_FOR_search, SalePrice,ThePriceAfterOwned);
    setStatus(status);
  };

  const onBuyNFTButtonPressed_before_setPrice = async () => {
    setdisplayPriceInputfile(!displayPriceInputfile);
  };

  return (
    //<div className="Minter">
    <div className="Minter">
          <h1 id="title">{"版权NFT号："+props.ID}</h1>
          <p id="status" style={{"whiteSpace":"pre"}} >{SearchResult}</p>
          <div>
            <p> {ResultName&&("名称: "+ResultName)} </p>
            <p> {ResultDescription&&("概述: "+ResultDescription)} </p>
            <p> {ResultAssetCID && ( <img src={`http://127.0.0.1:8080/ipfs/${ResultAssetCID}`} width="500px" />)} </p>
          </div>
  </div>




  );
};

export default My_NFT_query_one;
