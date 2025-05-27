import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { UserData } from "./UserContext";

const SocketContext = createContext();
const endpoint = "http://localhost:5002";

export const SocketContextProvider = ({ children }) => {
  const { user } = UserData();  // ✅ Move UserData() inside the component
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!user?._id) return;  // ✅ Ensure user is valid before connecting

    const socketInstance = io(endpoint, {
      query: {
        userId: user._id,
      },
    });

    setSocket(socketInstance);

    socketInstance.on("getOnlineUser", (users) => {
      setOnlineUsers(users);
    });

    return () => socketInstance.close();  // ✅ Fix cleanup function
  }, [user?._id]); // ✅ Fix dependency

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const SocketData = () => useContext(SocketContext);
