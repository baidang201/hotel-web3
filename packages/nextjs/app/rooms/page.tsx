"use client";

import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

enum RoomLevel {
  NORMAL,
  GOLD,
  PLATINUM,
  DIAMOND
}

enum RoomStatus {
  AVAILABLE,
  BOOKED
}

interface Room {
  id: bigint;
  name: string;
  pricePerNight: bigint;
  level: RoomLevel;
  status: RoomStatus;
  description: string;
}

export default function RoomsPage() {
  const { address: connectedAddress } = useAccount();
  
  const { data: rooms } = useScaffoldContractRead({
    contractName: "HotelBooking",
    functionName: "getAvailableRooms",
  });

  const { data: roomDetails } = useScaffoldContractRead({
    contractName: "HotelBooking",
    functionName: "getRoom",
    args: [BigInt(roomId)],  // 如果需要获取具体房间信息
  });

  const getRoomLevelString = (level: RoomLevel) => {
    switch(level) {
      case RoomLevel.NORMAL:
        return "普通";
      case RoomLevel.GOLD:
        return "黄金";
      case RoomLevel.PLATINUM:
        return "白金";
      case RoomLevel.DIAMOND:
        return "铂金";
      default:
        return "未知";
    }
  };

  return (
    <div className="flex flex-col py-8 px-4 gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">可用房间</h1>
        <div className="flex items-center gap-2">
          <span>当前账户:</span>
          <Address address={connectedAddress} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms?.map((room: Room) => (
          <div key={room.id.toString()} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">{room.name}</h2>
              <p>{room.description}</p>
              <div className="flex justify-between items-center mt-4">
                <div>
                  <p className="text-sm">等级: {getRoomLevelString(room.level)}</p>
                  <p className="text-lg font-bold">
                    {formatEther(room.pricePerNight)} ETH/晚
                  </p>
                </div>
                <div className="card-actions justify-end">
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      // TODO: 跳转到预订页面
                    }}
                  >
                    预订
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 