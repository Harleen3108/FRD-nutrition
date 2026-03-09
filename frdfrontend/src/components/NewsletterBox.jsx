import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react"; // Location Icon

import shopImg from "../assets/shop.png"; // main hero image

import store1 from "../assets/shop.png";    // grid image 1
import store2 from "../assets/store1.jpg"; // grid image 2
import store3 from "../assets/store2.webp"; // grid image 3
import store4 from "../assets/store3.webp"; // grid image 4
import { useNavigate } from "react-router-dom";



// Particle Component
const Particle = ({ delay }) => (
  <motion.div
    className="absolute w-1 h-1 bg-blue-600 rounded-full opacity-50"
    initial={{ y: "100%", x: Math.random() * 100 + "%" }}
    animate={{ y: "-20vh", opacity: [0.5, 1, 0.2] }}
    transition={{
      duration: 8 + Math.random() * 5,
      delay,
      repeat: Infinity,
      ease: "linear",
    }}
    style={{ left: Math.random() * 100 + "%" }}
  />
);

const NewsletterBox = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const navigate = useNavigate(); 
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <>
      {/* ⭐ PREMIUM STORE SECTION ⭐ */}
      <section className="w-full bg-gradient-to-br from-slate-50 via-white to-slate-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="relative bg-white/95 border border-gray-100 rounded-3xl shadow-2xl overflow-hidden p-6 md:p-8"
          >
            {/* subtle glow accent */}
            <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="flex flex-col md:flex-row gap-8 items-stretch">
              {/* LEFT: hero image + 4-image grid */}
              <div className="w-full md:w-1/2 flex flex-col gap-5">
                {/* Hero image */}
               <motion.div
  whileHover={{ scale: 1.02 }}
  transition={{ duration: 0.25 }}
  className="rounded-2xl overflow-hidden h-56 md:h-72 bg-white flex items-center justify-center p-4"
>
  <img
    src={shopImg}
    alt="FRD Nutrition Storefront"
    className="w-full h-full object-contain"
  />
</motion.div>

                {/* Grid of 4 images */}
                <div className="grid grid-cols-2 gap-3">
                  {[store1, store2, store3, store4].map((img, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-xl overflow-hidden h-24 sm:h-28 md:h-32 bg-gray-100"
                    >
                      <img
                        src={img}
                        alt={`Store view ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* RIGHT: content + CTAs */}
              <div className="w-full md:w-1/2 flex flex-col justify-center p-2 md:p-4">
                {/* Badge + icon */}
                <div className="flex items-center justify-center md:justify-start mb-4 gap-3">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="bg-gradient-to-br from-blue-50 to-emerald-50 p-3 rounded-full"
                  >
                    <MapPin size={26} className="text-blue-600" />
                  </motion.div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                    FRD Nutrition Store • Live Experience
                  </span>
                </div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3"
                >
                  Experience Us Live: Visit Our Store
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-slate-600 text-base md:text-lg mb-6 leading-relaxed"
                >
                  Step into our premium supplement hub — curated shelves, expert
                  guidance, and products we trust with our own performance. See
                  the full FRD Nutrition experience in person.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="flex flex-col sm:flex-row gap-3 sm:items-center"
                >
                  <motion.a
                    href="https://maps.app.goo.gl/t6PEwK1numpBytha7?g_st=aw"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ translateY: -2, boxShadow: "0 18px 45px rgba(37,99,235,0.35)" }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm md:text-base shadow-lg"
                  >
                    <MapPin size={18} />
                    Visit Store on Maps
                  </motion.a>

                 <motion.button
  type="button"
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.96 }}
  onClick={() => {
    navigate("/collection");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }}
  className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-gray-200 bg-white/80 text-slate-700 text-sm md:text-base font-medium shadow-sm"
>
  Explore Our Products
</motion.button>

                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="mt-6 text-xs md:text-sm text-slate-400"
                >
                  Open daily • Premium supplements • Personalized guidance for
                  your fitness journey.
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ⭐ NEWSLETTER SECTION ⭐ */}
      <div className="relative bg-white text-slate-800 py-24 px-6 overflow-hidden">
        <div
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(37,99,235,0.15)_1px,transparent_1px),linear-gradient(rgba(37,99,235,0.15)_1px,transparent_1px)] bg-[size:50px_50px] animate-[pulse_4s_infinite_alternate]"
          style={{
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0.6))",
          }}
        ></div>

        {[...Array(12)].map((_, i) => (
          <Particle key={i} delay={i * 0.8} />
        ))}

        <div className="relative max-w-3xl mx-auto text-center z-10">
          {subscribed ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h3 className="text-4xl font-bold text-blue-600">You’re In! ✅</h3>
              <p className="text-gray-400">
                Power unlocked — the future of strength is on its way.
              </p>
            </motion.div>
          ) : (
            <>
              <motion.h2
                className="text-5xl md:text-6xl font-extrabold mb-4 tracking-widest text-blue-600"
                initial={{ opacity: 0, y: -40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1 }}
              >
                Join The Power Grid
              </motion.h2>

              <motion.p
                className="text-gray-400 mb-8 text-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.3, duration: 1 }}
              >
                Exclusive drops, advanced training hacks, & next-gen supplement
                launches.
              </motion.p>

              <motion.form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full sm:w-80 px-6 py-3 rounded-full text-slate-800 placeholder-gray-600 bg-white border-2 border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />

                <motion.button
                  type="submit"
                  className="px-8 py-3 font-bold uppercase rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Activate
                </motion.button>
              </motion.form>

              <p className="text-sm text-gray-500 mt-6">
                No spam. Only high-voltage performance.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default NewsletterBox;
