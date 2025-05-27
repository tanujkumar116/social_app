import React, { useState } from "react";
import Addpost from "../components/Addpost";
import { PostData } from "../context/PostContext";
import PostCard from "../components/PostCard";
import { FaArrowUp, FaArrowDownLong } from "react-icons/fa6";
import LoadingScreen from "./loadingPage";

const Reels = () => {
  const { reels, loading } = PostData();
  const [index, setIndex] = useState(0);

  const prevReel = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const nextReel = () => {
    if (index < reels.length - 1) {
      setIndex(index + 1);
    }
  };

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center py-6">

          <div className="relative flex flex-col items-center w-[300px] md:w-[500px]">
            {reels && reels.length > 0 ? (
              <>
                {/* Reels Card */}
                <div className=" p-4 w-full mt-5">
                  <PostCard key={reels[index]._id} post={reels[index]} type="reel" />
                </div>

                {/* Navigation Buttons */}
                <div className="absolute top-1/2 left-full transform -translate-y-1/2 flex flex-col gap-4">
                  {index > 0 && (
                    <button
                      className="bg-gray-500 text-white p-3 rounded-full shadow-md hover:bg-gray-600 transition"
                      onClick={prevReel}
                    >
                      <FaArrowUp size={20} />
                    </button>
                  )}
                  {index < reels.length - 1 && (
                    <button
                      className="bg-gray-500 text-white p-3 rounded-full shadow-md hover:bg-gray-600 transition"
                      onClick={nextReel}
                    >
                      <FaArrowDownLong size={20} />
                    </button>
                  )}
                </div>
              </>
            ) : (
              <p className="text-center text-gray-600 mt-4">No reels yet</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Reels;
