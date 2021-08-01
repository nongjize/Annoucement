var Contract = require('web3-eth-contract');
const contractABI = require('../MyNFT.json')
//const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";//0x45F621B5916A94be390e0c763982711b64c9F63F
const contractAddress = process.env.REACT_APP_ContractAddress;
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey); 



// set provider for all later instances to use
Contract.setProvider('http://127.0.0.1:8545');
var contract_ = new Contract(contractABI, contractAddress);            //接口 'http://127.0.0.1:8545'
var contract= new web3.eth.Contract(contractABI, contractAddress);  //接口 Alckemy

export const MintTimeAndBlocknumber = async(NFT_id) => {
    try
    {
        //console.logs(web3.utils.sha3("Transfer(from,to,tokenId)"));
        //console.logs("!!!!!!!!!!!!!");
        const logs= await web3.eth.getPastLogs({
            fromBlock:0,
            toBlock:"latest",
            address: contractAddress,
           topics: [web3.utils.sha3('Transfer(address,address,uint256)'),"0x0000000000000000000000000000000000000000000000000000000000000000",null,NFT_id]
           //topics: [web3.utils.sha3('Transfer(address,address,uint256)'),null,null,NFT_id]
        });
        const timestamp11= await web3.eth.getBlock(logs[0].blockNumber);
        
        //const TotalNFT= await contract.methods.totalSupply().call();
        return {
            success: true,  
            logs_:logs,
            MintBlockNumber_:logs[0].blockNumber,//blockNumber
            MintTimestamp_:timestamp11.timestamp,
            test_:web3.utils.sha3('Transfer(address,address,uint256)')
        };
    }catch(error)
    {
        return {
            success: false, 
            TotalNFT_:"失败: "
        };
    }
}

export const TotalNFTs = async() => {
    try
    {
        const TotalNFT= await contract.methods.totalSupply().call();
        return {
            success: true,  
            TotalNFT_:TotalNFT
        };
    }catch(error)
    {
        return {
            success: false, 
            TotalNFT_:"失败: "
        };
    }
}

export const MintFee = async() => {
    try
    {
        const mintfee_= await contract.methods.Fee().call();
        return {
            success: true,  
            MintFee_:mintfee_
        };
    }catch(error)
    {
        return {
            success: false, 
            MintFee_:"0"
        };
    }
}

export const TotalNFTsOfAddress = async(address) => {//balanceOf(address owner) 
    try
    {
        const TotalNFT= await contract.methods.balanceOf(address).call();
        return {
            success: true,  
            TotalNFT_:TotalNFT
        };
    }catch(error)
    {
        return {
            success: false, 
            TotalNFT_:"失败: "
        };
    }
}
//tokenOfOwnerByIndex(address owner, uint256 index)
export const TokenOfOwnerByIndex=async(address,index)=>{
    try
    {
        const TokenID= await contract.methods.tokenOfOwnerByIndex(address,index).call();
        return {
            success_: true,    
            TokenID_:TokenID
        };

    }catch(error)
    {
        return {
            success_: false,    
            TokenID_:"失败: " + error.message,
        };
    }

}

export const InspectNFT = async(IdOfNFT) => {
    
    //error handling
    if (IdOfNFT.trim() === "" ) { 
        return {
            success: false,
            SearchResult_: "❗ID为空."
        }
    }

    try
    {
        const TheDressOfOwner= await contract.methods.ownerOf(IdOfNFT).call();
        const TheSalePrice= await contract.methods.SalePrice(IdOfNFT).call();
        const TokenUrI= await contract.methods.tokenURI(IdOfNFT).call();
        const TotalNFT= await contract.methods.totalSupply().call();
        return {
            success: true,    
            SearchResult_:"拥有者账号:"+TheDressOfOwner+"\n原数据IPFS CID:"+TokenUrI+"\n价格:"+web3.utils.fromWei(TheSalePrice,'ether') +"ETH",
            //SearchResult_:"Owner:"+TheDressOfOwner+"\nPrice:"+TheSalePrice +"ETH\n链接:"+TokenUrI,
            TheSalePrice_:TheSalePrice,
            MatedataCID_:TokenUrI,
            TotalNFT_:TotalNFT,
            Owner_:TheDressOfOwner
        };

    }catch(error)
    {
        return {
            success: false,    
            SearchResult_:"失败: " + error.message,
            TheSalePrice_:"失败: ",
            TokenUrI_:"失败: ",
            TotalNFT_:"失败: "
        };
    }
}
