'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import SwapCard from '@/components/SwapCard';
import PriceChart from '@/components/PriceChart';
import TransactionHistory from '@/components/TransactionHistory';
import { TOKEN_PRICES } from '@/constants/tokens';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'swap' | 'tokens' | 'pools'>('swap');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Hero background gradient orbs */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-20%',
            right: '5%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(236,72,153,0.10) 0%, transparent 70%)',
          }}
        />
      </div>

      <main
        style={{
          flex: 1,
          position: 'relative',
          zIndex: 1,
          padding: '32px 16px 64px',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {activeTab === 'swap' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1fr) 480px',
              gap: '24px',
              alignItems: 'start',
            }}
            className="main-grid"
          >
            {/* Left: Chart + History */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <PriceChart />
              <TransactionHistory />
            </div>

            {/* Right: Swap Widget */}
            <div style={{ position: 'sticky', top: '96px' }}>
              <SwapCard />
            </div>
          </div>
        )}

        {activeTab === 'tokens' && <TokensPage />}
        {activeTab === 'pools' && <PoolsPage />}
      </main>

      <style>{`
        @media (max-width: 900px) {
          .main-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ─── Tokens Explorer Page ───────────────────────────────────────────────────── */
function TokensPage() {
  const tokens = [
    { symbol: 'ETH', name: 'Ethereum', price: TOKEN_PRICES['ETH'], change: 2.34, color: '#627EEA', network: 'EVM' },
    { symbol: 'SOL', name: 'Solana', price: TOKEN_PRICES['SOL'], change: 5.12, color: '#14F195', network: 'Solana' },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin', price: TOKEN_PRICES['WBTC'], change: -1.08, color: '#F7931A', network: 'EVM' },
    { symbol: 'UNI', name: 'Uniswap', price: TOKEN_PRICES['UNI'], change: 3.67, color: '#FF007A', network: 'EVM' },
    { symbol: 'LINK', name: 'Chainlink', price: TOKEN_PRICES['LINK'], change: 1.23, color: '#375BD2', network: 'EVM' },
    { symbol: 'AAVE', name: 'Aave', price: TOKEN_PRICES['AAVE'], change: -0.54, color: '#B6509E', network: 'EVM' },
    { symbol: 'MATIC', name: 'Polygon', price: TOKEN_PRICES['MATIC'], change: 4.21, color: '#8247E5', network: 'EVM' },
    { symbol: 'JUP', name: 'Jupiter', price: TOKEN_PRICES['JUP'], change: 8.45, color: '#F05032', network: 'Solana' },
    { symbol: 'BONK', name: 'Bonk', price: TOKEN_PRICES['BONK'], change: -2.11, color: '#F48C37', network: 'Solana' },
    { symbol: 'RAY', name: 'Raydium', price: TOKEN_PRICES['RAY'], change: 1.88, color: '#5AC4BE', network: 'Solana' },
  ];

  return (
    <div className="animate-fade-in">
      <h1
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '28px',
          fontWeight: 700,
          marginBottom: '24px',
        }}
      >
        Token Explorer
      </h1>
      <div className="card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              {['#', 'Token', 'Network', 'Price', '24h Change', 'Trade'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '14px 20px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tokens.map((t, i) => (
              <tr
                key={t.symbol}
                style={{
                  borderBottom: i < tokens.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  transition: 'background var(--transition-fast)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--bg-card-hover)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
              >
                <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '14px' }}>{i + 1}</td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: `${t.color}22`,
                        border: `1.5px solid ${t.color}55`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: t.color,
                      }}
                    >
                      {t.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '15px' }}>{t.symbol}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.name}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span className={t.network === 'EVM' ? 'badge badge-evm' : 'badge badge-solana'}>
                    {t.network}
                  </span>
                </td>
                <td style={{ padding: '16px 20px', fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif' }}>
                  ${t.price < 0.01 ? t.price.toFixed(8) : t.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td
                  style={{
                    padding: '16px 20px',
                    fontWeight: 600,
                    color: t.change >= 0 ? 'var(--accent-green)' : 'var(--accent-red)',
                  }}
                >
                  {t.change >= 0 ? '+' : ''}{t.change}%
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <button className="btn btn-secondary btn-sm">Trade</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Pools Page ─────────────────────────────────────────────────────────────── */
function PoolsPage() {
  const pools = [
    { pair: 'ETH / USDC', tvl: '$842.3M', volume: '$124.7M', fee: '0.30%', apy: '12.4%', color1: '#627EEA', color2: '#2775CA' },
    { pair: 'WBTC / ETH', tvl: '$521.1M', volume: '$87.2M', fee: '0.30%', apy: '8.9%', color1: '#F7931A', color2: '#627EEA' },
    { pair: 'SOL / USDC', tvl: '$284.6M', volume: '$64.5M', fee: '0.25%', apy: '18.2%', color1: '#14F195', color2: '#2775CA' },
    { pair: 'ETH / USDT', tvl: '$391.8M', volume: '$102.3M', fee: '0.05%', apy: '6.1%', color1: '#627EEA', color2: '#26A17B' },
    { pair: 'UNI / ETH', tvl: '$68.2M', volume: '$18.9M', fee: '0.30%', apy: '24.7%', color1: '#FF007A', color2: '#627EEA' },
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '28px', fontWeight: 700 }}>
          Liquidity Pools
        </h1>
        <button className="btn btn-primary">+ New Position</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {pools.map((p) => (
          <div key={p.pair} className="card card-hover" style={{ padding: '20px 24px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr repeat(4, auto)',
                gap: '32px',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex' }}>
                  {[p.color1, p.color2].map((c, i) => (
                    <div
                      key={i}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: `${c}22`,
                        border: `1.5px solid ${c}55`,
                        marginLeft: i > 0 ? '-8px' : 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    />
                  ))}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '16px' }}>{p.pair}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Fee tier: {p.fee}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '2px' }}>TVL</div>
                <div style={{ fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif' }}>{p.tvl}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '2px' }}>24h Volume</div>
                <div style={{ fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif' }}>{p.volume}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '2px' }}>APY</div>
                <div style={{ fontWeight: 700, color: 'var(--accent-green)', fontFamily: 'Space Grotesk, sans-serif' }}>{p.apy}</div>
              </div>
              <button className="btn btn-primary btn-sm">Add Liquidity</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
