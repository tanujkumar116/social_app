import React, { useState } from "react";
import { PostData } from "../context/PostContext";

const AddPost = ({ type }) => {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const {addPost,addLoading}=PostData();
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!file) {
      alert("Please choose a file!");
      return;
    }
    const formdata=new FormData();
    formdata.append("caption",caption );
    formdata.append("file",file);
    addPost(formdata,setCaption,setFile,setPreview,type); 
    console.log("Uploading:", { caption, file, type });
  };

  return (
    <div className="bg-white p-4 shadow-lg rounded-lg w-96 mx-auto mt-2">
      {/* Caption Input */}
      <input
        type="text"
        placeholder="Enter Caption..."
        className="w-full p-3 mb-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none 
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100 text-gray-700 
                   placeholder-gray-500 transition duration-300"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />

      {/* File Input */}
      <input
        type="file"
        accept={type === "post" ? "image/*" : "video/*"}
        onChange={handleFileChange}
        className="w-full mb-3"
      />

      {/* File Preview */}
      {preview && (
        <div className="mb-3">
          {type === "post" ? (
            <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded-md shadow-md" />
          ) : (
            <video src={preview} controls className="w-full h-40 rounded-md shadow-md"></video>
          )}
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className={`px-4 py-2 rounded w-full transition text-white ${
          addLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        disabled={addLoading}
      >
        {addLoading ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 text-white mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            Uploading...
          </div>
        ) : (
          `+ Add ${type === "post" ? "Post" : "Reel"}`
        )}
      </button>
    </div>
  );
};

export default AddPost;
