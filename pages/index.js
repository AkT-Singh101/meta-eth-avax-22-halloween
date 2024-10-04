import { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractAbi from "../artifacts/contracts/HalloweenCandy.sol/HalloweenCandy.json";
import bg from '../assets/4183289.jpg'

export default function App() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [candyCount, setCandyCount] = useState(0);
  const [candiesGiven, setCandiesGiven] = useState(0);
  const [candiesTaken, setCandiesTaken] = useState(0);
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts && accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);
    getContractInstance();
  };

  const getContractInstance = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbi.abi,
      signer
    );
    setContract(contractInstance);
  };

  const getTotalCandies = async () => {
    if (contract) {
      const totalCandies = await contract.getTotalCandies();
      setCandyCount(parseInt(totalCandies._hex));
    }
  };

  const giveCandy = async () => {
    if (contract) {
      const tx = await contract.giveCandy(1); // Assuming giving one candy at a time
      await tx.wait();
      getTotalCandies();
    }
  };

  const takeCandy = async () => {
    if (contract) {
      const tx = await contract.takeCandy(1); // Assuming taking one candy at a time
      await tx.wait();
      getTotalCandies();
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return (
        <p className="text">
          Please install MetaMask to interact with this contract.
        </p>
      );
    }

    if (!account) {
      return (
        <button className="button" onClick={connectAccount}>
          Connect MetaMask
        </button>
      );
    }

    return (
      <div className="card">
        <p className="text">Your Account: {account}</p>
        <p className="text">Total Candies: {candyCount}</p>
        <p className="text">Total Candies Taken: {candiesGiven}</p>
        <p className="text">Total Candies Given: {candiesTaken}</p>
        <button className="button" onClick={giveCandy}>
          Take Candy
        </button>
        <button className="button" onClick={takeCandy}>
          Give Candy
        </button>
        <style jsx>{`

      .button {
        background-color: #ff7518; /* Halloween orange */
        color: white;
        padding: 12px 24px;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        font-size: 1rem;
        margin-right: 15px;
      }

      .card {
       padding: 25px 50px 75px 100px;
      background: rgba( 255, 255, 255, 0.25 );
box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
backdrop-filter: blur( 12px );
-webkit-backdrop-filter: blur( 12px );
border-radius: 10px;
border: 1px solid rgba( 255, 255, 255, 0.18 );}

      .button:hover {
        background-color: #e65c00; /* Darker orange on hover */
      }

      .text {
      color: white;
      font: semi-bold;
        font-size: 1.2rem;
      }
      `}</style>
      </div>
    );
  };

  
  useEffect(() => {
    if (account) {
      getTotalCandies();

      const handleCandyGiven = (giver) => {
        console.log(`${giver} has given candy!`);
        setCandiesGiven((prev) => prev + 1);
      };

      const handleCandyTaken = (taker) => {
        console.log(`${taker} has taken candy!`);
        setCandiesTaken((prev) => prev + 1);
      };

      contract?.on("CandyGiven", handleCandyGiven);
      contract?.on("CandyTaken", handleCandyTaken);

      // Cleanup function to remove listeners
      return () => {
        contract?.off("CandyGiven", handleCandyGiven);
        contract?.off("CandyTaken", handleCandyTaken);
      };
    }
  }, [account, contract]);

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1 className="header">
          Welcome to the Halloween Candy Exchange!
        </h1>
      </header>
      {initUser()}
      
      <style jsx>{`
      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background-image: url(${bg.src}); /* Using the imported bg image */
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      }

      .button {
        background-color: #ff7518; /* Halloween orange */
        color: white;
        padding: 12px 24px;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        font-size: 1rem;
      }

      .header {
        font-size: 2.5rem; 
        color: white; /* Bright yellow for a spooky effect */
      }
      `}</style>

</main>
);
}
