

import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Profile from './pages/Profile'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Verify from './pages/Verify'
import GymFacilities from './pages/GymFacilities'
import UserFacilities from './pages/UserFacilities'
import Auth0Callback from './pages/Auth0Callback'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import ScrollToTop from './components/ScrollToTop'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import ShippingInfo from './pages/ShippingInfo'
import ReturnsAndRefunds from './pages/ReturnsAndRefunds'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsAndConditions from './pages/TermsAndConditions'

const App = () => {
  return (
    <>
      <ToastContainer />

      {/* ✅ AUTO SCROLL TO TOP ON EVERY ROUTE CHANGE */}
      <ScrollToTop />

      <Navbar />
      <SearchBar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/collection"
          element={
            <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
              <Collection />
            </div>
          }
        />

        <Route path="/shipping-info" element={<ShippingInfo />} />
        <Route path="/returns-refunds" element={<ReturnsAndRefunds />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

        <Route
          path="/facilities"
          element={
            <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
              <GymFacilities />
            </div>
          }
        />

        <Route
          path="/about"
          element={
            <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
              <About />
            </div>
          }
        />

        <Route
          path="/contact"
          element={
            <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
              <Contact />
            </div>
          }
        />

        <Route
          path="/product/:productId"
          element={
            <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
              <Product />
            </div>
          }
        />

        <Route
          path="/cart"
          element={
            <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
              <Cart />
            </div>
          }
        />

        <Route
          path="/login"
          element={
            <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
              <Login />
            </div>
          }
        />

        <Route
          path="/place-order"
          element={
            <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
              <PlaceOrder />
            </div>
          }
        />

        <Route
          path="/orders"
          element={
            <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
              <Orders />
            </div>
          }
        />

        <Route
          path="/profile"
          element={
            <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
              <Profile />
            </div>
          }
        />

        <Route
          path="/verify"
          element={
            <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
              <Verify />
            </div>
          }
        />

        <Route
          path="/auth0/callback"
          element={
            <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
              <Auth0Callback />
            </div>
          }
        />

        <Route
          path="/my-facilities"
          element={
            <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
              <UserFacilities />
            </div>
          }
        />
      </Routes>

      <Footer />
    </>
  )
}

export default App
