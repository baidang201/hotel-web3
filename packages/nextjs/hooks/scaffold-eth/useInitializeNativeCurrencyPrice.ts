import { useEffect } from "react";
import { useGlobalState } from "~~/services/store/store";
import scaffoldConfig from "~~/scaffold.config";
import { useTargetNetwork } from "./useTargetNetwork";

export const useInitializeNativeCurrencyPrice = () => {
  const setNativeCurrencyPrice = useGlobalState(state => state.setNativeCurrencyPrice);
  const { targetNetwork } = useTargetNetwork();

  useEffect(() => {
    if (scaffoldConfig.disableEthPriceQuery) {
      setNativeCurrencyPrice(1);
      return;
    }

    const fetchPrice = async () => {
      try {
        // 在本地测试网络中使用默认值
        if (targetNetwork.id === 31337) {
          setNativeCurrencyPrice(1);
          return;
        }

        // 其他网络的价格查询逻辑...
        // 这里可以添加实际的价格查询代码
      } catch (error) {
        console.warn("Error fetching ETH price:", error);
        setNativeCurrencyPrice(1);
      }
    };

    fetchPrice();
  }, [setNativeCurrencyPrice, targetNetwork]);
};
