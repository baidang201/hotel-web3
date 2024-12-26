import { useTargetNetwork } from "./useTargetNetwork";

const DEFAULT_NETWORK_COLOR = "#666666";

/**
 * Gets the network color based on the current network
 */
export const useNetworkColor = () => {
  const { targetNetwork } = useTargetNetwork();

  if (!targetNetwork) {
    return DEFAULT_NETWORK_COLOR;
  }

  return targetNetwork.color || DEFAULT_NETWORK_COLOR;
};
