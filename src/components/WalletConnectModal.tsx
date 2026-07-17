'use client';

import React from 'react';
import { X, Zap, Shield, Globe } from 'lucide-react';
import { useWallet, WalletType } from '@/context/WalletContext';

interface Props {
  onClose: () => void;
}

interface WalletOption {
  id: WalletType;
  name: string;
  description: string;
  icon: string;
  network: 'EVM' | 'Solana';
  popular?: boolean;
}

const EVM_WALLETS: WalletOption[] = [
  {
    id: 'metamask',
    name: 'MetaMask',
    description: 'The most popular Ethereum wallet',
    icon: '🦊',
    network: 'EVM',
    popular: true,
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    description: 'Scan with any mobile wallet',
    icon: '🔗',
    network: 'EVM',
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    description: 'Connect to Coinbase Wallet',
    icon: '🔵',
    network: 'EVM',
  },
];

const SOLANA_WALLETS: WalletOption[] = [
  {
    id: 'phantom',
    name: 'Phantom',
    description: 'The most popular Solana wallet',
    icon: '👻',
    network: 'Solana',
    popular: true,
  },
  {
    id: 'solflare',
    name: 'Solflare',
    description: 'Native Solana wallet extension',
    icon: '☀️',
    network: 'Solana',
  },
  {
    id: 'backpack',
    name: 'Backpack',
    description: 'xNFT wallet for Solana',
    icon: '🎒',
    network: 'Solana',
  },
];

export default function WalletConnectModal({ onClose }: Props) {
  const { connectWallet, isConnecting } = useWallet();

  const handleConnect = async (walletId: WalletType) => {
    await connectWallet(walletId);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="card modal-content glass-strong"
        style={{ padding: '0', overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px 24px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>Connect Wallet</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Choose your wallet to start trading
            </p>
          </div>
          <button
            className="btn btn-ghost"
            onClick={onClose}
            style={{ padding: '8px', width: '36px', height: '36px', borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '20px 24px', overflowY: 'auto', maxHeight: 'calc(85vh - 100px)' }}>
          {/* Features */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              marginBottom: '24px',
            }}
          >
            {[
              { icon: <Shield size={14} />, label: 'Non-Custodial' },
              { icon: <Zap size={14} />, label: 'Instant Swaps' },
              { icon: <Globe size={14} />, label: 'Multi-Chain' },
            ].map((f) => (
              <div
                key={f.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 10px',
                  background: 'var(--bg-input)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  fontWeight: 500,
                }}
              >
                <span style={{ color: 'var(--accent-purple-light)' }}>{f.icon}</span>
                {f.label}
              </div>
            ))}
          </div>

          {/* EVM Wallets */}
          <div style={{ marginBottom: '20px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '10px',
              }}
            >
              <span className="badge badge-evm">EVM</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Ethereum, BNB Chain, Polygon, Arbitrum…
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {EVM_WALLETS.map((wallet) => (
                <WalletButton
                  key={wallet.id}
                  wallet={wallet}
                  onSelect={() => handleConnect(wallet.id)}
                  isConnecting={isConnecting}
                />
              ))}
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          </div>

          {/* Solana Wallets */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '10px',
              }}
            >
              <span className="badge badge-solana">Solana</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                SOL, SPL Tokens, NFTs…
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {SOLANA_WALLETS.map((wallet) => (
                <WalletButton
                  key={wallet.id}
                  wallet={wallet}
                  onSelect={() => handleConnect(wallet.id)}
                  isConnecting={isConnecting}
                />
              ))}
            </div>
          </div>

          {/* Footer */}
          <p
            style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              textAlign: 'center',
              marginTop: '20px',
              lineHeight: 1.5,
            }}
          >
            By connecting a wallet, you agree to our Terms of Service and acknowledge that you have read and understand our Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

function WalletButton({
  wallet,
  onSelect,
  isConnecting,
}: {
  wallet: WalletOption;
  onSelect: () => void;
  isConnecting: boolean;
}) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      onClick={onSelect}
      disabled={isConnecting}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '14px 16px',
        background: hovered ? 'var(--bg-card-hover)' : 'var(--bg-input)',
        border: `1px solid ${hovered ? 'var(--border-medium)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-md)',
        cursor: isConnecting ? 'wait' : 'pointer',
        width: '100%',
        textAlign: 'left',
        transition: 'all var(--transition-fast)',
        transform: hovered ? 'translateX(4px)' : 'none',
      }}
    >
      <span style={{ fontSize: '26px', lineHeight: 1 }}>{wallet.icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)' }}>
            {wallet.name}
          </span>
          {wallet.popular && (
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(124,58,237,0.2)',
                color: 'var(--accent-purple-light)',
                border: '1px solid rgba(124,58,237,0.3)',
              }}
            >
              Popular
            </span>
          )}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
          {wallet.description}
        </div>
      </div>
      <div style={{ color: 'var(--text-muted)', fontSize: '18px', opacity: hovered ? 1 : 0.4, transition: 'opacity 0.15s' }}>›</div>
    </button>
  );
}
