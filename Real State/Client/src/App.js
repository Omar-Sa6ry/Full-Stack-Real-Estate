import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './css/normalize.css'
import './css/tailwind.css'
import './css/App.css'
import './css/main.css'

import { PrivateRoutes } from './routing/PrivateRoutes'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import ForgotThePassword from './pages/ForgotThePassword'
import Register from './pages/Register'
import Profile from './pages/Profile'
import ChangePassword from './pages/ChangePassword'
import CreateListing from './pages/CreateListing'
import SingleListing from './pages/SingleListing'
import Search from './pages/Search'

function App () {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route path='/' element={<Home />} />
            <Route path='/search' element={<Search />} />
            <Route path='/about' element={<About />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/forgetPassword' element={<ForgotThePassword />} />
            <Route path='/listing/:id' element={<SingleListing />} />
            <Route
              path='/Profile'
              element={
                <PrivateRoutes>
                  <Profile />
                </PrivateRoutes>
              }
            />
            <Route
              path='/change-password'
              element={
                <PrivateRoutes>
                  <ChangePassword />
                </PrivateRoutes>
              }
            />
            <Route
              path='/create-listing'
              element={
                <PrivateRoutes>
                  <CreateListing />
                </PrivateRoutes>
              }
            />
            <Route
              path='/update-listing/:id'
              element={
                <PrivateRoutes>
                  <CreateListing />
                </PrivateRoutes>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
