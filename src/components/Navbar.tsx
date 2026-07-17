'use client';

import React, { useState } from 'react';
import { Zap, BarChart2, Droplets, Settings, Bell, ChevronDown, ExternalLink, Wallet } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import WalletConnectModal from './WalletConnectModal';

interface NavbarProps {
  activeTab: 'swap' | 'tokens' | 'pools';
  setActiveTab: (tab: 'swap' | 'tokens' | 'pools') => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const { wallet, disconnectWallet, formatAddress, isConnecting } = useWallet();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const navItems: { id: 'swap' | 'tokens' | 'pools'; label: string; icon: React.ReactNode }[] = [
    { id: 'swap', label: 'Swap', icon: <Zap size={15} /> },
    { id: 'tokens', label: 'Tokens', icon: <BarChart2 size={15} /> },
    { id: 'pools', label: 'Pools', icon: <Droplets size={15} /> },
  ];

  return (
    <>
      <nav
        className="glass"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          borderTop: 'none',
          borderLeft: 'none',
          borderRight: 'none',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            height: '68px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(124,58,237,0.4)',
              }}
            >
              <Zap size={20} color="#fff" fill="#fff" />
            </div>
            <span
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '20px',
                fontWeight: 700,
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              DexSwap
            </span>
          </div>

          {/* Nav Links */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'var(--bg-input)',
              padding: '4px',
              borderRadius: 'var(--radius-full)',
              flex: '0 0 auto',
            }}
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all var(--transition-fast)',
                  background: activeTab === item.id ? 'var(--bg-card)' : 'transparent',
                  color: activeTab === item.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  boxShadow: activeTab === item.id ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
                }}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Network Badge */}
            {wallet && (
              <div
                className={`badge ${wallet.network === 'EVM' ? 'badge-evm' : 'badge-solana'}`}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'currentColor',
                    animation: 'pulse-glow 2s ease-in-out infinite',
                  }}
                />
                {wallet.network === 'EVM' ? 'Ethereum' : 'Solana'}
              </div>
            )}

            {/* Settings */}
            <button className="btn btn-ghost" style={{ padding: '8px', width: '36px', height: '36px' }}>
              <Settings size={16} />
            </button>

            {/* Notifications */}
            <button className="btn btn-ghost" style={{ padding: '8px', width: '36px', height: '36px' }}>
              <Bell size={16} />
            </button>

            {/* Wallet button */}
            {wallet ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 14px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-full)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    color: 'var(--text-primary)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-medium)';
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: 'var(--gradient-primary)',
                      flexShrink: 0,
                    }}
                  />
                  <span>{wallet.ensName || formatAddress(wallet.address)}</span>
                  <ChevronDown size={14} color="var(--text-muted)" />
                </button>

                {/* Dropdown */}
                {showDropdown && (
                  <div
                    className="card glass-strong"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      minWidth: '220px',
                      padding: '8px',
                      zIndex: 200,
                      animation: 'fadeIn 0.2s ease forwards',
                    }}
                  >
                    <div style={{ padding: '12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '4px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{formatAddress(wallet.address)}</div>
                      <div style={{ fontWeight: 700, marginTop: '4px', fontFamily: 'Space Grotesk, sans-serif' }}>{wallet.balance}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{wallet.balanceUSD}</div>
                    </div>
                    <button
                      className="btn btn-ghost"
                      style={{ width: '100%', justifyContent: 'flex-start', gap: '8px', padding: '10px 12px', borderRadius: 'var(--radius-md)', fontSize: '14px' }}
                    >
                      <ExternalLink size={14} /> View on Explorer
                    </button>
                    <button
                      className="btn btn-ghost"
                      style={{ width: '100%', justifyContent: 'flex-start', gap: '8px', padding: '10px 12px', borderRadius: 'var(--radius-md)', fontSize: '14px', color: 'var(--accent-red)' }}
                      onClick={() => { disconnectWallet(); setShowDropdown(false); }}
                    >
                      <Wallet size={14} /> Disconnect
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => setShowWalletModal(true)}
                disabled={isConnecting}
                style={{ padding: '9px 20px' }}
              >
                {isConnecting ? <span className="spinner" /> : <Wallet size={15} />}
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </div>
      </nav>

      {showWalletModal && <WalletConnectModal onClose={() => setShowWalletModal(false)} />}

      {/* Close dropdown on outside click */}
      {showDropdown && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 199 }}
          onClick={() => setShowDropdown(false)}
        />
      )}
    </>
  );
}
