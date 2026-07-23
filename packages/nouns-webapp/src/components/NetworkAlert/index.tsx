import { useState } from 'react';

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

const DISMISS_KEY = 'bells-network-alert-dismissed';

/**
 * Non-blocking banner shown while the connected wallet is on another chain.
 * Browsing stays available; transactions are chain-guarded at the call sites.
 */
const NetworkAlert = () => {
  const { chainId: currentChainId } = useAccount();
  const { switchChain, isPending } = useSwitchChain();
  const [switchError, setSwitchError] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem(DISMISS_KEY) === 'true');

  if (dismissed) return null;

  const handleSwitch = () => {
    setSwitchError(null);
    switchChain(
      { chainId: targetChainId },
      {
        onError: err => setSwitchError(err.message.split('\n')[0]),
      },
    );
  };

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, 'true');
    setDismissed(true);
  };

  const targetLabel = chainLabel(targetChainId);
  const currentLabel =
    currentChainId !== undefined ? chainLabel(currentChainId) : 'an unknown network';

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-amber-300 bg-amber-50 px-4 py-3 text-amber-900">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <p className="m-0 text-sm">
          Your wallet is connected to <b>{currentLabel}</b> — bidding and voting need{' '}
          <b>{targetLabel}</b>.
        </p>
        <Button
          onClick={handleSwitch}
          disabled={isPending}
          size="sm"
          className="bg-gray-900 hover:bg-gray-800"
        >
          {isPending ? 'Switching…' : `Switch to ${targetLabel}`}
        </Button>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss network alert"
          className="text-xl leading-none text-amber-900/60 hover:text-amber-900"
        >
          ×
        </button>
        {switchError && (
          <p className="m-0 w-full text-center text-xs text-red-700">
            {switchError} — add it manually: chain ID {targetChainId}, RPC
            https://rpc.testnet.chain.robinhood.com, explorer
            https://explorer.testnet.chain.robinhood.com
          </p>
        )}
      </div>
    </div>
  );
};
export default NetworkAlert;
