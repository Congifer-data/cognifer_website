/* -----------------------------------------------------------------
File: frontend/src/pages/products/SaccoAnalytics.jsx
Purpose: SACCO Analytics product detail page — polished, animated, and interactive
Notes:
 - Image expected at: src/assets/products/sacco_analytics.webp
 - Small estimator uses simple heuristics (for quick lead qualification)
----------------------------------------------------------------- */

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import saccoImg from "../../assets/sacco_analytics.webp";

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export default function SaccoAnalytics() {
  // estimator inputs
  const [membersRange, setMembersRange] = useState("<500");
  const [integrations, setIntegrations] = useState("None");
  const [deployment, setDeployment] = useState("SaaS");

  // simple heuristics for timeline and price (presented as example)
  const estimator = useMemo(() => {
    // timeline base (days)
    const baseDays = 10; // discovery + kickoff
    const membersFactorMap = { "<500": 0, "500–2k": 5, "2k–10k": 10, "10k+": 18 };
    const integrationsFactorMap = { None: 0, Payments: 5, "Accounting/ERP": 7, Multiple: 12 };

    const deploymentFactor = deployment === "Self-hosted" ? 8 : 0;

    const timelineDays = baseDays + (membersFactorMap[membersRange] || 0) + (integrationsFactorMap[integrations] || 0) + deploymentFactor;

    // pricing (KES) — heuristic example only
    const baseKES = 120000; // base setup (SaaS quick-start)
    const perMemberKES = { "<500": 0, "500–2k": 10, "2k–10k": 6, "10k+": 4 }; // per member monthly/one-time factor
    const integrationsKES = { None: 0, Payments: 25000, "Accounting/ERP": 40000, Multiple: 70000 };
    const deploymentMultiplier = deployment === "Self-hosted" ? 1.5 : 1.0;

    // compute an example ballpark initial project cost
    const membersNumberEstimate = { "<500": 300, "500–2k": 1200, "2k–10k": 6000, "10k+": 15000 }[membersRange] || 500;
    const estimatedOneTime = Math.round((baseKES + (perMemberKES[membersRange] * membersNumberEstimate) + integrationsKES[integrations]) * deploymentMultiplier);

    return {
      timelineDays,
      estimatedOneTime,
      note:
        "This is a ballpark estimator for qualification only. Final price and timeline depend on integrations, SLA, custom reports and data migration.",
    };
  }, [membersRange, integrations, deployment]);

  return (
    <motion.section className="py-16 px-6 md:px-20 bg-gray-50" {...fadeUp} transition={{ duration: 0.6 }}>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Left / text */}
          <div>
            <h1 className="text-3xl md:text-4xl font-heading text-cognifer_blue font-bold">
              SACCO Analytics
            </h1>

            <p className="text-gray-700 mt-4 max-w-xl leading-relaxed">
              Automated scorecards, PAR monitoring and member analytics built for cooperatives.
              Improve loan performance, reduce portfolio risk, and produce ETIMS-compliant reports with minimal manual work.
            </p>

            {/* value bullets */}
            <div className="mt-6 grid gap-3">
              <motion.div whileHover={{ x: 6 }} className="p-4 bg-white rounded-lg shadow-sm border flex gap-3 items-start">
                <div className="font-semibold text-cognifer_blue">Automated Scorecards</div>
                <div className="text-sm text-gray-600">Daily/weekly reporting with benchmarks and trend alerts.</div>
              </motion.div>

              <motion.div whileHover={{ x: 6 }} className="p-4 bg-white rounded-lg shadow-sm border flex gap-3 items-start">
                <div className="font-semibold text-cognifer_blue">PAR Alerts & Drill-downs</div>
                <div className="text-sm text-gray-600">Actionable alerts with member-level drill-downs for collections teams.</div>
              </motion.div>

              <motion.div whileHover={{ x: 6 }} className="p-4 bg-white rounded-lg shadow-sm border flex gap-3 items-start">
                <div className="font-semibold text-cognifer_blue">Member Segmentation</div>
                <div className="text-sm text-gray-600">Cohorts, retention signals and product performance to drive targeted interventions.</div>
              </motion.div>

              <motion.div whileHover={{ x: 6 }} className="p-4 bg-white rounded-lg shadow-sm border flex gap-3 items-start">
                <div className="font-semibold text-cognifer_blue">ETIMS-ready Export</div>
                <div className="text-sm text-gray-600">Exports and compliance reports formatted for ETIMS workflows.</div>
              </motion.div>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/contact" className="px-5 py-3 bg-cognifer_blue text-white rounded-lg hover:bg-cognifer_blue/90 transition">
                Book Discovery Call
              </Link>
              <Link to="/contact" className="px-5 py-3 border rounded-lg hover:bg-gray-100 transition">
                Request Pilot
              </Link>
            </div>
          </div>

          {/* Right / image + quick stats */}
          <div className="space-y-6">
            <motion.div className="w-full rounded-xl overflow-hidden shadow-lg bg-white border" whileHover={{ scale: 1.02 }} transition={{ duration: 0.35 }}>
              <img src={saccoImg} alt="SACCO Analytics dashboard" className="w-full h-64 object-cover" />
            </motion.div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-lg border text-center">
                <div className="text-sm text-gray-500">Avg. time to onboard</div>
                <div className="text-xl font-semibold text-cognifer_blue">2–4 weeks</div>
              </div>
              <div className="bg-white p-3 rounded-lg border text-center">
                <div className="text-sm text-gray-500">Typical data sources</div>
                <div className="text-xl font-semibold text-cognifer_blue">Core + M-PESA</div>
              </div>
              <div className="bg-white p-3 rounded-lg border text-center">
                <div className="text-sm text-gray-500">Export</div>
                <div className="text-xl font-semibold text-cognifer_blue">ETIMS-ready</div>
              </div>
            </div>
          </div>
        </div>

        {/* Deployment, Estimator, Pricing & Image guidance */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div className="bg-white p-6 rounded-lg shadow-sm border" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
            <h3 className="text-xl font-semibold text-cognifer_blue mb-3">Deployment options & what's included</h3>
            <ul className="list-disc ml-5 text-gray-700 space-y-2">
              <li><strong>Cloud-hosted SaaS (managed)</strong> — quick start, automatic updates, daily backups.</li>
              <li><strong>Self-hosted (enterprise)</strong> — deploy on your infra, bespoke SLAs & integrations.</li>
              <li><strong>Support & onboarding</strong> — training, data migration assistance and 30-day support included.</li>
            </ul>

            <div className="mt-4 text-sm text-gray-600">
              <div><strong>Pricing model (example heuristic)</strong></div>
              <div className="mt-2">Estimated initial setup ≈ <strong>Base fee + members × per-member factor + integrations fee</strong>. Ongoing fees typically monthly (hosting, support, updates).</div>
              <div className="mt-2 text-xs text-gray-500 italic">We provide a tailored quote based on members, integrations, and support level.</div>
            </div>
          </motion.div>

          {/* Estimator */}
          <motion.div className="bg-white p-6 rounded-lg shadow-sm border" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
            <h3 className="text-xl font-semibold text-cognifer_blue mb-3">Quick timeline & price estimator</h3>

            <div className="grid grid-cols-1 gap-3">
              <label className="text-sm text-gray-700">Approx. active members</label>
              <select value={membersRange} onChange={(e) => setMembersRange(e.target.value)} className="w-full border rounded p-2">
                <option value="<500">&lt;500</option>
                <option value="500–2k">500–2k</option>
                <option value="2k–10k">2k–10k</option>
                <option value="10k+">10k+</option>
              </select>

              <label className="text-sm text-gray-700">Integrations needed</label>
              <select value={integrations} onChange={(e) => setIntegrations(e.target.value)} className="w-full border rounded p-2">
                <option>None</option>
                <option>Payments</option>
                <option>Accounting/ERP</option>
                <option>Multiple</option>
              </select>

              <label className="text-sm text-gray-700">Deployment</label>
              <select value={deployment} onChange={(e) => setDeployment(e.target.value)} className="w-full border rounded p-2">
                <option value="SaaS">Cloud-hosted SaaS</option>
                <option value="Self-hosted">Self-hosted (Enterprise)</option>
              </select>

              <div className="mt-3 p-3 bg-gray-50 rounded border">
                <div className="text-sm text-gray-600">Estimated timeline</div>
                <div className="text-2xl font-bold text-cognifer_blue">{estimator.timelineDays} days</div>
                <div className="text-sm text-gray-600 mt-2">Estimated initial cost (ballpark):</div>
                <div className="text-xl font-semibold text-gray-800">KES {estimator.estimatedOneTime.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-2">{estimator.note}</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Image guidance + CTA */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
          <h4 className="font-semibold text-cognifer_blue">Smarter SACCO Decisions, Driven by AI</h4>
          <p className="text-sm text-gray-600 mt-2">
            Get a complete picture of your SACCO’s health — from loan performance to member growth. Powered by predictive analytics and intelligent insights tailored for your cooperative.
          </p>

          <div className="mt-4 flex gap-3">
            <Link to="/contact" className="px-5 py-3 bg-cognifer_blue text-white rounded-lg hover:bg-cognifer_blue/90">Book Discovery Call</Link>
            <Link to="/contact" className="px-5 py-3 border rounded-lg hover:bg-gray-100">Request Pilot</Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
