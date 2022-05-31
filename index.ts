import { ethers } from "ethers";
import {
  Pool,
  Position,
  nearestUsableTick,
  NonfungiblePositionManager,
} from "@uniswap/v3-sdk";
import { Token, Percent, CurrencyAmount } from "@uniswap/sdk-core";
import { State, Immutables } from "./types";
import { abi as IUniswapV3PoolABI } from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";

// testnet -> https://ropsten.infura.io/v3/3a9a7d858a8d43998336efceafe07a67
// mainnet -> https://mainnet.infura.io/v3/3a9a7d858a8d43998336efceafe07a67

const provider = new ethers.providers.JsonRpcProvider(
  "https://mainnet.infura.io/v3/3a9a7d858a8d43998336efceafe07a67"
);

// connect to pool
const poolAddress = "0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8";
const poolContract = new ethers.Contract(
  poolAddress,
  IUniswapV3PoolABI,
  provider
);

async function getPoolImmutables() {
  const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] =
    await Promise.all([
      poolContract.factory(),
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
      poolContract.tickSpacing(),
      poolContract.maxLiquidityPerTick(),
    ]);

  const immutables: Immutables = {
    factory,
    token0,
    token1,
    fee,
    tickSpacing,
    maxLiquidityPerTick,
  };
  return immutables;
}

async function getPoolState() {
  const [liquidity, slot] = await Promise.all([
    poolContract.liquidity(),
    poolContract.slot0(),
  ]);

  const PoolState: State = {
    liquidity,
    sqrtPriceX96: slot[0],
    tick: slot[1],
    observationIndex: slot[2],
    observationCardinality: slot[3],
    observationCardinalityNext: slot[4],
    feeProtocol: slot[5],
    unlocked: slot[6],
  };

  return PoolState;
}

async function main(sender: string, op: number) {
  const block = await provider.getBlock(provider.getBlockNumber());
  const deadline = block.timestamp + 200;
  const [immutables, state] = await Promise.all([
    getPoolImmutables(),
    getPoolState(),
  ]);

  const USDC = new Token(3, immutables.token0, 6, "USDC", "USD Coin");
  const WETH = new Token(3, immutables.token1, 18, "WETH", "Wrapped Ether");

  const USDC_WETH_POOL = new Pool(
    USDC,
    WETH,
    immutables.fee,
    state.sqrtPriceX96.toString(),
    state.liquidity.toString(),
    state.tick
  );

  const position = new Position({
    pool: USDC_WETH_POOL,
    liquidity: state.liquidity.div(50000).toString(), // 0.005%
    tickLower:
      nearestUsableTick(state.tick, immutables.tickSpacing) -
      immutables.tickSpacing * 2,
    tickUpper:
      nearestUsableTick(state.tick, immutables.tickSpacing) +
      immutables.tickSpacing * 2,
  });

  // mint position
  if (op == 0) {
    const { calldata, value } = NonfungiblePositionManager.addCallParameters(
      position,
      {
        slippageTolerance: new Percent(50, 10_000),
        recipient: sender,
        deadline: deadline,
      }
    );
    console.log("mint position", calldata, value);
  }

  // add liquidity
  if (op == 1) {
    const { calldata, value } = NonfungiblePositionManager.addCallParameters(
      position,
      {
        slippageTolerance: new Percent(50, 10_000),
        deadline: deadline,
        tokenId: 1,
      }
    );

    console.log("add liquidity", calldata, value);
  }

  // remove liquidity
  if (op == 2) {
    const { calldata, value } = NonfungiblePositionManager.removeCallParameters(
      position,
      {
        tokenId: 1,
        liquidityPercentage: new Percent(1),
        slippageTolerance: new Percent(50, 10_000),
        deadline: deadline,
        collectOptions: {
          expectedCurrencyOwed0: CurrencyAmount.fromRawAmount(USDC, 0),
          expectedCurrencyOwed1: CurrencyAmount.fromRawAmount(WETH, 0),
          recipient: sender,
        },
      }
    );
    console.log("remove liquidity", calldata, value);
  }
}

const walletAddress = "0x5622D10dd0cf727953540953b31e5D0E0Babc10d";
main(walletAddress, 1);
