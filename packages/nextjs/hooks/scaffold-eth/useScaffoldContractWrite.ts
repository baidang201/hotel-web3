import { useContractWrite, useChainId } from 'wagmi';
import { useDeployedContractInfo } from './useDeployedContractInfo';
import { useTargetNetwork } from './useTargetNetwork';
import { ContractAbi, ContractName, UseScaffoldWriteConfig } from '~~/utils/scaffold-eth/contract';
import { getParsedError } from '~~/utils/scaffold-eth';
import { notification } from '~~/utils/scaffold-eth';

export const useScaffoldContractWrite = <
  TContractName extends ContractName,
  TFunctionName extends string,
>({
  contractName,
  functionName,
  args,
  value,
  onBlockConfirmation,
  blockConfirmations = 1,
  ...writeConfig
}: UseScaffoldWriteConfig<TContractName, TFunctionName>) => {
  const { data: deployedContractData } = useDeployedContractInfo(contractName);
  const { targetNetwork } = useTargetNetwork();
  const chainId = useChainId();

  const { write, data, isLoading, isError, error } = useContractWrite({
    chainId: targetNetwork.id,
    address: deployedContractData?.address,
    abi: deployedContractData?.abi as ContractAbi<TContractName>,
    functionName,
    args,
    value,
    ...writeConfig,
  });

  const handleWrite = async () => {
    if (!chainId) {
      notification.error("Please connect your wallet");
      return;
    }
    if (chainId !== targetNetwork.id) {
      notification.error("Please switch to the correct network");
      return;
    }

    if (!write) {
      notification.error("Failed to prepare contract write");
      return;
    }

    try {
      const tx = await write();
      
      if (onBlockConfirmation) {
        const receipt = await tx.wait(blockConfirmations);
        onBlockConfirmation(receipt);
      }
      
      return tx;
    } catch (e: any) {
      const message = getParsedError(e);
      notification.error(message);
      throw e;
    }
  };

  return {
    writeAsync: handleWrite,
    data,
    isLoading,
    isError,
    error,
  };
}; 