"use client";

import { useState } from "react";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

enum RoomLevel {
  NORMAL,
  GOLD,
  PLATINUM,
  DIAMOND
}

export default function AdminPage() {
  const { address: connectedAddress } = useAccount();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [level, setLevel] = useState<RoomLevel>(RoomLevel.NORMAL);

  const { writeAsync: createRoom } = useScaffoldContractWrite({
    contractName: "HotelBooking",
    functionName: "createRoom",
    args: [name, description, parseEther(pricePerNight || "0"), level],
  });

  const handleCreateRoom = async () => {
    try {
      await createRoom();
      // 清空表单
      setName("");
      setDescription("");
      setPricePerNight("");
      setLevel(RoomLevel.NORMAL);
    } catch (error) {
      console.error("创建房间失败:", error);
    }
  };

  return (
    <div className="flex flex-col py-8 px-4 gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">管理后台</h1>
        <Address address={connectedAddress} />
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
              disabled={!name || !description || !pricePerNight}
            >
              创建房间
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 