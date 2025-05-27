import axios from "axios";
import { createContext, useContext, useState } from "react";
import { toast } from "react-hot-toast";

const ChatContext = createContext();

export const ChatContexProvider = ({ children }) => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);  // ✅ Corrected naming

    async function createChat(id) {
        try {
            const { data } = await axios.post("/api/message", {
                recieverId: id,
                message: "hii"
            });
        } catch (error) {
            toast.error("Something went wrong");
        }
    }
    async function createChat2(id,message) {
        try {
            const { data } = await axios.post("/api/message", {
                recieverId: id,
                message
            });
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

    return (
        <ChatContext.Provider value={{ createChat, chats, setChats, selectedChat, setSelectedChat,createChat2 }}>
            {children}
        </ChatContext.Provider>
    );
};

export const ChatData = () => useContext(ChatContext);
