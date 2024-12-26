"use client";

// @refresh reset
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useDisconnect, useAccount } from "wagmi";
import { useNetworkColor } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";

export const RainbowKitCustomConnectButton = () => {
  const { disconnect } = useDisconnect();
  const { address: accountAddress } = useAccount();
  const networkColor = useNetworkColor();
  const { targetNetwork } = useTargetNetwork();

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const connected = mounted && account && chain;

        return (
          <div
            {...(!mounted && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button className="btn btn-primary" onClick={openConnectModal} type="button">
                    连接钱包
                  </button>
                );
              }

              if (chain.unsupported || !targetNetwork) {
                return (
                  <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-error dropdown-toggle">
                      <span>网络错误</span>
                    </label>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu p-2 mt-1 shadow-lg bg-base-100 rounded-box"
                    >
                      <li>
                        <button
                          className="menu-item"
                          type="button"
                          onClick={() => disconnect()}
                        >
                          断开连接
                        </button>
                      </li>
                    </ul>
                  </div>
                );
              }

              return (
                <div className="px-2 flex justify-end items-center">
                  <div className="flex justify-center items-center border-1 rounded-lg">
                    <div className="flex flex-col items-center">
                      <span
                        className="text-xs"
                        style={{ color: networkColor }}
                      >
                        {chain.name}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
