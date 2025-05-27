import React from 'react'
import { BrowserRouter,Routes,Route, useNavigate, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import { Toaster } from "react-hot-toast";
import { UserData } from './context/UserContext'
import LoadingScreen from './pages/loadingPage'
import Account from './pages/Account'
import Navigationbar from './components/Navigationbar'
import Notfound from './components/Notfound'
import Reels from './pages/Reels'
import UserAccount from './pages/UserAccount'
import Search from './pages/Search'
import ChatPage from './pages/ChatPage'
import { SocketData } from './context/Socketiocontex'

const App = () => {
  const {isAuth,loading,user}=UserData();
  const {onlineUsers}=SocketData();
  console.log(onlineUsers);
  return (
     <>
       <Toaster 
        position="top-center" 
        reverseOrder={false} 
        toastOptions={{
          duration: 2000,
          style: {
            fontSize: "15px", // Increase text size
            padding: "12px",  // Increase padding
            borderRadius: "8px", 
            background: "#fff", // Dark background
            color: "#333", // White text
          },
        }}
      />
      {loading?(
        <LoadingScreen/>
      ):
      <>
      <BrowserRouter>
      <Routes>
           <Route path="/" element={isAuth ? <Home /> : <Navigate to="/login" />} />
           <Route path="/account" element={isAuth ? <Account user={user} /> : <Navigate to="/login" />} />
           <Route path="/login" element={!isAuth ? <Login /> : <Navigate to="/" />} />
           <Route path="/user/:id" element={isAuth ? <UserAccount user={user}/> : <Navigate to="/login" />} />
           <Route path="/search" element={isAuth ? <Search /> : <Navigate to="/login" />} />
           <Route path="/chat" element={isAuth ? <ChatPage user={user}/> : <Navigate to="/login" />} />
           <Route path="/register" element={!isAuth ? <Register /> : <Navigate to="/" />} />
           <Route path="/reels" element={isAuth ?<Reels/>:<Navigate to="/login" />}/>
           <Route path="*" element={isAuth && <Notfound/>} />
      </Routes>
      {isAuth && <Navigationbar/>}
      </BrowserRouter>
       
       </>
      }
     
     </>
  )
}

export default App