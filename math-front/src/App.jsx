import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EntryPage from './components/EntryPage'
import Dashboard from './components/Dashboard';
import RoomPage from './components/RoomPage';
function App() {
 
  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<EntryPage />} />
        <Route path="/room" element={<RoomPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
