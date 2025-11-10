/* -----------------------------------------------------------------
File: frontend/src/components/Footer.jsx
Purpose: Sleek, professional footer matching new product structure
Design: Minimal, responsive, and consistent with Cognifer’s AI/Tech tone
----------------------------------------------------------------- */

import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative bg-cognifer_blue/95 text-white py-6 overflow-hidden">
      {/* Subtle glowing accents */}
      <span className="absolute top-3 left-10 w-2 h-2 bg-accent rounded-full animate-pulse opacity-50"></span>
      <span className="absolute top-8 right-16 w-2 h-2 bg-accent rounded-full animate-pulse opacity-40"></span>
      <span className="absolute bottom-3 left-1/3 w-3 h-3 bg-accent rounded-full animate-pulse opacity-60"></span>

      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-6 md:gap-10">
        {/* Brand / Motto */}
        <div className="text-center md:text-left">
          <span className="text-xl md:text-2xl font-heading font-bold block tracking-wide">
            Cognifer
          </span>
          <span className="text-sm text-white/80 block mt-1">
            Innovation • Insights • Technology
          </span>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm font-medium">
          {/* Products / Solutions */}
          <div>
            <div className="font-semibold text-white mb-2 text-base">
              Solutions
            </div>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/sacco-analytics"
                  className="hover:text-accent transition"
                >
                  SACCO Analytics
                </Link>
              </li>
              <li>
                <Link
                  to="/data-dashboards"
                  className="hover:text-accent transition"
                >
                  Data Dashboards
                </Link>
              </li>
              <li>
                <Link
                  to="/web-mobile-apps"
                  className="hover:text-accent transition"
                >
                  Web & Mobile Apps
                </Link>
              </li>
              <li>
                <Link
                  to="/web-development"
                  className="hover:text-accent transition"
                >
                  Web Development
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <div className="font-semibold text-white mb-2 text-base">
              Company
            </div>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-accent transition">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-accent transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/scorecard" className="hover:text-accent transition">
                  Scorecard Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* CTA / Mini Motto */}
          <div className="hidden sm:block">
            <div className="font-semibold text-white mb-2 text-base">
              Get Started
            </div>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/contact"
                  className="px-3 py-2 rounded-lg bg-accent text-cognifer_blue font-semibold text-xs hover:bg-white transition"
                >
                  Book Discovery Call
                </Link>
              </li>
              <li className="text-white/70 text-xs mt-1 italic">
                AI-driven Systems for Modern Business
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-6 border-t border-white/20 pt-3 text-center text-xs text-white/70">
        © {new Date().getFullYear()} Cognifer. All rights reserved.
      </div>
    </footer>
  );
}
