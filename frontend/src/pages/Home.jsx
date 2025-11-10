/* -----------------------------------------------------------------
File: frontend/src/pages/Home.jsx
Purpose: Landing page with Product slide-overs instead of separate redirects
----------------------------------------------------------------- */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaChartLine, FaDatabase, FaDesktop, FaLaptopCode, FaBolt } from "react-icons/fa";
import aiIllustration from "../assets/AI_Image.webp";
import saccoImg from "../assets/sacco_analytics.webp";
import dashboardsImg from "../assets/dashboards.webp";
import webappsImg from "../assets/webapps.webp";
import websitesImg from "../assets/websites.webp";

// Framer presets
const heroFade = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };
const slideOverAnim = {
  hidden: { x: "100%", opacity: 0 },
  show: { x: 0, opacity: 1, transition: { duration: 0.4 } },
  exit: { x: "100%", opacity: 0, transition: { duration: 0.3 } },
};

export default function Home() {
  const [activeProduct, setActiveProduct] = useState(null);

  const products = [
    {
      id: "sacco-analytics",
      title: "SACCO Analytics",
      image: saccoImg,
      icon: <FaChartLine className="text-cognifer_blue w-6 h-6" />,
      short: "Portfolio monitoring, delinquency alerts, and member KPIs powered by explainable AI.",
      long: "Our SACCO Analytics platform helps cooperatives track risk exposure, member performance, and liquidity trends in real time. The dashboards are fully ETIMS-ready and support scenario-based forecasts. Tailored for compliance and transparency.",
      link: "/products/sacco-analytics",
    },
    {
      id: "data-dashboards",
      title: "Data Dashboards",
      image: dashboardsImg,
      icon: <FaDatabase className="text-cognifer_blue w-6 h-6" />,
      short: "Interactive dashboards with predictive analytics and regulatory-ready reports.",
      long: "Our data dashboards transform complex metrics into visual clarity. Designed for SACCOs, fintechs, and enterprises that need instant visibility into KPIs, compliance data, and performance scores. Fully customizable with export-ready ETIMS reports.",
      link: "/products/data-dashboards",
    },
    {
      id: "web-mobile-apps",
      title: "Web & Mobile Apps",
      image: webappsImg,
      icon: <FaDesktop className="text-cognifer_blue w-6 h-6" />,
      short: "Custom-built mobile-first apps with secure authentication, payments, and integrations.",
      long: "We design and engineer cross-platform web and mobile apps that blend seamless UX, secure access, and enterprise-grade scalability. Perfect for member self-service portals, loan workflows, or integrations with MPesa, banks, and payment gateways.",
      link: "/products/web-mobile-apps",
    },
    {
      id: "web-development",
      title: "Web Development Services",
      image: websitesImg,
      icon: <FaLaptopCode className="text-cognifer_blue w-6 h-6" />,
      short: "End-to-end web solutions: UX, frontend, backend, and compliance workflows.",
      long: "From concept to deployment, we build regulatory-compliant, modern web experiences tailored for financial institutions. Whether it’s dashboards, internal portals, or marketing websites — every build follows clean architecture and robust security.",
      link: "/products/web-development",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gray-50">
      {/* Decorative background lines */}
      <svg className="absolute inset-0 pointer-events-none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <line x1="0" y1="18%" x2="100%" y2="22%" stroke="#2F81F7" strokeWidth="0.4" opacity="0.06" />
        <line x1="0" y1="48%" x2="100%" y2="53%" stroke="#2F81F7" strokeWidth="0.4" opacity="0.04" />
      </svg>

      {/* HERO */}
      <div className="container mx-auto px-6 pt-24 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div initial="hidden" animate="show" variants={heroFade} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-cognifer_blue leading-tight">
              Empowering Financial Intelligence with{" "}
              <span className="text-accent">AI-Powered</span>
            </h1>
            <p className="text-gray-700 text-lg max-w-xl mt-4">
              Cognifer helps SACCOs, fintechs, and enterprises turn data into explainable decisions —
              with analytics, dashboards, and modern web experiences.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center md:justify-end"
          >
            <div className="relative w-full max-w-md h-72 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-tr from-cognifer_blue/10 to-accent/10 group">
              <img
                src={aiIllustration}
                alt="AI Powered Analytics"
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="container mx-auto px-6 mt-16 mb-20" id="solutions">
        <h2 className="text-2xl font-heading text-cognifer_blue font-bold mb-6">Our Solutions</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {products.map((p) => (
            <motion.div
              key={p.id}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.18 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col h-full"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-cognifer_blue/10 text-cognifer_blue flex items-center justify-center">
                  {p.icon}
                </div>
                <div className="flex-1">
                  <div className="text-md font-semibold text-gray-900">{p.title}</div>
                  <div className="text-sm text-gray-600 mt-1">{p.short}</div>
                </div>
              </div>

              <div className="mt-4 mt-auto flex gap-3">
                <button
                  onClick={() => setActiveProduct(p)}
                  className="flex-1 text-center px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
                >
                  View details
                </button>

                <Link
                  to="/contact"
                  className="flex-1 text-center px-4 py-2 rounded-lg bg-cognifer_blue text-white font-medium hover:bg-blue-700 transition"
                >
                  Book Call
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* SLIDE OVER */}
      <AnimatePresence>
        {activeProduct && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveProduct(null)}
            />

            {/* Slide-over panel */}
            <motion.div
              className="fixed top-0 right-0 w-full sm:w-[480px] h-full bg-white shadow-xl z-50 flex flex-col"
              variants={slideOverAnim}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              <div className="p-6 flex justify-between items-center border-b">
                <h3 className="text-lg font-semibold text-cognifer_blue">{activeProduct.title}</h3>
                <button onClick={() => setActiveProduct(null)} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
              </div>

              <div className="overflow-y-auto p-6 space-y-4">
                <img
                  src={activeProduct.image}
                  alt={activeProduct.title}
                  className="rounded-lg w-full h-48 object-cover"
                />
                <p className="text-gray-700">{activeProduct.long}</p>

                <div className="pt-4 flex flex-col gap-3">
                  <Link
                    to={activeProduct.link}
                    className="w-full text-center px-4 py-2 rounded-lg bg-cognifer_blue text-white font-medium hover:bg-blue-700 transition"
                    onClick={() => setActiveProduct(null)}
                  >
                    Go to full page
                  </Link>
                  <button
                    onClick={() => setActiveProduct(null)}
                    className="w-full text-center px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
