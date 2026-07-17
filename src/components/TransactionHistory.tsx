'use client';

import React, { useState } from 'react';
import { ExternalLink, Clock, CheckCircle, XCircle, Loader2, ArrowRight, History } from 'lucide-react';

// Fixed base time (module-level constant so it's identical on SSR and client)
const BASE_TIME = new Date('2026-07-17T10:00:00.000Z').getTime();

interface Transaction {
  id: string;
  fromSymbol: string;
  toSymbol: string;
  fromAmount: string;
  toAmount: string;
  status: 'success' | 'pending' | 'failed';
  timestamp: Date;
  hash: string;
  network: 'EVM' | 'Solana';
  gasUsed?: string;
  priceImpact?: string;
}

const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    fromSymbol: 'ETH',
    toSymbol: 'USDC',
    fromAmount: '0.5',
    toAmount: '1,710.29',
    status: 'success',
    timestamp: new Date(BASE_TIME - 5 * 60 * 1000),
    hash: '0x3a8f1b2c4d5e6a7b8c9d0e1f2a3b4c5d6e7f8a9b',
    network: 'EVM',
    gasUsed: '$2.14',
    priceImpact: '0.02%',
  },
  {
    id: '2',
    fromSymbol: 'SOL',
    toSymbol: 'BONK',
    fromAmount: '2.0',
    toAmount: '14,583,329',
    status: 'success',
    timestamp: new Date(BASE_TIME - 22 * 60 * 1000),
    hash: 'DRpbCKgHGg3uYpk74DhWzBwJGq1S8VsE5fNH2gDiM',
    network: 'Solana',
    gasUsed: '$0.00025',
    priceImpact: '0.08%',
  },
  {
    id: '3',
    fromSymbol: 'WBTC',
    toSymbol: 'ETH',
    fromAmount: '0.012',
    toAmount: '0.2384',
    status: 'pending',
    timestamp: new Date(BASE_TIME - 2 * 60 * 1000),
    hash: '0x7c9d2e1f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d',
    network: 'EVM',
  },
  {
    id: '4',
    fromSymbol: 'UNI',
    toSymbol: 'LINK',
    fromAmount: '50',
    toAmount: '32.14',
    status: 'failed',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    hash: '0xd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3',
    network: 'EVM',
    gasUsed: '$1.87',
    priceImpact: '—',
  },
];

const StatusIcon = ({ status }: { status: Transaction['status'] }) => {
  if (status === 'success') return <CheckCircle size={15} color="var(--accent-green)" />;
  if (status === 'pending') return <Loader2 size={15} color="var(--accent-orange)" className="animate-spin" />;
  return <XCircle size={15} color="var(--accent-red)" />;
};

const StatusBadge = ({ status }: { status: Transaction['status'] }) => (
  <span className={`badge ${status === 'success' ? 'badge-success' : status === 'pending' ? 'badge-pending' : 'badge-error'}`}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

const formatTimeAgo = (date: Date) => {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
};

export default function TransactionHistory() {
  const [filter, setFilter] = useState<'all' | 'success' | 'pending' | 'failed'>('all');

  const filtered = DEMO_TRANSACTIONS.filter(
    (tx) => filter === 'all' || tx.status === filter
  );

  const getExplorerUrl = (tx: Transaction) => {
    if (tx.network === 'EVM') return `https://etherscan.io/tx/${tx.hash}`;
    return `https://solscan.io/tx/${tx.hash}`;
  };

  return (
    <div className="card animate-fade-in" style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <History size={16} color="var(--text-secondary)" />
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Transaction History</h3>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-input)', padding: '3px', borderRadius: 'var(--radius-full)' }}>
          {(['all', 'success', 'pending', 'failed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: filter === f ? 'var(--bg-card)' : 'transparent',
                color: filter === f ? 'var(--text-primary)' : 'var(--text-muted)',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all var(--transition-fast)',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: '14px' }}>
          <Clock size={28} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.4 }} />
          No transactions found
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filtered.map((tx) => (
            <div
              key={tx.id}
              className="card-hover"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 16px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                transition: 'all var(--transition-fast)',
              }}
            >
              {/* Status Icon */}
              <StatusIcon status={tx.status} />

              {/* Pair */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                  <span style={{ fontWeight: 700, fontSize: '14px' }}>{tx.fromSymbol}</span>
                  <ArrowRight size={12} color="var(--text-muted)" />
                  <span style={{ fontWeight: 700, fontSize: '14px' }}>{tx.toSymbol}</span>
                  <span className={tx.network === 'EVM' ? 'badge badge-evm' : 'badge badge-solana'}>
                    {tx.network}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {tx.fromAmount} {tx.fromSymbol} → {tx.toAmount} {tx.toSymbol}
                </div>
                {tx.gasUsed && (
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Gas: {tx.gasUsed}
                    {tx.priceImpact && ` · Impact: ${tx.priceImpact}`}
                  </div>
                )}
              </div>

              {/* Right Side */}
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                <StatusBadge status={tx.status} />
                <span suppressHydrationWarning style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {formatTimeAgo(tx.timestamp)}
                </span>
                <a
                  href={getExplorerUrl(tx)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                    transition: 'color var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--accent-purple-light)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-muted)')}
                >
                  {tx.hash.slice(0, 8)}...
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
