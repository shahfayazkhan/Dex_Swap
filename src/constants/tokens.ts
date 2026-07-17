export interface Token {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  network: 'EVM' | 'Solana';
  color: string;
}

export const EVM_TOKENS: Token[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    network: 'EVM',
    color: '#627EEA',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    network: 'EVM',
    color: '#2775CA',
  },
  {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    decimals: 8,
    address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    network: 'EVM',
    color: '#F7931A',
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    network: 'EVM',
    color: '#26A17B',
  },
  {
    symbol: 'UNI',
    name: 'Uniswap',
    decimals: 18,
    address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    network: 'EVM',
    color: '#FF007A',
  },
  {
    symbol: 'LINK',
    name: 'Chainlink',
    decimals: 18,
    address: '0x514910771af9ca656af840dff83e8264ecf986ca',
    network: 'EVM',
    color: '#375BD2',
  },
  {
    symbol: 'AAVE',
    name: 'Aave',
    decimals: 18,
    address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
    network: 'EVM',
    color: '#B6509E',
  },
  {
    symbol: 'MATIC',
    name: 'Polygon',
    decimals: 18,
    address: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
    network: 'EVM',
    color: '#8247E5',
  },
];

export const SOLANA_TOKENS: Token[] = [
  {
    symbol: 'SOL',
    name: 'Solana',
    decimals: 9,
    address: 'So11111111111111111111111111111111111111112',
    network: 'Solana',
    color: '#14F195',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    network: 'Solana',
    color: '#2775CA',
  },
  {
    symbol: 'BONK',
    name: 'Bonk',
    decimals: 5,
    address: 'DezXAZ8z7PnrnRJjz3wX4dxBSGm48dB1JMinGdLotXvt',
    network: 'Solana',
    color: '#F48C37',
  },
  {
    symbol: 'JUP',
    name: 'Jupiter',
    decimals: 6,
    address: 'JUPyiwrYJAQk2RJrBGdmqPPCGdGnZ9eq91M5YkSmFJa',
    network: 'Solana',
    color: '#F05032',
  },
  {
    symbol: 'RENDER',
    name: 'Render Token',
    decimals: 8,
    address: 'rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof',
    network: 'Solana',
    color: '#E62240',
  },
  {
    symbol: 'RAY',
    name: 'Raydium',
    decimals: 6,
    address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
    network: 'Solana',
    color: '#5AC4BE',
  },
];

export const ALL_TOKENS = [...EVM_TOKENS, ...SOLANA_TOKENS];

export const getTokensByNetwork = (network: 'EVM' | 'Solana') =>
  network === 'EVM' ? EVM_TOKENS : SOLANA_TOKENS;

// Mock prices (USD)
export const TOKEN_PRICES: Record<string, number> = {
  ETH: 3420.58,
  USDC: 1.00,
  WBTC: 67840.12,
  USDT: 1.00,
  UNI: 12.34,
  LINK: 18.92,
  AAVE: 143.67,
  MATIC: 0.87,
  SOL: 175.43,
  BONK: 0.000024,
  JUP: 1.28,
  RENDER: 8.92,
  RAY: 2.15,
};

// Mock user balances
export const MOCK_BALANCES: Record<string, number> = {
  ETH: 2.4312,
  USDC: 4820.00,
  WBTC: 0.05123,
  USDT: 1200.00,
  UNI: 150.0,
  LINK: 80.5,
  AAVE: 3.21,
  MATIC: 2000.0,
  SOL: 12.845,
  BONK: 5000000,
  JUP: 420.0,
  RENDER: 55.0,
  RAY: 340.0,
};
