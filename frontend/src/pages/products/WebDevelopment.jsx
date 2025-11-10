/* -----------------------------------------------------------------
File: frontend/src/pages/products/WebDevelopment.jsx
Purpose: Product detail page for Web Development Services (polished + estimator)
Notes:
 - Image expected at: src/assets/products/websites.webp
 - Estimator restructured to use site-type taxonomy (Static, Dynamic, SPA, Hybrid)
 - Monetary rates preserved from original; timelines / days-per-page slightly adjusted for complexity.
----------------------------------------------------------------- */

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImg from "../../assets/websites.webp";

const fadeUp = { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 } };

function roundToNearest(value, step = 1000) {
  return Math.round(value / step) * step;
}

export default function WebDevelopment() {
  // estimator inputs: reflect the product taxonomy the doc describes
  const [projectType, setProjectType] = useState("static"); // static, dynamic, spa, hybrid
  const [pages, setPages] = useState(5);
  const [integrations, setIntegrations] = useState("None");
  const [designLevel, setDesignLevel] = useState("Standard");

  // plain-language info for each website type (displayed under the Website type select)
  const siteTypeInfo = {
    static: {
      title: "Static site — quick, cheap, reliable",
      summary:
        "A few simple pages (text, images) that don’t change unless you edit them. Extremely fast, secure and low-cost to host.",
      example: "Small business brochure/portfolio: Home, Services, Prices, Gallery, Contact.",
      tip: "Choose this if you want a fast, low-maintenance web presence."
    },
    dynamic: {
      title: "Dynamic site (with backend) — data & accounts",
      summary:
        "A site that stores and serves information for users — bookings, forms, staff logins or other saved data.",
      example: "Clinic booking system: patients book appointments, staff manage schedules.",
      tip: "Choose this if you need to collect or manage customer data."
    },
    spa: {
      title: "Single-Page App (SPA) — interactive experience",
      summary:
        "A web app-like experience where the interface updates smoothly in the browser. Great for rich interactions.",
      example: "Order builder for a bakery where customers customize cakes and track delivery.",
      tip: "Pick this for a very interactive customer experience (more setup required)."
    },
    hybrid: {
      title: "Hybrid / SSR — fast pages + modern features",
      summary:
        "Server-rendered pages for speed and search, plus client interactivity where needed — the best of both worlds.",
      example:
        "Boutique store: SEO product pages plus a fast, polished checkout and personalization.",
      tip: "Pick this if you want great search visibility and a modern user experience."
    }
  };

  // estimator (rates preserved; timelines slightly adjusted by complexity)
  const estimator = useMemo(() => {
    // ---------------- preserved numeric rates (mapped to new types) ----------------
    // original "base-for-3-pages" map mapped to new types:
    const baseForThreeMap = { static: 3000, dynamic: 4500, spa: 6000, hybrid: 12000 };
    const baseForThree = baseForThreeMap[projectType] ?? 3000;
    const perPage = baseForThree / 3; // per-page base derived exactly as original

    // original integration flat costs preserved
    const integrationKESMap = { None: 0, Payments: 10000, "ERP/Accounting": 20000, Multiple: 30000 };
    const integrationKES = integrationKESMap[integrations] ?? 0;

    // original AI-assisted day rates preserved (mapped to new types)
    const effortKESPerDayMap = { static: 500, dynamic: 500, spa: 1000, hybrid: 1000 };
    const effortPerDay = effortKESPerDayMap[projectType] ?? 500;

    // design multiplier retained for reference (unchanged)
    const designMultiplierMap = { Standard: 1.0, Premium: 1.2, Custom: 1.4 };
    const designMultiplier = designMultiplierMap[designLevel] ?? 1.0;

    // ---------------- timeline params (slightly increased with complexity) ----------------
    // baseDays: small upward adjustments for more complex types (keeps "only slight" change)
    const baseDaysMap = { static: 3, dynamic: 4, spa: 5, hybrid: 6 }; // +1 day per step of complexity
    const baseDays = baseDaysMap[projectType] ?? 3;

    // days per extra page: slightly higher for richer apps
    const daysPerExtraMap = { static: 0.6, dynamic: 0.8, spa: 1.0, hybrid: 1.2 };
    const daysPerExtra = daysPerExtraMap[projectType] ?? 0.6;

    // integration days preserved but mapped (kept identical to original numbers)
    const integrationDaysMap = { None: 0, Payments: 3, "ERP/Accounting": 5, Multiple: 8 };
    const integrationDays = integrationDaysMap[integrations] ?? 0;

    // design days preserved mapping
    const designDaysMap = { Standard: 0, Premium: 3, Custom: 6 };
    const designDays = designDaysMap[designLevel] ?? 0;

    // ---------------- compute timeline ----------------
    const includedPages = 3; // base covers first 3 pages (original)
    const extraPages = Math.max(0, pages - includedPages);
    const extraPageDays = extraPages * daysPerExtra;

    const rawDevDays = baseDays + extraPageDays + integrationDays;
    const rawDays = rawDevDays + designDays;

    // variable buffer: baseline 15% (original) with small complexity increments; cap 25%
    let bufferPercent = 0.15;
    if (projectType === "spa") bufferPercent += 0.03;
    if (projectType === "hybrid") bufferPercent += 0.06;
    if (integrations === "Multiple") bufferPercent += 0.05;
    if (integrations === "ERP/Accounting") bufferPercent += 0.03;
    bufferPercent += Math.min(0.06, Math.floor(extraPages / 10) * 0.02); // small pages-based bump
    bufferPercent = Math.min(bufferPercent, 0.25);

    const bufferDays = Math.ceil(rawDays * bufferPercent);
    const timelineDays = Math.max(Math.round(rawDays + bufferDays), Math.round(baseDays));

    // ---------------- pricing (monetary rates preserved) ----------------
    // base per-page model retained (original behavior)
    const baseKES_total = Math.round(perPage * pages);

    // labor cost uses preserved effortPerDay and timelineDays
    const laborCost = effortPerDay * timelineDays;

    // explicit design labor cost (costed using same local day-rate to preserve rates)
    const designLaborCost = effortPerDay * designDays;

    // subtotal before PM & contingency (structure improved but rates preserved)
    const subtotal = baseKES_total + integrationKES + laborCost + designLaborCost;

    // project management & contingency percentages (small structural adds)
    const pmPercent = 0.12;
    const contingencyPercent = 0.08;
    const pmFee = Math.round(subtotal * pmPercent);
    const contingency = Math.round(subtotal * contingencyPercent);

    const rawTotal = subtotal + pmFee + contingency;

    // small AI productivity multiplier not to change rates materially — left neutral (1.0)
    // (user asked rates should not change much; refrain from adding a discount unless you want it)
    const finalRounded = roundToNearest(rawTotal, 1000);

    // floor: ensure not below the original base-for-3-pages baseline
    const minAcceptable = Math.round(baseForThree);
    const estimatedOneTime = Math.max(finalRounded, roundToNearest(minAcceptable, 1000));

    return {
      timelineDays,
      estimatedOneTime,
      breakdown: {
        pages,
        includedPages,
        extraPages,
        perPage,
        baseKES_total,
        daysPerExtra,
        extraPageDays,
        baseDays,
        integrationDays,
        integrationKES,
        designDays,
        designLaborCost,
        effortPerDay,
        laborCost,
        rawDays,
        bufferPercent,
        bufferDays,
        subtotal,
        pmPercent,
        pmFee,
        contingencyPercent,
        contingency,
        designMultiplierUsedForReference: designMultiplier
      },
      note:
        "Ballpark qualification only. Rates preserved to reflect local realities; timelines slightly adjusted by complexity. Final quote depends on exact scope, integrations, hosting and SLA. Domain & hosting excluded.",
    };
  }, [projectType, pages, integrations, designLevel]);

  return (
    <motion.section className="py-16 px-6 md:px-20 bg-gray-50" {...fadeUp} transition={{ duration: 0.5 }}>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Left column: copy */}
          <div>
            <h1 className="text-3xl md:text-4xl font-heading text-cognifer_blue font-bold">
              Web Development Services
            </h1>

            <p className="text-gray-700 mt-4 max-w-xl leading-relaxed">
              From polished brochure sites to fully-featured web platforms — we build fast, secure, SEO-friendly web
              experiences designed to convert and scale. We focus on measurable outcomes: leads, performance, and
              low-maintenance operations.
            </p>

            <div className="mt-6 grid gap-3">
              <div className="p-4 bg-white rounded-lg shadow-sm border flex gap-3 items-start">
                <div className="font-semibold text-cognifer_blue">Marketing Websites & Landing Pages</div>
                <div className="text-sm text-gray-600">High-converting pages with analytics and A/B-ready structure.</div>
              </div>

              <div className="p-4 bg-white rounded-lg shadow-sm border flex gap-3 items-start">
                <div className="font-semibold text-cognifer_blue">E-commerce & Payments</div>
                <div className="text-sm text-gray-600">Secure checkout, payments integration, and order flows that scale.</div>
              </div>

              <div className="p-4 bg-white rounded-lg shadow-sm border flex gap-3 items-start">
                <div className="font-semibold text-cognifer_blue">Headless CMS & Workflows</div>
                <div className="text-sm text-gray-600">Modern content authoring, multi-channel publishing and editorial flows.</div>
              </div>

              <div className="p-4 bg-white rounded-lg shadow-sm border flex gap-3 items-start">
                <div className="font-semibold text-cognifer_blue">Performance & SEO</div>
                <div className="text-sm text-gray-600">Fast Core Web Vitals, structured data and conversion-optimized layouts.</div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/contact" className="px-5 py-3 bg-cognifer_blue text-white rounded-lg hover:bg-cognifer_blue/90 transition">
                Book Discovery Call
              </Link>
              <Link to="/contact" className="px-5 py-3 border rounded-lg hover:bg-gray-100 transition">
                Request Quote
              </Link>
            </div>
          </div>

          {/* Right column: image + quick stats */}
          <div className="space-y-6">
            <motion.div className="w-full rounded-xl overflow-hidden shadow-lg bg-white border" whileHover={{ scale: 1.02 }} transition={{ duration: 0.35 }}>
              <img src={heroImg} alt="Website & web app mockup" className="w-full h-64 object-cover" />
            </motion.div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-lg border text-center">
                <div className="text-sm text-gray-500">Typical timeline</div>
                <div className="text-xl font-semibold text-cognifer_blue">{estimator.timelineDays} days (approx.)</div>
              </div>
              <div className="bg-white p-3 rounded-lg border text-center">
                <div className="text-sm text-gray-500">Common stacks</div>
                <div className="text-xl font-semibold text-cognifer_blue">React / Next / Node</div>
              </div>
              <div className="bg-white p-3 rounded-lg border text-center">
                <div className="text-sm text-gray-500">Hosting</div>
                <div className="text-xl font-semibold text-cognifer_blue">VPS / Cloud / Managed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery, Estimator & Pricing */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div className="bg-white p-6 rounded-lg shadow-sm border" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
            <h3 className="text-xl font-semibold text-cognifer_blue mb-3">Delivery & support</h3>
            <p className="text-gray-700">Every engagement includes planning, UX design, development, QA, and a support window after launch. We also offer ongoing maintenance and SLA packages for production systems.</p>

            <ul className="mt-4 list-disc ml-5 text-gray-700 space-y-2">
              <li><strong>Discovery & UX</strong> — requirements, user flows, and clickable prototypes.</li>
              <li><strong>Development</strong> — modular, testable code with CI/CD and staging environments.</li>
              <li><strong>QA & Launch</strong> — performance tuning, security hardening, and launch checks.</li>
              <li><strong>Optional Maintenance</strong> — monthly support, patching, backups, and monitoring.</li>
            </ul>

            <div className="mt-4 text-sm text-gray-600">
              <div><strong>Pricing model (heuristic)</strong></div>
              <div className="mt-2">Initial cost ≈ <strong>Base (per-page model preserved) + integrations + labor (dev + design explicit) + PM & contingency</strong>. Hosting and maintenance billed separately.</div>
            </div>
          </motion.div>

          <motion.div className="bg-white p-6 rounded-lg shadow-sm border" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
            <h3 className="text-xl font-semibold text-cognifer_blue mb-3">Quick timeline & price estimator</h3>

            <div className="grid gap-3">
              <label className="text-sm text-gray-700">Website type</label>
              <select value={projectType} onChange={(e) => setProjectType(e.target.value)} className="w-full border rounded p-2">
                <option value="static">Static site (landing, portfolio)</option>
                <option value="dynamic">Dynamic site with backend</option>
                <option value="spa">Single-Page App (SPA)</option>
                <option value="hybrid">Hybrid / SSR (Next.js, Nuxt)</option>
              </select>

              {/* site type explanation card (updates when website type changes) */}
              <motion.div
                key={projectType}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
                className="mt-3 p-3 bg-white rounded border shadow-sm"
                aria-live="polite"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-cognifer_blue">{siteTypeInfo[projectType].title}</div>
                    <div className="text-sm text-gray-700 mt-1">{siteTypeInfo[projectType].summary}</div>
                    <div className="text-sm text-gray-600 mt-2"><strong>Example:</strong> {siteTypeInfo[projectType].example}</div>
                    <div className="text-xs text-gray-500 mt-2">{siteTypeInfo[projectType].tip}</div>
                  </div>
                </div>
              </motion.div>

              <label className="text-sm text-gray-700">Number of pages (approx.)</label>
              <input type="number" min={1} value={pages} onChange={(e) => setPages(Number(e.target.value || 1))} className="w-full border rounded p-2" />

              <label className="text-sm text-gray-700">Integrations</label>
              <select value={integrations} onChange={(e) => setIntegrations(e.target.value)} className="w-full border rounded p-2">
                <option>None</option>
                <option>Payments</option>
                <option>ERP/Accounting</option>
                <option>Multiple</option>
              </select>

              <label className="text-sm text-gray-700">Design level</label>
              <select value={designLevel} onChange={(e) => setDesignLevel(e.target.value)} className="w-full border rounded p-2">
                <option value="Standard">Standard templates</option>
                <option value="Premium">Premium bespoke design</option>
                <option value="Custom">Custom UX & enterprise design</option>
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

        {/* Suggested images + CTA */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
          <h4 className="font-semibold text-cognifer_blue">Modern, Scalable Websites That Drive Growth</h4>
          <p className="text-sm text-gray-600 mt-2">
           We design and build fast, secure, SEO-friendly websites optimized for performance and scalability.
          </p>

          <div className="mt-4 flex gap-3">
            <Link to="/contact" className="px-5 py-3 bg-cognifer_blue text-white rounded-lg hover:bg-cognifer_blue/90">Book Discovery Call</Link>
            <Link to="/contact" className="px-5 py-3 border rounded-lg hover:bg-gray-100">Request Quote</Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
