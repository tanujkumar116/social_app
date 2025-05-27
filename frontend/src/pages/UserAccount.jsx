import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PostData } from "../context/PostContext";
import { toast } from "react-hot-toast";
import PostCard from "../components/PostCard";
import axios from "axios";
import Modal from "../pages/Modal"; 
import { SocketData } from "../context/Socketiocontex";

const UserAccount = ({ user: LoggedInUser }) => {
  const { posts, reels } = PostData();
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [modal, setModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const { onlineUsers } = SocketData();
  const isOnline = onlineUsers.includes(id);

  async function fetchUser() {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/api/user/${id}`);
      setUser(data);
      setFollowing(data.followers.includes(LoggedInUser?._id));
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to load user profile");
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchFollowedData(type) {
    try {
      const { data } = await axios.get(`/api/user/followeddata/${id}`);
      if (type === "followers") {
        setModalTitle("Followers");
        setModalData(data.followers);
      } else {
        setModalTitle("Following");
        setModalData(data.followings);
      }
      setModal(true);
    } catch (error) {
      console.error("Error fetching followers data:", error);
      toast.error("Failed to load connection data");
    }
  }

  useEffect(() => {
    fetchUser();
  }, [id, LoggedInUser]);

  const handleFollowToggle = async () => {
    try {
      const { data } = await axios.post(`/api/user/follow/${id}`);
      toast.success(data.message);
      setFollowing(!following);
      fetchUser();
    } catch (error) {
      console.error("Error updating follow status:", error);
      toast.error("Failed to update follow status");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-300 rounded-full mb-4"></div>
          <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-40"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-8 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-red-500 mb-2">User Not Found</h2>
          <p className="text-gray-600">The user profile you're looking for doesn't seem to exist.</p>
        </div>
      </div>
    );
  }

  const myPosts = posts?.filter((post) => post.owner._id === user._id) || [];
  const myReels = reels?.filter((reel) => reel.owner._id === user._id) || [];

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Profile Header */}
      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-3xl flex flex-col md:flex-row items-center md:space-x-8 transition-all duration-300 hover:shadow-lg">
        <div className="relative mb-4 md:mb-0">
          <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img
              src={user.profilePic?.url || "https://via.placeholder.com/150"}
              alt={user.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          {isOnline && (
            <span className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-3 border-white rounded-full flex items-center justify-center shadow-sm">
              <span className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></span>
            </span>
          )}
        </div>
        
        <div className="flex flex-col space-y-2 flex-grow text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
            {LoggedInUser?._id !== user._id && (
              <button
                onClick={handleFollowToggle}
                className={`mt-3 md:mt-0 px-6 py-2 rounded-full text-white font-medium transition-all duration-300 transform hover:scale-105 ${
                  following ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {following ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
          <p className="text-gray-500">{user.email}</p>
          <p className="text-gray-700 capitalize">{user.gender}</p>
          
          <div className="flex space-x-8 pt-4 justify-center md:justify-start">
            <div 
              className="flex flex-col items-center md:items-start cursor-pointer hover:text-blue-500 transition-colors" 
              onClick={() => fetchFollowedData("followers")}
            >
              <span className="text-2xl font-bold">{user.followers?.length || 0}</span>
              <span className="text-sm text-gray-600">Followers</span>
            </div>
            <div 
              className="flex flex-col items-center md:items-start cursor-pointer hover:text-blue-500 transition-colors" 
              onClick={() => fetchFollowedData("following")}
            >
              <span className="text-2xl font-bold">{user.followings?.length || 0}</span>
              <span className="text-sm text-gray-600">Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="mt-8 w-full max-w-3xl">
        <div className="flex justify-center md:justify-start mb-6">
          <div className="bg-white rounded-full shadow-md p-1 flex space-x-2">
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                activeTab === "posts" 
                  ? "bg-blue-500 text-white shadow-md" 
                  : "bg-transparent text-gray-700 hover:bg-gray-100"
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab("reels")}
              className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                activeTab === "reels" 
                  ? "bg-blue-500 text-white shadow-md" 
                  : "bg-transparent text-gray-700 hover:bg-gray-100"
              }`}
            >
              Reels
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full">
          {activeTab === "posts" ? (
            myPosts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {myPosts.map((post) => (
                  <PostCard key={post._id} post={post} type="post" />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-10 text-center">
                <p className="text-gray-500 text-lg">No posts available</p>
                {LoggedInUser?._id === user._id && (
                  <p className="text-blue-500 mt-2">Create your first post to get started!</p>
                )}
              </div>
            )
          ) : (
            myReels.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {myReels.map((reel) => (
                  <PostCard key={reel._id} post={reel} type="reel" />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-10 text-center">
                <p className="text-gray-500 text-lg">No reels available</p>
                {LoggedInUser?._id === user._id && (
                  <p className="text-blue-500 mt-2">Create your first reel to get started!</p>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* Modal Component */}
      {modal && <Modal title={modalTitle} data={modalData} setModal={setModal} />}
    </div>
  );
};

export default UserAccount;