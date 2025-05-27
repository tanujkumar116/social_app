import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import LoadingScreen from "./loadingPage"
const Register = () => {
  const { registerUser,loading } = UserData();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    file: null, // Ensure file is stored correctly
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
      setFormData({ ...formData, file: file }); // Correct way to store file
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert formData into FormData() object
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("gender", formData.gender);
    formDataToSend.append("file", formData.file); // Append file

    console.log("Registering User:", formData);
    await registerUser(formDataToSend, navigate);
  };

  return (
    loading ? (
      <LoadingScreen />
    ) : (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
            Register
          </h2>
  
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center">
              <label className="cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-24 h-24 object-cover rounded-full border-2 border-gray-300" />
                ) : (
                  <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-200 text-gray-500">
                    Upload
                  </div>
                )}
              </label>
            </div>
  
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="mt-1 block w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
  
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="mt-1 block w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
  
            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="mt-1 block w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
  
            {/* Gender Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <div className="flex space-x-4 mt-1">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Male
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Female
                </label>
              </div>
            </div>
  
            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 cursor-pointer"
            >
              Register
            </button>
          </form>
  
          {/* Already have an account? Login */}
          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    )
  );
  
};

export default Register;
