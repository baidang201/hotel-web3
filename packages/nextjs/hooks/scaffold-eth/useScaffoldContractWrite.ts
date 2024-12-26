import { useContractWrite, useWalletClient, useAccount, useChainId, usePublicClient } from 'wagmi';
import { useDeployedContractInfo } from './useDeployedContractInfo';
import { useTargetNetwork } from './useTargetNetwork';
import { ContractAbi, ContractName, UseScaffoldWriteConfig } from '~~/utils/scaffold-eth/contract';
import { getParsedError } from '~~/utils/scaffold-eth';

export const useScaffoldContractWrite = <
  TContractName extends ContractName,
  TFunctionName extends string,
>({
  contractName,
  functionName,
  args,
  value,
  onError,
  onSuccess,
  ...writeConfig
}: UseScaffoldWriteConfig<TContractName, TFunctionName>) => {
  const { data: deployedContractData } = useDeployedContractInfo(contractName);
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const chainId = useChainId();
  const { targetNetwork } = useTargetNetwork();

  const write = async () => {
    try {
      if (!deployedContractData?.address) {
        console.error("Contract not deployed");
        throw new Error("合约未部署");
      }

      if (!address) {
        console.error("No wallet connected");
        throw new Error("请先连接钱包");
      }

      if (chainId !== targetNetwork.id) {
        console.error("Wrong network", { current: chainId, target: targetNetwork.id });
        throw new Error("请切换到正确的网络");
      }

      if (!walletClient) {
        throw new Error("钱包客户端未初始化");
      }

      // 准备交易参数
      const config = {
        account: address,
        address: deployedContractData.address,
        abi: deployedContractData.abi,
        functionName,
        args,
        value,
        chainId: targetNetwork.id,
      };

      console.log("Preparing transaction with config:", config);

      try {
        // 使用 publicClient 准备交易
        const { request } = await publicClient.simulateContract(config);
        console.log("Transaction simulation successful");

        // 执行交易
        const hash = await walletClient.writeContract(request);
        console.log("Transaction hash:", hash);

        // 等待交易确认
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        console.log("Transaction receipt:", receipt);

        onSuccess?.({ hash });
        return { hash, receipt };
      } catch (error: any) {
        console.error("Transaction failed:", error);
        throw new Error(error.message || "交易失败");
      }

    } catch (e: any) {
      const message = getParsedError(e);
      console.error("Contract write error:", message);
      onError?.(e);
      throw e;
    }
  };

  return {
    write,
    isLoading: false,
    isError: false,
    error: null,
    status: 'idle',
  };
}; 