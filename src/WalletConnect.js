import { useEffect, useState } from "react";
import { connectWallet, mintNFT,BuyNFT } from "./utils/interact.js";



const WalletConnect = (props) => {
  //State variables
  const [walletAddress, setWallet] = useState("");
  const [isConnected, setConnectedStatus] = useState(false);
  const [status, setStatus] = useState("");
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
              "我的区块链账号: " +
              String(walletAddress).substring(0, 6) +
              "..." +
              String(walletAddress).substring(38)
            ) : (
              <span>连接区块链钱包</span>
            )}
      </button>
      <p id="status">
            {status}
          </p>
    </div>
  );
};

export default WalletConnect;
