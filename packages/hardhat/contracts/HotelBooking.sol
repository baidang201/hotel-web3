// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract HotelBooking is Ownable, ReentrancyGuard {
    // 错误定义
    error RoomNotExists();
    error RoomNotAvailable();
    error InvalidPayment();
    error InvalidDays();
    
    // 房间等级枚举
    enum RoomLevel { NORMAL, GOLD, PLATINUM, DIAMOND }
    
    // 房间状态枚举
    enum RoomStatus { AVAILABLE, BOOKED }
    
    // 房间结构
    struct Room {
        uint256 price;      // 房间价格
        RoomLevel level;    // 房间等级
        RoomStatus status;  // 房间状态
        string name;        // 房间名称
        string description; // 房间描述
    }
    
    // 存储所有房间
    Room[] public rooms;
    
    // 创建房间事件
    event RoomCreated(uint256 indexed roomId, string name, uint256 price, RoomLevel level);
    // 预订房间事件
    event RoomBooked(uint256 indexed roomId, address indexed booker, uint256 numDays);
    // 创建房间尝试事件
    event CreateRoomAttempt(
        address indexed creator,
        string name,
        string description,
        uint256 price,
        RoomLevel level
    );
    
    constructor() Ownable(msg.sender) {}
    
    // 创建房间 (仅管理员)
    function createRoom(
        string memory _name,
        string memory _description,
        uint256 _price,
        RoomLevel _level
    ) external onlyOwner {
        // 添加事件记录
        emit CreateRoomAttempt(msg.sender, _name, _description, _price, _level);
        
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_price > 0, "Price must be greater than 0");
        
        // 检查调用者是否是合约所有者
        require(owner() == msg.sender, "Caller is not the owner");
        
        rooms.push(Room({
            price: _price,
            level: _level,
            status: RoomStatus.AVAILABLE,
            name: _name,
            description: _description
        }));
        
        emit RoomCreated(rooms.length - 1, _name, _price, _level);
    }
    
    // 预订房间
    function bookRoom(uint256 _roomId, uint256 _numDays) external payable nonReentrant {
        if(_roomId >= rooms.length) revert RoomNotExists();
        if(_numDays == 0) revert InvalidDays();
        
        Room storage room = rooms[_roomId];
        if(room.status != RoomStatus.AVAILABLE) revert RoomNotAvailable();
        
        uint256 totalPrice = room.price * _numDays;
        if(msg.value < totalPrice) revert InvalidPayment();
        
        room.status = RoomStatus.BOOKED;
        
        // 退还多余的支付
        if(msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }
        
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

    // 获取房间信息
    function getRoom(uint256 _roomId) external view returns (Room memory) {
        if(_roomId >= rooms.length) revert RoomNotExists();
        return rooms[_roomId];
    }

    // 获取房间总数
    function getRoomCount() external view returns (uint256) {
        return rooms.length;
    }
} 