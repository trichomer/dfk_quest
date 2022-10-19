const { ethers } = require("ethers");
const fs = require("fs");
const config = require("./config.json");
const dfkProvider = new ethers.providers.JsonRpcProvider(config.dfkRPC);
const dfkProfilesAddress = "0xC4cD8C09D1A90b21Be417be91A81603B03993E81";
const dfkRafAddress = "0xd8D7CE8921490b75EC489bd076AD0f27DC765675";
const profilesABI = require("./abis/Profiles.json");
const dfkRafABI = require("./abis/raffleMaster.json");
const dfkProfilesContract = new ethers.Contract(dfkProfilesAddress, profilesABI, dfkProvider);
const dfkRafContract = new ethers.Contract(dfkRafAddress, dfkRafABI, dfkProvider);
const profile = async (owner) => {
    try {
        let profName = await dfkProfilesContract.getProfileByAddress(owner);
        console.log(`Profile name: ${profName[2]}`);
        return profName;
    } catch (err) {
        console.log(`Profile error: ${err.message}`);
    }
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
async function drawn() {
    dfkRafContract.on(
        "RaffleDrawn",
        (raffleId, winner) => {
            profile(winner);
            console.log(`Raffle Drawn:
            Winner: ${winner}
            Raffle ID: ${raffleId}\n`);
        }
    );
};
drawn();

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