import { useEffect, useState } from "react";
import { connectWallet, mintNFT,BuyNFT } from "./utils/interact.js";
import { create } from 'ipfs-http-client';

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
  const [MintPrice, setMintPrice] = useState("");
  const [fileUrl, updateFileUrl] = useState(``)
  const [IsInstallMetaMask,setIsInstallMetaMask] = useState(false);//MintPressed
  const [MintPressed,setMintPressed] = useState(false);//MintPressed

  async function onChange(e) //上传文件到ipfs 获取CID
  {
    const file = e.target.files[0]
    try 
    {
      const added = await client.add(file)
      //console.log('CID: ', added.cid)
      //console.log('path: ', added.path)
      const url = `http://127.0.0.1:8080/ipfs/${added.path}`
      updateFileUrl(url)
      setAssetCID(added.path)
    } 
    catch (error) 
    {
      console.log('Error uploading file: ', error)
    }  
  }

  useEffect(async () => { //TODO: implement
    if (window.ethereum) { //if Metamask installed
      setIsInstallMetaMask(true);
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
    } else
    {
      setIsInstallMetaMask(false);
    }
    
  });

  

  const onMintPressed = async () => 
  {
    setMintPressed(true);
    setStatus("NFT发布中...");
    try 
    {
      const metadata = new Object();
      metadata.name = name;
      metadata.asset = AssetCID;
      metadata.description = description;
      const added = await client.add(JSON.stringify(metadata))//上传 metadata json 对象，获取CID 即metadataCID
      setMatedataCID(added.path)
      const { status } = await mintNFT(added.path,MintPrice);
      setStatus(status);
    } 
    catch (error) 
    {
      console.log('Error At OnMintPressed: ', error)
    } 
  };
  return (
    <div>
    {
      !IsInstallMetaMask? <span>发布新的NFT需要关联到您的以太坊账号，浏览器没有安装metaMask钱包，请安装钱包，</span> :
      (walletAddress==="" ? <span>请连接钱包</span> :
      MintPressed?  <div>{MatedataCID} <br/> {status} </div>:
      (
        <div className="Minter">
          <h1 id="title">发布声明</h1>
          <p>
            Simply add your asset's link, name, and description, then press "Mint."
          </p>
          <form>
            <h2>文件上传</h2>
            <input type="file" onChange={onChange} />
            {AssetCID}
            <br />
            {fileUrl && (<img src={fileUrl} width="60px" />)}
          
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

          </div>
      ) )
    }
    </div>
    
  );
};

export default Minter;
