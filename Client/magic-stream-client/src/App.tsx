import './App.css'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Home from './components/home/Home'
import Recommended from './components/recommended/Recommended'
import Header from './components/header/Header'
import Register from './components/register/Register'
import Login from './components/login/Login'
import RequiredAuth from './components/RequiredAuth'
import useAuth from './hooks/useAuth'
import axiosClient from './api/axiosConfig'
import StreamMovie from './components/stream/StreamMovie'
import Review from './components/review/Review'

function App() {
  const nav = useNavigate()
  const { auth, setAuth } = useAuth()

  const updateMovieReview = (imdb_id: string) => {
    nav(`/reviews/${imdb_id}`)
  }

  const handleLogout = async () => {
    try {
      await axiosClient.post('/logout', { user_id: auth?.user_id })
      setAuth(null)
      nav('/login')

    } catch (err) {
      console.error('Logout failed:', err)
    }
  }


  return (
    <>
      <Header handleLogout = {handleLogout}/>
      <Routes>
          <Route path="/" element={<Home updateMovieReview={updateMovieReview}/>}></Route>
          <Route path="/register" element={<Register/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route element = {<RequiredAuth/>}>
              <Route path="/recommended" element={<Recommended/>}></Route>
              <Route path="/review/:imdb_id" element={<Review/>}></Route>
              <Route path="/stream/:yt_id" element={<StreamMovie/>}></Route>
          </Route>
      </Routes> 

    </>
  )
}

export default App
