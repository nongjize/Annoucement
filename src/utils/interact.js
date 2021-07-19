import {pinJSONToIPFS} from './pinata.js'
import { MintFee } from "./interact_Annoucement.js";
require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey); 

const contractABI = require('../MyNFT.json')
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const connectWallet = async () => {
    if (window.ethereum) 
    { //check if Metamask is installed
          try {
              const address = await window.ethereum.enable(); //connect Metamask
              const obj = {
                      connectedStatus: true,
                      status: "",
                      address: address
                  }
                  return obj;
               
          } catch (error) {
              return {
                  connectedStatus: false,
                  status: "🦊 Connect to Metamask using the button on the top right.nnnnnnjnz           at sg"
              }
          }
          
    } 
    else 
    {
        return {
              connectedStatus: false,
              status: "🦊 You must install Metamask into your browser: https://metamask.io/download.html"
          }    
    } 
};


export const mintNFT = async(MetadataURI,mintPrice) => {
    var BN = web3.utils.BN;
    window.contract = await new web3.eth.Contract(contractABI, contractAddress);//loadContract();//load smart contract
    const { success,MintFee_ } = await MintFee();//获取发布NFT所需费用
    if(success)
    {
        console.log("获取发布NFT所需费用为："+MintFee_);
        const transactionParameters = {
            to: contractAddress, // Required except during contract publications.
            from: window.ethereum.selectedAddress, // must match user's active address.
            //nonce:"1",
            value: web3.utils.toHex(new BN(web3.utils.toWei(MintFee_,"ether")).toString()),//发布固定费用
            'data': window.contract.methods.mintNFT(window.ethereum.selectedAddress,MetadataURI,web3.utils.toWei(mintPrice,"ether")).encodeABI() //make call to NFT smart contract 
        };
        try //sign transaction via Metamask
        {
            const txHash = await window.ethereum.request({method: 'eth_sendTransaction',params: [transactionParameters],});
            return {
                success: true,
                status: "NFT发布信息已经提交区块链，区块链交易哈希为："+txHash+" NFT发布成功与否需要等待区块链矿工确认，您可以在区块链上查看具体信息（通过Etherscan等区块链浏览器）" 
            }
        } 
        catch (error) 
        {
            return {
                success: false,
                status: "失败: " + error.message
            }
        }
    }
}

export const BuyNFT = async(IdOfNFT,salePriceInwei,SetPriceInEth) => {
    if (IdOfNFT.trim() === "" ) { 
        return {
            success: false,
            SearchResult_: "❗ID为空.",
        }
    }
    if(window.ethereum)
    {
        window.contract = await new web3.eth.Contract(contractABI, contractAddress);//loadContract();
        const transactionParameters = {
            to: contractAddress, // Required except during contract publications.
            from: window.ethereum.selectedAddress, // must match user's active address.
            value:web3.utils.toHex(salePriceInwei),
            'data': window.contract.methods.BuyNFT(IdOfNFT,web3.utils.toWei(SetPriceInEth,"ether")).encodeABI() //make call to NFT smart contract 
        };
        try //sign transaction via Metamask
        {
            const txHash = await window.ethereum.request({method:'eth_sendTransaction', params: [transactionParameters],});
            return {
                success: true,
                status: "NFT购买信息已经提交区块链，区块链交易哈希为："+txHash+" NFT购买成功与否需要等待区块链矿工确认，您可以在区块链上查看具体信息（通过Etherscan等区块链浏览器）"
            }
        } 
        catch (error) 
        {
            return {
                success: false,
                status: "购买失败: " + error.message
            }
        }
    }
    else
    {
        return {
            success: false,
            status: "购买失败，需要安装metamask并关联到要购买的以太坊账号"
        }
    }
    
    


}

