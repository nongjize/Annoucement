var Contract = require('web3-eth-contract');
const contractABI = require('../MyNFT.json')
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// set provider for all later instances to use
Contract.setProvider('http://127.0.0.1:8545');

var contract = new Contract(contractABI, contractAddress);

export const InspectNFT = async(IdOfNFT) => {
    
    //error handling
    if (IdOfNFT.trim() === "" ) { 
        return {
            success: false,
            SearchResult_: "❗ID为空."
        }
    }
    var result_="null";

    contract.methods.ownerOf(IdOfNFT).call()
    .then(async(result)=>{result_=result;});

    return{
        success: false,
        SearchResult_:result_
    }
}