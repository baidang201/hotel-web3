import * as chains from "wagmi/chains";

export type ScaffoldConfig = {
  targetNetworks: readonly chains.Chain[];
  pollingInterval: number;
  walletConnectProjectId: string;
  onlyLocalBurnerWallet: boolean;
  walletAutoConnect: boolean;
  disableEthPriceQuery: boolean;
};

// 使用默认的测试 projectId
const defaultWalletConnectProjectId = "3a8170812b534d0ff9d794f19a901d64";

const scaffoldConfig = {
  // 只使用 hardhat 网络
  targetNetworks: [
    {
      ...chains.hardhat,
      color: "#1E40AF",
      id: 31337,
    }
  ],

  // 区块轮询间隔 (ms)
  pollingInterval: 30000,

  // WalletConnect v2 项目 ID
  walletConnectProjectId: defaultWalletConnectProjectId,

  // 强制使用本地 Burner Wallet
  onlyLocalBurnerWallet: true,

  // 自动连接钱包
  walletAutoConnect: true,

  // 禁用 ETH 价格查询
  disableEthPriceQuery: true,
} satisfies ScaffoldConfig;

export default scaffoldConfig;
