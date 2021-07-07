import { useEffect, useState } from "react";
import { connectWallet, mintNFT,BuyNFT } from "./utils/interact.js";
import { InspectNFT } from "./utils/interact_Annoucement.js";
import { create } from 'ipfs-http-client';
const BufferList = require('bl/BufferList')

const client = create('/ip4/127.0.0.1/tcp/5001')
const NFT_inspect = (props) => {

  //State variables
  const [isConnected, setConnectedStatus] = useState(false);
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [AssetCID, setAssetCID] = useState("");
  const [MatedataCID, setMatedataCID] = useState("");
  const [url, setURL] = useState("");
  const [MintPrice, setMintPrice] = useState("");

  const [haveResult, sethaveResult] = useState(false);
  const [NFT_ID_FOR_search, set_NFT_ID_FOR_search] = useState("");//id
  const [SearchResult,setSearchResult]=useState("");//查询结果
  const [SalePrice,setSalePrice]=useState("");//价格
  const [ResultMatedataCID,setResultMatedataCID]=useState("");//URI链接
  const [TotalNFT,setTotalNFT]=useState("");//当前NFT总量

  const [ThePriceAfterOwned,setThePriceAfterOwned]=useState("")

  
  const [MetadataContent, updateMetadataContent] = useState(``)

  const [ResultName, updateResultName] = useState(``)
  const [ResultAssetCID, updateResultAssetCID] = useState(``)
  const [ResultDescription, updateResultDescription] = useState(``)

  const [fileUrl, updateFileUrl] = useState(``)
  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(file)
      console.log('CID: ', added.cid)
      console.log('path: ', added.path)
      const url = `http://127.0.0.1:8080/ipfs/${added.path}`
      updateFileUrl(url)
      setAssetCID(added.path)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }


 
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

  const connectWalletPressed = async () => { //TODO: implement
    const walletResponse = await connectWallet();
    setConnectedStatus(walletResponse.connectedStatus);
    setStatus(walletResponse.status);
    if (isConnected) {
      setWallet(walletAddress);
    }
  };




  

  const onNFT_search_Pressed = async () => {
    const { success,SearchResult_,TheSalePrice_,MatedataCID_,TotalNFT_} = await InspectNFT(NFT_ID_FOR_search);
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
      //console.log(strToObj.name)
      //console.log(strToObj.asset)
      //console.log(strToObj.description)

      updateResultName(strToObj.name)
      updateResultAssetCID(strToObj.asset)
      updateResultDescription(strToObj.description)

      //updateMetadataContent(content.toString());
    }

    //updateMetadataContent(Buffer.concat(chunks).toString());


  };

  const onBuyNFTButtonPressed = async () => {
    const { status } = await BuyNFT(NFT_ID_FOR_search, SalePrice,ThePriceAfterOwned);
    setStatus(status);
  };

  return (
    <div className="Minter">
      
      
          <h1 id="title">Inspect NFT</h1>
          <p>
            input the id of the NFT you want to inspect,if it exit,it well return the owner,sale price, access IPFS(the degist)
          </p>
          <form>
            <h2>NFT ID: </h2>
            <input
              type="text"
              placeholder="34"
              onChange={(event) => set_NFT_ID_FOR_search(event.target.value)}
            />
          </form>
          <button id="mintButton" onClick={onNFT_search_Pressed}>
            TO Inspect NFT
          </button>
          <p id="status" style={{"white-space":"pre"}} >{SearchResult}</p>
            {
              <div>
              <p> {ResultName&&("名称: "+ResultName)} </p>
              <p> {ResultDescription&&("概述: "+ResultDescription)} </p>
              <p> { ResultAssetCID && ( <img src={`http://127.0.0.1:8080/ipfs/${ResultAssetCID}`} width="60px" />)} </p>
              </div>
            }
          <div>
          {haveResult ? ((SalePrice==="0")? ( <span>此NFT不出售</span>) : (
            <div>
              <input
               type="text"
               placeholder="The Price afer you owed,set zero means don't seal"
               onChange={(event) => setThePriceAfterOwned(event.target.value)}
             />
              <button id="ByuNFTButton" onClick={onBuyNFTButtonPressed}>
              Buy
              </button>

          </div>
              )
              
            ) : (
              <span>请输入ID浏览NFT</span>
            )}
          </div>
      

    </div>
  );
};

export default NFT_inspect;
