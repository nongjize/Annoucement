import { useEffect, useState } from "react";
import { connectWallet, mintNFT,BuyNFT } from "./utils/interact.js";
import { InspectNFT , MintTimeAndBlocknumber} from "./utils/interact_Annoucement.js";
import { create } from 'ipfs-http-client';

const ipfs_gateway = process.env.REACT_APP_IPFS_GATEWAY;
const ipfs_api = process.env.REACT_APP_IPFS_API;

const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey); 
const BufferList = require('bl/BufferList')

const client = create(ipfs_api)
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
  const [mintTimeBlocknumber,setmintTimeBlocknumber]=useState("");//MintTimeAndBlocknumber
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
    const {MintTimestamp_,logs_,MintBlockNumber_}= await MintTimeAndBlocknumber(web3.utils.padLeft(web3.utils.toHex(props.ID), 64));
    //console.log(web3.utils.padLeft(web3.utils.toHex(props.ID), 64))
    // console.log("===========================================================");
    // console.log(MintBlockNumber_);
    // console.log(MintTimestamp_);
    // console.log(logs_);
    // console.log("===========================================================");
    setmintTimeBlocknumber("登记确认区块高度："+MintBlockNumber_+" 登记确认时间："+ dateFormat(MintTimestamp_*1000));

 
function dateFormat (time, format) {
  const t = new Date(time)
  // 日期格式
  format = format || 'Y-m-d h:i:s'
  let year = t.getFullYear()
  // 由于 getMonth 返回值会比正常月份小 1
  let month = t.getMonth() + 1
  let day = t.getDate()
  let hours = t.getHours()
  let minutes = t.getMinutes()
  let seconds = t.getSeconds()

  const hash = {
    'y': year,
    'm': month,
    'd': day,
    'h': hours,
    'i': minutes,
    's': seconds
  }
  // 是否补 0
  const isAddZero = (o) => {
    return /M|D|H|I|S/.test(o)
  }
  return format.replace(/\w/g, o => {
    let rt = hash[o.toLocaleLowerCase()]
    return rt > 10 || !isAddZero(o) ? rt : `0${rt}`
  })
}

    function formatDate(now) { 
      var year=now.getFullYear();  //取得4位数的年份
      var month=now.getMonth()+1;  //取得日期中的月份，其中0表示1月，11表示12月
      var date=now.getDate();      //返回日期月份中的天数（1到31）
      var hour=now.getHours();     //返回日期中的小时数（0到23）
      var minute=now.getMinutes(); //返回日期中的分钟数（0到59）
      var second=now.getSeconds(); //返回日期中的秒数（0到59）
      return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second; 
      } 

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
                  <button  onClick={onBuyNFTButtonPressed_before_setPrice}>购买</button>
                  {
                    displayPriceInputfile&&(
                      (!IsInstallMetaMask)? ( <span>没有检测到metamask,安装metamask钱包</span>):
                      !isConnected?(<span>{status}</span>):
                      
                      (
                        <div id="mainBodyer">
                         <div className="one">
                            <p>设置购买后价格(单位ETH)</p>
                            <p>设置为0表示购买后将不出售</p>
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
      <p>{mintTimeBlocknumber}</p>
      <div>
        <p> {ResultName&&("名称: "+ResultName)} </p>
        <p> {ResultDescription&&("概述: "+ResultDescription)} </p>
        <p> {ResultAssetCID && ( <img src={ipfs_gateway+ResultAssetCID} width="500px" />)} </p>
      </div>
    </div>
  );
};

export default NFT_query;
