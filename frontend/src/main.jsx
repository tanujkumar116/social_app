import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserContextProvider } from './context/UserContext.jsx'
import { PostContextProvider } from './context/PostContext.jsx'
import { ChatContexProvider } from './context/ChatContex.jsx'
import { SocketContextProvider } from './context/Socketiocontex.jsx'
createRoot(document.getElementById('root')).render(
  <UserContextProvider>
    <PostContextProvider>
      <ChatContexProvider>
      <SocketContextProvider>
    <App />
    </SocketContextProvider>
    </ChatContexProvider>
    </PostContextProvider>
  </UserContextProvider>,
)
