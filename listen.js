const { ethers } = require("ethers");
const fs = require("fs");
const url = "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc";
// const url = "https://avax-dfk.gateway.pokt.network/v1/lb/6244818c00b9f0003ad1b619/ext/bc/q2aTwKuyzgs8pynF7UXBZCU7DejbZbZ6EUyHr3JQzYgwNPUPi/rpc";
const erc20Abi = fs.readFileSync("./abis/erc20.json").toString();
const saleAbi = fs
  .readFileSync("./abis/HeroAuctionUpgradeable.json")
  .toString();
const crystalAddress = "0x04b9dA42306B023f3572e106B11D82aAd9D32EBb";
const saleAddress = "0xc390fAA4C7f66E4D62E59C231D5beD32Ff77BEf0";
const provider = new ethers.providers.JsonRpcProvider(url);
const DFKHeroCoreAddress = "0xEb9B61B145D6489Be575D3603F4a704810e143dF";
const heroABI = [
  "function getHero ( uint256 _id ) external view returns ( tuple )",
];
const config = require("./config.json");
const https = require('https');

// Matches "/echo [whatever]"
// bot.onText(/\/echo (.+)/, (msg, match) => {
//     // 'msg' is the received Message from Telegram
//     // 'match' is the result of executing the regexp above on the text content
//     // of the message
//     const chatId = msg.chat.id;
//     const resp = match[1]; // the captured "whatever"
//     // send back the matched "whatever" to the chat
//     bot.sendMessage(chatId, resp);
// });
  // Listen for any kind of message. There are different kinds of
  // messages.
// bot.on('message', (msg) => {
//     const chatId = msg.chat.id;
//     // send a message to the chat acknowledging receipt of their message
//     bot.sendMessage(chatId, 'Received your message, ' + msg.from.first_name);
// });





// let crystalContract = new ethers.Contract(
//     crystalAddress,
//     erc20Abi,
//     provider
// );
let saleContract = new ethers.Contract(saleAddress, saleAbi, provider);

// crystalContract.on("Transfer", (from, to, amount, event) => {
//     console.log(`${ from } sent ${ ethers.utils.formatEther(amount) } to ${ to}`);
// });

// address = "0x7B8ee8e1127de4faa326726c9595FB8c2b29Ec42";
// filter = crystalContract.filters.Transfer(null, address)
// crystalContract.on(filter, (from, to, amount, event) => {
//     console.log(`Received ${ ethers.utils.formatEther(amount) } from ${ from }`);
// });

// event AuctionCreated(
// uint256 auctionId,
// address indexed owner,
// uint256 indexed tokenId,
// uint256 startingPrice,
// uint256 endingPrice,
// uint256 duration,
// address winner);

// const getHeroDetails = async (heroId) => {
//   try {
//     let heroIdInt = Number(heroId);
//     let heroDetails = gql########;

//     console.log(heroDetails);
//     console.log(heroDetails.length);
//     // return heroDetails;
//   } catch (err) {
//     console.log(err.message);
//   }
// };



const data = JSON.stringify({
  query: ``,
});

const options = {
  hostname: 'defi-kingdoms-community-api-gateway-co06z8vi.uc.gateway.dev',
  path: '/graphql',
  port: 443,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'User-Agent': 'Node',
  },
};

const req = https.request(options, (res) => {
  let data = '';
  console.log(`statusCode: ${res.statusCode}`);

  res.on('data', (d) => {
    data += d;
  });
  res.on('end', () => {
    console.log(JSON.parse(data).data);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();





const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(config.botToken, {polling: true});

saleContract.on(
  "AuctionCreated",
  (auctionId, owner, tokenId, startingPrice, endingPrice, duration, winner) => {
    console.log(
      `Hero ${tokenId} posted by ${owner} for ${ethers.utils.formatUnits(
        startingPrice,
        18
      )} CRYSTAL`
    );
    // getHeroDetails(tokenId);
    bot.sendMessage(503468588, `Hero ${tokenId} posted for ${ethers.utils.formatUnits(startingPrice, 18)} CRYSTAL \n https://heroes.defikingdoms.com/image/${tokenId}`);
  }
);

