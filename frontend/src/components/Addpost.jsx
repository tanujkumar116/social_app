import React, { useState } from "react";
import { PostData } from "../context/PostContext";
import { Plus } from "lucide-react"; // optional, for icon

const AddPost = () => {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [type, setType] = useState("post"); // user selects post or reel
  const { addPost, addLoading } = PostData();

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
    const formdata = new FormData();
    formdata.append("caption", caption);
    formdata.append("file", file);
    addPost(formdata, setCaption, setFile, setPreview, type);
  };

  return (
    <div className="bg-white p-6 shadow-xl rounded-2xl w-full max-w-md mx-auto mt-6 border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Create a Post or Reel</h2>

      {/* Type Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Type:</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="post">Post (Image)</option>
          <option value="reel">Reel (Video)</option>
        </select>
      </div>

      {/* Caption Input */}
      <input
        type="text"
        placeholder="Write a caption..."
        className="w-full p-3 mb-4 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none 
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />

      {/* File Input */}
      <label className="block text-sm text-gray-600 mb-1 font-medium">
        Upload {type === "post" ? "Image" : "Video"}
      </label>
      <input
        type="file"
        accept={type === "post" ? "image/*" : "video/*"}
        onChange={handleFileChange}
        className="w-full mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-full 
                   file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 
                   hover:file:bg-blue-100"
      />

      {/* File Preview */}
      {preview && (
        <div className="mb-4 rounded-lg overflow-hidden border border-gray-200 shadow-sm transition-all duration-300">
          {type === "post" ? (
            <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
          ) : (
            <video src={preview} controls className="w-full h-48 object-cover" />
          )}
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className={`w-full py-2.5 rounded-lg text-white text-sm font-semibold shadow-md transition-all duration-300
          ${addLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300"}`}
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
          <div className="flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Add {type === "post" ? "Post" : "Reel"}</span>
          </div>
        )}
      </button>
    </div>
  );
};

export default AddPost;
