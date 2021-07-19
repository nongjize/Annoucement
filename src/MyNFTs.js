import { useEffect, useState } from "react";
import { TotalNFTsOfAddress,TokenOfOwnerByIndex } from "./utils/interact_Annoucement.js";
import My_NFT_query_one from "./My_NFT_query_one.js";

const MyNFTs = (props) => {
  const [TotalNFTss, setTotalNFTss] = useState('');
  const [isConnected, setConnectedStatus] = useState(false);
  const [IsInstallMetaMask,setIsInstallMetaMask] = useState(false);
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [NFT_arr, setNFT_arr] = useState(new Array());
  useEffect( 
    async function RefreshMyNFTs_info() 
    {
      if (window.ethereum)//已安装metaMask钱包
      { 
        setIsInstallMetaMask(true);
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length) 
          { 
            setConnectedStatus(true);
            var NFTs=new Array();
            setWallet(accounts[0]);
            const {success,TotalNFT_}=await TotalNFTsOfAddress(accounts[0]);
             if (success)
             {
               setTotalNFTss(TotalNFT_);
               const totalNFT_int=parseInt(TotalNFT_);
               for(var i = 0; i<totalNFT_int; i++)
               {
                  const {success_,TokenID_}=await TokenOfOwnerByIndex(accounts[0],parseInt(i));
                  if(success_){NFTs[i]=TokenID_;}
               }
               setNFT_arr(NFTs);
            }
          }
          else {
            setConnectedStatus(false);
            setStatus("🦊 Connect to Metamask using the top right button.");
          }
        }
        catch {
          setConnectedStatus(false);
          setStatus(
            "🦊 Connect to Metamask using the top right button. " +
              walletAddress
          );
        }
      }
      else//未安装metaMask钱包
      {
        setIsInstallMetaMask(false);
      }
    },
    []
  );

  return (
    <div >{
      !IsInstallMetaMask? <span>需要关联到您的以太坊账号才能查询到您账号下的NFT，浏览器没有安装metaMask钱包，请安装钱包，</span> :(
        (!isConnected ? <span>{status}</span> :
        (<div >
          <h1 id="title">{"我的(地址："+walletAddress+")NFT"}</h1>
          <p> {TotalNFTss&&("拥有NFT数量: "+TotalNFTss)} </p>
          <p>{status}</p>
          {NFT_arr.map((number) =><My_NFT_query_one key={number.toString()}  ID={number.toString()}/>)}
        </div>)
      )
      )
      }
    </div>
  );
};

export default MyNFTs;
