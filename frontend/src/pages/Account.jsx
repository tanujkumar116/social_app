import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostData } from "../context/PostContext";
import { UserData } from "../context/UserContext";
import PostCard from "../components/PostCard";
import axios from "axios";
import Modal from "../pages/Modal";
import { FaEdit, FaLock, FaSignOutAlt, FaUserFriends, FaImages, FaFilm } from "react-icons/fa";

const Account = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = UserData();
  const { posts, reels } = PostData();
  const [activeTab, setActiveTab] = useState("posts");
  const [modal, setModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState([]);
  const [userData, setUserData] = useState(null);

  // Fetch user details
  async function fetchUser() {
    try {
      const { data } = await axios.get(`/api/user/${user?._id}`);
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  // Fetch followers/following data
  async function fetchFollowedData(type) {
    try {
      const { data } = await axios.get(`/api/user/followeddata/${user?._id}`);
      setModalTitle(type === "followers" ? "Followers" : "Following");
      setModalData(type === "followers" ? data.followers : data.followings);
      setModal(true);
    } catch (error) {
      console.error("Error fetching follow data:", error);
    }
  }

  useEffect(() => {
    if (user?._id) {
      fetchUser();
    }
  }, [user]);

  if (!userData) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const myPosts = posts?.filter((post) => post.owner._id === user._id) || [];
  const myReels = reels?.filter((reel) => reel.owner._id === user._id) || [];

  return (
    <div className="min-h-screen bg-gray-50 ml-26">
      {/* Header Gradient */}
      <div className="bg-gradient-to-r from-white to-white h-32"></div>
      
      {/* Profile Card */}
      <div className="max-w-3xl mx-auto px-4 -mt-16">
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <div className="flex flex-col sm:flex-row items-center">
            {/* Profile Image */}
            <div className="relative mb-4 sm:mb-0 sm:mr-6">
              <img
                src={userData.profilePic?.url || "https://via.placeholder.com/100"}
                alt={userData.name}
                className="w-24 h-24 rounded-full border-4 border-white object-cover"
              />
              <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full">
                <FaEdit className="text-xs" />
              </button>
            </div>
            
            {/* User Info */}
            <div className="text-center sm:text-left flex-grow">
              <h2 className="text-2xl font-bold">{userData.name}</h2>
              <p className="text-gray-600 text-sm">{userData.email}</p>
              <p className="text-gray-600 text-sm capitalize">{userData.gender}</p>
              
              {/* Stats */}
              <div className="flex justify-center sm:justify-start space-x-6 mt-3">
                <div 
                  onClick={() => fetchFollowedData("followers")}
                  className="cursor-pointer text-center"
                >
                  <p className="font-semibold">{userData.followers?.length || 0}</p>
                  <p className="text-xs text-gray-500">Followers</p>
                </div>
                <div 
                  onClick={() => fetchFollowedData("following")}
                  className="cursor-pointer text-center"
                >
                  <p className="font-semibold">{userData.followings?.length || 0}</p>
                  <p className="text-xs text-gray-500">Following</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">{myPosts.length}</p>
                  <p className="text-xs text-gray-500">Posts</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">{myReels.length}</p>
                  <p className="text-xs text-gray-500">Reels</p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-4 sm:mt-0 flex flex-col space-y-2">
              <button 
                onClick={() => logoutUser(navigate)}
                className="flex items-center justify-center px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex">
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex-1 py-3 font-medium ${
                activeTab === "posts" 
                  ? "text-blue-600 border-b-2 border-blue-500" 
                  : "text-gray-500"
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab("reels")}
              className={`flex-1 py-3 font-medium ${
                activeTab === "reels" 
                  ? "text-blue-600 border-b-2 border-blue-500" 
                  : "text-gray-500"
              }`}
            >
              Reels
            </button>
          </div>

          <div className="p-4">
            {activeTab === "posts" ? (
              myPosts.length > 0 ? (
                <div className="space-y-4">
                  {myPosts.map((post) => (
                    <PostCard key={post._id} post={post} type="post" />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaImages className="mx-auto text-3xl text-gray-300 mb-2" />
                  <p className="text-gray-500">No posts available</p>
                  
                </div>
              )
            ) : (
              myReels.length > 0 ? (
                <div className="space-y-4">
                  {myReels.map((reel) => (
                    <PostCard key={reel._id} post={reel} type="reel" />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaFilm className="mx-auto text-3xl text-gray-300 mb-2" />
                  <p className="text-gray-500">No reels available</p>
                  
                </div>
              )
            )}
          </div>
        </div>
      </div>
      
      {/* Modal Component */}
      {modal && <Modal title={modalTitle} data={modalData} setModal={setModal} />}
    </div>
  );
};

export default Account;