

import React, { useContext, useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import logo from '../assets/logo11.png';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setIsScrolled(true);
      else setIsScrolled(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logout = () => {
    navigate('/login');
    localStorage.removeItem('token');
    setToken('');
    setCartItems({});
  };

  const animations = `
    @keyframes slideDown {
      from { transform: translateY(-100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .slide-down-animation {
      animation: slideDown 0.5s ease-out forwards;
    }
    @keyframes shimmerLine {
      0% { transform: translateX(-40%); }
      100% { transform: translateX(140%); }
    }
  `;

  return (
    <>
      <style>{animations}</style>

      {/* FIXED NAVBAR WRAPPER */}
      <div className="fixed top-0 w-full z-50 transition-all duration-500 ease-in-out">
        {/* MAIN NAVBAR ONLY */}
        <nav
          className={`relative w-full px-4 md:px-8 flex items-center justify-between transition-all duration-500 ease-in-out
          ${
            isScrolled
              ? 'h-16 bg-gradient-to-r from-[#123a70] via-[#1f4f94] to-[#2b6cb0] backdrop-blur-md shadow-[0_10px_35px_rgba(0,0,0,0.4)] border-b border-white/10'
              : 'h-20 bg-gradient-to-r from-[#1f4f94] via-[#2b6cb0] to-[#3b82f6] shadow-[0_12px_40px_rgba(15,23,42,0.35)] border-b border-transparent'
          }`}
        >
          {/* faint bottom shimmer line */}
          <div className="pointer-events-none absolute bottom-0 left-0 w-full h-[2px] overflow-hidden">
            <div
              className="h-full w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-80"
              style={{
                animation: 'shimmerLine 4s linear infinite',
              }}
            />
          </div>

          {/* LOGO */}
          <Link to="/" className="flex items-center group">
            <img
              src={logo}
              alt="FRD Nutrition Logo"
              className={`w-auto object-contain drop-shadow-lg transition-all duration-500 group-hover:scale-105
              ${isScrolled ? 'h-12' : 'h-16'}`}
            />
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center space-x-8">
            {['Home', 'Collection', 'About', 'Contact'].map((item) => (
              <NavLink
                key={item}
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                className={({ isActive }) =>
                  `text-sm uppercase font-bold tracking-wide transition-all duration-300 relative group
                  ${isActive ? 'text-white' : 'text-blue-100 hover:text-white'}`
                }
              >
                {({ isActive }) => (
                  <>
                    {item === 'Collection' ? 'Supplements' : item}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300
                      ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* ICONS */}
          <div className="flex items-center space-x-6">
            {/* SEARCH */}
            <button
              onClick={() => {
                setShowSearch(true);
                navigate('/collection');
              }}
              className="text-blue-100 transition-transform duration-300 hover:text-white hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 filter drop-shadow-sm"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* PROFILE */}
            <div className="relative group">
              <button
                onClick={() => (token ? null : navigate('/login'))}
                className="text-blue-100 transition-transform duration-300 hover:text-white hover:scale-110"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 filter drop-shadow-sm"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>

              {token && (
                <div className="hidden group-hover:block absolute right-0 pt-4 z-20">
                  <div className="flex flex-col gap-2 w-48 py-3 px-4 bg-white text-slate-800 rounded-lg shadow-xl border border-gray-100 slide-down-animation">
                    <p
                      onClick={() => navigate('/profile')}
                      className="cursor-pointer hover:text-[#2b6cb0] font-medium text-sm py-1"
                    >
                      Profile
                    </p>
                    <p
                      onClick={() => navigate('/orders')}
                      className="cursor-pointer hover:text-[#2b6cb0] font-medium text-sm py-1"
                    >
                      Orders
                    </p>
                    <p
                      onClick={logout}
                      className="cursor-pointer hover:text-red-500 font-medium text-sm py-1"
                    >
                      Logout
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* CART */}
            <button
              onClick={() => navigate('/cart')}
              className="relative text-blue-100 transition-transform duration-300 hover:text-white hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 filter drop-shadow-sm"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="absolute -top-1 -right-2 w-5 h-5 bg-white text-[#2b6cb0] text-[10px] font-bold flex items-center justify-center rounded-full shadow-md">
                {getCartCount()}
              </span>
            </button>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setVisible(true)}
              className="md:hidden text-white transition-transform duration-300 hover:text-blue-100 hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </nav>
      </div>

      {/* spacer so content isn't hidden behind fixed nav */}
      <div
        className={`transition-all duration-500 ${
          isScrolled ? 'h-16' : 'h-20'
        }`}
      ></div>

      {/* MOBILE MENU */}
      {visible && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col slide-down-animation">
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-[#2b6cb0] tracking-wider">
              MENU
            </h3>
            <button
              onClick={() => setVisible(false)}
              className="text-slate-800 p-2 rounded-full hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-grow flex flex-col justify-center items-center space-y-8 text-xl font-semibold text-slate-800">
            {['Home', 'Collection', 'About', 'Contact'].map((link) => (
              <NavLink
                key={link}
                onClick={() => setVisible(false)}
                to={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                className={({ isActive }) =>
                  isActive
                    ? 'text-[#2b6cb0] scale-110'
                    : 'hover:text-blue-500 transition-all'
                }
              >
                {link === 'Collection' ? 'Supplements' : link}
              </NavLink>
            ))}

            <div className="w-12 h-1 bg-blue-100 rounded-full my-4"></div>

            {token ? (
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setVisible(false);
                  }}
                  className="text-slate-600 hover:text-[#2b6cb0]"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    navigate('/orders');
                    setVisible(false);
                  }}
                  className="text-slate-600 hover:text-[#2b6cb0]"
                >
                  Orders
                </button>
                <button
                  onClick={() => {
                    logout();
                    setVisible(false);
                  }}
                  className="text-red-500"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  navigate('/login');
                  setVisible(false);
                }}
                className="bg-[#2b6cb0] text-white py-3 px-8 rounded-full shadow-lg hover:bg-blue-600 transition-transform active:scale-95"
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
