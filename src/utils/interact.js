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


export const mintNFT = async(url, name, description) => {
    
    //error handling
    // if (url.trim() === "" || (name.trim() === "" || description.trim() === "")) { 
    //     return {
    //         success: false,
    //         status: "❗Please make sure all fields are completed before minting.",
    //     }
    // }
  
    // //make metadata
    // const metadata = new Object();
    // metadata.name = name;
    // metadata.image = url;
    // metadata.description = description;

    // //pinata pin request
    // const pinataResponse = await pinJSONToIPFS(metadata);
    // if (!pinataResponse.success) {
    //     return {
    //         success: false,
    //         status: "😢 Something went wrong while uploading your tokenURI.",
    //     }
    // } 
    // const tokenURI = pinataResponse.pinataUrl;  

    //load smart contract
    window.contract = await new web3.eth.Contract(contractABI, contractAddress);//loadContract();

    //set up your Ethereum transaction
    const transactionParameters = {
        to: contractAddress, // Required except during contract publications.
        from: window.ethereum.selectedAddress, // must match user's active address.
        //nonce:"1",
        value: "0x4697a8e3afe000",
        'data': window.contract.methods.mintNFT(window.ethereum.selectedAddress, url,123).encodeABI() //make call to NFT smart contract 
    };
  
    //sign transaction via Metamask
    try 
    {
        const txHash = await window.ethereum.request(
            {
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            }
            );
        return {
            success: true,
            status: "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash
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

export const InspectNFT = async(IdOfNFT) => {
    
    //error handling
    if (IdOfNFT.trim() === "" ) { 
        return {
            success: false,
            SearchResult_: "❗ID为空.",
        }
    }


     //load smart contract
     window.contract = await new web3.eth.Contract(contractABI, contractAddress);//loadContract();

     //set up your Ethereum transaction
     const transactionParameters = {
         to: contractAddress, // Required except during contract publications.
         from: window.ethereum.selectedAddress, // must match user's active address.
         'data': window.contract.methods.ownerOf(IdOfNFT).encodeABI() //make call to NFT smart contract 
     };
   
     //sign transaction via Metamask
     try 
     {
         const txHash = await window.ethereum
             .request({
                 method: 'eth_sendTransaction',
                 params: [transactionParameters],
             });
         return {
             success: true,
             status: "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash
         }
     } 
     catch (error) 
     {
         return {
             success: false,
             status: "😥 Something went wrong: " + error.message
         }
     }


}