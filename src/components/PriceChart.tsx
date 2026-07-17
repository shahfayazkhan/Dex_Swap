'use client';

import React, { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { TOKEN_PRICES } from '@/constants/tokens';

// Generate realistic-looking historical price data
function generatePriceData(basePrice: number, points: number, volatility = 0.03) {
  const data = [];
  let price = basePrice * (0.85 + Math.random() * 0.1);
  for (let i = 0; i < points; i++) {
    price = price * (1 + (Math.random() - 0.5) * volatility);
    data.push({ price: parseFloat(price.toFixed(2)) });
  }
  // Ensure last price is near current
  data[data.length - 1].price = basePrice;
  return data;
}

const PERIODS: { label: string; points: number; volatility: number }[] = [
  { label: '1H',  points: 60,  volatility: 0.008 },
  { label: '24H', points: 96,  volatility: 0.015 },
  { label: '7D',  points: 168, volatility: 0.025 },
  { label: '30D', points: 120, volatility: 0.04  },
  { label: '1Y',  points: 365, volatility: 0.06  },
];

const TOKENS_LIST = ['ETH', 'SOL', 'WBTC', 'UNI', 'LINK'];

interface DataPoint { price: number }

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number }[];
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="card glass-strong"
        style={{ padding: '8px 14px', border: '1px solid var(--border-medium)' }}
      >
        <div style={{ fontSize: '15px', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
          ${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>
    );
  }
  return null;
};

export default function PriceChart() {
  const [selectedToken, setSelectedToken] = useState('ETH');
  const [selectedPeriod, setSelectedPeriod] = useState(1); // index into PERIODS
  const [data, setData] = useState<DataPoint[]>(() =>
    generatePriceData(TOKEN_PRICES['ETH'], PERIODS[1].points, PERIODS[1].volatility)
  );

  const currentPrice = TOKEN_PRICES[selectedToken] || 0;
  const startPrice = data[0]?.price || 1;
  const change = ((currentPrice - startPrice) / startPrice) * 100;
  const isPositive = change >= 0;

  const handleTokenChange = (symbol: string) => {
    setSelectedToken(symbol);
    const p = PERIODS[selectedPeriod];
    setData(generatePriceData(TOKEN_PRICES[symbol] || 1, p.points, p.volatility));
  };

  const handlePeriodChange = (idx: number) => {
    setSelectedPeriod(idx);
    const p = PERIODS[idx];
    setData(generatePriceData(TOKEN_PRICES[selectedToken] || 1, p.points, p.volatility));
  };

  const gradientId = isPositive ? 'greenGradient' : 'redGradient';
  const strokeColor = isPositive ? '#10b981' : '#ef4444';

  return (
    <div className="card animate-fade-in" style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          {/* Token Selector Tabs */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
            {TOKENS_LIST.map((t) => (
              <button
                key={t}
                onClick={() => handleTokenChange(t)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: `1px solid ${selectedToken === t ? 'var(--border-strong)' : 'var(--border-subtle)'}`,
                  background: selectedToken === t ? 'var(--bg-input)' : 'transparent',
                  color: selectedToken === t ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Price Display */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <span
              style={{
                fontSize: '32px',
                fontWeight: 700,
                fontFamily: 'Space Grotesk, sans-serif',
              }}
            >
              ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: isPositive ? 'var(--accent-green)' : 'var(--accent-red)',
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {isPositive ? '+' : ''}{change.toFixed(2)}%
            </div>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {selectedToken} • {PERIODS[selectedPeriod].label} change
          </div>
        </div>

        {/* Period Selector */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {PERIODS.map((p, idx) => (
            <button
              key={p.label}
              onClick={() => handlePeriodChange(idx)}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: selectedPeriod === idx ? 'var(--bg-input)' : 'transparent',
                color: selectedPeriod === idx ? 'var(--text-primary)' : 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: '200px', marginLeft: '-8px', marginRight: '-8px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 8, left: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" hide />
            <YAxis
              domain={['auto', 'auto']}
              hide
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke={strokeColor}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ r: 5, fill: strokeColor, stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        {[
          { label: '24h Volume', value: '$1.24B' },
          { label: 'Market Cap', value: '$412.7B' },
          { label: '24h High', value: `$${(currentPrice * 1.04).toFixed(2)}` },
          { label: '24h Low', value: `$${(currentPrice * 0.96).toFixed(2)}` },
        ].map((s) => (
          <div key={s.label}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '3px' }}>
              {s.label}
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif' }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
