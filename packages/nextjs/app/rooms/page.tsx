"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatEther } from "viem";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

type Room = {
  price: bigint;
  level: number;
  status: number;
  name: string;
  description: string;
};

export default function RoomsPage() {
  const [roomDetails, setRoomDetails] = useState<(Room | null)[]>([]);

  // 获取房间总数
  const { data: roomCount } = useScaffoldContractRead({
    contractName: "HotelBooking",
    functionName: "getRoomCount",
  });

  // 获取所有房间信息
  const { data: room0 } = useScaffoldContractRead({
    contractName: "HotelBooking",
    functionName: "getRoom",
    args: [BigInt(0)],
  });

  const { data: room1 } = useScaffoldContractRead({
    contractName: "HotelBooking",
    functionName: "getRoom",
    args: [BigInt(1)],
  });

  const { data: room2 } = useScaffoldContractRead({
    contractName: "HotelBooking",
    functionName: "getRoom",
    args: [BigInt(2)],
  });

  useEffect(() => {
    if (roomCount) {
      const count = Number(roomCount);
      const rooms = [room0, room1, room2].slice(0, count);
      setRoomDetails(rooms);
    }
  }, [roomCount, room0, room1, room2]);

  const getRoomLevel = (level: number) => {
    switch (level) {
      case 0:
        return "普通";
      case 1:
        return "黄金";
      case 2:
        return "白金";
      case 3:
        return "钻石";
      default:
        return "未知";
    }
  };

  return (
    <div className="flex flex-col py-8 px-4 gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">房间列表</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roomDetails.map((room, index) => 
          room && (
            <div key={index} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{room.name}</h2>
                <p>{room.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <p className="text-sm">等级: {getRoomLevel(room.level)}</p>
                    <p className="text-sm">价格: {formatEther(room.price)} ETH/晚</p>
                    <p className="text-sm">状态: {room.status === 0 ? "可预订" : "已预订"}</p>
                  </div>
                  {room.status === 0 && (
                    <Link 
                      href={`/rooms/${index}/book`}
                      className="btn btn-primary"
                    >
                      预订
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {roomDetails.length === 0 && (
        <div className="text-center py-8">
          <p>暂无房间</p>
        </div>
      )}
    </div>
  );
} 