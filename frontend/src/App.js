import './styles/app.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, {useState, useEffect} from "react";
import {ethers} from "ethers";
import myEpicNft from "./nft-Contract/artifacts/contracts/MyEpicNFT.sol/MyEpicNFT.json";

// Constants
const TWITTER_HANDLE = 'yashhhguptaaa';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {

  const [currentAccount, setCurrentAccount] = useState("");

  const askContractToMintNft = async () => {
    const CONTRACT_ADDRESS = "0xa836E54B97bEF27610E6714403d9557FdccF2F75"
    try {
      const {ethereum} = window;

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makeAnEpicNFT();

        console.log("Mining...please wait.")
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
      } else{
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      
    }
  }

  const checkIfWalletIsConnected = async () => {
    const {ethereum} = window;
    if(!ethereum) {
      console.log("Make sure you have metamask!")
      return;
    } else {
      console.log("We have the ethereum object",ethereum )
    }

    const accounts = await ethereum.request({ method: 'eth_accounts'});

    if(accounts.length !== 0 ) {
      const account = accounts[0]
      console.log("Found an authorized account: ",account);
      setCurrentAccount(account)
    } else {
      console.log("No authorized account found");
    }
  }

  const connectWallet = async () => {
    try {
      const {ethereum} = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({method : "eth_requestAccounts"});

      console.log("Connected",accounts[0]);
      setCurrentAccount(accounts[0])
    } catch (error) {
      
    }
  }


  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  const renderMintNftButton = () => (
    <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
      Mint NFT
    </button>
  )

  useEffect(() => {
    checkIfWalletIsConnected();
  },[])


  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {currentAccount === "" ? renderNotConnectedContainer() : renderMintNftButton()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;