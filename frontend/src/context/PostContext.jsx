import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
const PostContext = createContext();

export const PostContextProvider = ({ children }) => {
  const [reels, setReels] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addLoading,setaddLoading]=useState(false);
  const [followingposts,setfollowingpost]=useState([]);
  const [followingreels,setfollowingreels]=useState([]);

  async function fetchPosts() {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/post/all");
      setReels(data.reels);
      setPosts(data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }
  async function deletePost(id){
       try{
         const {data}=await axios.post("/api/post/delete/"+id);
         fetchPosts()
        toast.success(data.message);

       }
       catch(error){
        toast.error(error.response.data.message);
       }
  }
  async function addPost(formData,setCaption,setFile,setPreview,type) {
    try{
       setaddLoading(true);
       const {data}=await axios.post("/api/post/new?type="+type,formData);
       toast.success(data.message);
       fetchPosts();
       setCaption("");
       setFile(null);
       setPreview(null);
       setaddLoading(false);
    }
    catch(error){
      toast.error(error.response.data.message);
    }
  }
  async function likePost(id){
    try{
       const {data}=await axios.post("/api/post/like/"+id,);
      //  toast.success(data.message);
       fetchPosts();
    }
    catch(error){
      cosole.log(error);
    }
  }

async function commentOnPost(id, comment) {
  try {
    const { data } = await axios.post(`/api/post/comment/${id}`, { comment }); // Use POST & pass data correctly
    fetchPosts(); // Ensure this function is defined and updates the posts
    // toast.success(data.message);
  } catch (error) {
    console.error(error);
    toast.error("Failed to comment on post");
  }
}
async function deleteComment(id,commentId) {
   try{
        const {data}=await axios.post("/api/post/commentdelete/"+id,{commentId});
        // toast.success(data.message);
   }
   catch(error){
    console.error(error);
    toast.error("Failed to delete comment on post");
   }
}
async function editcaption(id,caption) {
  try{
     const {data}=await axios.post("api/post/editcaption/"+id,{caption});
    //  toast.success(data.message);
  }
  catch(error){
    toast.error(error.response.data.message);
  }
  
}
async function follwoingposts() {
  try{
      const {data}=await axios.get("/api/post/follwingposts");
      setfollowingpost(data.posts);
      setfollowingreels(data.reels);
  }
  catch(error){
    console.error(error);
    toast.error("Failed to delete comment on post");
  }
}

  // Fetch posts when the provider mounts
  useEffect(() => {
    fetchPosts();
    follwoingposts();
  }, []);

  return (
    <PostContext.Provider value={{ reels, posts, loading, fetchPosts,addPost,likePost,commentOnPost,addLoading,deleteComment,deletePost , editcaption,followingposts,followingreels}}>
      {children}
    </PostContext.Provider>
  );
};

// Custom hook to use PostContext
export const PostData = () => useContext(PostContext);
