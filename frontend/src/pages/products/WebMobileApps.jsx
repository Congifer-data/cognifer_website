/* -----------------------------------------------------------------
File: frontend/src/pages/products/WebMobileApps.jsx
Purpose: Product detail page for Web & Mobile Apps (Kenyan SME realistic estimator)
----------------------------------------------------------------- */

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImg from "../../assets/webapps.webp";

const fadeUp = { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 } };

export default function WebMobileApps() {
  // estimator inputs
  const [platforms, setPlatforms] = useState(1); // 1 = Web only, 2 = Web + Mobile, 3 = Web + iOS + Android
  const [integrations, setIntegrations] = useState(1);
  const [authComplexity, setAuthComplexity] = useState("standard");
  const [userScale, setUserScale] = useState("small");

  // === ESTIMATOR LOGIC ===
  const estimator = useMemo(() => {
    const baseDays = 7;
    const platformDays = 3 * (platforms - 1);
    const integrationDays = 2 * integrations;
    const authDays =
      authComplexity === "advanced" ? 6 : authComplexity === "sso" ? 3 : 1;
    const scaleDays =
      userScale === "large" ? 5 : userScale === "medium" ? 3 : 0;

    const timelineDays =
      baseDays + platformDays + integrationDays + authDays + scaleDays;

    const baseKES = 12000;
    const platformKES = 15000 * (platforms - 1);
    const integrationKES = 8000 * integrations;
    const authKES =
      authComplexity === "advanced"
        ? 20000
        : authComplexity === "sso"
        ? 10000
        : 4000;

    const laborKES = 2000 * Math.ceil(timelineDays / 5);
    const userMultiplier =
      userScale === "large" ? 1.25 : userScale === "medium" ? 1.1 : 1.0;

    const totalKES = Math.round(
      (baseKES + platformKES + integrationKES + authKES + laborKES) *
        userMultiplier
    );

    const monthlyOps = Math.round(totalKES * 0.03);

    return {
      timelineDays,
      totalKES,
      monthlyOps,
      breakdown: {
        baseKES,
        platformKES,
        integrationKES,
        authKES,
        laborKES,
        multiplier: userMultiplier,
      },
    };
  }, [platforms, integrations, authComplexity, userScale]);

  return (
    <motion.section
      className="py-16 px-6 md:px-20 bg-gray-50"
      {...fadeUp}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Left: Info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-heading text-cognifer_blue font-bold">
              Web & Mobile Apps
            </h1>
            <p className="text-gray-700 mt-4 max-w-xl leading-relaxed">
              Affordable, AI-assisted web and mobile apps designed for Kenyan
              SMEs — fast to build, secure, and scalable without the enterprise
              cost burden.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="px-5 py-3 bg-cognifer_blue text-white rounded-lg hover:bg-cognifer_blue/90 transition"
              >
                Book Discovery Call
              </Link>
              <Link
                to="/contact"
                className="px-5 py-3 border rounded-lg hover:bg-gray-100 transition"
              >
                Request Quote
              </Link>
            </div>
          </div>

          {/* Right: Estimator */}
          <motion.div
            className="bg-white p-6 rounded-lg shadow-sm border"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-cognifer_blue mb-3">
              Quick Timeline & Price Estimator
            </h3>

            <div className="grid gap-3">
              {/* --- Platform Selector (Improved) --- */}
              <label className="text-sm text-gray-700 mb-1">
                Select Platform
              </label>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { id: 1, label: "Web", icon: "🌐", desc: "Browser only" },
                  {
                    id: 2,
                    label: "Web + Mobile",
                    icon: "📱",
                    desc: "Responsive / PWA",
                  },
                  {
                    id: 3,
                    label: "Web + iOS + Android",
                    icon: "⚙️",
                    desc: "All platforms",
                  },
                ].map((platform) => (
                  <div
                    key={platform.id}
                    onClick={() => setPlatforms(platform.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center
                      ${
                        platforms === platform.id
                          ? "border-blue-600 bg-blue-50 shadow-md"
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                  >
                    <div className="text-2xl mb-1">{platform.icon}</div>
                    <div className="font-semibold text-sm md:text-base">
                      {platform.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {platform.desc}
                    </div>
                  </div>
                ))}
              </div>

              {/* --- Other Inputs --- */}
              <label className="text-sm text-gray-700">
                Number of integrations (MPesa, APIs)
              </label>
              <input
                type="number"
                min={0}
                max={8}
                value={integrations}
                onChange={(e) => setIntegrations(Number(e.target.value || 0))}
                className="w-full border rounded p-2"
              />

              <label className="text-sm text-gray-700">Auth complexity</label>
              <select
                value={authComplexity}
                onChange={(e) => setAuthComplexity(e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="standard">Standard (email / OAuth)</option>
                <option value="sso">SSO / Identity Provider</option>
                <option value="advanced">
                  Advanced (MFA, enterprise compliance)
                </option>
              </select>

              <label className="text-sm text-gray-700">User scale</label>
              <select
                value={userScale}
                onChange={(e) => setUserScale(e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="small">Small (up to 5k users)</option>
                <option value="medium">Medium (5k–50k)</option>
                <option value="large">Large (50k+)</option>
              </select>

              {/* --- Output --- */}
              <div className="mt-3 p-3 bg-gray-50 rounded border">
                <div className="text-sm text-gray-600">Estimated timeline</div>
                <div className="text-2xl font-bold text-cognifer_blue">
                  {estimator.timelineDays} days
                </div>

                <div className="text-sm text-gray-600 mt-2">
                  Estimated project cost (ballpark)
                </div>
                <div className="text-xl font-semibold text-gray-800">
                  KES {estimator.totalKES.toLocaleString()}
                </div>

                <div className="text-sm text-gray-600 mt-2">
                  Estimated monthly ops
                </div>
                <div className="text-md text-gray-700">
                  KES {estimator.monthlyOps.toLocaleString()} / month
                </div>

                <div className="text-xs text-gray-500 mt-3">
                  Breakdown: base {estimator.breakdown.baseKES.toLocaleString()}{" "}
                  | integrations{" "}
                  {estimator.breakdown.integrationKES.toLocaleString()} | auth{" "}
                  {estimator.breakdown.authKES.toLocaleString()} | labor{" "}
                  {estimator.breakdown.laborKES.toLocaleString()} | multiplier{" "}
                  {estimator.breakdown.multiplier}
                </div>

                <div className="text-xs text-gray-400 mt-2">
                  (AI-assisted estimate for qualification — final quote after
                  scope discussion)
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
