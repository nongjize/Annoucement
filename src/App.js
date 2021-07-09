import './App.css';
import Minter from './Minter'
import NFT_inspect from './NFT_inspect';
import NFT_inspect6 from './NFT_inspect6';
import React, { useState } from 'react';
import Popup from './utils/Popup';
import WalletConnect from './WalletConnect';
import NFT_query from './NFT_query';
import { TotalNFTs } from "./utils/interact_Annoucement.js";
import MyNFTs from './MyNFTs';

function App() {
  const [NFT_ID_FOR_search, set_NFT_ID_FOR_search] = useState(0);

  const [isOpen, setIsOpen] = useState(false);
  const togglePopup = () => { setIsOpen(!isOpen);}

  const [isMyNFTsOpen, setIsMyNFTsOpen] = useState(false);
  const toggleMyNFTsPopup = () => { setIsMyNFTsOpen(!isMyNFTsOpen);}

  const [isInspectWindowOpen, setIsInspectWindowOpen] = useState(false);
  const toggleInspectPopup = () => { setIsInspectWindowOpen(!isInspectWindowOpen);}

  const [The6NFTContent, setThe6NFTContent] = useState("");
  const RefreshNewestNFT = async () => {
    const {success,TotalNFT_}=await TotalNFTs();
    if (success){
      setThe6NFTContent(<NFT_inspect6 
        ID1={TotalNFT_} 
        ID2={(parseInt(TotalNFT_)-1).toString()} 
        ID3={(parseInt(TotalNFT_)-2).toString()} 
        ID4={(parseInt(TotalNFT_)-3).toString()} 
        ID5={(parseInt(TotalNFT_)-4).toString()} 
        ID6={(parseInt(TotalNFT_)-5).toString()}> </NFT_inspect6>);
    }
  }
  //RefreshNewestNFT();

  return (
    <div className="App">
       
      <button id="Creat_NFT_Button" onClick={togglePopup}> CREAT</button>
      {isOpen && <Popup content={<Minter></Minter>} handleClose={togglePopup}/>}

      <button id="Creat_NFT_Button" onClick={toggleMyNFTsPopup}> MyNFTs</button>
      {isMyNFTsOpen && <Popup content={<MyNFTs ID1="1" ID2="2" ID3="3" ID4="4" ID5="5" ID6="6" ></MyNFTs>} handleClose={toggleMyNFTsPopup}/>}

      <WalletConnect></WalletConnect>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <div className="Minter" >
        <h2>Input ID To query NFT: </h2>
        <input
          type="text"
          placeholder="34"
          onChange={(event) => set_NFT_ID_FOR_search(event.target.value)}
        />
        <button id="mintButton" onClick={toggleInspectPopup}>QUERY</button>
        {isInspectWindowOpen && <Popup content={<NFT_query  ID={NFT_ID_FOR_search}></NFT_query>} handleClose={toggleInspectPopup}/>}
      </div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <button id="mintButton" onClick={RefreshNewestNFT}>Refresh</button>
      {The6NFTContent}
    </div>
  );
}

export default App;
