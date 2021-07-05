import { useEffect, useState } from "react";
import { connectWallet, mintNFT,BuyNFT } from "./utils/interact.js";
import { InspectNFT } from "./utils/interact_Annoucement.js";
import { create } from 'ipfs-http-client'

const client = create('/ip4/127.0.0.1/tcp/5001')
const Minter = (props) => {

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
  const [TokenURI,setTokenURI]=useState("");//URI链接
  const [TotalNFT,setTotalNFT]=useState("");//当前NFT总量

  const [ThePriceAfterOwned,setThePriceAfterOwned]=useState("")

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

  const onMintPressed = async () => {
    try {
    //make metadata
    const metadata = new Object();
     metadata.name = name;
     metadata.asset = AssetCID;
     metadata.description = description;
    
    //“FirstName”: “xu”,”LastName”,”Xiang”
      const added = await client.add(JSON.stringify(metadata))
      setMatedataCID(added.path)
      const { status } = await mintNFT(MatedataCID,MintPrice);
      setStatus(status);
    } catch (error) {
      console.log('Error At OnMintPressed: ', error)
    } 
  };


  

  const onNFT_search_Pressed = async () => {
    const { success,SearchResult_,TheSalePrice_,TokenUrI_,TotalNFT_} = await InspectNFT(NFT_ID_FOR_search);
    setSearchResult( SearchResult_ );
    setSalePrice(TheSalePrice_);
    setTokenURI(TokenUrI_);
    setTotalNFT(TotalNFT_);
    sethaveResult(success);
  };

  const onBuyNFTButtonPressed = async () => {
    const { status } = await BuyNFT(NFT_ID_FOR_search, SalePrice,ThePriceAfterOwned);
    setStatus(status);
  };

  return (
    <div className="Minter">

      <div>
          <button id="walletButton" onClick={connectWalletPressed}>
            {isConnected ? (
              "👛 Connected: " +
              String(walletAddress).substring(0, 6) +
              "..." +
              String(walletAddress).substring(38)
            ) : (
              <span>👛 Connect Wallet</span>
            )}
          </button>

          <h1 id="title">发布版权声明</h1>
          <p>
            Simply add your asset's link, name, and description, then press "Mint."
          </p>
          <form>
          
            <h2>文件上传</h2>
            <input
              type="file"
              onChange={onChange}
            />
            {AssetCID}
            <br />
            {
              fileUrl && (
                <img src={fileUrl} width="60px" />
              )
            }
          
            <h2>Name: </h2>
            <input
              type="text"
              placeholder="e.g. My first NFT!"
              onChange={(event) => setName(event.target.value)}
            />
            <h2>Description: </h2>
            <input
              type="text"
              placeholder="e.g. Even cooler than cryptokitties ;"
              onChange={(event) => setDescription(event.target.value)}
            />
            <h2>PriceInETH：</h2>
            <input
              type="text"
              placeholder="价格"
              onChange={(event) => setMintPrice(event.target.value)}
            />
          </form>
          <button id="mintButton" onClick={onMintPressed}>
            Mint NFT
          </button>
          {MatedataCID}
            <br />
          <p id="status">
            {status}
          </p>
      </div>
      
      <div >
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
          <p>
          {haveResult ? ((SalePrice==="0")? ( <span>此NFT不出售</span>) : (
              <button id="ByuNFTButton" onClick={onBuyNFTButtonPressed}>
              Buy
              </button>)
            ) : (
              <span>请输入ID浏览NFT</span>
            )}
          </p>
      </div>

    </div>
  );
};

export default Minter;
