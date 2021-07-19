import { useEffect, useState } from "react";
import { connectWallet, mintNFT,BuyNFT } from "./utils/interact.js";
import { InspectNFT } from "./utils/interact_Annoucement.js";
import { create } from 'ipfs-http-client';
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey); 
const BufferList = require('bl/BufferList')

const client = create('/ip4/127.0.0.1/tcp/5001')
const NFT_query = (props) => {

  const [status, setStatus] = useState("");
  

  const [haveResult, sethaveResult] = useState(false);
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
  const [IsInstallMetaMask,setIsInstallMetaMask] = useState(false);
  const [isConnected, setConnectedStatus] = useState(false);
  const [walletAddress, setWallet] = useState("");//BuyNFTButtonPressed
  const [BuyNFTButtonPressed, setBuyNFTButtonPressed] = useState(false);

  useEffect(async function RefreshMyNFTs_info(){
    if(window.ethereum){//已安装metaMask
      setIsInstallMetaMask(true);
      try 
      {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length) 
        { 
        setConnectedStatus(true);
        setWallet(web3.utils.toChecksumAddress(accounts[0]));
        setConnectedAccount(web3.utils.toChecksumAddress(accounts[0]));
        }
        else 
        {
          setConnectedStatus(false);
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      }        
      catch 
      {
        setConnectedStatus(false);
        setStatus(
          "🦊 Connect to Metamask using the top right button. " +
            walletAddress
        );
      }
    }else//没有安装MetaMask
    {
      setIsInstallMetaMask(false);
    }
    

    onNFT_search_Pressed();
    

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
    //console.log("所有者："+Owner_)

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
    setBuyNFTButtonPressed(true);
    setStatus("购买中...请在metamask钱包中确认支付（包含区块链交易手续费金额）");
    const { status } = await BuyNFT(props.ID, SalePrice,ThePriceAfterOwned);
    setStatus(status);
  };

  const onBuyNFTButtonPressed_before_setPrice = async () => {

    setdisplayPriceInputfile(!displayPriceInputfile);
  };

  return (
    <div className="Minter">
      <div>
          {haveResult && 
          ((ConnectedAccount===Owner)?(<span>【该NFT为本账号所拥有】</span>) : 
            ((SalePrice==="0")? ( <span>【此NFT为非售状态】</span>):
            BuyNFTButtonPressed?(<span>{status}</span>):
             (
                <div>
                  <button  onClick={onBuyNFTButtonPressed_before_setPrice}>Buy</button>
                  {
                    displayPriceInputfile&&(
                      (!IsInstallMetaMask)? ( <span>没有检测到metamask,安装metamask钱包</span>):
                      !isConnected?(<span>{status}</span>):
                      
                      (
                        <div id="mainBodyer">
                         <div className="one">
                            <p>设置购买后价格(单位ETH)</p>
                            <p>设置为0表示购买后不出售(默认为0)</p>
                         </div> 
                         <div className="two"> <input id="leftBodyer"  type="text" placeholder="在此输入购买后的价格" onChange={(event) => setThePriceAfterOwned(event.target.value)}/>
                          <button  onClick={onBuyNFTButtonPressed}>确认购买</button> </div> 
                        </div>
                        )
                    )
                  }
                </div>
              ) 
             ) 
          ) 
          }
      </div>
      <h1 id="title">{"版权NFT号："+props.ID}</h1>
      <p id="status" style={{"whiteSpace":"pre"}} >{SearchResult}</p>
      <div>
        <p> {ResultName&&("名称: "+ResultName)} </p>
        <p> {ResultDescription&&("概述: "+ResultDescription)} </p>
        <p> { ResultAssetCID && ( <img src={`http://127.0.0.1:8080/ipfs/${ResultAssetCID}`} width="500px" />)} </p>
      </div>
    </div>
  );
};

export default NFT_query;
