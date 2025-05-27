import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaTimes, FaUserPlus, FaSpinner } from "react-icons/fa";
import Chat from "../components/Chat";
import MessageContainer from "../components/MessageContainer";
import { ChatData } from "../context/ChatContex";
import { SocketData } from "../context/Socketiocontex";

const ChatPage = ({ user }) => {
  const { createChat, selectedChat, setSelectedChat, chats, setChats } = ChatData();
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingChats, setLoadingChats] = useState(true);
  const { onlineUsers } = SocketData();

  // Fetch all users based on search query
  useEffect(() => {
    const fetchAllUsers = async () => {
      if (!query.trim()) {
        setUsers([]);
        return;
      }
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/userall?search=${query}`);
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
      setLoading(false);
    };

    const timer = setTimeout(fetchAllUsers, 500); // Debounce search input
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch all chats
  const getAllChats = async () => {
    setLoadingChats(true);
    try {
      const { data } = await axios.get("/api/chats");
      setChats(data.chats);
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoadingChats(false);
    }
  };
  
  useEffect(() => {
    getAllChats();
  }, []);

  // Create new chat
  async function createNewChat(id) {
    try {
      await createChat(id);
      await getAllChats();
      setSearch(false);
      setQuery("");
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  }

  return (
    <div className="w-full max-w-6xl min-h-screen p-4 md:p-6 bg-gray-100 rounded-lg shadow-lg mx-auto">
      <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-100px)]">
        
        {/* Left Sidebar - User Search & Chat List */}
        <div className="w-full md:w-1/3 lg:w-1/4 bg-white rounded-lg shadow-md overflow-hidden flex flex-col ml-45">
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Conversations</h2>
              <button
                className={`${
                  search ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
                } text-white p-2 rounded-full transition-colors`}
                onClick={() => setSearch(!search)}
                title={search ? "Close search" : "Search users"}
              >
                {search ? <FaTimes /> : <FaUserPlus />}
              </button>
            </div>
            
            {search && (
              <div className="mt-3 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full border border-gray-300 pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  placeholder="Search for users..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            )}
          </div>

          {search ? (
            <div className="flex-1 overflow-auto p-3">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Search Results</h3>
              
              {loading ? (
                <div className="flex justify-center items-center py-6">
                  <FaSpinner className="animate-spin text-blue-500" />
                </div>
              ) : users.length > 0 ? (
                <div className="space-y-2">
                  {users.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => createNewChat(user._id)}
                      className="bg-gray-50 hover:bg-gray-100 text-gray-800 p-3 cursor-pointer flex items-center gap-3 rounded-lg transition-colors border border-gray-100"
                    >
                      <img
                        src={user.profilePic?.url || "https://via.placeholder.com/40"}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                        alt={`${user.name}'s avatar`}
                      />
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : query.trim() !== "" ? (
                <p className="text-center text-gray-500 py-6">No users found</p>
              ) : (
                <p className="text-center text-gray-500 py-6">Type to search for users</p>
              )}
            </div>
          ) : (
            <div className="flex-1 overflow-auto p-3">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Conversations</h3>
              
              {loadingChats ? (
                <div className="flex justify-center items-center py-6">
                  <FaSpinner className="animate-spin text-blue-500" />
                </div>
              ) : chats.length > 0 ? (
                <div className="space-y-1">
                  {chats.map((chat) => (
                    <Chat
                      key={chat._id}
                      chat={chat}
                      setSelectedChat={setSelectedChat}
                      selectedChat={selectedChat}
                      isOnline={onlineUsers.includes(chat.users[0]._id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                  <p className="mb-2">No conversations yet</p>
                  <p className="text-sm text-gray-400">Search for users to start chatting</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side - Chat Messages */}
        <div className="w-full md:w-2/3 lg:w-3/4 bg-white rounded-lg shadow-md overflow-hidden flex-1">
          {selectedChat ? (
            <MessageContainer selectedChat={selectedChat} setChats={setChats} />
          ) : (
            <div className="flex flex-col justify-center items-center h-full text-gray-500 p-6">
              <div className="bg-gray-100 rounded-full p-6 mb-4">
                <FaSearch className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">Hello, {user.name}</h3>
              <p className="text-center text-gray-400 max-w-md">
                Select a conversation from the sidebar or search for someone new to start chatting.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;