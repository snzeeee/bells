import { find, pipe } from 'remeda';
import { defineChain } from 'viem';
import { createConfig, http, fallback, webSocket } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

import { CHAIN_ID, WALLET_CONNECT_V2_PROJECT_ID } from './config';

export const robinhoodTestnet = defineChain({
  id: 46630,
  name: 'Robinhood Chain Testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: [import.meta.env.VITE_ROBINHOOD_JSONRPC ?? 'https://rpc.testnet.chain.robinhood.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://explorer.testnet.chain.robinhood.com',
    },
  },
  testnet: true,
});

const activeChainId = Number(CHAIN_ID);

const activeChain =
  pipe(
    [mainnet, sepolia, robinhoodTestnet],
    find(chain => chain.id === activeChainId),
  ) ?? sepolia;

const transports = {
  [mainnet.id]: fallback([
    ...(import.meta.env.VITE_MAINNET_WSRPC !== undefined
      ? [webSocket(import.meta.env.VITE_MAINNET_WSRPC)]
      : []),
    ...(import.meta.env.VITE_MAINNET_JSONRPC !== undefined
      ? [http(import.meta.env.VITE_MAINNET_JSONRPC)]
      : []),
  ]),
  [sepolia.id]: fallback([
    ...(import.meta.env.VITE_SEPOLIA_WSRPC !== undefined
      ? [webSocket(import.meta.env.VITE_SEPOLIA_WSRPC)]
      : []),
    ...(import.meta.env.VITE_SEPOLIA_JSONRPC !== undefined
      ? [http(import.meta.env.VITE_SEPOLIA_JSONRPC)]
      : []),
  ]),
  [robinhoodTestnet.id]: http(
    import.meta.env.VITE_ROBINHOOD_JSONRPC ?? 'https://rpc.testnet.chain.robinhood.com',
  ),
};

export const config = createConfig({
  chains: [activeChain],
  transports,
  connectors: [
    injected(),
    walletConnect({
      projectId: WALLET_CONNECT_V2_PROJECT_ID,
      showQrModal: false,
    }),
    coinbaseWallet({
      appName: 'Bells',
    }),
  ],
});

export const defaultChain = activeChain;

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
