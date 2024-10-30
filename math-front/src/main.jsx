import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SocketProvider } from './contexts/SocketContext';
import { AuthProvider } from './contexts/AuthContext.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
   <SocketProvider>
   <AuthProvider>
    
    <App />
 
</AuthProvider>
   </SocketProvider>
  </StrictMode>,
)
