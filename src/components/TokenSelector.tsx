'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { Token, MOCK_BALANCES, TOKEN_PRICES } from '@/constants/tokens';
import { useWallet } from '@/context/WalletContext';

interface Props {
  tokens: Token[];
  selected: Token | null;
  onSelect: (token: Token) => void;
  label: string;
}

export default function TokenSelector({ tokens, selected, onSelect, label }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { wallet } = useWallet();
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = tokens.filter(
    (t) =>
      t.symbol.toLowerCase().includes(query.toLowerCase()) ||
      t.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery('');
    }
  }, [open]);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: selected ? '8px 12px 8px 8px' : '10px 14px',
          background: selected ? 'var(--bg-input)' : 'var(--gradient-primary)',
          border: `1px solid ${selected ? 'var(--border-medium)' : 'transparent'}`,
          borderRadius: 'var(--radius-full)',
          cursor: 'pointer',
          transition: 'all var(--transition-fast)',
          flexShrink: 0,
          color: selected ? 'var(--text-primary)' : '#fff',
          fontWeight: 600,
          fontSize: '15px',
          fontFamily: 'Inter, sans-serif',
          boxShadow: selected ? 'none' : '0 4px 14px rgba(124,58,237,0.3)',
          whiteSpace: 'nowrap',
        }}
      >
        {selected ? (
          <>
            {/* Token Badge */}
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: `${selected.color}22`,
                border: `1.5px solid ${selected.color}55`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 800,
                color: selected.color,
                flexShrink: 0,
              }}
            >
              {selected.symbol.slice(0, 2)}
            </div>
            {selected.symbol}
            <ChevronDown size={14} color="var(--text-muted)" />
          </>
        ) : (
          <>
            {label}
            <ChevronDown size={14} />
          </>
        )}
      </button>

      {/* Modal */}
      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div
            className="card modal-content glass-strong"
            style={{ padding: '0', overflow: 'hidden', maxWidth: '400px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: '20px 20px 16px',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 700 }}>Select Token</h3>
                <button
                  className="btn btn-ghost"
                  onClick={() => setOpen(false)}
                  style={{ padding: '6px', width: '32px', height: '32px', borderRadius: '50%' }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Search */}
              <div style={{ position: 'relative' }}>
                <Search
                  size={16}
                  color="var(--text-muted)"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  ref={inputRef}
                  className="input"
                  placeholder="Search by name or address"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{ paddingLeft: '38px', fontSize: '14px' }}
                />
              </div>
            </div>

            {/* Common Tokens */}
            {!query && (
              <div style={{ padding: '14px 20px 8px' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
                  Common tokens
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {tokens.slice(0, 4).map((t) => (
                    <button
                      key={t.symbol}
                      onClick={() => { onSelect(t); setOpen(false); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-input)',
                        cursor: 'pointer',
                        color: 'var(--text-primary)',
                        fontSize: '13px',
                        fontWeight: 600,
                        transition: 'all var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)')}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)')}
                    >
                      <span style={{ color: t.color, fontSize: '11px', fontWeight: 800 }}>{t.symbol.slice(0, 2)}</span>
                      {t.symbol}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Token List */}
            <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
              {filtered.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No tokens found
                </div>
              ) : (
                filtered.map((t) => {
                  const balance = wallet ? (MOCK_BALANCES[t.symbol] || 0) : 0;
                  const balanceUSD = balance * (TOKEN_PRICES[t.symbol] || 0);
                  return (
                    <button
                      key={t.symbol}
                      onClick={() => { onSelect(t); setOpen(false); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '14px 20px',
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background var(--transition-fast)',
                        textAlign: 'left',
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--bg-card-hover)')}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                    >
                      {/* Token Icon */}
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          background: `${t.color}20`,
                          border: `1.5px solid ${t.color}40`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 800,
                          color: t.color,
                          flexShrink: 0,
                        }}
                      >
                        {t.symbol.slice(0, 2)}
                      </div>

                      {/* Name */}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '15px' }}>{t.symbol}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.name}</div>
                      </div>

                      {/* Balance */}
                      {wallet && balance > 0 && (
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif' }}>
                            {balance < 0.001 ? balance.toExponential(2) : balance.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            ${balanceUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
