import './App.css';
import Minter from './Minter'
import NFT_inspect from './NFT_inspect';
import NFT_inspect6 from './NFT_inspect6';
import DAPPintroduction from './DAPPintroduction'
import React, { useState } from 'react';
import Popup from './utils/Popup';
import WalletConnect from './WalletConnect';
import NFT_query from './NFT_query';

import MyNFTs from './MyNFTs';

function App() {
  const [NFT_ID_FOR_search, set_NFT_ID_FOR_search] = useState(0);

  const [isOpen, setIsOpen] = useState(false);
  const togglePopup = () => { setIsOpen(!isOpen);}

  const [isMyNFTsOpen, setIsMyNFTsOpen] = useState(false);
  const toggleMyNFTsPopup = () => { setIsMyNFTsOpen(!isMyNFTsOpen);}

  const [isInspectWindowOpen, setIsInspectWindowOpen] = useState(false);
  const toggleInspectPopup = () => { setIsInspectWindowOpen(!isInspectWindowOpen);}

  //const [isOpen, setIsOpen] = useState(false);

  let walletAddress_Root="123";
  const HandlesetWallet_Root=(address_1)=> {
    walletAddress_Root=address_1;
    console.log("ssssssssssssssssssset walletAddress_Root:"+walletAddress_Root);
  }

  
  

  return (
    <div className="App">
       
      <button id="Creat_NFT_Button" onClick={togglePopup}> CREAT</button>
      {isOpen && <Popup content={<Minter></Minter>} handleClose={togglePopup}/>}

      <button id="Creat_NFT_Button" onClick={toggleMyNFTsPopup}> MyNFTs</button>
      {isMyNFTsOpen && <Popup content={<MyNFTs address={walletAddress_Root} />} handleClose={toggleMyNFTsPopup}/>}

      <WalletConnect />
      <DAPPintroduction/>
      <br/>
      <br/>
      <br/>
      <br/>
      <div className="Minter">
        <div className="WrapperForQueryInMainPage">
          <h2>Input ID To query NFT: </h2>
          <input type="text" placeholder="34"onChange={(event) => set_NFT_ID_FOR_search(event.target.value)}/>
          <button id="mintButton" onClick={toggleInspectPopup}>QUERY</button>
          {isInspectWindowOpen && <Popup content={<NFT_query  ID={NFT_ID_FOR_search}/>} handleClose={toggleInspectPopup}/>}
        </div>
      </div>
      <br/>
      <br/>
      <br/>
      <br/>
      <NFT_inspect6/>
    </div>
  );
}

export default App;
