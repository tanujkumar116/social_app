import React, { useState } from 'react';
import Addpost from '../components/Addpost';
import PostCard from '../components/PostCard';
import { PostData } from '../context/PostContext';
import RightNav from '../components/RightNav';

const Home = () => {
  const { posts, followingposts } = PostData();
  const [activeTab, setActiveTab] = useState('all'); // Default to 'all' posts tab

  return (
    <div className="h-screen overflow-y-auto p-6 bg-gray-100 flex flex-col ml-50 ">
      {/* Navigation Tabs */}
      <div className="w-full flex justify-center mb-5 ">
        <div className="inline-flex rounded-md shadow-sm bg-white overflow-hidden border border-gray-300">
          <button
            className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${
              activeTab === 'all'
                ? 'bg-blue-500 text-white border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All Posts
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${
              activeTab === 'following'
                ? 'bg-blue-500 text-white border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('following')}
          >
            Following
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex gap-5">
        {/* Posts Section */}
        <div className="flex-1 max-w-3xl">
          {activeTab === 'all' ? (
            posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <p className="text-center text-gray-500">No posts available</p>
            )
          ) : (
            followingposts.length > 0 ? (
              followingposts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <p className="text-center text-gray-500">No following posts available</p>
            )
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-64">
          <RightNav />
        </div>
      </div>
    </div>
  );
};

export default Home;
