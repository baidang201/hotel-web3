import { useContractRead } from 'wagmi';
import { useDeployedContractInfo } from './useDeployedContractInfo';
import { useTargetNetwork } from './useTargetNetwork';
import { ContractAbi, ContractName, UseScaffoldReadConfig } from '~~/utils/scaffold-eth/contract';

export const useScaffoldContractRead = <
  TContractName extends ContractName,
  TFunctionName extends string,
>({
  contractName,
  functionName,
  args,
  ...readConfig
}: UseScaffoldReadConfig<TContractName, TFunctionName>) => {
  const { data: deployedContractData } = useDeployedContractInfo(contractName);
  const { targetNetwork } = useTargetNetwork();

  return useContractRead({
    chainId: targetNetwork.id,
    functionName,
    address: deployedContractData?.address,
    abi: deployedContractData?.abi as ContractAbi<TContractName>,
    args,
    ...readConfig,
  });
}; 