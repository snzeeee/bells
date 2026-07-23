/**
 * Bells auction keeper — settles the current auction once it ends, which
 * mints the next bell and starts the next auction ("the bell rings").
 *
 * Nouns auctions do not settle themselves; on mainnet bots race to call
 * settleCurrentAndCreateNewAuction. On our testnet this keeper plays that
 * role. Run it alongside the indexer on any machine holding a funded key:
 *
 *   npx hardhat run bells/keeper.js --network robinhoodTestnet
 */
const hre = require('hardhat');
const addresses = require('./addresses.robinhood-testnet.json');

const POLL_INTERVAL_MS = 60_000;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  const { ethers } = hre;
  const [keeper] = await ethers.getSigners();
  const auctionHouse = await ethers.getContractAt(
    'NounsAuctionHouse',
    addresses.NounsAuctionHouseProxy,
  );
  console.log(`Keeper ${keeper.address} watching ${addresses.NounsAuctionHouseProxy}`);

  for (;;) {
    try {
      const auction = await auctionHouse.auction();
      const { timestamp: now } = await ethers.provider.getBlock('latest');
      const secondsLeft = Number(auction.endTime) - now;

      if (auction.settled) {
        console.log(`[${new Date().toISOString()}] auction already settled — waiting`);
      } else if (secondsLeft > 0) {
        console.log(
          `[${new Date().toISOString()}] bell #${auction.nounId}: ${secondsLeft}s left`,
        );
      } else {
        console.log(`[${new Date().toISOString()}] bell #${auction.nounId} ended — settling…`);
        const tx = await auctionHouse.settleCurrentAndCreateNewAuction({ gasLimit: 2_000_000 });
        const receipt = await tx.wait();
        console.log(`  settled in ${receipt.transactionHash}`);
      }
    } catch (e) {
      console.error(`[${new Date().toISOString()}] keeper error: ${e.message}`);
    }
    await sleep(POLL_INTERVAL_MS);
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
