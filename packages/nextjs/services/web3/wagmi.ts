import { createConfig, http } from 'wagmi';
import { hardhat } from "wagmi/chains";
import { createPublicClient, createWalletClient } from 'viem';

// 创建本地钱包
const createBurnerAccount = () => {
  const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  return {
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    privateKey,
  };
};

// 创建客户端
const transport = http();

const publicClient = createPublicClient({
  chain: hardhat,
  transport,
});

const walletClient = createWalletClient({
  chain: hardhat,
  transport,
  account: createBurnerAccount().address,
});

// 配置 wagmi
export const wagmiConfig = createConfig({
  chains: [hardhat],
  client: publicClient,
});

// 导出 hardhat 账户
export const burnerAccount = createBurnerAccount();

// 导出客户端
export { publicClient, walletClient }; 