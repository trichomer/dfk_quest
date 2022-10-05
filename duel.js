const { ethers } = require("ethers");
const fs = require("fs");
const config = require("./config.json");
const dfkDuelAddress = "0xE97196f4011dc9DA0829dd8E151EcFc0f37EE3c7";
const dfkDuelABI = [
  "",
  "",
  ""
];

// const url = "https://avax-dfk.gateway.pokt.network/v1/lb/6244818c00b9f0003ad1b619/ext/bc/q2aTwKuyzgs8pynF7UXBZCU7DejbZbZ6EUyHr3JQzYgwNPUPi/rpc";
const url = "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc";

const provider = new ethers.providers.JsonRpcProvider(url);
const dfkDuelContract = new ethers.Contract(dfkDuelAddress, dfkDuelABI, provider);


dfkDuelContract.on(
  "DuelEntryMatched",
  (duelId, duelEntryId, player1, player2) => {
    console.log(`\nDuel ID: ${duelId}\nDuel Entry ID: ${duelEntryId}\nPlayer 1: ${player1}\nPlayer 2: ${player2}`);
  }
);