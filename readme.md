# Introduction

This is a test case to use uniswap v3 sdk and do the following operations as a LP on USDC/WETH pool

- Minting a position
- Add liquidity
- Remove liquidity

# How to run?

1. Install modules

```
npm install
```

2. Running Project

```
npm start
```

Note: you also need to set your wallet address and operation you want in `index.ts` file

# Issues

**PRICE_OUTBOUND ERROR** when using testnet of ropsten. For more detail follow the [link](https://stackoverflow.com/questions/70835872/what-does-invariant-failed-price-bounds-means)
