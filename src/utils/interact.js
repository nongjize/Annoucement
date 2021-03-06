import {pinJSONToIPFS} from './pinata.js'
import { MintFee } from "./interact_Annoucement.js";
require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey); 

const contractABI = require('../MyNFT.json')
//const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";//0x45F621B5916A94be390e0c763982711b64c9F63F
const contractAddress = process.env.REACT_APP_ContractAddress;

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
                  status: "ð¦ Connect to Metamask using the button on the top right.nnnnnnjnz           at sg"
              }
          }
          
    } 
    else 
    {
        return {
              connectedStatus: false,
              status: "ð¦ You must install Metamask into your browser: https://metamask.io/download.html"
          }    
    } 
};


export const mintNFT = async(MetadataURI,mintPrice) => {
    var BN = web3.utils.BN;
    window.contract = await new web3.eth.Contract(contractABI, contractAddress);//loadContract();//load smart contract
    const { success,MintFee_ } = await MintFee();//è·ååå¸NFTæéè´¹ç¨
    if(success)
    {
        console.log("è·ååå¸NFTæéè´¹ç¨ä¸ºï¼"+MintFee_);
        const transactionParameters = {
            to: contractAddress, // Required except during contract publications.
            from: window.ethereum.selectedAddress, // must match user's active address.
            //nonce:"1",
            value: web3.utils.toHex(new BN(web3.utils.toWei(MintFee_,"ether")).toString()),//åå¸åºå®è´¹ç¨
            'data': window.contract.methods.mintNFT(window.ethereum.selectedAddress,MetadataURI,web3.utils.toWei(mintPrice,"ether")).encodeABI() //make call to NFT smart contract 
        };
        try //sign transaction via Metamask
        {
            const txHash = await window.ethereum.request({method: 'eth_sendTransaction',params: [transactionParameters],});
            return {
                success: true,
                status: "NFTåå¸ä¿¡æ¯å·²ç»æäº¤åºåé¾ï¼åºåé¾äº¤æåå¸ä¸ºï¼"+txHash+" NFTåå¸æåä¸å¦éè¦ç­å¾åºåé¾ç¿å·¥ç¡®è®¤ï¼æ¨å¯ä»¥å¨åºåé¾ä¸æ¥çå·ä½ä¿¡æ¯ï¼éè¿Etherscanç­åºåé¾æµè§å¨ï¼" 
            }
        } 
        catch (error) 
        {
            return {
                success: false,
                status: "å¤±è´¥: " + error.message
            }
        }
    }
}

export const BuyNFT = async(IdOfNFT,salePriceInwei,SetPriceInEth) => {
    if (IdOfNFT.trim() === "" ) { 
        return {
            success: false,
            SearchResult_: "âIDä¸ºç©º.",
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
                status: "NFTè´­ä¹°ä¿¡æ¯å·²ç»æäº¤åºåé¾ï¼åºåé¾äº¤æåå¸ä¸ºï¼"+txHash+" NFTè´­ä¹°æåä¸å¦éè¦ç­å¾åºåé¾ç¿å·¥ç¡®è®¤ï¼æ¨å¯ä»¥å¨åºåé¾ä¸æ¥çå·ä½ä¿¡æ¯ï¼éè¿Etherscanç­åºåé¾æµè§å¨ï¼"
            }
        } 
        catch (error) 
        {
            return {
                success: false,
                status: "è´­ä¹°å¤±è´¥: " + error.message
            }
        }
    }
    else
    {
        return {
            success: false,
            status: "è´­ä¹°å¤±è´¥ï¼éè¦å®è£metamaskå¹¶å³èå°è¦è´­ä¹°çä»¥å¤ªåè´¦å·"
        }
    }
    
    


}

