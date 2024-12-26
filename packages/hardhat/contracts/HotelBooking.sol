// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract HotelBooking is Ownable, ReentrancyGuard {
    // 房间等级枚举
    enum RoomLevel { NORMAL, GOLD, PLATINUM, DIAMOND }
    
    // 房间状态枚举
    enum RoomStatus { AVAILABLE, BOOKED }
    
    // 房间结构
    struct Room {
        uint256 price;      // 房间价格
        RoomLevel level;    // 房间等级
        RoomStatus status;  // 房间状态
    }
    
    // 存储所有房间
    Room[] public rooms;
    
    // 创建房间事件
    event RoomCreated(uint256 roomId, uint256 price, RoomLevel level);
    // 预订房间事件
    event RoomBooked(uint256 roomId, address booker, uint256 numDays);
    
    constructor() Ownable(msg.sender) {}
    
    // 创建房间 (仅管理员)
    function createRoom(uint256 _price, RoomLevel _level) external onlyOwner {
        rooms.push(Room({
            price: _price,
            level: _level,
            status: RoomStatus.AVAILABLE
        }));
        
        emit RoomCreated(rooms.length - 1, _price, _level);
    }
    
    // 预订房间
    function bookRoom(uint256 _roomId, uint256 _numDays) external payable nonReentrant {
        require(_roomId < rooms.length, "Room does not exist");
        require(rooms[_roomId].status == RoomStatus.AVAILABLE, "Room is not available");
        require(msg.value >= rooms[_roomId].price * _numDays, "Insufficient payment");
        
        rooms[_roomId].status = RoomStatus.BOOKED;
        
        emit RoomBooked(_roomId, msg.sender, _numDays);
    }
    
    // 获取可用房间列表
    function getAvailableRooms() external view returns (uint256[] memory) {
        uint256 count = 0;
        
        // 计算可用房间数量
        for(uint256 i = 0; i < rooms.length; i++) {
            if(rooms[i].status == RoomStatus.AVAILABLE) {
                count++;
            }
        }
        
        // 创建结果数组
        uint256[] memory availableRooms = new uint256[](count);
        uint256 index = 0;
        
        // 填充可用房间ID
        for(uint256 i = 0; i < rooms.length; i++) {
            if(rooms[i].status == RoomStatus.AVAILABLE) {
                availableRooms[index] = i;
                index++;
            }
        }
        
        return availableRooms;
    }
} 