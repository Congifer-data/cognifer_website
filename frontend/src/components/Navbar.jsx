/* -----------------------------------------------------------------
File: frontend/src/components/Navbar.jsx
Purpose: Futuristic, translucent blue Navbar with animated dropdown
Design Notes:
- Glassmorphism aesthetic with soft light-blue gradient and blur
- Animated “Products” dropdown (Framer Motion)
- Cognifer logo (assets/logo.webp)
- CTA: “Book Call” button highlighted in rich accent blue
----------------------------------------------------------------- */

import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.webp";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openProducts, setOpenProducts] = useState(false);

  const products = [
    { label: "SACCO Analytics Tools", path: "/products/sacco-analytics" },
    { label: "Data Intelligence Dashboards", path: "/products/data-dashboards" },
    { label: "Web & Mobile Apps", path: "/products/web-mobile-apps" },
    { label: "Web Development Services", path: "/products/web-development" },
  ];

  return (
    <header className="fixed w-full z-50 bg-gradient-to-b from-[rgba(220,238,255,0.85)] to-[rgba(240,248,255,0.75)] backdrop-blur-2xl border-b border-blue-100/30 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
      <div className="container mx-auto flex items-center justify-between py-3 px-6">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="Cognifer logo"
            className="w-10 h-10 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-2xl md:text-3xl font-heading font-bold text-cognifer_blue tracking-tight">
              Cognifer
            </span>
            <span className="text-[13px] md:text-sm text-gray-600 tracking-tight">
              AI-driven Systems for Modern Business
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8 relative">
          {/* HOME */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-cognifer_blue font-semibold"
                : "text-gray-800 hover:text-cognifer_blue transition"
            }
          >
            Home
          </NavLink>

          {/* PRODUCTS DROPDOWN */}
          <div
            className="relative"
            onMouseEnter={() => setOpenProducts(true)}
            onMouseLeave={() => setOpenProducts(false)}
          >
            <button className="flex items-center gap-1 text-gray-800 hover:text-cognifer_blue transition font-medium">
              Products <FaChevronDown size={12} />
            </button>

            <AnimatePresence>
              {openProducts && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-64 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-blue-100/40 py-3"
                >
                  {products.map((p, i) => (
                    <motion.div
                      key={p.path}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={p.path}
                        onClick={() => setOpenProducts(false)}
                        className="block px-5 py-2 text-gray-800 text-sm hover:bg-cognifer_blue/10 rounded-md transition"
                      >
                        {p.label}
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* OTHER LINKS */}
          <NavLink
            to="/scorecard"
            className={({ isActive }) =>
              isActive
                ? "text-cognifer_blue font-semibold"
                : "text-gray-800 hover:text-cognifer_blue transition"
            }
          >
            Scorecard
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "text-cognifer_blue font-semibold"
                : "text-gray-800 hover:text-cognifer_blue transition"
            }
          >
            About
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? "text-cognifer_blue font-semibold"
                : "text-gray-800 hover:text-cognifer_blue transition"
            }
          >
            Contact
          </NavLink>

          {/* CTA BUTTON */}
          <Link
            to="/contact"
            className="ml-3 inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-cognifer_blue to-blue-500 text-white font-medium hover:from-blue-600 hover:to-cognifer_blue transition shadow-md"
          >
            Book Call
          </Link>
        </nav>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-md bg-white/40 border border-blue-100 text-gray-700 backdrop-blur-sm"
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-[rgba(235,245,255,0.95)] backdrop-blur-xl border-t border-blue-100 shadow-lg"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              <NavLink
                to="/"
                onClick={() => setMobileOpen(false)}
                className="text-gray-800 hover:text-cognifer_blue"
              >
                Home
              </NavLink>

              <div>
                <div className="font-semibold text-gray-700 mb-1">Products</div>
                <div className="pl-3 flex flex-col gap-1">
                  {products.map((p) => (
                    <Link
                      key={p.path}
                      to={p.path}
                      onClick={() => setMobileOpen(false)}
                      className="text-gray-700 text-sm hover:text-cognifer_blue"
                    >
                      {p.label}
                    </Link>
                  ))}
                </div>
              </div>

              <NavLink
                to="/scorecard"
                onClick={() => setMobileOpen(false)}
                className="text-gray-800 hover:text-cognifer_blue"
              >
                Scorecard
              </NavLink>

              <NavLink
                to="/about"
                onClick={() => setMobileOpen(false)}
                className="text-gray-800 hover:text-cognifer_blue"
              >
                About
              </NavLink>

              <NavLink
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="text-gray-800 hover:text-cognifer_blue"
              >
                Contact
              </NavLink>

              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="mt-3 px-4 py-2 rounded-lg bg-gradient-to-r from-cognifer_blue to-blue-500 text-white text-center font-medium hover:from-blue-600 hover:to-cognifer_blue transition"
              >
                Book Call
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
