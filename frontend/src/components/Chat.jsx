import React from "react";
import { formatDistanceToNow } from "date-fns";

const Chat = ({ chat, setSelectedChat, selectedChat, isOnline }) => {
  const chatPartner = chat.users[0]; // Assuming the first user is the chat partner
  const lastMessage = chat.latestMessage?.text || "No messages yet";
  const lastMessageTime = chat.latestMessage?.createdAt 
    ? formatDistanceToNow(new Date(chat.latestMessage.createdAt), { addSuffix: true })
    : "";
  
  const isSelected = selectedChat?._id === chat._id;

  return (
    <div
      className={`relative flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-all duration-300 w-full mb-2
        ${isSelected 
          ? "bg-blue-500 text-white shadow-md" 
          : "hover:bg-gray-100 border border-gray-100"
        }`}
      onClick={() => setSelectedChat(chat)}
    >
      {/* Profile Picture with Online Status */}
      <div className="relative flex-shrink-0">
        <img
          src={chatPartner.profilePic?.url || "https://via.placeholder.com/40"}
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
          alt={`${chatPartner.name}'s avatar`}
        />
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
        )}
      </div>

      {/* Chat Details */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex justify-between items-start">
          <p className={`font-semibold text-lg truncate ${isSelected ? "text-white" : "text-gray-800"}`}>
            {chatPartner.name}
          </p>
          {lastMessageTime && (
            <span className={`text-xs ${isSelected ? "text-blue-100" : "text-gray-500"}`}>
              {lastMessageTime}
            </span>
          )}
        </div>
        <p className={`text-sm truncate w-full ${isSelected ? "text-blue-100" : "text-gray-500"}`}>
          {lastMessage.length > 30 ? lastMessage.substring(0, 30) + "..." : lastMessage}
        </p>
      </div>
    </div>
  );
};

export default Chat;