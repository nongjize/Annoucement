import { useEffect, useState } from "react";
import { connectWallet, mintNFT,BuyNFT } from "./utils/interact.js";
import { create } from 'ipfs-http-client';

const client = create('/ip4/127.0.0.1/tcp/5001')

const WalletConnect = (props) => {
  //State variables
  const [isConnected, setConnectedStatus] = useState(false);
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [AssetCID, setAssetCID] = useState("");
  const [fileUrl, updateFileUrl] = useState(``)


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



  //connectWalletPressed();
  return (
    <div className="Minter">
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
      <p id="status">
            {status}
          </p>
    </div>
  );
};

export default WalletConnect;
