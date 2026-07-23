import { useState } from 'react';

import { Modal } from 'react-bootstrap';
import { useAccount, useSwitchChain } from 'wagmi';

import { Button } from '@/components/ui/button';
import { defaultChain } from '@/wagmi';

const KNOWN_CHAINS: Record<number, string> = {
  1: 'Ethereum Mainnet',
  10: 'Optimism',
  56: 'BNB Chain',
  130: 'Unichain',
  137: 'Polygon',
  8453: 'Base',
  42161: 'Arbitrum One',
  43114: 'Avalanche',
  59144: 'Linea',
  81457: 'Blast',
  7777777: 'Zora',
  11155111: 'Sepolia',
};

const chainLabel = (id: number) =>
  id === defaultChain.id ? defaultChain.name : (KNOWN_CHAINS[id] ?? `chain ${id}`);

const targetChainId = defaultChain.id;

const NetworkAlert = () => {
  const { chainId: currentChainId } = useAccount();
  const { switchChain, isPending } = useSwitchChain();
  const [switchError, setSwitchError] = useState<string | null>(null);

  const handleSwitch = () => {
    setSwitchError(null);
    switchChain(
      { chainId: targetChainId },
      {
        onError: err => setSwitchError(err.message),
      },
    );
  };

  const targetLabel = chainLabel(targetChainId);
  const currentLabel =
    currentChainId !== undefined ? chainLabel(currentChainId) : 'an unknown network';

  return (
    <Modal show={true} backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>Wrong Network Detected</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Your wallet is connected to <b>{currentLabel}</b>. Bells auctions require{' '}
          <b>{targetLabel}</b> to participate.
        </p>
        <Button
          onClick={handleSwitch}
          disabled={isPending}
          size="lg"
          className="mt-4 w-full bg-gray-900 hover:bg-gray-800"
        >
          {isPending ? 'Switching…' : `Switch to ${targetLabel}`}
        </Button>
        {switchError && (
          <>
            <p className="mt-3 text-sm text-red-600">{switchError}</p>
            <p className="mt-3">
              <b>If your wallet didn&apos;t prompt, add the network manually:</b>
            </p>
            <ol>
              <li>Open your wallet and click the network dropdown</li>
              <li>Choose &quot;Add a custom network&quot;</li>
              <li>
                Name: {targetLabel} — Chain ID: {targetChainId}
              </li>
              <li>RPC: https://rpc.testnet.chain.robinhood.com</li>
              <li>Currency: ETH — Explorer: https://explorer.testnet.chain.robinhood.com</li>
            </ol>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};
export default NetworkAlert;
