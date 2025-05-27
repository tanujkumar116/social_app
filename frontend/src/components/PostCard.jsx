import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaComment, FaEllipsisH, FaTrash, FaEdit, FaShare } from "react-icons/fa";
import { PostData } from "../context/PostContext";
import { UserData } from "../context/UserContext";
import { formatDistanceToNow, format } from "date-fns";
import { Link } from "react-router-dom";
import { SocketData } from "../context/Socketiocontex";

const PostCard = ({ post, type }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes.length);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newCaption, setNewCaption] = useState(post.caption);
  const [isAnimating, setIsAnimating] = useState(false);
  const { onlineUsers } = SocketData();
  const { user } = UserData();
  const isOnline = onlineUsers.includes(post.owner._id);
  const { likePost, commentOnPost, deleteComment, editcaption, deletePost } = PostData();

  const postDate = new Date(post.createdAt);
  const formattedDate =
    (new Date() - postDate) / (1000 * 60 * 60 * 24) < 1
      ? formatDistanceToNow(postDate, { addSuffix: true })
      : format(postDate, "dd MMM yyyy");

  useEffect(() => {
    setLiked(post.likes.includes(user._id));
    setLikes(post.likes.length);
  }, [post, user._id]);

  const handleLike = () => {
    setLiked(!liked);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 800);
    likePost(post._id);
    
    // Optimistically update likes count
    setLikes(prev => liked ? prev - 1 : prev + 1);
  };

  const handleComment = () => {
    if (comment.trim()) {
      commentOnPost(post._id, comment);
      const newComment = {
        _id: Math.random().toString(36).substr(2, 9),
        user: { _id: user._id, profilePic: user.profilePic, name: user.name },
        comment: comment,
        createdAt: new Date().toISOString(),
      };
      setComments([newComment, ...comments]);
      setComment("");
    }
  };

  const handleDeleteComment = (commentId) => {
    deleteComment(post._id, commentId);
    setComments(comments.filter((c) => c._id !== commentId));
  };

  const handleEditCaption = async () => {
    if (newCaption.trim()) {
      await editcaption(post._id, newCaption);
      post.caption = newCaption;
      setIsEditing(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => showOptions && setShowOptions(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showOptions]);

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden w-full max-w-xl mx-auto my-6 transition-all duration-300 hover:shadow-lg">
      {/* Post Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <Link to={`/user/${post.owner._id}`} className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-sm transition-transform duration-300 group-hover:scale-105">
              <img 
                src={post.owner.profilePic.url} 
                alt={post.owner.name}
                className="w-full h-full object-cover" 
              />
            </div>
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
            )}
          </div>
          <div className="transition-all duration-300 group-hover:translate-x-1">
            <span className="font-semibold text-gray-800">{post.owner.name}</span>
            <p className="text-xs text-gray-500">{formattedDate}</p>
          </div>
        </Link>
        
        {user._id === post.owner._id && (
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setShowOptions(!showOptions);
              }}
            >
              <FaEllipsisH className="text-gray-600" />
            </button>
            
            {showOptions && (
              <div className="absolute right-0 mt-1 w-36 bg-white shadow-lg rounded-lg overflow-hidden z-10 border border-gray-100 transition-all transform origin-top-right animate-fadeIn">
                <button 
                  className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex items-center transition-colors" 
                  onClick={() => {
                    setIsEditing(true);
                    setShowOptions(false);
                  }}
                >
                  <FaEdit className="mr-3 text-blue-500" /> Edit Post
                </button>
                <button 
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors" 
                  onClick={() => deletePost(post._id)}
                >
                  <FaTrash className="mr-3" /> Delete Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Caption */}
      <div className="px-4 pb-3">
        {isEditing ? (
          <div className="mt-1 space-y-2">
            <textarea 
              value={newCaption} 
              onChange={(e) => setNewCaption(e.target.value)} 
              className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Write your caption..."
              rows={3}
            />
            <div className="flex space-x-2">
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium" 
                onClick={handleEditCaption}
              >
                Save Changes
              </button>
              <button 
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium" 
                onClick={() => {
                  setIsEditing(false);
                  setNewCaption(post.caption);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          post.caption && (
            <p className="text-gray-800 text-sm leading-relaxed">{post.caption}</p>
          )
        )}
      </div>

      {/* Media Content */}
      <div className="relative overflow-hidden">
        <div className="aspect-w-16 aspect-h-12 bg-gray-100">
          {type === "reel" ? (
            <video 
              src={post.post.url} 
              controls 
              className="w-full h-full object-contain" 
              poster={post.post.url.replace(/\.[^/.]+$/, "_thumbnail.jpg")}
            />
          ) : (
            <img 
              src={post.post.url} 
              alt="Post Content" 
              className="w-full h-full object-contain" 
              loading="lazy"
            />
          )}
        </div>
        
        {/* Like Animation */}
        {isAnimating && (
          <div className="absolute inset-0 flex items-center justify-center">
            <FaHeart className="text-red-500 animate-ping-once text-6xl opacity-90" />
          </div>
        )}
      </div>

      {/* Engagement Section */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex space-x-5">
            <button 
              onClick={handleLike} 
              className={`flex items-center space-x-1 transition-transform duration-200 ${liked ? 'text-red-500' : 'text-gray-600'} hover:scale-110`}
            >
              {liked ? (
                <FaHeart className="transform transition hover:scale-110" size={20} />
              ) : (
                <FaRegHeart className="transform transition hover:scale-110" size={20} />
              )}
              <span className="text-sm font-medium">{likes}</span>
            </button>
            
            <button 
              onClick={() => setShowComments(!showComments)} 
              className="flex items-center space-x-1 text-gray-600 transition-transform duration-200 hover:scale-110 hover:text-blue-500"
            >
              <FaComment size={20} />
              <span className="text-sm font-medium">{comments.length}</span>
            </button>
            
            <button className="text-gray-600 transition-transform duration-200 hover:scale-110 hover:text-green-500">
              <FaShare size={20} />
            </button>
          </div>
          
          <div className="text-xs text-gray-500">
            {type === "reel" ? "Reel" : "Post"}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-100 pt-3 px-4 pb-4 bg-gray-50 transition-all duration-300 ease-in-out">
          {/* Comment Input */}
          <div className="flex space-x-2 mb-4">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <img src={user.profilePic.url} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-grow flex items-center space-x-2 bg-white rounded-full border border-gray-200 px-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
              <input 
                type="text" 
                placeholder="Add a comment..." 
                value={comment} 
                onChange={(e) => setComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                className="flex-grow py-2 outline-none text-sm text-gray-700 bg-transparent" 
              />
              <button 
                onClick={handleComment} 
                disabled={!comment.trim()}
                className={`flex-shrink-0 text-sm font-medium ${comment.trim() ? 'text-blue-500 hover:text-blue-600' : 'text-gray-300'} transition-colors`}
              >
                Post
              </button>
            </div>
          </div>
          
          {/* Comments List */}
          <div className="space-y-4 max-h-64 overflow-y-auto custom-scrollbar">
            {comments.length > 0 ? (
              comments.map((c) => (
                <div key={c._id} className="flex space-x-3 group">
                  <Link to={`/user/${c.user._id}`} className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img src={c.user.profilePic.url} alt={c.user.name} className="w-full h-full object-cover" />
                    </div>
                  </Link>
                  <div className="flex-grow bg-white p-3 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link to={`/user/${c.user._id}`} className="font-medium text-gray-800 text-sm hover:underline">
                          {c.user.name}
                        </Link>
                        <p className="text-gray-700 text-sm mt-1">{c.comment}</p>
                      </div>
                      {user._id === c.user._id && (
                        <button 
                          onClick={() => handleDeleteComment(c._id)} 
                          className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaTrash size={12} />
                        </button>
                      )}
                    </div>
                    {c.createdAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(c.createdAt), 'MMM d, h:mm a')}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>No comments yet</p>
                <p className="text-sm">Be the first to comment on this post</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Add this to your CSS
const customStyles = `
.animate-ping-once {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1);
}
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out forwards;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555;
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}
.aspect-w-16 {
  position: relative;
  padding-bottom: 62.5%; /* 10/16 = 0.625 */
}
.aspect-w-16 > * {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
`;

export default PostCard;