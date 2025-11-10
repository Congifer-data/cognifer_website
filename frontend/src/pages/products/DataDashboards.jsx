/* -----------------------------------------------------------------
File: frontend/src/pages/products/DataDashboards.jsx
Purpose: Product detail page for Data Dashboards (upgraded UI + preserved estimator)
Notes:
 - Image expected at: src/assets/dashboards.webp
 - Estimator logic preserved (SME-friendly heuristics)
----------------------------------------------------------------- */

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImg from "../../assets/dashboards.webp";

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export default function DataDashboards() {
  // === Inputs (unchanged estimator inputs) ===
  const [sources, setSources] = useState(2);
  const [kpis, setKpis] = useState(8);
  const [realTime, setRealTime] = useState("near");
  const [users, setUsers] = useState("ops");

  // === Estimator (KEEPING YOUR LOGIC EXACTLY) ===
  const estimator = useMemo(() => {
    const baseDays = 5;
    const days =
      baseDays +
      sources * 1.5 +
      Math.ceil(kpis / 5) * 1.5 +
      (realTime === "realtime" ? 8 : realTime === "near" ? 3 : 0) +
      (users === "enterprise" ? 8 : users === "exec" ? 4 : 0);

    const timelineDays = Math.round(days);

    const baseKES = 7000;
    const integrationKES = sources * 800;
    const authKES = realTime === "realtime" ? 4000 : realTime === "near" ? 2000 : 0;
    const laborKES = timelineDays * 500;
    const userMult = users === "enterprise" ? 1.4 : users === "exec" ? 1.2 : 1.0;

    const estimatedOneTime = Math.round(
      (baseKES + integrationKES + authKES + laborKES) * userMult
    );
    const monthlyOps = Math.round(estimatedOneTime * 0.06);

    return { timelineDays, estimatedOneTime, monthlyOps };
  }, [sources, kpis, realTime, users]);

  // === UI ===
  return (
    <motion.section
      className="py-16 px-6 md:px-20 bg-gray-50"
      {...fadeUp}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto">
        {/* Top two-column area (info left, hero right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* LEFT: Headline + animated feature scorecards */}
          <div>
            <h1 className="text-3xl md:text-4xl font-heading text-cognifer_blue font-bold">
              Data Dashboards & Analytics
            </h1>

            <p className="text-gray-700 mt-4 max-w-xl leading-relaxed">
              AI-powered dashboards that turn raw business data into timely, actionable insights.
              Built for Kenyan teams that need fast, reliable reporting without enterprise complexity.
            </p>

            {/* Animated feature cards (scorecard style) */}
            <div className="mt-6 grid gap-3">
              <motion.div whileHover={{ x: 6 }} className="p-4 bg-white rounded-lg shadow-sm border flex gap-3 items-start">
                <div className="font-semibold text-cognifer_blue">Unified KPI Hub</div>
                <div className="text-sm text-gray-600">All metrics in one secure, easy-to-share view.</div>
              </motion.div>

              <motion.div whileHover={{ x: 6 }} className="p-4 bg-white rounded-lg shadow-sm border flex gap-3 items-start">
                <div className="font-semibold text-cognifer_blue">Actionable Insights</div>
                <div className="text-sm text-gray-600">Drilldowns, anomalies, and trend signals you can use now.</div>
              </motion.div>

              <motion.div whileHover={{ x: 6 }} className="p-4 bg-white rounded-lg shadow-sm border flex gap-3 items-start">
                <div className="font-semibold text-cognifer_blue">Forecasts & Scenarios</div>
                <div className="text-sm text-gray-600">What-if projections and simple forecasting for planning.</div>
              </motion.div>

              <motion.div whileHover={{ x: 6 }} className="p-4 bg-white rounded-lg shadow-sm border flex gap-3 items-start">
                <div className="font-semibold text-cognifer_blue">Automated Data Flows</div>
                <div className="text-sm text-gray-600">Connect Sheets, POS, CRM or APIs — reduce manual reporting.</div>
              </motion.div>
            </div>

            {/* CTAs */}
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
                Request Demo
              </Link>
            </div>
          </div>

          {/* RIGHT: hero image + three small stats (scorecard) */}
          <div className="space-y-6">
            <motion.div
              className="w-full rounded-xl overflow-hidden shadow-lg bg-white border"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.35 }}
            >
              <img src={heroImg} alt="Data dashboards hero" className="w-full h-64 object-cover" />
            </motion.div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-lg border text-center">
                <div className="text-sm text-gray-500">Avg. delivery</div>
                <div className="text-xl font-semibold text-cognifer_blue">7 days to 3 weeks</div>
              </div>
              <div className="bg-white p-3 rounded-lg border text-center">
                <div className="text-sm text-gray-500">Common sources</div>
                <div className="text-xl font-semibold text-cognifer_blue">CRM + Sheets</div>
              </div>
              <div className="bg-white p-3 rounded-lg border text-center">
                <div className="text-sm text-gray-500">Integrations</div>
                <div className="text-xl font-semibold text-cognifer_blue">API, CSV</div>
              </div>
            </div>
          </div>
        </div>

        {/* Estimator Section (two-column: value card + estimator card) */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: value / analyst-friendly short card */}
          <motion.div
            className="bg-white p-6 rounded-lg shadow-sm border"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-cognifer_blue mb-3">
              Why teams rely on these dashboards
            </h3>
            <ul className="list-disc ml-5 text-gray-700 space-y-2 text-sm">
              <li>One-click drilldowns from executive KPIs to transaction-level detail</li>
              <li>Automated alerts for KPI drift and anomalies</li>
              <li>Built-in light forecasting to guide decisions</li>
              <li>Low-touch integration with common SME systems</li>
            </ul>
          </motion.div>

          {/* Right: Estimator card (unchanged logic, styled like Sacco) */}
          <motion.div
            className="bg-white p-6 rounded-lg shadow-sm border"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-cognifer_blue mb-3">
              Quick Timeline & Price Estimator
            </h3>

            <div className="grid gap-3">
              <label className="text-sm text-gray-700">Data Sources</label>
              <input
                type="number"
                min={1}
                max={10}
                value={sources}
                onChange={(e) => setSources(Number(e.target.value))}
                className="w-full border rounded p-2"
              />

              <label className="text-sm text-gray-700">KPI Cards</label>
              <input
                type="number"
                min={1}
                max={50}
                value={kpis}
                onChange={(e) => setKpis(Number(e.target.value))}
                className="w-full border rounded p-2"
              />

              <label className="text-sm text-gray-700">Refresh Mode</label>
              <select
                value={realTime}
                onChange={(e) => setRealTime(e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="none">Batch (daily)</option>
                <option value="near">Near-real-time</option>
                <option value="realtime">Real-time (streaming)</option>
              </select>

              <label className="text-sm text-gray-700">User Tier</label>
              <select
                value={users}
                onChange={(e) => setUsers(e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="ops">SME / Ops</option>
                <option value="exec">Mid-level / Exec</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>

            {/* Results */}
            <div className="mt-5 p-4 bg-gray-50 rounded border">
              <div className="text-sm text-gray-600">Estimated timeline</div>
              <div className="text-2xl font-bold text-cognifer_blue">
                {estimator.timelineDays} days
              </div>

              <div className="text-sm text-gray-600 mt-2">Estimated project cost</div>
              <div className="text-xl font-semibold text-gray-800">
                KES {estimator.estimatedOneTime.toLocaleString()}
              </div>

              <div className="text-sm text-gray-600 mt-2">Estimated monthly ops</div>
              <div className="text-md text-gray-700">
                ~KES {estimator.monthlyOps.toLocaleString()} / month
              </div>

              <div className="text-xs text-gray-500 mt-3">
                (AI-assisted estimate for qualification — final quote after scope discussion)
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
