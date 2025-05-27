import React, { useEffect, useState } from 'react';
import { UserData } from '../context/UserContext';
import axios from 'axios';
import { Loader2, UserPlus, UserMinus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {PostData} from "../context/PostContext";

const RightNav = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [followLoading, setFollowLoading] = useState({});
    const { user } = UserData();
    const {g_followingposts}=PostData();

    useEffect(() => {
        if (user?._id) {
            fetchUsers();
        }
    }, [user]);

    async function fetchUsers() {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/userall');
            if (Array.isArray(data)) {
                const otherUsers = data
                    .filter(u => u._id !== user._id && user.followings.includes(u._id)!=true)
                    .slice(0, 5)
                    .map(u => ({
                        ...u,
                        isFollowing: user.followings?.includes(u._id),
                    }));
                setUsers(otherUsers);
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load suggestions");
        } finally {
            setLoading(false);
        }
    }

    async function handleFollowToggle(userId) {
        setFollowLoading(prev => ({ ...prev, [userId]: true }));
        try {
            
            const { data } = await axios.post(`/api/user/follow/${userId}`);
            toast.success(data.message);

            // Update context
            const isCurrentlyFollowing = user.followings?.includes(userId);
            const updatedFollowings = isCurrentlyFollowing
                ? user.followings.filter(id => id !== userId)
                : [...(user.followings || []), userId];
                g_followingposts();

            setUsers(prev =>
                prev.map(u =>
                    u._id === userId ? { ...u, isFollowing: !u.isFollowing } : u
                )
            );
        } catch (error) {
            console.error("Error updating follow status:", error);
            toast.error("Failed to update follow status");
        } finally {
            setFollowLoading(prev => ({ ...prev, [userId]: false }));
        }
    }

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">People you may know</h2>

            {loading ? (
                <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
                </div>
            ) : users.length > 0 ? (
                <div className="space-y-4">
                    {users.map((suggestedUser) => {
                        const following = suggestedUser.isFollowing;
                        return (
                            <div key={suggestedUser._id} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="relative w-12 h-12">
                                        <img
                                            src={suggestedUser.profilePic?.url || '/images/default-avatar.png'}
                                            alt={suggestedUser.name}
                                            className="w-12 h-12 rounded-full object-cover border border-gray-200"
                                            onError={(e) => {
                                                e.currentTarget.src = '/images/default-avatar.png';
                                            }}
                                        />
                                    </div>
                                    <div className="ml-3">
                                        <span className="text-sm font-medium text-gray-800">{suggestedUser.name}</span>
                                        {suggestedUser.title && (
                                            <p className="text-xs text-gray-500 truncate max-w-xs">{suggestedUser.title}</p>
                                        )}
                                    </div>
                                </div>
                                <button 
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center ${
                                        followLoading[suggestedUser._id] 
                                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                                            : following
                                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors'
                                                : 'bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors'
                                    }`}
                                    onClick={() => handleFollowToggle(suggestedUser._id)}
                                    disabled={followLoading[suggestedUser._id]}
                                >
                                    {followLoading[suggestedUser._id] ? (
                                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                    ) : following ? (
                                        <UserMinus className="h-3 w-3 mr-1" />
                                    ) : (
                                        <UserPlus className="h-3 w-3 mr-1" />
                                    )}
                                    {following ? 'Following' : 'Follow'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">No suggestions available at this time.</p>
                </div>
            )}

            <div className="mt-5 pt-4 border-t border-gray-100">
                <a href="/explore" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    View more connections
                </a>
            </div>
        </div>
    );
};

export default RightNav;
