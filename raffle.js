const { ethers } = require("ethers");
const fs = require("fs");
const config = require("./config.json");
const dfkRafAddress = "0xd8D7CE8921490b75EC489bd076AD0f27DC765675";
const dfkRafABI = require("./abis/raffleMaster.json");
const url = "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc";
const provider = new ethers.providers.JsonRpcProvider(url);
const dfkRafContract = new ethers.Contract(dfkRafAddress, dfkRafABI, provider);

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