"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var ethers_1 = require("ethers");
var v3_sdk_1 = require("@uniswap/v3-sdk");
var sdk_core_1 = require("@uniswap/sdk-core");
var IUniswapV3Pool_json_1 = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
// testnet -> https://ropsten.infura.io/v3/3a9a7d858a8d43998336efceafe07a67
// mainnet -> https://mainnet.infura.io/v3/3a9a7d858a8d43998336efceafe07a67
var provider = new ethers_1.ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/3a9a7d858a8d43998336efceafe07a67");
// connect to pool
var poolAddress = "0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8";
var poolContract = new ethers_1.ethers.Contract(poolAddress, IUniswapV3Pool_json_1.abi, provider);
function getPoolImmutables() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick, immutables;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        poolContract.factory(),
                        poolContract.token0(),
                        poolContract.token1(),
                        poolContract.fee(),
                        poolContract.tickSpacing(),
                        poolContract.maxLiquidityPerTick(),
                    ])];
                case 1:
                    _a = _b.sent(), factory = _a[0], token0 = _a[1], token1 = _a[2], fee = _a[3], tickSpacing = _a[4], maxLiquidityPerTick = _a[5];
                    immutables = {
                        factory: factory,
                        token0: token0,
                        token1: token1,
                        fee: fee,
                        tickSpacing: tickSpacing,
                        maxLiquidityPerTick: maxLiquidityPerTick
                    };
                    return [2 /*return*/, immutables];
            }
        });
    });
}
function getPoolState() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, liquidity, slot, PoolState;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        poolContract.liquidity(),
                        poolContract.slot0(),
                    ])];
                case 1:
                    _a = _b.sent(), liquidity = _a[0], slot = _a[1];
                    PoolState = {
                        liquidity: liquidity,
                        sqrtPriceX96: slot[0],
                        tick: slot[1],
                        observationIndex: slot[2],
                        observationCardinality: slot[3],
                        observationCardinalityNext: slot[4],
                        feeProtocol: slot[5],
                        unlocked: slot[6]
                    };
                    return [2 /*return*/, PoolState];
            }
        });
    });
}
function main(sender, op) {
    return __awaiter(this, void 0, void 0, function () {
        var block, deadline, _a, immutables, state, USDC, WETH, USDC_WETH_POOL, position, _b, calldata, value, _c, calldata, value, _d, calldata, value;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, provider.getBlock(provider.getBlockNumber())];
                case 1:
                    block = _e.sent();
                    deadline = block.timestamp + 200;
                    return [4 /*yield*/, Promise.all([
                            getPoolImmutables(),
                            getPoolState(),
                        ])];
                case 2:
                    _a = _e.sent(), immutables = _a[0], state = _a[1];
                    USDC = new sdk_core_1.Token(3, immutables.token0, 6, "USDC", "USD Coin");
                    WETH = new sdk_core_1.Token(3, immutables.token1, 18, "WETH", "Wrapped Ether");
                    USDC_WETH_POOL = new v3_sdk_1.Pool(USDC, WETH, immutables.fee, state.sqrtPriceX96.toString(), state.liquidity.toString(), state.tick);
                    position = new v3_sdk_1.Position({
                        pool: USDC_WETH_POOL,
                        liquidity: state.liquidity.div(50000).toString(),
                        tickLower: (0, v3_sdk_1.nearestUsableTick)(state.tick, immutables.tickSpacing) -
                            immutables.tickSpacing * 2,
                        tickUpper: (0, v3_sdk_1.nearestUsableTick)(state.tick, immutables.tickSpacing) +
                            immutables.tickSpacing * 2
                    });
                    // mint position
                    if (op == 0) {
                        _b = v3_sdk_1.NonfungiblePositionManager.addCallParameters(position, {
                            slippageTolerance: new sdk_core_1.Percent(50, 10000),
                            recipient: sender,
                            deadline: deadline
                        }), calldata = _b.calldata, value = _b.value;
                        console.log("mint position", calldata, value);
                    }
                    // add liquidity
                    if (op == 1) {
                        _c = v3_sdk_1.NonfungiblePositionManager.addCallParameters(position, {
                            slippageTolerance: new sdk_core_1.Percent(50, 10000),
                            deadline: deadline,
                            tokenId: 1
                        }), calldata = _c.calldata, value = _c.value;
                        console.log("add liquidity", calldata, value);
                    }
                    // remove liquidity
                    if (op == 2) {
                        _d = v3_sdk_1.NonfungiblePositionManager.removeCallParameters(position, {
                            tokenId: 1,
                            liquidityPercentage: new sdk_core_1.Percent(1),
                            slippageTolerance: new sdk_core_1.Percent(50, 10000),
                            deadline: deadline,
                            collectOptions: {
                                expectedCurrencyOwed0: sdk_core_1.CurrencyAmount.fromRawAmount(USDC, 0),
                                expectedCurrencyOwed1: sdk_core_1.CurrencyAmount.fromRawAmount(WETH, 0),
                                recipient: sender
                            }
                        }), calldata = _d.calldata, value = _d.value;
                        console.log("remove liquidity", calldata, value);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
var walletAddress = "0x5622D10dd0cf727953540953b31e5D0E0Babc10d";
main(walletAddress, 1);
