import { useMemo } from "react";
import { usePublicClient, useWalletClient } from "wagmi";
import scaffoldConfig from "~~/scaffold.config";

type TargetNetwork = {
  id: number;
  name: string;
  network: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: {
    default: {
      http: string[];
    };
    public: {
      http: string[];
    };
  };
  blockExplorers?: {
    default: {
      name: string;
      url: string;
    };
  };
  color?: string;
};

export function useTargetNetwork() {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const targetNetwork = useMemo((): TargetNetwork => {
    const configuredNetwork = scaffoldConfig.targetNetworks[0];
    return {
      ...configuredNetwork,
      color: "#1E40AF",
    };
  }, []);

  const isTargetNetwork = useMemo(() => {
    return walletClient?.chain.id === targetNetwork.id;
  }, [walletClient, targetNetwork]);

  return {
    targetNetwork,
    isTargetNetwork,
    publicClient,
    walletClient,
  };
}
