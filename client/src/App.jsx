import React from 'react'
import { Routes,Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import EmailVerify from './pages/EmailVerify'
import ProtectedRoute from './components/ProtectedRoute'
import Transactions from './pages/Transactions'
import Analytics from './pages/Analytics'
import Wallet from './pages/Wallet'
import Personal from './pages/Personal'

const App = () => {
  return (
    <div>
     <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/email-verify" element={<EmailVerify/>} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/transactions" 
        element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/analytics" 
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/wallet" 
        element={
          <ProtectedRoute>
            <Wallet />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/personal" 
        element={
          <ProtectedRoute>
            <Personal />
          </ProtectedRoute>
        } 
      />
      
      </Routes>
    </div>
  )
}

export default App
