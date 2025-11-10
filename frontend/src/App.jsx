/* -----------------------------------------------------------------
File: frontend/src/App.jsx
Purpose: Main React app with routing, responsive Navbar, flexible layout, and footer
Theme: Classy, modern, AI/Tech-inspired
Notes:
 - Individual product pages (no central Products.jsx)
 - ScrollToTop ensures each route renders from the top (good for fixed Navbar)
 - 404 fallback route included
----------------------------------------------------------------- */

import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Scorecard from "./pages/Scorecard";
import Contact from "./pages/Contact";
import About from "./pages/About";

/* Product detail pages (created earlier) */
import SaccoAnalytics from "./pages/products/SaccoAnalytics";
import DataDashboards from "./pages/products/DataDashboards";
import WebMobileApps from "./pages/products/WebMobileApps";
import WebDevelopment from "./pages/products/WebDevelopment";

/* Small helper to scroll to top on route change (keeps UX tidy) */
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

/* Simple 404 page */
function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-heading text-cognifer_blue font-bold">404</h1>
        <p className="mt-3 text-gray-600">Page not found. Try the home page or check the menu.</p>
        <a href="/" className="inline-block mt-6 px-5 py-2 rounded-lg bg-cognifer_blue text-white">Go home</a>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Top Navigation (fixed) */}
        <Navbar />

        {/* Page Routes */}
        <main className="flex-grow pt-20">
          {/* ScrollToTop listens to location changes */}
          <ScrollToTop />

          {/* Wrap with Suspense in case you later switch to lazy-loaded pages */}
          <Suspense fallback={
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="text-gray-500">Loading…</div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />

              {/* Individual product pages */}
              <Route path="/products/sacco-analytics" element={<SaccoAnalytics />} />
              <Route path="/products/data-dashboards" element={<DataDashboards />} />
              <Route path="/products/web-mobile-apps" element={<WebMobileApps />} />
              <Route path="/products/web-development" element={<WebDevelopment />} />

              <Route path="/scorecard" element={<Scorecard />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />

              {/* fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}
