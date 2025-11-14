/* -----------------------------------------------------------------
File: frontend/src/components/Navbar.tsx
Purpose: Futuristic, translucent blue Navbar with animated dropdown
Design Notes:
- Glassmorphism aesthetic with soft light-blue gradient and blur
- Animated “Products” dropdown (Framer Motion)
- Cognifer logo (assets/logo.webp)
- CTA: “Book Call” button highlighted in rich accent blue
- Accessibility: keyboard support, proper ARIA attributes, close on outside click / Escape

TypeScript-safe: explicit types for product list, refs, handlers to avoid `unknown[]` and `{}` type errors.
----------------------------------------------------------------- */

import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.webp";

interface Product {
  label: string;
  path: string;
}

const products: Product[] = [
  { label: "SACCO Analytics Tools", path: "/products/sacco-analytics" },
  { label: "Data Intelligence Dashboards", path: "/products/data-dashboards" },
  { label: "Web & Mobile Apps", path: "/products/web-mobile-apps" },
  { label: "Web Development Services", path: "/products/web-development" },
];

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [openProducts, setOpenProducts] = useState<boolean>(false);

  const productsRef = useRef<HTMLDivElement | null>(null);
  const mobileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (productsRef.current && target && !productsRef.current.contains(target)) {
        setOpenProducts(false);
      }
      if (mobileRef.current && target && !mobileRef.current.contains(target) && mobileOpen) {
        setMobileOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenProducts(false);
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileOpen]);

  return (
    <header className="fixed w-full z-50 bg-gradient-to-b from-[rgba(220,238,255,0.85)] to-[rgba(240,248,255,0.75)] backdrop-blur-2xl border-b border-blue-100/30 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
      <div className="container mx-auto flex items-center justify-between py-3 px-6">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group" aria-label="Go to home">
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
            ref={productsRef}
            onMouseEnter={() => setOpenProducts(true)}
            onMouseLeave={() => setOpenProducts(false)}
          >
            {/* Button uses font-bold as requested */}
            <button
              type="button"
              className="flex items-center gap-1 text-gray-800 hover:text-cognifer_blue transition font-bold"
              aria-haspopup={true}
              aria-expanded={openProducts}
              onClick={() => setOpenProducts((s) => !s)}
              onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
                if (e.key === "Enter" || e.key === " ") setOpenProducts((s) => !s);
              }}
            >
              Products <FaChevronDown size={12} aria-hidden />
            </button>

            <AnimatePresence>
              {openProducts && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 mt-3 w-64 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-blue-100/40 py-3"
                  role="menu"
                  aria-label="Products menu"
                >
                  {products.map((p, i) => (
                    <motion.div
                      key={p.path}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link
                        to={p.path}
                        onClick={() => setOpenProducts(false)}
                        className="block px-5 py-2 text-gray-800 text-sm font-bold hover:bg-cognifer_blue/10 rounded-md transition"
                        role="menuitem"
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
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-md bg-white/40 border border-blue-100 text-gray-700 backdrop-blur-sm"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={mobileRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="md:hidden bg-[rgba(235,245,255,0.95)] backdrop-blur-xl border-t border-blue-100 shadow-lg"
            role="dialog"
            aria-label="Mobile navigation"
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
                <div className="font-bold text-gray-700 mb-1">Products</div>
                <div className="pl-3 flex flex-col gap-1">
                  {products.map((p) => (
                    <Link
                      key={p.path}
                      to={p.path}
                      onClick={() => setMobileOpen(false)}
                      className="text-gray-700 text-sm font-bold hover:text-cognifer_blue"
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
};

export default Navbar;
