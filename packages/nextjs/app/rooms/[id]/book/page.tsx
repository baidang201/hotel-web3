"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

interface BookingPageProps {
  params: {
    id: string;
  };
}

export default function BookingPage({ params }: BookingPageProps) {
  const router = useRouter();
  const { address: connectedAddress } = useAccount();
  
  const [checkIn, setCheckIn] = useState<string>("");
  const [checkOut, setCheckOut] = useState<string>("");
  
  const { data: room } = useScaffoldContractRead({
    contractName: "HotelBooking",
    functionName: "rooms",
    args: [BigInt(params.id)],
  });

  const { writeAsync: bookRoom } = useScaffoldContractWrite({
    contractName: "HotelBooking",
    functionName: "bookRoom",
    args: [
      BigInt(params.id),
      BigInt(Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
    ],
    value: room ? room.price * BigInt(
      Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    ) : BigInt(0),
  });

  const handleBooking = async () => {
    try {
      if (!checkIn || !checkOut) {
        throw new Error("请选择入住和退房日期");
      }

      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const days = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (days <= 0) {
        throw new Error("退房日期必须晚于入住日期");
      }

      const tx = await bookRoom();
      console.log("预订交易:", tx);
      
      router.push("/bookings");
    } catch (error: any) {
      console.error("预订失败:", error);
      // 这里可以添加错误提示UI
    }
  };

  if (!room) return <div>加载中...</div>;

  return (
    <div className="flex flex-col py-8 px-4 gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">预订房间</h1>
        <Address address={connectedAddress} />
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">{room.name}</h2>
          <p>{room.description}</p>
          
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">入住日期</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">退房日期</span>
            </label>
            <input
              type="date" 
              className="input input-bordered w-full"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="mt-4">
            <p className="text-lg font-bold">
              总价: {room ? (Number(room.pricePerNight) * 
                Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 
                (1000 * 60 * 60 * 24))).toString() : "0"} ETH
            </p>
          </div>

          <div className="card-actions justify-end mt-4">
            <button 
              className="btn btn-primary"
              onClick={handleBooking}
              disabled={!checkIn || !checkOut}
            >
              确认预订
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 