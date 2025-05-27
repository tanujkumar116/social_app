import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserPlus, FaUserCheck } from "react-icons/fa";

const Modal = ({ title, data, setModal }) => {
  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setModal]);

  return (
    <div style = {{backgroundColor : "#00000090"}} className="fixed inset-0 flex justify-center items-center z-50">
      <div 
        ref={modalRef} 
        className="bg-white rounded-lg w-80 max-w-md shadow-xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button
            onClick={() => setModal(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="max-h-72 overflow-y-auto">
          {data && data.length > 0 ? (
            data.map((user) => (
              <div key={user._id} className="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100">
                <Link 
                  to={`/user/${user._id}`} 
                  onClick={() => setModal(false)}
                  className="flex items-center space-x-3 flex-1"
                >
                  <img
                    src={user.profilePic?.url || "https://via.placeholder.com/50"}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <p className="text-gray-800 font-medium">{user.name}</p>
                    {user.username && (
                      <p className="text-gray-500 text-xs">@{user.username}</p>
                    )}
                  </div>
                </Link>
                
                {/* Follow/Unfollow button if needed */}
                {user._id !== JSON.parse(localStorage.getItem('user'))?._id && (
                  user.isFollowing ? (
                    <button className="text-gray-600 bg-gray-100 hover:bg-gray-200 text-xs px-3 py-1 rounded-full flex items-center">
                      <FaUserCheck className="mr-1" />
                      Following
                    </button>
                  ) : (
                    <button className="text-white bg-blue-500 hover:bg-blue-600 text-xs px-3 py-1 rounded-full flex items-center">
                      <FaUserPlus className="mr-1" />
                      Follow
                    </button>
                  )
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 px-4">
              <div className="bg-gray-100 p-4 rounded-full mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-center text-gray-500">No {title.toLowerCase()} found.</p>
            </div>
          )}
        </div>

        {/* Footer with close button */}
        <div className="p-3 border-t">
          <button 
            onClick={() => setModal(false)}
            className="w-full py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;