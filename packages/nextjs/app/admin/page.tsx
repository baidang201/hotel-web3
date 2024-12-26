"use client";

import { useState } from "react";
import { parseEther, getContract } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractWrite, useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";

enum RoomLevel {
  NORMAL,
  GOLD,
  PLATINUM,
  DIAMOND
}

export default function AdminPage() {
  const { address: connectedAddress, isConnected } = useAccount();
  const { targetNetwork, isTargetNetwork } = useTargetNetwork();
  const publicClient = usePublicClient();
  
  const { data: contractInfo } = useDeployedContractInfo({
    contractName: "HotelBooking",
  });

  console.log("Contract Info:", contractInfo);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [level, setLevel] = useState<RoomLevel>(RoomLevel.NORMAL);

  const { write: createRoom, isLoading, error: writeError } = useScaffoldContractWrite({
    contractName: "HotelBooking",
    functionName: "createRoom",
    args: [
      name,
      description,
      parseEther(pricePerNight || "0"),
      BigInt(level)
    ],
    onError: (error) => {
      console.error("Contract write error:", error);
    },
    onSuccess: (tx) => {
      console.log("Transaction submitted:", tx);
    },
  });

  const handleCreateRoom = async () => {
    try {
      if (!isConnected) {
        throw new Error("请先连接钱包");
      }

      if (!isTargetNetwork) {
        throw new Error("请切换到本地网络");
      }

      if (!contractInfo?.address) {
        throw new Error("合约未部署");
      }

      if (!name || !description || !pricePerNight) {
        throw new Error("请填写所有必填字段");
      }

      try {
        const owner = await publicClient.readContract({
          address: contractInfo.address,
          abi: contractInfo.abi,
          functionName: 'owner',
        });

        if (!owner || !connectedAddress || owner.toLowerCase() !== connectedAddress.toLowerCase()) {
          throw new Error("只有合约所有者才能创建房间");
        }

        console.log("Creating room...", {
          name,
          description,
          price: parseEther(pricePerNight || "0").toString(),
          level: BigInt(level).toString(),
          owner,
          connectedAddress,
        });

        const result = await createRoom();
        console.log("Transaction result:", result);

        if (result?.receipt) {
          setName("");
          setDescription("");
          setPricePerNight("");
          setLevel(RoomLevel.NORMAL);
          alert("房间创建成功！");
        }

      } catch (error: any) {
        console.error("Transaction failed:", error);
        throw error;
      }

    } catch (error: any) {
      console.error("创建房间失败:", error);
      alert(`创建房间失败: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col py-8 px-4 gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">管理后台</h1>
        <div className="flex flex-col items-end gap-2">
          <Address address={connectedAddress} />
          <span className="text-sm">
            {isConnected 
              ? isTargetNetwork 
                ? `当前网络: ${targetNetwork.name}`
                : "请切换网络"
              : "请连接钱包"}
          </span>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">创建新房间</h2>
          
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">房间名称</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">房间描述</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">每晚价格 (ETH)</span>
            </label>
            <input
              type="number"
              step="0.01"
              className="input input-bordered w-full"
              value={pricePerNight}
              onChange={(e) => setPricePerNight(e.target.value)}
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">房间等级</span>
            </label>
            <select 
              className="select select-bordered w-full"
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
            >
              <option value={RoomLevel.NORMAL}>普通</option>
              <option value={RoomLevel.GOLD}>黄金</option>
              <option value={RoomLevel.PLATINUM}>白金</option>
              <option value={RoomLevel.DIAMOND}>铂金</option>
            </select>
          </div>

          <div className="card-actions justify-end mt-4">
            <button 
              className="btn btn-primary"
              onClick={handleCreateRoom}
              disabled={
                !name || 
                !description || 
                !pricePerNight || 
                !isConnected || 
                !isTargetNetwork ||
                isLoading
              }
            >
              {isLoading 
                ? "处理中..." 
                : !isConnected 
                  ? "请连接钱包" 
                  : !isTargetNetwork 
                    ? "请切换网络" 
                    : "创建房间"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 