import { useContext, createContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [isAuth, setAuth] = useState(false);
    const [loading, setLoading] = useState(false);
    async function upadatProfile(file) {
        try{
           const {data}=await axios.post("/api/user/update",file);
           toast.success(data.message);
        }
        catch(error){
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }
    async function upadatepassword(oldpassword,newpassword) {
        try{
             const {data}=await axios.post("/api/user/changepassword",{oldpassword,newpassword});
             toast.success(data.message);
        }
        catch(error){
            toast.error(error.response?.data?.message || "Something went wrong");
        }
        
    }
    async function loginUser(email, password, navigate) {
        try {
            const { data } = await axios.post("/api/auth/login", { email, password });
            toast.success(data.message);
            setAuth(true);
            setUser(data.user);
            setLoading(false);
            navigate("/");
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }
    async function registerUser(formData, navigate) {
        try {
            setLoading(true);
            const { data } = await axios.post("/api/auth/register", formData);
            toast.success(data.message);
            setAuth(true);
            setUser(data.user);
            setLoading(false);
            navigate("/");
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }

    async function fetchUser() {
        try {
            const { data } = await axios.get("/api/user/me");
            setUser(data);
            setAuth(true);
        } catch (error) {
            console.error("Error fetching user:", error);
            toast.error("Failed to fetch user data");
            setAuth(false);
        } finally {
            setLoading(false); // Ensures loading stops even on error
        }
    }
    async function logoutUser(navigate) {
        try{
             const {data}=await axios.get("/api/auth/logout");
             if(data){
                toast.success(data.message);
                setUser({});
                setAuth(false);
                navigate('\login');
             }
        }
        catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }

    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ loginUser, isAuth, setAuth, user, setUser, loading,logoutUser,registerUser,upadatProfile,upadatepassword }}>
            {children}
        </UserContext.Provider>
    );
};

export const UserData = () => useContext(UserContext);
