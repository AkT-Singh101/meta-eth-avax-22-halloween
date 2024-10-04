// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const initCandies = 1000; // Initial number of candies
  const HalloweenCandy = await hre.ethers.getContractFactory("HalloweenCandy");
  const candyExchange = await HalloweenCandy.deploy(initCandies);
  await candyExchange.deployed();

  console.log(
    `A contract with ${initCandies} candies deployed to ${candyExchange.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
