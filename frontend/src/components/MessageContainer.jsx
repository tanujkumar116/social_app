import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { UserData } from "../context/UserContext";
import { ChatData } from "../context/ChatContex";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";

const MessageContainer = ({ selectedChat, setChats }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { user } = UserData();
  const { createChat2 } = ChatData();
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch Messages
  async function fetchMessages() {
    if (!selectedChat?.users[0]?._id) return;
    
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/api/message/${selectedChat.users[0]._id}`);
      setMessages(data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Reduced polling frequency
    return () => clearInterval(interval);
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle Send Message
  async function handleSend(e) {
    e.preventDefault();
    if (message.trim() === "") return;
    
    setIsSending(true);
    try {
      await createChat2(selectedChat.users[0]._id, message);
      await fetchMessages();
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  }

  // Format timestamp
  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};
    
    messages.forEach(msg => {
      const date = new Date(msg.createdAt).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col w-full h-full min-h-[500px] bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 bg-gray-100 border-b border-gray-200">
         <Link
                    
  
                      to={`/user/${selectedChat?.users[0]._id}`}
                    >
        <img
          src={selectedChat?.users[0]?.profilePic?.url || "https://via.placeholder.com/40"}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
        /></Link>
        <div>
          <p className="text-lg font-semibold text-gray-800">{selectedChat?.users[0]?.name || "Chat"}</p>
          <p className="text-xs text-gray-500">
            {selectedChat?.users[0]?.isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-col flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 max-h-[calc(100vh-200px)]">
        {isLoading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <FaSpinner className="animate-spin text-blue-500 text-xl" />
          </div>
        ) : messages.length > 0 ? (
          Object.entries(messageGroups).map(([date, msgs]) => (
            <div key={date} className="space-y-3">
              <div className="flex justify-center">
                <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
                  {date === new Date().toLocaleDateString() ? "Today" : date}
                </span>
              </div>
              
              {msgs.map((msg) => {
                const isSelf = msg.sender === user._id;
                return (
                  <div
                    key={msg._id}
                    className={`flex ${isSelf ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`p-3 max-w-[75%] rounded-2xl text-sm shadow-sm
                        ${isSelf
                          ? "bg-blue-500 text-white"
                          : "bg-white border border-gray-200 text-gray-800"
                        }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                      <span 
                        className={`text-xs block mt-1 text-right
                          ${isSelf ? "text-blue-100" : "text-gray-500"}`}
                      >
                        {formatMessageTime(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p className="text-center mb-2">No messages yet</p>
            <p className="text-sm text-center text-gray-400">Send a message to start the conversation</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form className="flex gap-2 items-center" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSending}
          />
          <button
            className={`${
              isSending ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            } text-white p-3 rounded-full transition-colors flex items-center justify-center min-w-[48px]`}
            type="submit"
            disabled={isSending}
          >
            {isSending ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaPaperPlane />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageContainer;