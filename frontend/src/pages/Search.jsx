import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import LoadingScreen from "./loadingPage";

const Search = () => {
  const [users, setUsers] = useState([]); // Ensure it's always an array
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (search.trim() === "") {
      setUsers([]); // Clear users when input is empty
      return;
    }
    fetchUsers();
  }, [search]);
  
  async function fetchUsers() {
    if (!search.trim()) return; // Prevent empty searches
  
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/userall?search=${search}`);
      console.log(data);
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
        toast.error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]); // Reset to empty array on error
      toast.error("Something went wrong");
    }
    setLoading(false);
  }
  

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex justify-center items-center flex-col pt-5">
        <div className="search flex justify-between items-center gap-4">
          <input
            type="text"
            className="custom-input border border-gray-400 px-3 py-2 rounded-md"
            placeholder="Enter Name"
            value={search}
            onChange={(e) => (setSearch(e.target.value))}
            onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
          />
          <button
            onClick={fetchUsers}
            className="px-3 py-2 bg-blue-500 text-white rounded-md"
          >
            Search
          </button>
        </div>

        {loading ? (
          <LoadingScreen />
        ) : users.length > 0 ? (
          users.map((e) => (
            <Link
              key={e._id}
              className="mt-3 w-55 px-3 py-2 bg-gray-300 rounded-md flex left-10 gap-3"
              to={`/user/${e._id}`}
            >
              <img
                src={e.profilePic?.url || "https://via.placeholder.com/50"} 
                alt={e.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              {e.name}
            </Link>
          ))
        ) : (
          <p className="mt-3 text-gray-500">No users found. Try searching for a name.</p>
        )}
      </div>
    </div>
  );
};

export default Search;
