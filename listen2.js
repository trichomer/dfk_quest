const { ethers } = require("ethers");
const fs = require("fs");
const config = require("./config.json");
const hmyProvider = new ethers.providers.JsonRpcProvider(config.hmyRPC);
const dfkProvider = new ethers.providers.JsonRpcProvider(config.dfkRPC);
const profilesAddress = "0x6391F796D56201D279a42fD3141aDa7e26A3B4A5";
const profilesAbi = fs.readFileSync("./abis/Profiles.json").toString();
const profilesContract = new ethers.Contract(profilesAddress, profilesAbi, hmyProvider);

const profile = async () => {
    let profName = await profilesContract.getProfileByAddress(config.queryWallet);
    console.log(`Profile name: ${profName[2]}`);
};

profile();