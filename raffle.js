const { ethers } = require("ethers");
const fs = require("fs");
const config = require("./config.json");
const dfkProvider = new ethers.providers.JsonRpcProvider(config.dfkRPC);
const hmyProvider = new ethers.providers.JsonRpcProvider(config.hmyRPC);
const profilesAddress = "0x6391F796D56201D279a42fD3141aDa7e26A3B4A5";
const dfkRafAddress = "0xd8D7CE8921490b75EC489bd076AD0f27DC765675";
const profilesABI = require("./abis/Profiles.json");
const dfkRafABI = require("./abis/raffleMaster.json");
const profilesContract = new ethers.Contract(profilesAddress, profilesABI, hmyProvider);
const dfkRafContract = new ethers.Contract(dfkRafAddress, dfkRafABI, dfkProvider);
const profile = async (owner) => {
    let profName = await profilesContract.getProfileByAddress(owner);
    console.log(`Profile name: ${profName[2]}`);
    return profName;
};



// dfkRafContract.on(
//     "RaffleEntered",
//     (user, raffleId, tickets) => {
//         console.log(`Raffle Entered:
//         User: ${user}
//         Raffle ID: ${raffleId}
//         Tickets: ${tickets}\n`);
//     }
// );

dfkRafContract.on(
    "RaffleDrawn",
    (raffleId, winner) => {
        profile(winner);
        console.log(`Raffle Drawn:
        Winner: ${winner}
        Raffle ID: ${raffleId}\n`);
    }
);

dfkRafContract.on(
    "RaffleClosed",
    (raffleId) => {
        console.log(`Raffle Closed:
        Raffle ID: ${raffleId}`);
    }
);

async function testFunctions() {
    // let a = await dfkRafContract.getCurrentRaffleData();
    let b = await dfkRafContract.getCurrentRaffleBuckets();
    console.log(`${b}`);
};
testFunctions();