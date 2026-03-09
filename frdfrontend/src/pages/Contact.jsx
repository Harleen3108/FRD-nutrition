import React from 'react';
import { motion } from 'framer-motion';
import Title from '../components/Title';
import NewsletterBox from '../components/NewsletterBox';
import shop from "../assets/shop.png"

const Contact = () => {
  return (
    <div className="bg-white text-slate-800 overflow-hidden">
      {/* Hero Banner */}
      <motion.div
        className="relative w-full h-[50vh] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <img
          src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Contact Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <h1 className="relative z-10 text-5xl font-extrabold tracking-wide text-white">
          CONTACT <span className="text-blue-400">US</span>
        </h1>
      </motion.div>

      {/* Contact Info Section */}
      <div className="my-20 flex flex-col md:flex-row justify-center gap-12 px-6 md:px-20">
        <motion.img
          src={shop}
          alt="Contact Office"
          className="w-full md:max-w-[480px] rounded-2xl shadow-2xl border border-gray-700 object-cover"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        />
        <motion.div
          className="flex flex-col justify-center gap-6 md:w-1/2 text-gray-300"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-semibold text-2xl text-blue-600">Our Store</p>
          <p>
            FRD Nutrition <br />
            Dev Colony Gali, 1, Delhi Rd, <br />
            Rohtak, Haryana 124001
          </p>
          <p>
            +919088032004 <br />
            01262660027 <br />
            frdnutrtionpremium.com
          </p>
         
        </motion.div>
      </div>

      {/* Map / Extra Image Section */}
      <div className="px-6 md:px-20 mb-20">
        <motion.div
          className="w-full overflow-hidden rounded-2xl shadow-2xl border border-gray-700"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <img
            src="https://images.pexels.com/photos/5327555/pexels-photo-5327555.jpeg"
            alt="Gym Contact Map"
            className="w-full h-72 md:h-[400px] object-cover"
          />
        </motion.div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default Contact;
