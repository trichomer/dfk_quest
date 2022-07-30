const { ethers } = require("ethers");
const fs = require('fs');
const { EthersProvider } = require("simple-uniswap-sdk");
const url = 'https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc';
const provider = new ethers.providers.JsonRpcProvider(url);
const { Route, ChainId, Trade, TokenAmount, TradeType, Fetcher, Token } = require("@uniswap/sdk");
const signer = provider.getSigner();

const rxWalletAddress = '0x9aB773A84E0ACbf2F793B1ec267465293208dfB7';

const privateKey = fs.readFileSync(".secret").toString().trim();
const wallet = new ethers.Wallet(privateKey, provider);
const erc20Abi = fs.readFileSync("./abis/erc20.json").toString();
const masterGardenerAbi = fs.readFileSync("./abis/MasterGardener.json").toString();
const bankAbi = fs.readFileSync("./abis/bank.json").toString();
const uniswapFactoryAbi = fs.readFileSync("./abis/UniswapV2Factory.json").toString();
const uniswapRouterAbi = fs.readFileSync("./abis/UniswapV2Router02.json").toString();

const uniswapFactory = '0x794C07912474351b3134E6D6B3B7b3b4A07cbAAa';
const uniswapFactoryContract = new ethers.Contract(uniswapFactory, uniswapFactoryAbi, provider);
const uniswapRouter = '0x3C351E1afdd1b1BC44e931E12D4E05D6125eaeCa';
const uniswapRouterContract = new ethers.Contract(uniswapRouter, uniswapRouterAbi, provider);
// console.log(uniswapFactoryc);

const masterGardenerAddress = '0x57Dec9cC7f492d6583c773e2E7ad66dcDc6940Fb';
const masterGardenerContract = new ethers.Contract(masterGardenerAddress, masterGardenerAbi, provider);

const bankAddress = '0x6e7185872bcdf3f7a6cbbe81356e50daffb002d2';
const bankContract = new ethers.Contract(bankAddress, bankAbi, provider);

const crystalAddress = '0x04b9dA42306B023f3572e106B11D82aAd9D32EBb';
const crystalContract = new ethers.Contract(crystalAddress, erc20Abi, provider);
const xjewelAddress = '0x77f2656d04E158f915bC22f07B779D94c1DC47Ff';
const xjewelContract = new ethers.Contract(xjewelAddress, erc20Abi, provider);
const crystalUsdcPair = '0x04Dec678825b8DfD2D0d9bD83B538bE3fbDA2926';
const crystalUsdcContract = new ethers.Contract(crystalUsdcPair, erc20Abi, provider);
const jewelXJewelPair = '0x6AC38A4C112F125eac0eBDbaDBed0BC8F4575d0d';
const jewelXJewelAbi = fs.readFileSync("./abis/ethUsdcAbi.json").toString();
const jewelXJewelContract = new ethers.Contract(jewelXJewelPair, jewelXJewelAbi, provider);
const jewelCrystalPair = '0x48658E69D741024b4686C8f7b236D3F1D291f386';
const jewelCrystalContract = new ethers.Contract(jewelCrystalPair, erc20Abi, provider);
const wjewelAddress = '0xCCb93dABD71c8Dad03Fc4CE5559dC3D89F67a260';
const wjewelContract = new ethers.Contract(wjewelAddress, erc20Abi, provider);
const xcrystalAddress = '0x6e7185872bcdf3f7a6cbbe81356e50daffb002d2';
const xcrystalContract = new ethers.Contract(xcrystalAddress, erc20Abi, provider);
const usdcAddress = '0x3AD9DFE640E1A9Cc1D9B0948620820D975c3803a';
const usdcContract = new ethers.Contract(usdcAddress, erc20Abi, provider);
const goldAddress = '0x576C260513204392F0eC0bc865450872025CB1cA';
const goldContract = new ethers.Contract(goldAddress, erc20Abi, provider);


const ethUrl = 'https://eth-mainnet.g.alchemy.com/v2/Me9TM57oKMh4sMHIiLBSLgOfWG1SCqx0';
const ethProvider = new ethers.providers.JsonRpcProvider(ethUrl);
const ethUsdcEthPair = '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc';
const ethUsdcAbi = fs.readFileSync("./abis/ethUsdcAbi.json").toString();
const ethUsdcEthContract = new ethers.Contract(ethUsdcEthPair, ethUsdcAbi, ethProvider);

const hmyUrl = 'https://api.s0.t.hmny.io/';
const hmyProvider = new ethers.providers.JsonRpcProvider(hmyUrl);
const woneJewelPair = '0xEb579ddcD49A7beb3f205c9fF6006Bb6390F138f';
const woneJewelAbi = fs.readFileSync("./abis/ethUsdcAbi.json").toString();
const woneJewelContract = new ethers.Contract(woneJewelPair, woneJewelAbi, hmyProvider);


const balances = async () => {
    console.log('#'.repeat(50),
        '\n DFK Chain Balances\n',
        rxWalletAddress, 
        '\n', 
        '#'.repeat(50));
    console.log('-'.repeat(50));

    blockNumber = await provider.getBlockNumber();
    console.log('DFK Chain block #', blockNumber);
    jewelBalance = await provider.getBalance(rxWalletAddress);
    console.log(ethers.utils.formatEther(jewelBalance), 'JEWEL');

    console.log('-'.repeat(50), '\nBank\n');
    bankBalance = await bankContract.balanceOf(rxWalletAddress);
    console.log(ethers.utils.formatUnits(bankBalance), 'xCRYSTAL in Bank');
    bankSupply = await bankContract.totalSupply();
    console.log(ethers.utils.formatUnits(bankSupply), 'Bank Total Supply');

    console.log('-'.repeat(50), '\nERC20 Tokens\n');
    crystalName = await crystalContract.name();
    console.log('Name:', crystalName);
    crystalSymbol = await crystalContract.symbol();
    console.log('Symbol:', crystalSymbol);
    crystalDecimals = await crystalContract.decimals();
    console.log('Decimals:', crystalDecimals);
    crystalBalance = await crystalContract.balanceOf(rxWalletAddress);
    console.log(ethers.utils.formatUnits(crystalBalance), 'CRYSTAL');

    xcrystalName = await xcrystalContract.name();
    console.log('Name:', xcrystalName);
    xcrystalSymbol = await xcrystalContract.symbol();
    console.log('Symbol:', xcrystalSymbol);
    xcrystalDecimals = await xcrystalContract.decimals();
    console.log('Decimals:', xcrystalDecimals);
    xcrystalBalance = await xcrystalContract.balanceOf(rxWalletAddress);
    console.log(ethers.utils.formatUnits(xcrystalBalance), 'xCRYSTAL');
    console.log('-'.repeat(60));

    wjewelName = await wjewelContract.name();
    console.log('Name:', wjewelName);
    wjewelSymbol = await wjewelContract.symbol();
    console.log('Symbol:', wjewelSymbol);
    wjewelDecimals = await wjewelContract.decimals();
    console.log('Decimals:', wjewelDecimals);
    wjewelBalance = await wjewelContract.balanceOf(rxWalletAddress);
    console.log(ethers.utils.formatUnits(wjewelBalance), 'WJEWEL');
    console.log('-'.repeat(60));

    xjewelName = await xjewelContract.name();
    console.log('Name:', xjewelName);
    xjewelSymbol = await xjewelContract.symbol();
    console.log('Symbol:', xjewelSymbol);
    xjewelDecimals = await xjewelContract.decimals();
    console.log('Decimals:', xjewelDecimals);
    xjewelBalance = await xjewelContract.balanceOf(rxWalletAddress);
    console.log(ethers.utils.formatUnits(xjewelBalance), 'xJEWEL');
    console.log('-'.repeat(60));

    usdcName = await usdcContract.name();
    console.log('Name:', usdcName);
    usdcSymbol = await usdcContract.symbol();
    console.log('Symbol:', usdcSymbol);
    usdcDecimals = await usdcContract.decimals();
    console.log('Decimals:', usdcDecimals);
    usdcBalance = await usdcContract.balanceOf(rxWalletAddress);
    console.log(ethers.utils.formatUnits(usdcBalance), 'USDC');
    console.log('-'.repeat(60));

    goldName = await goldContract.name();
    console.log('Name:', goldName);
    goldSymbol = await goldContract.symbol();
    console.log('Symbol:', goldSymbol);
    goldDecimals = await goldContract.decimals();
    console.log('Decimals:', goldDecimals);
    goldBalance = await goldContract.balanceOf(rxWalletAddress);
    console.log(ethers.utils.formatUnits(goldBalance), 'DFKGOLD');
    console.log('-'.repeat(60));

    // console.log('-'.repeat(50), '\nGardens\n');
    // gardenPending = await masterGardenerContract.pendingReward(2, rxWalletAddress);
    // console.log(ethers.utils.formatUnits(gardenPending));
    // gardenUser = await masterGardenerContract.userInfo(rxWalletAddress);
    // console.log(gardenUser);
    // gardenPoolId = await masterGardenerContract.poolId1(rxWalletAddress);
    // console.log(ethers.utils.formatUnits(gardenPoolId));
    // gardenPools = await masterGardenerContract.poolLength();
    // console.log(ethers.utils.formatUnits(gardenPools));
    // garden2 = await masterGardenerContract.poolInfo(jewelXJewelPair);
    // console.log(garden2);


    console.log('-'.repeat(50), '\nPairs\n');
    pair1 = await uniswapFactoryContract.functions.getPair(wjewelAddress, xjewelAddress);
    console.log('Pair address for xJewel-wJewel pulled from Factory Contract using getPair():\n', pair1);

    // console.log(jewelCrystalContract);

    // reserves1 = await ethUsdcEthContract.functions.getReserves();
    // console.log(reserves1);

    // reserves2 = await woneJewelContract.functions.getReserves();
    // console.log('\n #### Harmony - wONE-JEWEL pair token reserves #### \n', reserves2, '\n');

    reserves = await jewelXJewelContract.functions.getReserves();
    console.log('\n #### DFK Chain - wJEWEL-xJEWEL pair token reserves #### \n', reserves, '\n');





    // const route = new Route([pair1, wjewelAddress]);
    // console.log(route);
    // const trade = new Trade(route, new TokenAmount(wjewelAddress, '100000000000000', TradeType.EXACT_INPUT));
    // console.log(trade);

    // a = pair_con.getAmountsOut(1.0, [wjewelAddress, xjewelAddress]);
    // console.log(a);

    // crystalUsdcName = await crystalUsdcContract.name();
    // console.log('Name:', crystalUsdcName);
    // crystalUsdcSymbol = await crystalUsdcContract.symbol();
    // console.log('Symbol:', crystalUsdcSymbol);
    // crystalUsdcDecimals = await crystalUsdcContract.decimals();
    // console.log('Decimals:', crystalUsdcDecimals);
    // crystalUsdcBalance = await crystalUsdcContract.balanceOf(rxWalletAddress);
    // console.log(ethers.utils.formatUnits(crystalUsdcBalance), 'CRYSTAL-USDC');
    // console.log('-'.repeat(60));

    // jewelXJewelName = await jewelXJewelContract.name();
    // console.log('Name:', jewelXJewelName);
    // jewelXJewelSymbol = await jewelXJewelContract.symbol();
    // console.log('Symbol:', jewelXJewelSymbol);
    // jewelXJewelDecimals = await jewelXJewelContract.decimals();
    // console.log('Decimals:', jewelXJewelDecimals);
    // jewelXJewelBalance = await jewelXJewelContract.balanceOf(rxWalletAddress);
    // console.log(ethers.utils.formatUnits(jewelXJewelBalance), 'JEWEL-xJEWEL');
    // console.log('-'.repeat(60));

    // jewelCrystalName = await jewelCrystalContract.name();
    // console.log('Name:', crystalUsdcName);
    // jewelCrystalSymbol = await jewelCrystalContract.symbol();
    // console.log('Symbol:', jewelCrystalSymbol);
    // jewelCrystalDecimals = await jewelCrystalContract.decimals();
    // console.log('Decimals:', jewelCrystalDecimals);
    // jewelCrystalBalance = await jewelCrystalContract.balanceOf(rxWalletAddress);
    // console.log(ethers.utils.formatUnits(jewelCrystalBalance), 'CRYSTAL-USDC');
    // console.log('-'.repeat(60));
};

balances();




// const txn = async () => {
//     const tx = signer.sendTransaction({
//         to: rxWalletAddress,
//         value: ethers.utils.parseEther("0.0001")
//     });
// };

// txn();




