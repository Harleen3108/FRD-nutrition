// import React from 'react';
// import { FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
// import { Link } from "react-router-dom";
// import ShippingInfo from "../pages/ShippingInfo"
// import ReturnsAndRefunds from "../pages/ReturnsAndRefunds"

// const Footer = () => {
//   return (
//     <footer className="bg-gradient-to-br from-white to-blue-50 text-slate-700 pt-16 pb-8 px-8 relative overflow-hidden">
//       {/* Soft Glow Accent */}
//       <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-10 -z-10" />
//       <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-5 -z-10" />

//       {/* Newsletter CTA */}
//       <div className="max-w-7xl mx-auto mb-12 text-center">
//         <h2 className="text-2xl font-bold text-blue-600 mb-3 uppercase tracking-widest">
//           Join Our Squad
//         </h2>
//         <p className="text-slate-600 mb-6">
//           Get exclusive deals, expert tips, and the latest launches straight to your inbox.
//         </p>
//         <form className="flex justify-center gap-2 max-w-md mx-auto">
//           <input
//             type="email"
//             placeholder="Enter your email"
//             className="flex-1 px-4 py-3 rounded-md bg-white border border-gray-300 text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <button
//             type="submit"
//             className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md uppercase tracking-wide transition-all duration-300"
//           >
//             Subscribe
//           </button>
//         </form>
//       </div>

//       {/* Links Section */}
//       <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-12 mb-12">
//         {/* Shop */}
//         <div>
//           <h3 className="text-blue-600 font-semibold mb-4 uppercase tracking-wide">Shop</h3>
//           <ul className="space-y-2 text-sm">
//             <li className="hover:text-blue-600 cursor-pointer transition">Protein</li>
//             <li className="hover:text-blue-600 cursor-pointer transition">BCAA</li>
//             <li className="hover:text-blue-600 cursor-pointer transition">Creatine</li>
//             <li className="hover:text-blue-600 cursor-pointer transition">Pre-Workout</li>
//             <li className="hover:text-blue-600 cursor-pointer transition">Vitamins</li>
//           </ul>
//         </div>

//         {/* Support */}
//         <div>
//           <h3 className="text-blue-600 font-semibold mb-4 uppercase tracking-wide">Support</h3>
//           <ul className="space-y-2 text-sm">
            
//              <Link to="/contact" className="cursor-pointer">
//    Contact
//   </Link><br></br>
//              <Link to="/shipping-info" className="cursor-pointer">
//     Shipping Info
//   </Link><br></br>
//            <Link to="/returns-refunds" className="hover:text-blue-600">
//   Returns & Refunds
// </Link>
          
//           </ul>
//         </div>

//         {/* Company */}
//         <div>
//           <h3 className="text-blue-600 font-semibold mb-4 uppercase tracking-wide">Company</h3>
//           <ul className="space-y-2 text-sm">
            
//     <Link to="/about" className="hover:text-blue-600">
//  About
// </Link><br></br>
//             <Link className="hover:text-blue-600" to="/privacy-policy">Privacy Policy</Link><br></br>
// <Link className="hover:text-blue-600" to="/terms-and-conditions">Terms & Conditions</Link>

//           </ul>
//         </div>

//         {/* Account */}
//         <div>
//           <h3 className="text-blue-600 font-semibold mb-4 uppercase tracking-wide">Account</h3>
//           <ul className="space-y-2 text-sm">
//             <Link className="hover:text-blue-600" to="/login">Log in</Link><br></br>
//             <Link className="hover:text-blue-600" to="/login">Sign up</Link><br></br>
            
           
//           </ul>
//         </div>

//         {/* Social */}
//         <div>
//           <h3 className="text-blue-600 font-semibold mb-4 uppercase tracking-wide">Follow Us</h3>
//           <div className="flex gap-4 text-xl">
//             <FaInstagram className="hover:text-blue-600 cursor-pointer transition-transform transform hover:scale-110" />
//             <FaFacebookF className="hover:text-blue-600 cursor-pointer transition-transform transform hover:scale-110" />
//             <FaTwitter className="hover:text-blue-600 cursor-pointer transition-transform transform hover:scale-110" />
//             <FaLinkedinIn className="hover:text-blue-600 cursor-pointer transition-transform transform hover:scale-110" />
//           </div>
//         </div>
//       </div>

//       {/* Bottom Bar */}
//       <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 border-t border-gray-200 pt-6 text-xs text-slate-500">
//         <p>&copy; {new Date().getFullYear()} FRD Nutrition Premium — All Rights Reserved.</p>
//         <div className="flex gap-4">
//           <span>India</span>
//           <span>|</span>
//           <span>English (EN)</span>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import React from 'react';
import { FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { Link } from "react-router-dom";
import ShippingInfo from "../pages/ShippingInfo"
import ReturnsAndRefunds from "../pages/ReturnsAndRefunds"

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-white to-blue-50 text-slate-700 pt-16 pb-8 px-8 relative overflow-hidden">
      
      {/* Soft Glow Accent */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-10 -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-5 -z-10" />

      {/* Newsletter */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h2 className="text-2xl font-bold text-blue-600 mb-3 uppercase tracking-widest">
          Join Our Squad
        </h2>
        <p className="text-slate-600 mb-6">
          Get exclusive deals, expert tips, and the latest launches straight to your inbox.
        </p>
        <form className="flex justify-center gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-md bg-white border border-gray-300 text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md uppercase tracking-wide transition-all duration-300"
          >
            Subscribe
          </button>
        </form>
      </div>

      {/* Footer Links */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-12 mb-12">

        {/* Shop */}
        <div>
          <h3 className="text-blue-600 font-semibold mb-4 uppercase tracking-wide">Shop</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-blue-600 cursor-pointer transition">Protein</li>
            <li className="hover:text-blue-600 cursor-pointer transition">BCAA</li>
            <li className="hover:text-blue-600 cursor-pointer transition">Creatine</li>
            <li className="hover:text-blue-600 cursor-pointer transition">Pre-Workout</li>
            <li className="hover:text-blue-600 cursor-pointer transition">Vitamins</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-blue-600 font-semibold mb-4 uppercase tracking-wide">Support</h3>
          <ul className="space-y-2 text-sm">
            <Link to="/contact" className="cursor-pointer">Contact</Link><br />
            <Link to="/shipping-info" className="cursor-pointer">Shipping Info</Link><br />
            <Link to="/returns-refunds" className="hover:text-blue-600">Returns & Refunds</Link>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-blue-600 font-semibold mb-4 uppercase tracking-wide">Company</h3>
          <ul className="space-y-2 text-sm">
            <Link to="/about" className="hover:text-blue-600">About</Link><br />
            <Link className="hover:text-blue-600" to="/privacy-policy">Privacy Policy</Link><br />
            <Link className="hover:text-blue-600" to="/terms-and-conditions">Terms & Conditions</Link>
          </ul>
        </div>

        {/* Account */}
        <div>
          <h3 className="text-blue-600 font-semibold mb-4 uppercase tracking-wide">Account</h3>
          <ul className="space-y-2 text-sm">
            <Link className="hover:text-blue-600" to="/login">Log in</Link><br />
            <Link className="hover:text-blue-600" to="/login">Sign up</Link><br />
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-blue-600 font-semibold mb-4 uppercase tracking-wide">Follow Us</h3>
          <div className="flex gap-4 text-xl">

            {/* Facebook */}
            <a
              href="https://www.facebook.com/share/16RdAzGQFL/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF className="hover:text-blue-600 cursor-pointer transition-transform transform hover:scale-110" />
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/frd_nutrition_rohtak_?igsh=Y2JxaXlybXV1NWxu"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="hover:text-blue-600 cursor-pointer transition-transform transform hover:scale-110" />
            </a>

            {/* YouTube */}
            <a
              href="https://youtu.be/ThqDnNDKLpE?si=JYov-aRHfQgoik64"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube className="hover:text-blue-600 cursor-pointer transition-transform transform hover:scale-110" />
            </a>

            {/* Twitter (no link provided) */}
            <FaTwitter className="hover:text-blue-600 cursor-pointer opacity-50" />

            {/* LinkedIn (no link provided) */}
            <FaLinkedinIn className="hover:text-blue-600 cursor-pointer opacity-50" />

          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 border-t border-gray-200 pt-6 text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} FRD Nutrition Premium — All Rights Reserved.</p>
        <div className="flex gap-4">
          <span>India</span>
          <span>|</span>
          <span>English (EN)</span>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
