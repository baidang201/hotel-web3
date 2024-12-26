import type { AppProps } from "next/app";
import { useInitializeNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";

function MyApp({ Component, pageProps }: AppProps) {
  useInitializeNativeCurrencyPrice();
  
  // 确保 nativeCurrency 已初始化
  const nativeCurrency = useGlobalState(state => state.nativeCurrency);
  
  if (!nativeCurrency) {
    return null;
  }

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={appChains.chains} theme={darkTheme()}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp; 