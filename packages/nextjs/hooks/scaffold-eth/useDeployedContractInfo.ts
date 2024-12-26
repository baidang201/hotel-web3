import { useEffect, useState } from "react";
import { useIsMounted } from "usehooks-ts";
import { usePublicClient, useChainId } from "wagmi";
import { ContractCodeStatus, ContractName, UseDeployedContractConfig, contracts } from "~~/utils/scaffold-eth/contract";

type DeployedContractData<TContractName extends ContractName> = {
  data: Contract<TContractName> | undefined;
  isLoading: boolean;
};

export function useDeployedContractInfo<TContractName extends ContractName>(
  config: UseDeployedContractConfig<TContractName>,
): DeployedContractData<TContractName> {
  const isMounted = useIsMounted();
  const chainId = useChainId();
  const publicClient = usePublicClient();

  const [status, setStatus] = useState<ContractCodeStatus>(ContractCodeStatus.LOADING);

  const finalConfig: UseDeployedContractConfig<TContractName> =
    typeof config === "string" ? { contractName: config } : config;

  const { contractName } = finalConfig;

  // 获取当前链上的合约信息
  const deployedContract = contracts?.[chainId]?.[contractName as ContractName];

  useEffect(() => {
    const checkContractDeployment = async () => {
      try {
        if (!isMounted() || !publicClient || !deployedContract?.address) {
          setStatus(ContractCodeStatus.NOT_FOUND);
          return;
        }

        const code = await publicClient.getBytecode({
          address: deployedContract.address,
        });

        // 如果合约代码是 `0x` => 该地址上没有部署合约
        if (code === "0x") {
          setStatus(ContractCodeStatus.NOT_FOUND);
          return;
        }
        setStatus(ContractCodeStatus.DEPLOYED);
      } catch (e) {
        console.error("Error checking contract deployment:", e);
        setStatus(ContractCodeStatus.NOT_FOUND);
      }
    };

    checkContractDeployment();
  }, [isMounted, contractName, deployedContract, publicClient]);

  console.log("Contract Info:", {
    data: status === ContractCodeStatus.DEPLOYED ? deployedContract : undefined,
    isLoading: status === ContractCodeStatus.LOADING,
  });

  return {
    data: status === ContractCodeStatus.DEPLOYED ? deployedContract : undefined,
    isLoading: status === ContractCodeStatus.LOADING,
  };
}
