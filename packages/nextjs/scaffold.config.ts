import * as chains from "wagmi/chains";

export type ScaffoldConfig = {
  targetNetworks: readonly chains.Chain[];
  pollingInterval: number;
  alchemyApiKey: string;
  walletConnectProjectId: string;
  onlyLocalBurnerWallet: boolean;
  walletAutoConnect: boolean;
  disableEthPriceQuery: boolean;
};

// 使用默认的测试 projectId
const defaultWalletConnectProjectId = "3a8170812b534d0ff9d794f19a901d64";

const scaffoldConfig = {
  // 目标网络配置
  targetNetworks: [
    {
      ...chains.hardhat,
      color: "#1E40AF",
    },
    {
      ...chains.mainnet,
      color: "#2E8B57",
    },
    {
      ...chains.sepolia,
      color: "#FF4500",
    },
    {
      ...chains.goerli,
      color: "#DAA520",
    },
  ],

  // 区块轮询间隔 (ms)
  pollingInterval: 30000,

  // Alchemy API key
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "",

  // WalletConnect v2 项目 ID
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || defaultWalletConnectProjectId,

  // 只使用本地测试钱包
  onlyLocalBurnerWallet: true,

  // 自动连接钱包
  walletAutoConnect: true,

  // 禁用 ETH 价格查询
  disableEthPriceQuery: true,
} satisfies ScaffoldConfig;

export default scaffoldConfig;
