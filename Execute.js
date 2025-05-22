const { ethers } = require("ethers");
const cron = require("node-cron");
const axios = require("axios");

// Contract ABI - using the complete ABI
const contractABI = [{"type":"constructor","inputs":[],"stateMutability":"nonpayable"},{"type":"receive","stateMutability":"payable"},{"type":"function","name":"DEFAULT_ADMIN_ROLE","inputs":[],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"view"},{"type":"function","name":"LIQUIDITY_SLIPPAGE_BP","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"SWAP_SLIPPAGE_BP","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"allowance","inputs":[{"name":"owner","type":"address","internalType":"address"},{"name":"spender","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"approve","inputs":[{"name":"spender","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"nonpayable"},{"type":"function","name":"asset","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"balanceOf","inputs":[{"name":"account","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"convertToAssets","inputs":[{"name":"shares","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"convertToShares","inputs":[{"name":"assets","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"currentTradeCycleId","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"decimals","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"uint8"}],"stateMutability":"view"},{"type":"function","name":"deposit","inputs":[{"name":"_assets","type":"uint256","internalType":"uint256"},{"name":"_receiver","type":"address","internalType":"address"}],"outputs":[{"name":"shares","type":"uint256","internalType":"uint256"}],"stateMutability":"nonpayable"},{"type":"function","name":"emergencyPause","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"emergencyUnpause","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"endTradeCycle","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"getInfraredPositions","inputs":[{"name":"_tradeCycleId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"tuple[]","internalType":"struct DiracStrykeKodiakLimitOrder.InfraredPositionData[]","components":[{"name":"tickLower","type":"int24","internalType":"int24"},{"name":"tickUpper","type":"int24","internalType":"int24"},{"name":"wberaDeposit","type":"uint256","internalType":"uint256"},{"name":"liquidity","type":"uint256","internalType":"uint256"},{"name":"wBeraWithdrawn","type":"uint256","internalType":"uint256"},{"name":"startedAt","type":"uint40","internalType":"uint40"},{"name":"expiresAt","type":"uint40","internalType":"uint40"},{"name":"withdrawnAt","type":"uint40","internalType":"uint40"}]}],"stateMutability":"view"},{"type":"function","name":"getRoleAdmin","inputs":[{"name":"role","type":"bytes32","internalType":"bytes32"}],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"view"},{"type":"function","name":"getStrykePositions","inputs":[{"name":"_tradeCycleId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"tuple[]","internalType":"struct DiracStrykeKodiakLimitOrder.StrykePositionData[]","components":[{"name":"hook","type":"address","internalType":"address"},{"name":"tickLower","type":"int24","internalType":"int24"},{"name":"tickUpper","type":"int24","internalType":"int24"},{"name":"liquidity","type":"uint128","internalType":"uint128"},{"name":"tokenId","type":"uint256","internalType":"uint256"},{"name":"honeyDeposit","type":"uint256","internalType":"uint256"},{"name":"sharesMinted","type":"uint256","internalType":"uint256"},{"name":"honeyWithdrawn","type":"uint256","internalType":"uint256"},{"name":"wBeraWithdrawn","type":"uint256","internalType":"uint256"},{"name":"startedAt","type":"uint40","internalType":"uint40"},{"name":"expiresAt","type":"uint40","internalType":"uint40"},{"name":"withdrawnAt","type":"uint40","internalType":"uint40"}]}],"stateMutability":"view"},{"type":"function","name":"grantRole","inputs":[{"name":"role","type":"bytes32","internalType":"bytes32"},{"name":"account","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"hasRole","inputs":[{"name":"role","type":"bytes32","internalType":"bytes32"},{"name":"account","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"honey","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contract IERC20"}],"stateMutability":"view"},{"type":"function","name":"ibera","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contract IERC20"}],"stateMutability":"view"},{"type":"function","name":"infraredVault","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"initialize","inputs":[{"name":"_honey","type":"address","internalType":"contract IERC20"},{"name":"_wbera","type":"address","internalType":"contract IERC20"},{"name":"_ibera","type":"address","internalType":"contract IERC20"},{"name":"_strykeClammRouter","type":"address","internalType":"address"},{"name":"_strykePositionManager","type":"address","internalType":"address"},{"name":"_strykeLiquidityHandler","type":"address","internalType":"address"},{"name":"_strykeLiquidityPool","type":"address","internalType":"address"},{"name":"_strykeOneWeekHook","type":"address","internalType":"address"},{"name":"_strykeIntradayHook","type":"address","internalType":"address"},{"name":"_kodiakSwapRouter","type":"address","internalType":"address"},{"name":"_kodiakIslandRouter","type":"address","internalType":"address"},{"name":"_kodiakIsland","type":"address","internalType":"address"},{"name":"_infraredVault","type":"address","internalType":"address"},{"name":"_maxUserDeposit","type":"uint256","internalType":"uint256"},{"name":"_kodiakPositionManager","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"kodiakExecuteLimitOrder","inputs":[{"name":"_positionId","type":"uint256","internalType":"uint256"},{"name":"_isExpiry","type":"bool","internalType":"bool"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"kodiakFactory","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"kodiakIsland","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"kodiakIslandRouter","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"kodiakOpenLimitOrder","inputs":[{"name":"_tickLower","type":"int24","internalType":"int24"},{"name":"_tickUpper","type":"int24","internalType":"int24"},{"name":"_amountWbera","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"kodiakPositionManager","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"kodiakRemoveLimitOrder","inputs":[{"name":"_positionId","type":"uint256","internalType":"uint256"},{"name":"_isExpiry","type":"bool","internalType":"bool"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"kodiakSwapRouter","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"kodiakUpdateLimitOrder","inputs":[{"name":"_positionId","type":"uint256","internalType":"uint256"},{"name":"_newTickLower","type":"int24","internalType":"int24"},{"name":"_newTickUpper","type":"int24","internalType":"int24"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"kodiakV3QuoterV2","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"maxDeposit","inputs":[{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"maxMint","inputs":[{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"maxRedeem","inputs":[{"name":"owner","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"maxUserDeposit","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"maxWithdraw","inputs":[{"name":"owner","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"mint","inputs":[{"name":"_shares","type":"uint256","internalType":"uint256"},{"name":"_receiver","type":"address","internalType":"address"}],"outputs":[{"name":"assets","type":"uint256","internalType":"uint256"}],"stateMutability":"nonpayable"},{"type":"function","name":"name","inputs":[],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"type":"function","name":"onERC721Received","inputs":[{"name":"","type":"address","internalType":"address"},{"name":"","type":"address","internalType":"address"},{"name":"","type":"uint256","internalType":"uint256"},{"name":"","type":"bytes","internalType":"bytes"}],"outputs":[{"name":"","type":"bytes4","internalType":"bytes4"}],"stateMutability":"nonpayable"},{"type":"function","name":"paused","inputs":[],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"previewDeposit","inputs":[{"name":"assets","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"previewMint","inputs":[{"name":"shares","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"previewRedeem","inputs":[{"name":"shares","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"previewWithdraw","inputs":[{"name":"assets","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"redeem","inputs":[{"name":"_shares","type":"uint256","internalType":"uint256"},{"name":"_receiver","type":"address","internalType":"address"},{"name":"_owner","type":"address","internalType":"address"}],"outputs":[{"name":"assets","type":"uint256","internalType":"uint256"}],"stateMutability":"nonpayable"},{"type":"function","name":"renounceRole","inputs":[{"name":"role","type":"bytes32","internalType":"bytes32"},{"name":"callerConfirmation","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"requestToEndTradeCycle","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"revokeRole","inputs":[{"name":"role","type":"bytes32","internalType":"bytes32"},{"name":"account","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"startTradeCycle","inputs":[{"name":"_duration","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"strykeBurnPosition","inputs":[{"name":"_positionId","type":"uint256","internalType":"uint256"},{"name":"_forceBurn","type":"bool","internalType":"bool"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"strykeClammRouter","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"strykeIntradayHook","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"strykeLiquidityHandler","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"strykeLiquidityPool","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"strykeMintPosition","inputs":[{"name":"_amountHoney","type":"uint256","internalType":"uint256"},{"name":"_mintPositionData","type":"bytes","internalType":"bytes"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"strykeOneWeekHook","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"strykePositionManager","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"supportsInterface","inputs":[{"name":"interfaceId","type":"bytes4","internalType":"bytes4"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"swapTokens","inputs":[{"name":"_amountIn","type":"uint256","internalType":"uint256"},{"name":"_amountOutMin","type":"uint256","internalType":"uint256"},{"name":"_isWberaIn","type":"bool","internalType":"bool"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"symbol","inputs":[],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"type":"function","name":"totalAssets","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"totalSupply","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"totalUsers","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"tradeCycles","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"honeyDeposit","type":"uint256","internalType":"uint256"},{"name":"status","type":"uint8","internalType":"enum DiracStrykeKodiakLimitOrder.TradeCycleStatus"},{"name":"startedAt","type":"uint40","internalType":"uint40"},{"name":"expiresAt","type":"uint40","internalType":"uint40"},{"name":"endedAt","type":"uint40","internalType":"uint40"}],"stateMutability":"view"},{"type":"function","name":"transfer","inputs":[{"name":"to","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"nonpayable"},{"type":"function","name":"transferFrom","inputs":[{"name":"from","type":"address","internalType":"address"},{"name":"to","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"nonpayable"},{"type":"function","name":"updateKodiakRouter","inputs":[{"name":"_kodiakPositionManager","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"updateMaxUserDeposit","inputs":[{"name":"_newMaxUserDeposit","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"updateTradeCycleDuration","inputs":[{"name":"_newTradeCycleEndDate","type":"uint40","internalType":"uint40"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"userDeposits","inputs":[{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"wbera","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contract IERC20"}],"stateMutability":"view"},{"type":"function","name":"whitelistUsers","inputs":[{"name":"_users","type":"address[]","internalType":"address[]"},{"name":"_status","type":"bool","internalType":"bool"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"whitelisted","inputs":[{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"withdraw","inputs":[{"name":"_assets","type":"uint256","internalType":"uint256"},{"name":"_receiver","type":"address","internalType":"address"},{"name":"_owner","type":"address","internalType":"address"}],"outputs":[{"name":"shares","type":"uint256","internalType":"uint256"}],"stateMutability":"nonpayable"},{"type":"event","name":"Approval","inputs":[{"name":"owner","type":"address","indexed":true,"internalType":"address"},{"name":"spender","type":"address","indexed":true,"internalType":"address"},{"name":"value","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"Deposit","inputs":[{"name":"sender","type":"address","indexed":true,"internalType":"address"},{"name":"owner","type":"address","indexed":true,"internalType":"address"},{"name":"assets","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"shares","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"InfraredStaked","inputs":[{"name":"tradeCycleId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"positionId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"tickLower","type":"int24","indexed":false,"internalType":"int24"},{"name":"tickUpper","type":"int24","indexed":false,"internalType":"int24"},{"name":"amountWbera","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"liquidity","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"startedAt","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"expiresAt","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"InfraredUnstaked","inputs":[{"name":"tradeCycleId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"positionId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"liquidity","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"withdrawnAt","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"Initialized","inputs":[{"name":"version","type":"uint64","indexed":false,"internalType":"uint64"}],"anonymous":false},{"type":"event","name":"KodiakIslandLiquidityAdded","inputs":[{"name":"totalWberaIn","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"amount0","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"amount1","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"mintedShares","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"KodiakIslandLiquidityRemoved","inputs":[{"name":"totalWberaOut","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"liquidityBurned","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"KodiakLimitOrderExecuted","inputs":[{"name":"tradeCycleId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"positionId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"executedAt","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"KodiakLimitOrderOpened","inputs":[{"name":"tradeCycleId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"positionId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"tokenId","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"tickLower","type":"int24","indexed":false,"internalType":"int24"},{"name":"tickUpper","type":"int24","indexed":false,"internalType":"int24"},{"name":"startedAt","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"expiresAt","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"KodiakLimitOrderRemoved","inputs":[{"name":"tradeCycleId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"positionId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"executedAt","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"KodiakLimitOrderUpdated","inputs":[{"name":"tradeCycleId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"positionId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"newTokenId","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"newTickLower","type":"int24","indexed":false,"internalType":"int24"},{"name":"newTickUpper","type":"int24","indexed":false,"internalType":"int24"}],"anonymous":false},{"type":"event","name":"Paused","inputs":[{"name":"account","type":"address","indexed":false,"internalType":"address"}],"anonymous":false},{"type":"event","name":"RoleAdminChanged","inputs":[{"name":"role","type":"bytes32","indexed":true,"internalType":"bytes32"},{"name":"previousAdminRole","type":"bytes32","indexed":true,"internalType":"bytes32"},{"name":"newAdminRole","type":"bytes32","indexed":true,"internalType":"bytes32"}],"anonymous":false},{"type":"event","name":"RoleGranted","inputs":[{"name":"role","type":"bytes32","indexed":true,"internalType":"bytes32"},{"name":"account","type":"address","indexed":true,"internalType":"address"},{"name":"sender","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"RoleRevoked","inputs":[{"name":"role","type":"bytes32","indexed":true,"internalType":"bytes32"},{"name":"account","type":"address","indexed":true,"internalType":"address"},{"name":"sender","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"StrykePositionBurned","inputs":[{"name":"tradeCycleId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"positionId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"sharesToBurn","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"honeyWithdrawn","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"wBeraWithdrawn","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"withdrawnAt","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"StrykePositionMinted","inputs":[{"name":"tradeCycleId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"positionId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"hook","type":"address","indexed":false,"internalType":"address"},{"name":"tickLower","type":"int24","indexed":false,"internalType":"int24"},{"name":"tickUpper","type":"int24","indexed":false,"internalType":"int24"},{"name":"tokenId","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"amountHoney","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"sharesMinted","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"startedAt","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"expiresAt","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"TradeCycleEnded","inputs":[{"name":"tradeCycleId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"endedAt","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"TradeCyclePendingEnd","inputs":[{"name":"tradeCycleId","type":"uint256","indexed":true,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"TradeCycleStarted","inputs":[{"name":"tradeCycleId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"honeyDeposit","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"startedAt","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"expiresAt","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"Transfer","inputs":[{"name":"from","type":"address","indexed":true,"internalType":"address"},{"name":"to","type":"address","indexed":true,"internalType":"address"},{"name":"value","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"Unpaused","inputs":[{"name":"account","type":"address","indexed":false,"internalType":"address"}],"anonymous":false},{"type":"event","name":"Withdraw","inputs":[{"name":"sender","type":"address","indexed":true,"internalType":"address"},{"name":"receiver","type":"address","indexed":true,"internalType":"address"},{"name":"owner","type":"address","indexed":true,"internalType":"address"},{"name":"assets","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"shares","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"error","name":"AccessControlBadConfirmation","inputs":[]},{"type":"error","name":"AccessControlUnauthorizedAccount","inputs":[{"name":"account","type":"address","internalType":"address"},{"name":"neededRole","type":"bytes32","internalType":"bytes32"}]},{"type":"error","name":"ArrayOutOfBound","inputs":[]},{"type":"error","name":"ERC20InsufficientAllowance","inputs":[{"name":"spender","type":"address","internalType":"address"},{"name":"allowance","type":"uint256","internalType":"uint256"},{"name":"needed","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"ERC20InsufficientBalance","inputs":[{"name":"sender","type":"address","internalType":"address"},{"name":"balance","type":"uint256","internalType":"uint256"},{"name":"needed","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"ERC20InvalidApprover","inputs":[{"name":"approver","type":"address","internalType":"address"}]},{"type":"error","name":"ERC20InvalidReceiver","inputs":[{"name":"receiver","type":"address","internalType":"address"}]},{"type":"error","name":"ERC20InvalidSender","inputs":[{"name":"sender","type":"address","internalType":"address"}]},{"type":"error","name":"ERC20InvalidSpender","inputs":[{"name":"spender","type":"address","internalType":"address"}]},{"type":"error","name":"ERC4626ExceededMaxDeposit","inputs":[{"name":"receiver","type":"address","internalType":"address"},{"name":"assets","type":"uint256","internalType":"uint256"},{"name":"max","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"ERC4626ExceededMaxMint","inputs":[{"name":"receiver","type":"address","internalType":"address"},{"name":"shares","type":"uint256","internalType":"uint256"},{"name":"max","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"ERC4626ExceededMaxRedeem","inputs":[{"name":"owner","type":"address","internalType":"address"},{"name":"shares","type":"uint256","internalType":"uint256"},{"name":"max","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"ERC4626ExceededMaxWithdraw","inputs":[{"name":"owner","type":"address","internalType":"address"},{"name":"assets","type":"uint256","internalType":"uint256"},{"name":"max","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"EnforcedPause","inputs":[]},{"type":"error","name":"ExpectedPause","inputs":[]},{"type":"error","name":"InsufficientFunds","inputs":[]},{"type":"error","name":"InvalidInitialization","inputs":[]},{"type":"error","name":"LiquidityNotAvailable","inputs":[]},{"type":"error","name":"NotInitializing","inputs":[]},{"type":"error","name":"OperationFailed","inputs":[]},{"type":"error","name":"ReentrancyGuardReentrantCall","inputs":[]},{"type":"error","name":"SafeERC20FailedOperation","inputs":[{"name":"token","type":"address","internalType":"address"}]},{"type":"error","name":"TradeNotMatured","inputs":[]},{"type":"error","name":"UserExceedMaxDepositAmount","inputs":[]},{"type":"error","name":"UserNotWhitelisted","inputs":[]},{"type":"error","name":"ZeroAddress","inputs":[]},{"type":"error","name":"ZeroAmount","inputs":[]}];

// Contract address
const contractAddress = "0xAcbdc07Df88e8E6efF55FB147406c4e089ffa27B";

// Configuration
const TARGET_PRICE = 6.278; // Set your target price hereberachain:0xAcbdc07Df88e8E6efF55FB147406c4e089ffa27B
const POSITION_ID = 4;
const IS_EXPIRY = true;
const CHECK_INTERVAL = "*/1 * * * *"; // Every 1 minute

// Initialize provider and contract
const provider = new ethers.JsonRpcProvider("https://rpc.berachain.com");
const contract = new ethers.Contract(contractAddress, contractABI, provider);

// Pyth Configuration
const PYTH_PRICE_FEED_ID = "0x962088abcfdbdb6e30db2e340c8cf887d9efb311b1f2f17b155a63dbb6d40265"; // BERA/USD price feed ID
const PYTH_API_URL = "https://hermes.pyth.network/v2/updates/price/latest";

/**
 * Format price value based on exponent
 * @param {number} price - The raw price value
 * @param {number} expo - The exponent (usually negative)
 * @return {number} - The formatted price
 */
function formatPrice(price, expo) {
    return price * Math.pow(10, expo);
}

// Function to check contract state
async function checkContractState() {
    try {
        // Check if contract is paused
        const isPaused = await contract.paused();
        if (isPaused) {
            throw new Error("Contract is paused");
        }

        // Get current trade cycle
        const currentCycleId = await contract.currentTradeCycleId();
        console.log(`Current trade cycle ID: ${currentCycleId}`);

        // Get trade cycle info
        const tradeCycle = await contract.tradeCycles(currentCycleId);
        console.log(`Trade cycle status: ${tradeCycle.status}`);
        console.log(`Started at: ${new Date(Number(tradeCycle.startedAt) * 1000).toLocaleString()}`);
        console.log(`Expires at: ${new Date(Number(tradeCycle.expiresAt) * 1000).toLocaleString()}`);

        // Check if trade cycle is active
        if (Number(tradeCycle.status) !== 1) { // 1 = STARTED
            throw new Error(`Trade cycle is not active. Current status: ${tradeCycle.status}`);
        }

        // Check if trade cycle has expired
        const now = BigInt(Math.floor(Date.now() / 1000));
        // if (now > tradeCycle.expiresAt) {
        //     throw new Error("Trade cycle has expired");
        // }

        return true;
    } catch (error) {
        console.error("Contract state check failed:", error.message);
        return false;
    }
}

// Function to get BERAUSD price from Pyth using the REST API
async function getBERAUSDPrice() {
    try {
        console.log("Fetching BeraUSD price from Pyth Network...");
        
        const url = `${PYTH_API_URL}?ids[]=${PYTH_PRICE_FEED_ID}`;
        const response = await axios.get(url);
        
        if (!response.data || !response.data.parsed || response.data.parsed.length === 0) {
            throw new Error('Invalid response from Pyth API');
        }
        
        const priceData = response.data.parsed[0];
        const { price, conf, expo, publish_time } = priceData.price;
        
        const formattedPrice = formatPrice(price, expo);
        const formattedConf = formatPrice(conf, expo);
        
        const emaPrice = priceData.ema_price;
        const formattedEmaPrice = formatPrice(emaPrice.price, emaPrice.expo);
        
        const publishDate = new Date(publish_time * 1000).toLocaleString();
        
        console.log(`Published: ${publishDate}`);
        
        return formattedPrice;
    } catch (error) {
        console.error("Error fetching BERAUSD price from Pyth:", error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        return null;
    }
}

// Function to execute limit order
async function executeLimitOrder() {
    try {
        // Check contract state first
        const isContractReady = await checkContractState();
        if (!isContractReady) {
            return;
        }

        const privateKey = "";
        const signer = new ethers.Wallet(privateKey, provider);
        const contractWithSigner = contract.connect(signer);
        
        // // Check if the signer has OPERATOR_ROLE
        // const OPERATOR_ROLE = await contract.OPERATOR_ROLE();
        // const hasRole = await contract.hasRole(OPERATOR_ROLE, signer.address);
        
        // if (!hasRole) {
        //     throw new Error(`Address ${signer.address} does not have OPERATOR_ROLE`);
        // }
        
        console.log(`Executing limit order with position ID ${POSITION_ID}...`);
        console.log(`Signer address: ${signer.address}`);

        // Get current gas price
        const gasPrice = await provider.getFeeData();
        console.log(`Current gas price: ${gasPrice.gasPrice?.toString() || 'unknown'}`);
        
        // Prepare transaction with higher gas limit
        const tx = await contractWithSigner.kodiakExecuteLimitOrder(POSITION_ID, IS_EXPIRY, {
            gasLimit: 500000, // Increased gas limit
            maxFeePerGas: gasPrice.maxFeePerGas,
            maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas
        });
        
        console.log("Transaction sent! Hash:", tx.hash);
        console.log("Waiting for confirmation...");
        
        // Wait for transaction confirmation with timeout
        const receipt = await Promise.race([
            tx.wait(),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Transaction confirmation timeout')), 60000)
            )
        ]);
        
        console.log("Transaction confirmed!");
        console.log("Gas used:", receipt.gasUsed.toString());
        
        // Stop the cron job after successful execution
        cronJob.stop();
    } catch (error) {
        console.error("Error executing limit order:", error.message);
        // if (error.code === 'CALL_EXCEPTION') {
        //     console.error("Transaction reverted. This could be due to:");
        //     console.error("1. Position ID not existing");
        //     console.error("2. Position already executed");
        //     console.error("3. Position not matured");
        //     console.error("4. Insufficient gas");
        //     console.error("5. Contract is paused");
        //     console.error("6. Trade cycle is not active");
            
        //     // Try to get more detailed error information
        //     try {
        //         const errorData = error.data || error.transaction?.data;
        //         if (errorData) {
        //             console.error("Error data:", errorData);
        //         }
        //     } catch (e) {
        //         console.error("Could not extract error data");
        //     }
        // }
    }
}

// Main monitoring function
async function checkPriceAndExecute() {
    const currentPrice = await getBERAUSDPrice();
    
    if (currentPrice === null) {
        console.log("Failed to fetch price, retrying in next interval...");
        return;
    }
    
    console.log(`Current BERAUSD price: $${currentPrice.toFixed(6)}`);
    
    if (currentPrice >= TARGET_PRICE) {
        console.log(`Target price reached! Executing limit order...`);
        await executeLimitOrder();
    } else {
        console.log(`Current price $${currentPrice.toFixed(6)} is below target price $${TARGET_PRICE}. Waiting...`);
    }
}

// Start the cron job
const cronJob = cron.schedule(CHECK_INTERVAL, checkPriceAndExecute);

console.log("Price monitoring started...");
console.log(`Target price: $${TARGET_PRICE}`);
console.log(`Checking every 1 minute...`);

// Initial check right away
checkPriceAndExecute();

// Handle script termination
process.on("SIGINT", () => {
    console.log("Stopping price monitoring...");
    cronJob.stop();
    process.exit();
});