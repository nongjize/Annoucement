import { useEffect, useState } from "react";
import { connectWallet, mintNFT,BuyNFT } from "./utils/interact.js";
import { create } from 'ipfs-http-client';
//import { pinFileToIPFS,pinJSONToIPFS} from "./utils/pinata.js"

const ipfs_gateway = process.env.REACT_APP_IPFS_GATEWAY;
const ipfs_api = process.env.REACT_APP_IPFS_API;

const client = create(ipfs_api)//https://api.pinata.cloud/psa//The process cannot access the file because it is being used by anot
//const client = create('https://api.pinata.cloud/psa')//
const IPFS_gateway = process.env.REACT_APP_PINATA_GATEWAY;

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
      //use pinata ipfs
      // console.log("文件："+file);
      // const pinFileToIPFS_response = await pinFileToIPFS("G://fornft.png");
      // if(pinFileToIPFS_response.success)
      // {
      //   const url = IPFS_gateway+pinFileToIPFS_response.pinataCID
      //   updateFileUrl(url)
      //   setAssetCID(pinFileToIPFS_response.pinataCID)
      //   console.log("文件CID："+pinFileToIPFS_response.pinataCID);
      // }
      // else
      // {
      //   console.log("文件上传到IPFS gateway失败："+pinFileToIPFS_response.message);
      // }


      //use local ipfs node
      const added = await client.add(file)
      const url = ipfs_gateway+ added.path
      //const url = IPFS_gateway+added.path
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
      
      // // use pinata ipfs 
      // const pinJSONToIPFS_response = await pinJSONToIPFS(metadata);
      // if (pinJSONToIPFS_response.success) 
      // {
      //   setMatedataCID(pinJSONToIPFS_response.pinataCID)
      //   const { status } = await mintNFT(pinJSONToIPFS_response.pinataCID,MintPrice);
      //   setStatus(status);
      // }
      // else
      // {
      //   console.log('错误: ', pinJSONToIPFS_response.message)
      // } 
      
      //use local ipfs node
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

          <form>
            <h2>文件上传（作品源文件）</h2>
            <input type="file" onChange={onChange} />
            {AssetCID}
            <br />
            {fileUrl && (<img src={fileUrl} width="60px" />)}
          
            <h2>名称: </h2>
            <input
              type="text"
              placeholder="例如：蒙娜丽丽"
              onChange={(event) => setName(event.target.value)}
            />
            <h2>简介: </h2>
            <input
              type="text"
              placeholder="例如：这是某某创作的一幅漂亮的数字画，。。。"
              onChange={(event) => setDescription(event.target.value)}
            />
            <h2>价格：</h2>
            <input
              type="text"
              placeholder="例如：12.59"
              onChange={(event) => setMintPrice(event.target.value)}
            />
             <p>【请输入您准备出售该版权NFT的价格(单位:ETH）；填0表示该版权NFT只用来声明版权，不出售】</p>
          </form>
          <button id="mintButton" onClick={onMintPressed}>
            发布版权NFT
          </button>

          </div>
      ) )
    }
    </div>
    
  );
};

export default Minter;
