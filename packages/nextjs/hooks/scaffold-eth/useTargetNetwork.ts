import { useMemo } from "react";
import { usePublicClient, useChainId } from "wagmi";
import scaffoldConfig from "~~/scaffold.config";

type TargetNetwork = {
  id: number;
  name: string;
  color?: string;
  network: string;
};

export function useTargetNetwork() {
  const chainId = useChainId();
  const publicClient = usePublicClient();

  const targetNetwork = useMemo((): TargetNetwork => {
    const configuredNetwork = scaffoldConfig.targetNetworks[0];
    return {
      id: configuredNetwork.id,
      name: configuredNetwork.name,
      network: configuredNetwork.network,
      color: "#1E40AF", // 默认颜色
    };
  }, []);

  const isTargetNetwork = useMemo(() => {
    return chainId === targetNetwork.id;
  }, [chainId, targetNetwork]);

  return {
    targetNetwork,
    isTargetNetwork,
    publicClient,
  };
}
