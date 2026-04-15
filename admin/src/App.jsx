import{ BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Dependencies
import UserProvider from './context/userContext'
import { Toaster } from 'react-hot-toast'

// Pages
import Login from './pages/Auth/Login'
import Home from './pages/Dashboard/Home'
import Bookings from './pages/Dashboard/Bookings'
import Categories from './pages/Dashboard/Categories'
import Features from './pages/Dashboard/Features'
import Rooms from './pages/Dashboard/Rooms'
import Users from './pages/Dashboard/Users'
import Guests from './pages/Dashboard/Guests'


function App() {

  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route index element={<Root />} />
            <Route path='/login'  element={<Login />} />
            <Route path='/dashboard'  element={<Home />} />
            <Route path='/booking'  element={<Bookings />} />
            <Route path='/category'  element={<Categories />} />
            <Route path='/feature'  element={<Features />} />
            <Route path='/room'  element={<Rooms />} />
            <Route path='/staff'  element={<Users />} />
            <Route path='/guest'  element={<Guests />} />

          </Routes>
        </Router>
      </div>

      <Toaster 
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px"
          }
        }}
      />
    </UserProvider>
  )
}

export default App

const Root = () => {
  // Check is token exists in local storage
  const isAuthenticated = !!localStorage.getItem('token')

  // Redirect to Dashboard if authenticated, else to Login
  return isAuthenticated ? (<Navigate to="/dashboard" />) : (<Navigate to="/login" />)
}