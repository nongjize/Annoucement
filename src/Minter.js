import { useEffect, useState } from "react";
import { connectWallet, mintNFT,BuyNFT } from "./utils/interact.js";
import { InspectNFT } from "./utils/interact_Annoucement.js";

const Minter = (props) => {

  //State variables
  const [isConnected, setConnectedStatus] = useState(false);
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");

  const [NFT_ID_FOR_search, set_NFT_ID_FOR_search] = useState("");
  const [SearchResult,setSearchResult]=useState("");
  const [SalePrice,setSalePrice]=useState("");
  const [TokenURI,setTokenURI]=useState("");
  const [TotalNFT,setTotalNFT]=useState("");

  const [TheIdToBuy,setTheIdToBuy]=useState("");
  const [ThePriceToBuy,setThePriceToBuy]=useState("");
 
  useEffect(async () => { //TODO: implement
    if (window.ethereum) { //if Metamask installed
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
    } 
  });

  const connectWalletPressed = async () => { //TODO: implement
    const walletResponse = await connectWallet();
    setConnectedStatus(walletResponse.connectedStatus);
    setStatus(walletResponse.status);
    if (isConnected) {
      setWallet(walletAddress);
    }
  };

  const onMintPressed = async () => {
    const { status } = await mintNFT(url, name, description);
    setStatus(status);
  };

  const onNFT_search_Pressed = async () => {
    const { SearchResult_,TheSalePrice_,TokenUrI_,TotalNFT_} = await InspectNFT(NFT_ID_FOR_search);
    setSearchResult( SearchResult_ );
    setSalePrice(TheSalePrice_);
    setTokenURI(TokenUrI_);
    setTotalNFT(TotalNFT_);
  };

  const GetPrice = async () => {
    const { TheSalePrice_} = await InspectNFT(NFT_ID_FOR_search);
    setSearchResult( SearchResult_ );
    setSalePrice(TheSalePrice_);
    setTokenURI(TokenUrI_);
    setTotalNFT(TotalNFT_);
  };

  const onBuyNFTButtonPressed = async () => {
    const { status } = await BuyNFT(url, name, description);
    setStatus(status);
  };

  return (
    <div className="Minter">

      <div>
          <button id="walletButton" onClick={connectWalletPressed}>
            {isConnected ? (
              "👛 Connected: " +
              String(walletAddress).substring(0, 6) +
              "..." +
              String(walletAddress).substring(38)
            ) : (
              <span>👛 Connect Wallet</span>
            )}
          </button>

          <br></br>
          <h1 id="title">🧙‍♂️ Alchemy NFT Minter</h1>
          <p>
            Simply add your asset's link, name, and description, then press "Mint."
          </p>
          <form>
            <h2>🖼 Link to asset: </h2>
            <input
              type="text"
              placeholder="e.g. https://gateway.pinata.cloud/ipfs/<hash>"
              onChange={(event) => setURL(event.target.value)}
            />
            <h2>🤔 Name: </h2>
            <input
              type="text"
              placeholder="e.g. My first NFT!"
              onChange={(event) => setName(event.target.value)}
            />
            <h2>✍️ Description: </h2>
            <input
              type="text"
              placeholder="e.g. Even cooler than cryptokitties ;)"
              onChange={(event) => setDescription(event.target.value)}
            />
          </form>
          <button id="mintButton" onClick={onMintPressed}>
            Mint NFT
          </button>
          <p id="status">
            {status}
          </p>
      </div>
      
      <div>
          <br></br>
          <h1 id="title">Inspect NFT</h1>
          <p>
            input the id of the NFT you want to inspect,if it exit,it well return the owner,sale price, access IPFS(the degist)
          </p>
          <form>
            <h2>NFT ID: </h2>
            <input
              type="text"
              placeholder="34"
              onChange={(event) => set_NFT_ID_FOR_search(event.target.value)}
            />
          </form>
          <button id="mintButton" onClick={onNFT_search_Pressed}>
            TO Inspect NFT
          </button>
          <p id="status">{SearchResult}</p>
          <p id="status">{SalePrice}</p>
          <p id="status">{TokenURI}</p>
          <p id="status">{TotalNFT}</p>
      </div>

      <div>
          <br></br>
          <h1 id="title">BuyNFT</h1>
          <p>
            【input the NFT ID you want to buy】
          </p>
          <form>
            <h2>NFT ID: </h2>
            <input
              type="text"
              placeholder="34"
              onChange={(event) =>{ 
                setTheIdToBuy(event.target.value);
                

              }}
            />
          </form>
          <button id="mintButton" onClick={onBuyNFTButtonPressed}>
            Buy
          </button>
          <p id="status">
            {status}
          </p>
    </div>

    </div>
  );
};

export default Minter;
