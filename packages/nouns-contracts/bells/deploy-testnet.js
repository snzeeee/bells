/**
 * Bells — full testnet deployment on Robinhood Chain testnet (chainId 46630).
 *
 * Mirrors `deploy-and-configure-short-times-dao-v3` minus Etherscan
 * verification (Blockscout chain) and minus `update-configs-dao-v3` (writes to
 * a removed SDK path). Demo parameters per BUILD-HANDOFF §8: 1h auctions,
 * ~10min voting delay, ~2h voting period, 10min timelock. The parent chain
 * produces one block every ~12s, and `block.number` on Arbitrum Orbit chains
 * follows the parent chain — hence 50/600 block values.
 *
 * Run: npx hardhat run bells/deploy-testnet.js --network robinhoodTestnet
 */
const fs = require('fs');
const path = require('path');
const hre = require('hardhat');

async function main() {
  const { run, ethers } = hre;
  const [deployer] = await ethers.getSigners();
  const balance = await deployer.getBalance();
  console.log(`Deployer: ${deployer.address} — balance: ${ethers.utils.formatEther(balance)} ETH`);

  // 1. WETH mock (no canonical WETH on this testnet)
  const weth = await (await ethers.getContractFactory('WETH')).deploy();
  await weth.deployed();
  console.log(`WETH deployed: ${weth.address}`);

  // 2. Full Nouns suite with demo governance times
  const contracts = await run('deploy-short-times-dao-v3', {
    autoDeploy: true,
    weth: weth.address,
    auctionDuration: 3600, // 1 hour — "the bell rings every hour on testnet"
    auctionTimeBuffer: 120,
    auctionReservePrice: 1,
    timelockDelay: 600, // 10 min
    votingPeriod: 600, // ~2h in parent-chain blocks
    votingDelay: 50, // ~10min in parent-chain blocks
  });

  // 3. On-chain art (placeholder Nouns traits — replaced by bell traits in Phase 5)
  await run('populate-descriptor', {
    nftDescriptor: contracts.NFTDescriptorV2.address,
    nounsDescriptor: contracts.NounsDescriptorV3.address,
  });

  // 4. Hand the keys to the DAO and start the first auction
  const executorAddress = contracts.NounsDAOExecutorProxy.instance.address;
  await (await contracts.NounsDescriptorV3.instance.transferOwnership(executorAddress)).wait();
  await (await contracts.NounsToken.instance.transferOwnership(executorAddress)).wait();
  await (
    await contracts.NounsAuctionHouseProxyAdmin.instance.transferOwnership(executorAddress)
  ).wait();
  console.log('Ownership of descriptor, token and proxy admin transferred to the executor.');

  const auctionHouse = contracts.NounsAuctionHouse.instance.attach(
    contracts.NounsAuctionHouseProxy.address,
  );
  await (await auctionHouse.unpause({ gasLimit: 1_000_000 })).wait();
  console.log('First auction started.');
  await (await auctionHouse.transferOwnership(executorAddress)).wait();
  console.log('Auction house ownership transferred to the executor.');

  // 5. Record addresses
  const out = { chainId: 46630, WETH: weth.address };
  for (const [name, c] of Object.entries(contracts)) out[name] = c.address;
  const outPath = path.join(__dirname, 'addresses.robinhood-testnet.json');
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
  console.log(`Addresses written to ${outPath}`);
  console.log(JSON.stringify(out, null, 2));

  const remaining = await deployer.getBalance();
  console.log(`Remaining balance: ${ethers.utils.formatEther(remaining)} ETH`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
