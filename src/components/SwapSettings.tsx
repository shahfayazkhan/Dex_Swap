'use client';

import React, { useState } from 'react';
import { Settings, Info, X } from 'lucide-react';

interface Props {
  slippage: number;
  onSlippageChange: (value: number) => void;
}

const PRESETS = [0.1, 0.5, 1.0];

export default function SwapSettings({ slippage, onSlippageChange }: Props) {
  const [open, setOpen] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [deadline, setDeadline] = useState(30); // minutes

  const isCustom = !PRESETS.includes(slippage);

  const handleCustomInput = (val: string) => {
    setCustomValue(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0 && num <= 50) {
      onSlippageChange(num);
    }
  };

  const getSlippageColor = () => {
    if (slippage > 5) return 'var(--accent-red)';
    if (slippage > 1) return 'var(--accent-orange)';
    return 'var(--accent-green)';
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="btn btn-ghost"
        style={{
          padding: '8px',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          position: 'relative',
        }}
        title="Swap Settings"
      >
        <Settings
          size={16}
          style={{ transition: 'transform 0.3s ease', transform: open ? 'rotate(45deg)' : 'none' }}
        />
        {/* Indicator dot if custom slippage */}
        {slippage !== 0.5 && (
          <span
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: getSlippageColor(),
            }}
          />
        )}
      </button>

      {/* Panel */}
      {open && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 99 }}
            onClick={() => setOpen(false)}
          />
          <div
            className="card glass-strong"
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '300px',
              padding: '20px',
              zIndex: 100,
              animation: 'fadeIn 0.2s ease forwards',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 700 }}>Transaction Settings</h4>
              <button
                className="btn btn-ghost"
                onClick={() => setOpen(false)}
                style={{ padding: '4px', width: '28px', height: '28px', borderRadius: '50%' }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Slippage Tolerance */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Slippage Tolerance
                </span>
                <div className="tooltip-container">
                  <Info size={13} color="var(--text-muted)" style={{ cursor: 'help' }} />
                  <div className="tooltip-content">
                    Max price change before transaction reverts
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    onClick={() => { onSlippageChange(p); setCustomValue(''); }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${slippage === p ? 'rgba(124,58,237,0.5)' : 'var(--border-subtle)'}`,
                      background: slippage === p ? 'rgba(124,58,237,0.15)' : 'var(--bg-input)',
                      color: slippage === p ? 'var(--accent-purple-light)' : 'var(--text-secondary)',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    {p}%
                  </button>
                ))}

                {/* Custom */}
                <div style={{ flex: 1, position: 'relative' }}>
                  <input
                    className="input"
                    placeholder="Custom"
                    value={customValue}
                    onChange={(e) => handleCustomInput(e.target.value)}
                    style={{
                      fontSize: '13px',
                      padding: '8px 28px 8px 10px',
                      borderColor: isCustom ? 'rgba(124,58,237,0.5)' : undefined,
                      background: isCustom ? 'rgba(124,58,237,0.1)' : 'var(--bg-input)',
                      color: isCustom ? 'var(--accent-purple-light)' : 'var(--text-primary)',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                    }}
                  >
                    %
                  </span>
                </div>
              </div>

              {/* Warning */}
              {slippage > 5 && (
                <div
                  style={{
                    marginTop: '8px',
                    padding: '8px 12px',
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '12px',
                    color: 'var(--accent-red)',
                  }}
                >
                  ⚠️ High slippage — your transaction may be frontrun
                </div>
              )}
              {slippage > 0 && slippage <= 0.1 && (
                <div
                  style={{
                    marginTop: '8px',
                    padding: '8px 12px',
                    background: 'rgba(245,158,11,0.1)',
                    border: '1px solid rgba(245,158,11,0.3)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '12px',
                    color: 'var(--accent-orange)',
                  }}
                >
                  ⚡ Low slippage — transaction may fail in volatile markets
                </div>
              )}
            </div>

            {/* Transaction Deadline */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Transaction Deadline
                </span>
                <div className="tooltip-container">
                  <Info size={13} color="var(--text-muted)" style={{ cursor: 'help' }} />
                  <div className="tooltip-content">
                    Transaction reverts if not confirmed in time
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  className="input"
                  type="number"
                  value={deadline}
                  onChange={(e) => setDeadline(Math.max(1, Math.min(4320, parseInt(e.target.value) || 30)))}
                  style={{ fontSize: '13px', padding: '8px 10px', width: '80px' }}
                  min={1}
                  max={4320}
                />
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>minutes</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
