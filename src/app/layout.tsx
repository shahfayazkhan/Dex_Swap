import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { WalletProvider } from '@/context/WalletContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DexSwap — Trade Any Token Instantly',
  description:
    'A decentralized exchange supporting Ethereum, Solana, and all major tokens. Connect MetaMask, Phantom, or any wallet and swap with the best rates.',
  keywords: 'DEX, swap, DeFi, Ethereum, Solana, MetaMask, Phantom, crypto, tokens',
  openGraph: {
    title: 'DexSwap — Trade Any Token Instantly',
    description: 'Swap tokens across EVM and Solana with premium UI and multi-wallet support.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
