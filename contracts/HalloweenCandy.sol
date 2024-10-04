// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract HalloweenCandy {
    uint256 public totalCandies;
    uint256 public totalCandiesGiven;
    uint256 public totalCandiesTaken;
    event CandyGiven(address indexed giver, uint256 amount);
    event CandyTaken(address indexed taker, uint256 amount);

    constructor(uint256 initialCandies) {
        totalCandies = initialCandies;
        totalCandiesGiven = 0;
        totalCandiesTaken = 0;
        console.log("Welcome to the Spooky Candy Exchange!");
    }

    function giveCandy(uint256 amount) public {
        require(amount > 0, "You need to give at least one candy.");
        totalCandies += amount;
        totalCandiesGiven += amount;
        emit CandyGiven(msg.sender, amount);
        console.log("%s has contributed %d candies!", msg.sender, amount);
    }

    function takeCandy(uint256 amount) public {
        require(amount > 0, "You need to take at least one candy.");
        require(totalCandies >= amount, "There aren't enough candies available.");
        totalCandies -= amount;
        totalCandiesTaken += amount;
        emit CandyTaken(msg.sender, amount);
        console.log("%s has claimed %d candies!", msg.sender, amount);
    }

    function getTotalCandies() public view returns (uint256) {
        console.log("Currently, there are %d candies in the exchange!", totalCandies);
        return totalCandies;
    }

    function getTotalCandiesGiven() public view returns (uint256) {
        return totalCandiesGiven;
    }

    function getTotalCandiesTaken() public view returns (uint256) {
        return totalCandiesTaken;
    }
}
