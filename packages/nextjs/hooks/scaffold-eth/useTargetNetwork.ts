import { useMemo } from "react";
import { usePublicClient, useChainId } from "wagmi";
import scaffoldConfig from "~~/scaffold.config";

export function useTargetNetwork() {
  const chainId = useChainId();
  const publicClient = usePublicClient();

  const targetNetwork = useMemo(() => {
    // 在本地开发时总是使用 hardhat 网络
    return scaffoldConfig.targetNetworks[0];
  }, []);

  const isTargetNetwork = chainId === targetNetwork.id;

  return {
    targetNetwork,
    isTargetNetwork,
    publicClient,
  };
}
