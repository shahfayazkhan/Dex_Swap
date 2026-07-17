'use client';

import { useState, useCallback, useEffect } from 'react';
import { Token, TOKEN_PRICES, MOCK_BALANCES } from '@/constants/tokens';

export interface SwapRoute {
  path: string[];
  fee: number;
  priceImpact: number;
}

export interface SwapState {
  fromToken: Token | null;
  toToken: Token | null;
  fromAmount: string;
  toAmount: string;
  slippage: number;
  priceImpact: number;
  exchangeRate: number;
  minimumReceived: number;
  route: SwapRoute | null;
  isLoading: boolean;
  txStatus: 'idle' | 'pending' | 'success' | 'error';
  txHash: string | null;
}

// Constant product AMM formula simulation: x * y = k
const simulateAMMOutput = (
  amountIn: number,
  reserveIn: number,
  reserveOut: number,
  feeTier: number = 0.003
): number => {
  const amountInWithFee = amountIn * (1 - feeTier);
  const numerator = amountInWithFee * reserveOut;
  const denominator = reserveIn + amountInWithFee;
  return numerator / denominator;
};

const getPriceImpact = (amountUSD: number): number => {
  if (amountUSD < 100) return 0.01;
  if (amountUSD < 1000) return 0.05;
  if (amountUSD < 10000) return 0.15;
  if (amountUSD < 100000) return 0.45;
  return 1.2;
};

const getRoute = (fromToken: Token, toToken: Token): SwapRoute => {
  const directPair = `${fromToken.symbol} → ${toToken.symbol}`;
  const bridgePair = `${fromToken.symbol} → USDC → ${toToken.symbol}`;
  // Simulates routing intelligence
  const needsBridge =
    fromToken.symbol !== 'USDC' &&
    fromToken.symbol !== 'USDT' &&
    toToken.symbol !== 'USDC' &&
    toToken.symbol !== 'USDT';

  return {
    path: needsBridge
      ? [fromToken.symbol, 'USDC', toToken.symbol]
      : [fromToken.symbol, toToken.symbol],
    fee: needsBridge ? 0.006 : 0.003,
    priceImpact: 0,
  };
};

export const useSwap = () => {
  const [state, setState] = useState<SwapState>({
    fromToken: null,
    toToken: null,
    fromAmount: '',
    toAmount: '',
    slippage: 0.5,
    priceImpact: 0,
    exchangeRate: 0,
    minimumReceived: 0,
    route: null,
    isLoading: false,
    txStatus: 'idle',
    txHash: null,
  });

  const calculateOutput = useCallback(
    (fromToken: Token, toToken: Token, fromAmount: string, slippage: number) => {
      const amount = parseFloat(fromAmount);
      if (isNaN(amount) || amount <= 0) {
        setState((prev) => ({
          ...prev,
          toAmount: '',
          exchangeRate: 0,
          priceImpact: 0,
          minimumReceived: 0,
          route: null,
        }));
        return;
      }

      const fromPrice = TOKEN_PRICES[fromToken.symbol] || 1;
      const toPrice = TOKEN_PRICES[toToken.symbol] || 1;

      // Simulate liquidity reserves proportional to price
      const reserveIn = 1_000_000 / fromPrice;
      const reserveOut = 1_000_000 / toPrice;

      const route = getRoute(fromToken, toToken);
      const amountOut = simulateAMMOutput(amount, reserveIn, reserveOut, route.fee);
      const amountUSD = amount * fromPrice;
      const priceImpact = getPriceImpact(amountUSD);
      const adjustedAmountOut = amountOut * (1 - priceImpact / 100);
      const exchangeRate = adjustedAmountOut / amount;
      const minimumReceived = adjustedAmountOut * (1 - slippage / 100);

      route.priceImpact = priceImpact;

      setState((prev) => ({
        ...prev,
        toAmount: adjustedAmountOut.toFixed(6),
        exchangeRate,
        priceImpact,
        minimumReceived,
        route,
      }));
    },
    []
  );

  const setFromToken = useCallback((token: Token) => {
    setState((prev) => {
      const newState = { ...prev, fromToken: token };
      // Swap tokens if same selected
      if (prev.toToken?.symbol === token.symbol) {
        newState.toToken = prev.fromToken;
      }
      return newState;
    });
  }, []);

  const setToToken = useCallback((token: Token) => {
    setState((prev) => {
      const newState = { ...prev, toToken: token };
      if (prev.fromToken?.symbol === token.symbol) {
        newState.fromToken = prev.toToken;
      }
      return newState;
    });
  }, []);

  const setFromAmount = useCallback(
    (amount: string) => {
      setState((prev) => ({ ...prev, fromAmount: amount }));
      if (state.fromToken && state.toToken && amount) {
        calculateOutput(state.fromToken, state.toToken, amount, state.slippage);
      } else {
        setState((prev) => ({ ...prev, toAmount: '' }));
      }
    },
    [state.fromToken, state.toToken, state.slippage, calculateOutput]
  );

  const setSlippage = useCallback(
    (slippage: number) => {
      setState((prev) => ({ ...prev, slippage }));
      if (state.fromToken && state.toToken && state.fromAmount) {
        calculateOutput(state.fromToken, state.toToken, state.fromAmount, slippage);
      }
    },
    [state.fromToken, state.toToken, state.fromAmount, calculateOutput]
  );

  const flipTokens = useCallback(() => {
    setState((prev) => ({
      ...prev,
      fromToken: prev.toToken,
      toToken: prev.fromToken,
      fromAmount: prev.toAmount,
      toAmount: prev.fromAmount,
    }));
  }, []);

  const setMaxAmount = useCallback(() => {
    if (!state.fromToken) return;
    const balance = MOCK_BALANCES[state.fromToken.symbol] || 0;
    const amount = balance.toString();
    setState((prev) => ({ ...prev, fromAmount: amount }));
    if (state.toToken) {
      calculateOutput(state.fromToken, state.toToken, amount, state.slippage);
    }
  }, [state.fromToken, state.toToken, state.slippage, calculateOutput]);

  const executeSwap = useCallback(async () => {
    if (!state.fromToken || !state.toToken || !state.fromAmount) return;

    setState((prev) => ({ ...prev, txStatus: 'pending', isLoading: true }));
    // Simulate a blockchain transaction delay
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // 95% success rate simulation
    const success = Math.random() > 0.05;
    const fakeHash = '0x' + Math.random().toString(16).slice(2).padEnd(64, '0');

    setState((prev) => ({
      ...prev,
      txStatus: success ? 'success' : 'error',
      txHash: success ? fakeHash : null,
      isLoading: false,
      fromAmount: success ? '' : prev.fromAmount,
      toAmount: success ? '' : prev.toAmount,
    }));

    // Reset status after delay
    setTimeout(() => {
      setState((prev) => ({ ...prev, txStatus: 'idle', txHash: null }));
    }, 5000);
  }, [state]);

  // Recalculate whenever tokens or amount change
  useEffect(() => {
    if (state.fromToken && state.toToken && state.fromAmount) {
      calculateOutput(state.fromToken, state.toToken, state.fromAmount, state.slippage);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.fromToken, state.toToken]);

  return {
    ...state,
    setFromToken,
    setToToken,
    setFromAmount,
    setSlippage,
    flipTokens,
    setMaxAmount,
    executeSwap,
    getBalance: (symbol: string) => MOCK_BALANCES[symbol] || 0,
    getPrice: (symbol: string) => TOKEN_PRICES[symbol] || 0,
  };
};
