import React from "react";

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex space-x-2">
        <div className="w-5 h-5 bg-blue-600 rounded-full animate-bounce"></div>
        <div className="w-5 h-5 bg-blue-600 rounded-full animate-bounce delay-150"></div>
        <div className="w-5 h-5 bg-blue-600 rounded-full animate-bounce delay-300"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
