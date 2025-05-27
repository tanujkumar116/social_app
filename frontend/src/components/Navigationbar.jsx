import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaVideo, FaCommentDots, FaUser, FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { MdAddBox } from "react-icons/md";
const Navigationbar = () => {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Update active tab when location changes
  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  // Add mounting animation
  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { path: "/", label: "Home", icon: <FaHome /> },
    {path:"/Post",label:"Post",icon:<MdAddBox />},
    { path: "/search", label: "Search", icon: <FaSearch /> },
    { path: "/reels", label: "Reels", icon: <FaVideo /> },
    { path: "/chat", label: "Chat", icon: <FaCommentDots /> },
    { path: "/account", label: "Profile", icon: <FaUser /> },
  ];

  return (
    <>
      {/* Hamburger Button (Mobile Only) */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? (
          <FaTimes className="text-red-500" size={20} />
        ) : (
          <FaBars className="text-blue-600" size={20} />
        )}
      </button>

      {/* Sidebar Navigation */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-xl transition-all duration-300 ease-in-out z-40
        ${isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"} 
        md:translate-x-0 md:w-56 
        ${mounted ? "opacity-100" : "opacity-0"}`}
      >
        {/* Logo/App Name Area */}
        <div className="flex justify-center items-center h-20 border-b border-gray-100">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            SocialApp
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = active === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-blue-50 group ${
                  isActive 
                    ? "bg-blue-500 text-white shadow-md hover:bg-blue-600" 
                    : "text-gray-600 hover:text-blue-600"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {React.cloneElement(item.icon, {
                  size: 18,
                  className: `transition-all duration-300 ${
                    isActive ? "text-white" : "text-gray-500 group-hover:text-blue-600"
                  }`,
                })}
                <span className={`text-base font-medium transition-all duration-300 ${
                  isActive ? "" : "group-hover:translate-x-1"
                }`}>
                  {item.label}
                </span>
                
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-white"></div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer Section */}
        <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-gray-100">
          <div className="text-xs text-center text-gray-400">
            &copy; {new Date().getFullYear()} SocialApp
          </div>
        </div>
      </div>

      {/* Overlay to Close Menu on Click */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Navigationbar;