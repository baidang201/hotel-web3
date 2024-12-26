import { useAccount, useChainId, usePublicClient } from 'wagmi';
import { useDeployedContractInfo } from './useDeployedContractInfo';
import { useTargetNetwork } from './useTargetNetwork';
import { ContractAbi, ContractName, UseScaffoldWriteConfig } from '~~/utils/scaffold-eth/contract';
import { getParsedError } from '~~/utils/scaffold-eth';
import { burnerAccount, walletClient } from '~~/services/web3/wagmi';

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
  const { address } = useAccount();
  const chainId = useChainId();
  const { targetNetwork } = useTargetNetwork();
  const publicClient = usePublicClient();

  const write = async () => {
    try {
      if (!deployedContractData?.address) {
        throw new Error("合约未部署");
      }

      if (!address) {
        throw new Error("请先连接钱包");
      }

      if (chainId !== targetNetwork.id) {
        throw new Error("请切换到本地网络");
      }

      // 使用 burner 账户
      const account = burnerAccount;

      // 先模拟交易
      const { request } = await publicClient.simulateContract({
        address: deployedContractData.address,
        abi: deployedContractData.abi,
        functionName,
        args,
        value,
        account: account.address,
      });

      console.log("Transaction simulation successful:", request);

      // 使用 walletClient 发送交易
      const hash = await walletClient.writeContract({
        ...request,
        account: account.address,
      });

      console.log("Transaction hash:", hash);

      // 等待交易确认
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log("Transaction confirmed:", receipt);

      onSuccess?.({ hash });
      return { hash, receipt };

    } catch (e: any) {
      const message = getParsedError(e);
      console.error("Contract write error:", message);
      onError?.(e);
      throw e;
    }
  };

  return {
    write,
    data: null,
    isLoading: false,
    isError: false,
    error: null,
    status: 'idle',
  };
}; 