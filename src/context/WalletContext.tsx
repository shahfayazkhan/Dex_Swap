'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// ─── Wallet Types ─────────────────────────────────────────────────────────────

export type WalletType = 'metamask' | 'walletconnect' | 'coinbase' | 'phantom' | 'solflare' | 'backpack';
export type NetworkType = 'EVM' | 'Solana';

export interface ConnectedWallet {
  type: WalletType;
  network: NetworkType;
  address: string;
  ensName?: string;
  balance: string;
  balanceUSD: string;
  chainId?: number;
}

interface WalletContextType {
  wallet: ConnectedWallet | null;
  isConnecting: boolean;
  connectWallet: (type: WalletType) => Promise<void>;
  disconnectWallet: () => void;
  formatAddress: (address: string) => string;
}

// ─── Mock Connection ──────────────────────────────────────────────────────────

const MOCK_ADDRESSES: Record<WalletType, string> = {
  metamask: '0x742d35Cc6634C0532925a3b8D4C9E0C9e5f0f1c3',
  walletconnect: '0xA839b1aC08c2348fCe8f11C62E30e7B6D92aBC01',
  coinbase: '0x9B7e2D8aF1a3c5B2041D7CD2C8F3A15BEd0C2D45',
  phantom: 'DRpbCKgHGg3uYpk74DhWzBwJGq1S8VsE5fNH2gDiMTfL',
  solflare: 'GmJGAVGL5CRBgqYuNBgKhDVNJM7B3qm1TBPaQxGr5nCK',
  backpack: 'HFxBmrMK1nE5ZZmYuLyMZGDz7aG4W2EPdPVqhVFqpWNu',
};

const MOCK_BALANCES: Record<WalletType, { balance: string; balanceUSD: string }> = {
  metamask: { balance: '2.4312 ETH', balanceUSD: '$8,316.52' },
  walletconnect: { balance: '0.8791 ETH', balanceUSD: '$3,006.77' },
  coinbase: { balance: '1.1234 ETH', balanceUSD: '$3,841.68' },
  phantom: { balance: '12.845 SOL', balanceUSD: '$2,253.15' },
  solflare: { balance: '5.3210 SOL', balanceUSD: '$933.89' },
  backpack: { balance: '8.1100 SOL', balanceUSD: '$1,423.32' },
};

const WALLET_NETWORKS: Record<WalletType, NetworkType> = {
  metamask: 'EVM',
  walletconnect: 'EVM',
  coinbase: 'EVM',
  phantom: 'Solana',
  solflare: 'Solana',
  backpack: 'Solana',
};

// ─── Context ──────────────────────────────────────────────────────────────────

const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = useCallback(async (type: WalletType) => {
    setIsConnecting(true);
    // Simulate async connection delay
    await new Promise((r) => setTimeout(r, 1400));

    const address = MOCK_ADDRESSES[type];
    const { balance, balanceUSD } = MOCK_BALANCES[type];
    const network = WALLET_NETWORKS[type];

    setWallet({
      type,
      network,
      address,
      ensName: type === 'metamask' ? 'vitalik.eth' : undefined,
      balance,
      balanceUSD,
      chainId: network === 'EVM' ? 1 : undefined,
    });
    setIsConnecting(false);
  }, []);

  const disconnectWallet = useCallback(() => {
    setWallet(null);
  }, []);

  const formatAddress = useCallback((address: string) => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  return (
    <WalletContext.Provider
      value={{ wallet, isConnecting, connectWallet, disconnectWallet, formatAddress }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used inside WalletProvider');
  return ctx;
};
