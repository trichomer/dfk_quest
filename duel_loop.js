const { ethers } = require("ethers");
const fs = require("fs");
const config = require("./config.json");
const dfkDuelAddress = "0xf724FE22b45D519D149477aA2eC5348Cee08Cae3";
const config = require("./config.json");
const dfkDuelABI = require("./abis/DFKDuelS1.json");
const url = "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc";
const provider = new ethers.providers.JsonRpcProvider(url);
const dfkDuelContract = new ethers.Contract(dfkDuelAddress, dfkDuelABI, provider);

