'use client';

import React, { useState } from 'react';
import { ArrowUpDown, Info, Loader2, CheckCircle, XCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import { useSwap } from '@/hooks/useSwap';
import { useWallet } from '@/context/WalletContext';
import { ALL_TOKENS, EVM_TOKENS, SOLANA_TOKENS, MOCK_BALANCES } from '@/constants/tokens';
import TokenSelector from './TokenSelector';
import SwapSettings from './SwapSettings';

export default function SwapCard() {
  const swap = useSwap();
  const { wallet } = useWallet();
  const [showWalletModal, setShowWalletModal] = useState(false);

  const tokens = wallet
    ? wallet.network === 'EVM'
      ? EVM_TOKENS
      : SOLANA_TOKENS
    : ALL_TOKENS;

  const fromBalance = swap.fromToken ? (MOCK_BALANCES[swap.fromToken.symbol] || 0) : 0;
  const toBalance = swap.toToken ? (MOCK_BALANCES[swap.toToken.symbol] || 0) : 0;
  const fromUSD = swap.fromAmount && swap.fromToken
    ? (parseFloat(swap.fromAmount) * swap.getPrice(swap.fromToken.symbol)).toFixed(2)
    : null;
  const toUSD = swap.toAmount && swap.toToken
    ? (parseFloat(swap.toAmount) * swap.getPrice(swap.toToken.symbol)).toFixed(2)
    : null;

  const hasInsufficientBalance = wallet && swap.fromToken && swap.fromAmount
    ? parseFloat(swap.fromAmount) > fromBalance
    : false;

  const getButtonLabel = () => {
    if (!wallet) return { label: 'Connect Wallet', variant: 'btn-primary', disabled: false };
    if (!swap.fromToken || !swap.toToken) return { label: 'Select Tokens', variant: 'btn-secondary', disabled: true };
    if (!swap.fromAmount || parseFloat(swap.fromAmount) === 0) return { label: 'Enter an Amount', variant: 'btn-secondary', disabled: true };
    if (hasInsufficientBalance) return { label: `Insufficient ${swap.fromToken.symbol} Balance`, variant: 'btn-danger', disabled: true };
    if (swap.isLoading) return { label: 'Swapping...', variant: 'btn-primary', disabled: true };
    return { label: `Swap ${swap.fromToken?.symbol || ''} → ${swap.toToken?.symbol || ''}`, variant: 'btn-primary', disabled: false };
  };

  const { label: btnLabel, variant: btnVariant, disabled: btnDisabled } = getButtonLabel();

  const getPriceImpactStyle = () => {
    if (swap.priceImpact > 5) return 'impact-high';
    if (swap.priceImpact > 2) return 'impact-medium';
    return 'impact-low';
  };

  return (
    <>
      <div
        className="card animate-slide-up"
        style={{
          padding: '20px',
          border: '1px solid var(--border-medium)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>Swap</h2>
          <SwapSettings slippage={swap.slippage} onSlippageChange={swap.setSlippage} />
        </div>

        {/* From Token Box */}
        <div
          style={{
            background: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            marginBottom: '4px',
            transition: 'border-color var(--transition-fast)',
          }}
          onFocus={() => {}}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>You Pay</span>
            {wallet && swap.fromToken && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Balance: {fromBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })} {swap.fromToken.symbol}
                </span>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={swap.setMaxAmount}
                  style={{
                    padding: '2px 8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(124,58,237,0.15)',
                    color: 'var(--accent-purple-light)',
                    border: '1px solid rgba(124,58,237,0.3)',
                  }}
                >
                  MAX
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              className="amount-input"
              type="number"
              placeholder="0.0"
              value={swap.fromAmount}
              onChange={(e) => swap.setFromAmount(e.target.value)}
              min={0}
            />
            <TokenSelector
              tokens={tokens}
              selected={swap.fromToken}
              onSelect={swap.setFromToken}
              label="Select"
            />
          </div>
          {fromUSD && (
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
              ≈ ${parseFloat(fromUSD).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          )}
        </div>

        {/* Flip Button */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '2px 0', position: 'relative', zIndex: 1 }}>
          <button
            onClick={swap.flipTokens}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'var(--bg-card)',
              border: '2px solid var(--border-medium)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all var(--transition-base)',
              color: 'var(--text-secondary)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.borderColor = 'var(--accent-purple-light)';
              el.style.color = 'var(--accent-purple-light)';
              el.style.transform = 'rotate(180deg)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.borderColor = 'var(--border-medium)';
              el.style.color = 'var(--text-secondary)';
              el.style.transform = 'none';
            }}
          >
            <ArrowUpDown size={16} />
          </button>
        </div>

        {/* To Token Box */}
        <div
          style={{
            background: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            marginTop: '4px',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>You Receive</span>
            {wallet && swap.toToken && toBalance > 0 && (
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Balance: {toBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })} {swap.toToken.symbol}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              className="amount-input"
              type="text"
              placeholder="0.0"
              value={swap.toAmount}
              readOnly
              style={{ color: swap.toAmount ? 'var(--accent-green)' : 'var(--text-muted)' }}
            />
            <TokenSelector
              tokens={tokens}
              selected={swap.toToken}
              onSelect={swap.setToToken}
              label="Select"
            />
          </div>
          {toUSD && (
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
              ≈ ${parseFloat(toUSD).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          )}
        </div>

        {/* Swap Details */}
        {swap.fromToken && swap.toToken && swap.fromAmount && parseFloat(swap.fromAmount) > 0 && (
          <div
            style={{
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              marginBottom: '14px',
              fontSize: '13px',
            }}
            className="animate-fade-in"
          >
            {/* Rate */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Rate</span>
              <span style={{ fontWeight: 500 }}>
                1 {swap.fromToken.symbol} = {swap.exchangeRate.toFixed(6)} {swap.toToken.symbol}
              </span>
            </div>

            {/* Price Impact */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                Price Impact
                <div className="tooltip-container">
                  <Info size={11} color="var(--text-muted)" style={{ cursor: 'help' }} />
                  <div className="tooltip-content">Market price change due to trade size</div>
                </div>
              </div>
              <span className={getPriceImpactStyle()} style={{ fontWeight: 600 }}>
                {swap.priceImpact > 5 && <AlertTriangle size={11} style={{ display: 'inline', marginRight: '3px' }} />}
                {swap.priceImpact.toFixed(2)}%
              </span>
            </div>

            {/* Min Received */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Min. Received</span>
              <span style={{ fontWeight: 500 }}>
                {swap.minimumReceived.toFixed(6)} {swap.toToken.symbol}
              </span>
            </div>

            {/* Slippage */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Slippage</span>
              <span style={{ fontWeight: 500 }}>{swap.slippage}%</span>
            </div>

            {/* Route */}
            {swap.route && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Route</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                  {swap.route.path.map((step, i) => (
                    <React.Fragment key={step}>
                      <span style={{ color: 'var(--text-primary)' }}>{step}</span>
                      {i < swap.route!.path.length - 1 && <ArrowRight size={11} color="var(--text-muted)" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Transaction Status */}
        {swap.txStatus === 'pending' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              background: 'rgba(245,158,11,0.08)',
              border: '1px solid rgba(245,158,11,0.25)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '14px',
              fontSize: '13px',
              color: 'var(--accent-orange)',
            }}
            className="animate-fade-in"
          >
            <Loader2 size={16} className="animate-spin" />
            Waiting for confirmation...
          </div>
        )}

        {swap.txStatus === 'success' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.25)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '14px',
              fontSize: '13px',
              color: 'var(--accent-green)',
            }}
            className="animate-bounce-in"
          >
            <CheckCircle size={16} />
            Transaction confirmed! 🎉
          </div>
        )}

        {swap.txStatus === 'error' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '14px',
              fontSize: '13px',
              color: 'var(--accent-red)',
            }}
            className="animate-fade-in"
          >
            <XCircle size={16} />
            Transaction failed. Please try again.
          </div>
        )}

        {/* Swap Button */}
        <button
          className={`btn ${btnVariant} btn-large`}
          style={{ width: '100%' }}
          disabled={btnDisabled}
          onClick={async () => {
            if (!wallet) {
              // Trigger wallet modal from parent via event or state
              window.dispatchEvent(new CustomEvent('open-wallet-modal'));
            } else {
              await swap.executeSwap();
            }
          }}
        >
          {swap.isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Swapping...
            </>
          ) : (
            btnLabel
          )}
        </button>

        {/* Powered by */}
        <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>
          Powered by DexSwap · Best rates aggregated across 30+ protocols
        </div>
      </div>
    </>
  );
}
