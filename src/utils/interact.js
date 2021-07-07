import {pinJSONToIPFS} from './pinata.js'
require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey); 

const contractABI = require('../MyNFT.json')
//const contractAddress = "0x4C4a07F737Bf57F6632B6CAB089B78f62385aCaE";;//0x5FbDB2315678afecb367f032d93F642f64180aa3
// 0x5FbDB2315678afecb367f032d93F642f64180aa3
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

    //load smart contract
    window.contract = await new web3.eth.Contract(contractABI, contractAddress);//loadContract();

    //set up your Ethereum transaction
    const transactionParameters = {
        to: contractAddress, // Required except during contract publications.
        from: window.ethereum.selectedAddress, // must match user's active address.
        //nonce:"1",
        value: web3.utils.toHex(new BN(web3.utils.toWei("12.25","ether")).toString()),//发布固定费用
        'data': window.contract.methods.mintNFT(window.ethereum.selectedAddress,MetadataURI,web3.utils.toWei(mintPrice,"ether")).encodeABI() //make call to NFT smart contract 
    };
  
    //sign transaction via Metamask
    try 
    {
        const txHash = await window.ethereum.request({method: 'eth_sendTransaction',params: [transactionParameters],});
        return {
            success: true,
            status: "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash
        }
        // const receipt=await txHash.wait()
        // for (const event of receipt.events) {
        //     if (event.event !== 'Transfer') {
        //         console.log('ignoring unknown event type ', event.event)
        //         continue
        //     }
        // return {success: true,
        //         status: "已经完成发布，NFT ID为："+event.args.tokenId.toString()}
        // }
    } 
    catch (error) 
    {
        return {
            success: false,
            status: "失败: " + error.message
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
    
    window.contract = await new web3.eth.Contract(contractABI, contractAddress);//loadContract();
     const transactionParameters = {
         to: contractAddress, // Required except during contract publications.
         from: window.ethereum.selectedAddress, // must match user's active address.
         //value: web3.utils.toHex(web3.utils.toWei(salePriceInEth, 'ether').toString()),//web3.utils.numberToHex('234');
         value:web3.utils.toHex(salePriceInwei),
         'data': window.contract.methods.BuyNFT(IdOfNFT,web3.utils.toWei(SetPriceInEth,"ether")).encodeABI() //make call to NFT smart contract 
     };
   
     //sign transaction via Metamask
     try 
     {
         const txHash = await window.ethereum.request({method:'eth_sendTransaction', params: [transactionParameters],});
         return {
             success: true,
             status: "成功！Etherscan: https://ropsten.etherscan.io/tx/" + txHash
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

