var Contract = require('web3-eth-contract');
const contractABI = require('../MyNFT.json')
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey); 

// set provider for all later instances to use
Contract.setProvider('http://127.0.0.1:8545');

var contract = new Contract(contractABI, contractAddress);

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

// export const InspectNFTs = async(firstID,lastID) => 
// {
//     if (firstID.trim() === "" ) { 
//         return {
//             success: false,
//             SearchResult_: "❗firstID为空."
//         }
//     }
//     if (lastID.trim() === "" ) { 
//         return {
//             success: false,
//             SearchResult_: "❗lastID为空."
//         }
//     }
//     if (lastID<firstID) { 
//         return {
//             success: false,
//             SearchResult_: "❗lastID不能比firstID小."
//         }
//     }

//     try
//     {
//         var SearchResult="";
//         for (var i=firstID;i<lastID;i++)
//         { 
//             const TheDressOfOwner= await contract.methods.ownerOf(i).call();
//             const TheSalePrice= await contract.methods.SalePrice(i).call();
//             const TokenUrI= await contract.methods.tokenURI(i).call();
//             SearchResult+="Owner:"+TheDressOfOwner+"\nPrice:"+web3.utils.fromWei(TheSalePrice,'ether') +"ETH\n链接:"+TokenUrI+"\n\n"
//         }
//         return {
//             success: true,    
//             SearchResult_:SearchResult
//         };

//     }catch(error)
//     {
//         return {
//             success: false,    
//             SearchResult_:"失败: " + error.message,
//         };
//     }
// }

