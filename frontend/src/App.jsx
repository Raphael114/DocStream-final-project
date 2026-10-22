import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'

import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import MyAppoinments from './pages/MyAppoinments'
import MyProfile from './pages/MyProfile'
import Appointment from './pages/Appointment'
import Jobs from './pages/Jobs'
import Navbar from './components/Navbar'
import Chatbot from './components/Chatbot'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify';

import { assets } from './assets/assets'

const App = () => {
  const location = useLocation()

  return (
    <div className='mx-4 sm:mx-[10%] relative'>
      {/* faint logo background for all pages */}
      <div className='global-logo-bg' aria-hidden>
        <img src={assets.logo} alt='' />
      </div>
      <ToastContainer/>
      <Navbar />
      <div key={location.pathname} className='relative z-10 animate-enter'>
        <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/jobs' element={<Jobs />} />
        <Route path='/jobs/:jobId' element={<Jobs />} />
        <Route path='/login' element={<Login />} />
        <Route path='/my-appointments' element={<MyAppoinments />} />
        <Route path='/my-appointments/:docId' element={<Appointment />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/appointment/:docId' element={<Appointment/>}></Route>

        </Routes>
      </div>
      <Footer/>
      <Chatbot />
    </div>
  )
}

export default App
