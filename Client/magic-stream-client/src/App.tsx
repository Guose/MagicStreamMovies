import './App.css'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Home from './components/home/Home'
import Header from './components/header/Header'
import Register from './components/register/Register'
import Login from './components/login/Login'

function App() {
  const nav = useNavigate()
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recommended" element={<div>Recommended</div>} />
      </Routes>
    </>
  )
}

export default App
