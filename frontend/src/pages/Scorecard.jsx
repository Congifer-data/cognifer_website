/* -----------------------------------------------------------------
File: frontend/src/pages/Scorecard.jsx
Purpose: Conversational, animated AI-ready scorecard questionnaire
Author: Cognifer AI (for Cognifer) — redesigned conditional flow
----------------------------------------------------------------- */

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import axios from "axios";
import { jsPDF } from "jspdf";

/* -----------------------------------------------------------------
   QUESTION BANK (AI-ready structure)
   Note: static questionSets used for sacco & webapp; website questions
   are generated dynamically based on qualifiers (current_website).
----------------------------------------------------------------- */
const questionSets = {
  sacco: [
    { key: "repayment", text: "How would you rate your loan repayment performance? (1 = Poor, 5 = Excellent)", weight: 0.3 },
    { key: "growth", text: "How fast is your member base growing? (1 = Slow, 5 = Rapid)", weight: 0.2 },
    { key: "efficiency", text: "How efficient are your operations? (1 = Inefficient, 5 = Highly Efficient)", weight: 0.25 },
    { key: "innovation", text: "How open is your SACCO to adopting digital tools? (1 = Resistant, 5 = Fully Open)", weight: 0.25 },
  ],
  webapp: [
    { key: "automation", text: "How much automation do you use in your daily processes? (1 = Rarely, 5 = Extensively)", weight: 0.25 },
    { key: "scalability", text: "How scalable is your current system? (1 = Limited, 5 = Highly Scalable)", weight: 0.25 },
    { key: "security", text: "How secure is your current platform? (1 = Vulnerable, 5 = Highly Secure)", weight: 0.2 },
    { key: "uiux", text: "How satisfied are users with your interface? (1 = Dissatisfied, 5 = Very Satisfied)", weight: 0.15 },
    { key: "observability", text: "How confident are you in monitoring and logging to diagnose issues? (1 = Not confident, 5 = Very confident)", weight: 0.15 },
  ],
  // website: will be provided dynamically below
};

/* -----------------------------------------------------------------
   Qualifiers (small answers to steer the flow)
----------------------------------------------------------------- */
const qualifiersByCategory = {
  sacco: [
    { key: "members", label: "Approx. active members", options: ["<500", "500–2k", "2k–10k", "10k+"] },
    { key: "collections_method", label: "Primary collections method", options: ["Manual", "Mobile money", "Automated debit", "Mixed"] },
  ],
  webapp: [
    { key: "users_12mo", label: "Estimated active users in 12 months", options: ["<1k", "1k–10k", "10k–100k", "100k+"] },
    { key: "integrations_needed", label: "Integrations needed", options: ["None", "Payments", "Accounting/ERP", "Multiple"] },
  ],
  website: [
    { key: "current_website", label: "Current website status", options: ["No website", "Basic site", "Advanced (CMS/ecommerce)"] },
    { key: "primary_goal", label: "Primary website goal", options: ["Lead generation", "E-commerce", "Branding", "Support Portal"] },
    { key: "timeline_urgency", label: "Launch urgency", options: ["Flexible (3+ months)", "1–3 months", "Within 1 month", "ASAP (2 weeks)"] },
  ],
};

/* -----------------------------------------------------------------
   Small UI building blocks
----------------------------------------------------------------- */

/* QuestionCard: local rating resets when question changes */
function QuestionCard({ question, onAnswer, onPrev, showPrev }) {
  const [rating, setRating] = useState(null);
  const ratings = [1, 2, 3, 4, 5];

  useEffect(() => {
    // reset local rating when question changes to avoid carry-over
    setRating(null);
  }, [question?.key]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.32 }}
      className="bg-white/95 backdrop-blur-lg shadow-lg rounded-2xl p-8 w-full max-w-xl mx-auto text-center"
    >
      <h2 className="text-2xl font-semibold text-cognifer_blue mb-5 leading-snug">{question.text}</h2>

      <div className="flex justify-center gap-4">
        {ratings.map((r) => (
          <motion.button
            key={r}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              setRating(r);
              // small delay for UX before moving on
              setTimeout(() => onAnswer(r), 200);
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center border text-sm font-medium transition-colors ${
              rating === r ? "bg-cognifer_blue text-white border-cognifer_blue" : "bg-gray-100 text-gray-700 border-gray-300"
            }`}
            aria-pressed={rating === r}
            aria-label={`Rate ${r}`}
          >
            {r}
          </motion.button>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-500">Scale: 1 (low) — 5 (high)</div>

      <div className="mt-6 flex justify-between">
        {showPrev ? (
          <button onClick={onPrev} className="px-4 py-2 rounded bg-gray-100 text-sm">Previous</button>
        ) : <div />}

        <div className="text-xs text-gray-400">Tip: pick the number that feels closest — no right answer.</div>
      </div>
    </motion.div>
  );
}

/* Result chart */
function ResultChart({ results }) {
  const data = Object.entries(results || {}).map(([k, v]) => ({ name: k.replace(/_/g, " "), score: Number(v) }));
  return (
    <div className="w-full max-w-xl h-56 mx-auto">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
          <Bar dataKey="score" fill="#1E40AF" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* analyze into strengths/weaknesses */
function analyzeResponses(answers) {
  const list = Object.entries(answers || {}).map(([k, v]) => ({ key: k, score: Number(v) }));
  const strengths = list.slice().sort((a, b) => b.score - a.score).slice(0, 3);
  const weaknesses = list.slice().sort((a, b) => a.score - b.score).slice(0, 3);
  return { strengths, weaknesses };
}

/* -----------------------------------------------------------------
   Main page
----------------------------------------------------------------- */
export default function Scorecard() {
  const [stage, setStage] = useState("intro"); // intro | qualifiers | questions | contact | results
  const [category, setCategory] = useState(null);
  const [qualifiers, setQualifiers] = useState({});
  const [answers, setAnswers] = useState({});
  const [index, setIndex] = useState(0);
  const [contact, setContact] = useState({ company: "", email: "" }); // parent contact (committed)
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  /* -------------------------
     Dynamic questions generator
     (website questions branch depending on qualifiers.current_website)
     ------------------------- */
  const dynamicQuestions = useMemo(() => {
    if (!category) return [];

    if (category === "website") {
      const status = qualifiers.current_website || "No website";

      if (status === "No website") {
        // User has no site — focus on goals, content, urgency and priorities
        return [
          { key: "goal_clarity", text: "How clear is the single main goal for your new website? (1 = Not clear, 5 = Crystal clear)", weight: 0.2 },
          { key: "audience_clarity", text: "How well do you know who the website should serve? (1 = Not at all, 5 = Very well)", weight: 0.15 },
          { key: "launch_urgency", text: "How soon do you need the website live? (1 = Flexible, 5 = ASAP / 2 weeks)", weight: 0.15 },
          { key: "content_ready", text: "How ready are your texts, photos and product info? (1 = Nothing ready, 5 = All ready)", weight: 0.15 },
          { key: "budget_confidence", text: "How confident are you about the budget you can set aside? (1 = Unknown, 5 = Clear plan)", weight: 0.1 },
          { key: "mobile_priority", text: "How important is mobile-first experience for your customers? (1 = Low, 5 = Critical)", weight: 0.15 },
          { key: "maintenance_preference", text: "Do you prefer a 'set-and-forget' site or one you update often? (1 = Frequent updates, 5 = Low maintenance)", weight: 0.1 },
        ];
      }

      if (status === "Basic site") {
        // Basic site — evaluate improvements and readiness for upgrade
        return [
          { key: "design_modernity", text: "How modern and user-friendly is your current site? (1 = Outdated, 5 = Excellent)", weight: 0.2 },
          { key: "conversion_tracking", text: "Do you have tracking that converts visitors to leads/customers? (1 = No, 5 = Fully tracked)", weight: 0.2 },
          { key: "mobile_friendly", text: "Is your site reliable on phones and tablets? (1 = Poor, 5 = Excellent)", weight: 0.15 },
          { key: "content_update_frequency", text: "How often do you update content (offers, products)? (1 = Rarely, 5 = Daily)", weight: 0.1 },
          { key: "seo_basics", text: "Are basic SEO elements (titles, meta, indexability) in place? (1 = Not at all, 5 = Yes)", weight: 0.15 },
          { key: "hosting_satisfaction", text: "Are you happy with your hosting (speed, uptime)? (1 = Unhappy, 5 = Very happy)", weight: 0.1 },
          { key: "analytics_level", text: "Do you review analytics to inform decisions? (1 = Never, 5 = Regularly)", weight: 0.1 },
        ];
      }

      // Advanced/CMS/ecommerce — focus on integrations, data, reliability & growth
      return [
        { key: "integrations_health", text: "How reliable are your existing integrations (payments, ERP)? (1 = Fragile, 5 = Stable)", weight: 0.18 },
        { key: "data_migration", text: "How complex is migrating existing products/data? (1 = Simple, 5 = Very complex)", weight: 0.15 },
        { key: "uptime_sla", text: "Do you need guaranteed uptime or business-critical SLA? (1 = No, 5 = Yes, critical)", weight: 0.12 },
        { key: "performance", text: "How fast does your site perform under normal load? (1 = Slow, 5 = Fast)", weight: 0.12 },
        { key: "user_accounts", text: "Do many users log in or use accounts? (1 = None, 5 = Many / mission-critical)", weight: 0.12 },
        { key: "analytics_advanced", text: "Do you use advanced analytics/events for business decisions? (1 = No, 5 = Yes)", weight: 0.12 },
        { key: "security_readiness", text: "How confident are you in your security and backups? (1 = Not confident, 5 = Very confident)", weight: 0.19 },
      ];
    }

    // fallback to static sets (sacco / webapp)
    return questionSets[category] || [];
  }, [category, qualifiers]);

  /* -------------------------
     compute / submit
     uses dynamicQuestions (not the static bank) so flow is conditional
  ------------------------- */
  async function computeScoreAndSubmit(finalAnswers, commitContact = null) {
    setLoading(true);
    const qs = dynamicQuestions || [];
    let weighted = 0, totalWeight = 0;
    qs.forEach((q) => {
      const val = Number(finalAnswers[q.key] ?? 0);
      const w = Number(q.weight ?? 1);
      weighted += val * w;
      totalWeight += w;
    });
    const avg = totalWeight ? weighted / totalWeight : 3;
    const pct = Math.max(0, Math.min(100, (avg / 5) * 100));

    try {
      // try to post to backend (non-blocking)
      await axios.post("/scorecard/submit", {
        category,
        qualifiers,
        questions: qs.map(q => ({ key: q.key, text: q.text, weight: q.weight })),
        answers: finalAnswers,
        contact: commitContact || contact,
        score: pct,
      });
    } catch (err) {
      console.warn("Backend submit failed (ok to ignore dev):", err);
    } finally {
      setScore(pct);
      setStage("results");
      setLoading(false);
    }
  }

  /* reset */
  function resetAll() {
    setStage("intro");
    setCategory(null);
    setQualifiers({});
    setAnswers({});
    setIndex(0);
    setContact({ company: "", email: "" });
    setScore(null);
  }

  /* handle question answer */
  function handleQuestionAnswer(value) {
    const q = dynamicQuestions[index];
    const next = { ...answers, [q.key]: value };
    setAnswers(next);
    // advance or go to contact
    if (index < dynamicQuestions.length - 1) {
      setIndex((i) => i + 1);
    } else {
      setStage("contact");
    }
  }

  /* go to previous question (or qualifiers if at first) */
  function handlePrev() {
    if (index > 0) {
      setIndex(i => i - 1);
    } else {
      // go back to qualifiers
      setStage("qualifiers");
    }
  }

  /* download pdf */
  function downloadSummaryPDF() {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    doc.setFontSize(18);
    doc.setTextColor("#0B1E3F");
    doc.text("Cognifer Scorecard Summary", 40, 60);

    doc.setFontSize(12);
    doc.setTextColor("#333");
    doc.text(`Category: ${category || "—"}`, 40, 100);
    doc.text(`Company: ${contact.company || "—"}`, 40, 118);
    doc.text(`Email: ${contact.email || "—"}`, 40, 136);
    doc.text(`Score: ${score?.toFixed(1) ?? "—"}%`, 40, 154);

    let y = 190;
    doc.setFontSize(13);
    doc.text("Qualifiers:", 40, y);
    y += 18;
    Object.entries(qualifiers).forEach(([k, v]) => {
      doc.setFontSize(11);
      doc.text(`${k.replace(/_/g, " ")}: ${String(v)}`, 50, y);
      y += 16;
      if (y > 760) { doc.addPage(); y = 40; }
    });

    y += 6;
    doc.setFontSize(13);
    doc.text("Responses:", 40, y);
    y += 18;
    Object.entries(answers).forEach(([k, v]) => {
      doc.setFontSize(11);
      doc.text(`${k.replace(/_/g, " ")}: ${String(v)}`, 50, y);
      y += 16;
      if (y > 760) { doc.addPage(); y = 40; }
    });

    doc.save(`cognifer-score-${(contact.company || "summary").replace(/\s+/g, "-")}.pdf`);
  }

  /* -------------------------
     Panels
  ------------------------- */

  const IntroPanel = (
    <motion.div
      key="intro"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.35 }}
      className="bg-white/95 backdrop-blur-lg shadow-xl rounded-2xl p-8 max-w-3xl w-full mx-auto"
    >
      <h2 className="text-2xl font-semibold text-cognifer_blue mb-6">Which best matches your need?</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { key: "sacco", title: "SACCO / Financial Cooperative", desc: "Member-based organisations — loan health, reporting & digital adoption." },
          { key: "website", title: "Website Presence", desc: "Improve brand visibility, SEO and conversion." },
          { key: "webapp", title: "Web / Mobile App", desc: "Systems, integrations and scale-ready apps." },
        ].map((opt) => (
          <motion.div
            key={opt.key}
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer border border-gray-200 rounded-lg p-5 bg-gradient-to-br from-white to-blue-50 hover:shadow-md transition"
            onClick={() => {
              setCategory(opt.key);
              setQualifiers({}); // reset
              setAnswers({});
              setIndex(0);
              setStage("qualifiers");
            }}
          >
            <div className="text-lg font-semibold text-cognifer_blue mb-1">{opt.title}</div>
            <p className="text-sm text-gray-600">{opt.desc}</p>
          </motion.div>
        ))}
      </div>
      <p className="text-gray-500 mt-4 text-sm italic">Select the option closest to your organisation — we’ll tailor the next questions.</p>
    </motion.div>
  );

  const QualifiersPanel = (
    <motion.div
      key="qualifiers"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.35 }}
      className="bg-white/95 backdrop-blur-lg shadow-lg rounded-2xl p-8 max-w-3xl w-full mx-auto"
    >
      <h2 className="text-2xl font-semibold text-cognifer_blue mb-4">Quick setup</h2>
      <p className="text-sm text-gray-600 mb-4">Two or three short choices so we personalize the assessment. Friendly — no right answers.</p>

      <div className="grid md:grid-cols-2 gap-4">
        {(qualifiersByCategory[category] || []).map((q) => (
          <div key={q.key} className="p-3 border rounded-lg bg-white">
            <div className="text-sm font-semibold text-gray-800 mb-2">{q.label}</div>
            <select
              value={qualifiers[q.key] || ""}
              onChange={(e) => setQualifiers((p) => ({ ...p, [q.key]: e.target.value }))}
              className="w-full border rounded p-2 text-sm"
            >
              <option value="">Select</option>
              {q.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <button onClick={() => setStage("intro")} className="px-4 py-2 rounded bg-gray-100">Back</button>
        <button
          onClick={() => {
            // clear answers and index whenever qualifiers change and we start questions
            setAnswers({});
            setIndex(0);
            setStage("questions");
          }}
          disabled={!((qualifiersByCategory[category] || []).every(q => Boolean(qualifiers[q.key])))}
          className={`px-4 py-2 rounded text-white ${((qualifiersByCategory[category] || []).every(q => Boolean(qualifiers[q.key]))) ? "bg-cognifer_blue hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}`}
        >
          Start assessment
        </button>
      </div>
    </motion.div>
  );

  /* ContactPanel uses local states for stable typing — commit on submit */
  function ContactPanel() {
    const [localCompany, setLocalCompany] = useState(contact.company || "");
    const [localEmail, setLocalEmail] = useState(contact.email || "");
    const valid = localCompany.trim() && localEmail.trim();

    useEffect(() => {
      // sync if parent contact changes externally (rare), but avoid overwriting while typing
      setLocalCompany(contact.company || "");
      setLocalEmail(contact.email || "");
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stage]); // sync when panel mounts (stage becomes 'contact')

    async function handleSubmit() {
      // commit local -> parent immediately (synchronous)
      setContact({ company: localCompany.trim(), email: localEmail.trim() });
      // call compute with the committed values (pass commitContact so backend gets it)
      await computeScoreAndSubmit(answers, { company: localCompany.trim(), email: localEmail.trim() });
    }

    return (
      <motion.div
        key="contact"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        transition={{ duration: 0.32 }}
        className="bg-white/95 backdrop-blur-lg shadow-lg rounded-2xl p-8 max-w-xl w-full mx-auto"
      >
        <h2 className="text-2xl font-semibold text-cognifer_blue mb-4">Just a bit more — contact</h2>
        <p className="text-sm text-gray-600 mb-4">We email the full summary to this address for follow-up.</p>

        <input
          value={localCompany}
          onChange={(e) => setLocalCompany(e.target.value)}
          placeholder="Company name"
          className="w-full p-3 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-cognifer_blue"
        />
        <input
          value={localEmail}
          onChange={(e) => setLocalEmail(e.target.value)}
          placeholder="Email address"
          className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-cognifer_blue"
        />

        <div className="flex gap-3">
          <button onClick={() => setStage("questions")} className="px-4 py-2 rounded bg-gray-100">Back</button>
          <button
            onClick={handleSubmit}
            disabled={!valid || loading}
            className={`px-4 py-2 rounded text-white ${valid && !loading ? "bg-cognifer_blue hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}`}
          >
            {loading ? "Computing..." : "View my score"}
          </button>
        </div>
      </motion.div>
    );
  }

  /* Results panel (compact) */
  function ResultsPanel() {
    const { strengths, weaknesses } = analyzeResponses(answers);
    const grade = score >= 80 ? "A" : score >= 60 ? "B" : score >= 40 ? "C" : "D";
    const topWeak = (weaknesses[0] && weaknesses[0].key.replace(/_/g, " ")) || null;
    const rec = topWeak ? `We recommend improving "${topWeak}" — a targeted package can help.` : "Your score looks balanced — we can optimize further.";

    return (
      <motion.div
        key="results"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        transition={{ duration: 0.32 }}
        className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl p-8 max-w-2xl w-full mx-auto"
      >
        <div className="text-center">
          <div className="text-sm text-gray-500">Assessment Complete</div>
          <div className="text-5xl font-bold text-green-600 mt-2">{score?.toFixed(1)}%</div>
          <div className="text-lg font-semibold text-cognifer_blue mt-2">Grade: {grade}</div>
          <p className="text-gray-700 mt-4">{rec}</p>
        </div>

        <div className="mt-6">
          <ResultChart results={answers} />
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-white border rounded-lg">
            <div className="text-sm font-semibold text-gray-800 mb-2">Top strengths</div>
            <ul className="text-sm text-gray-700 space-y-2">
              {strengths.map((s) => (
                <li key={s.key} className="flex justify-between">
                  <span>{s.key.replace(/_/g, " ")}</span>
                  <span className="font-semibold">{s.score}/5</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-white border rounded-lg">
            <div className="text-sm font-semibold text-gray-800 mb-2">Opportunities</div>
            <ul className="text-sm text-gray-700 space-y-2">
              {weaknesses.map((w) => (
                <li key={w.key} className="flex justify-between">
                  <span>{w.key.replace(/_/g, " ")}</span>
                  <span className="font-semibold">{w.score}/5</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button onClick={() => setStage("intro")} className="w-full sm:w-auto px-5 py-3 border rounded-lg text-cognifer_blue">Start Over</button>
          <button onClick={downloadSummaryPDF} className="w-full sm:w-auto px-5 py-3 bg-gray-100 rounded-lg">Download Summary (PDF)</button>
        </div>

        <div className="mt-4 text-xs text-gray-400 text-center">
          We store minimal contact details to provide tailored follow-up.
          <div className="mt-2 text-sm">Contact: {contact.company || "—"} • {contact.email || "—"}</div>
        </div>
      </motion.div>
    );
  }

  /* small progress tracker for questions stage */
  function ProgressTracker() {
    const total = dynamicQuestions.length || 1;
    // show progress as how many answered out of total. If on question index 0 (first question) show 0/total
    const answered = Math.min(index, total);
    const percent = Math.round((answered / total) * 100);
    return (
      <div className="max-w-xl mx-auto mb-4">
        <div className="text-sm text-gray-600 mb-2">Progress</div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ ease: "easeOut", duration: 0.4 }}
            className="h-full bg-cognifer_blue"
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">{answered}/{total} answered</div>
      </div>
    );
  }

  /* -----------------------------------------------------------------
     Render (stage-level AnimatePresence keys only)
  ----------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 px-4">
      <div className="text-center mb-8">
        <motion.h1 layout className="text-4xl font-extrabold text-cognifer_blue mb-3">Cognifer Scorecard</motion.h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">Innovation. Insights. Technology — discover where your organisation stands.</p>
      </div>

      <div className="w-full max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {stage === "intro" && IntroPanel}
          {stage === "qualifiers" && QualifiersPanel}

          {stage === "questions" && (
            <motion.div
              key="questions"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.32 }}
            >
              <ProgressTracker />
              <QuestionCard
                question={dynamicQuestions[index]}
                onAnswer={handleQuestionAnswer}
                onPrev={handlePrev}
                showPrev={true}
              />
            </motion.div>
          )}

          {stage === "contact" && (
            <motion.div key="contact" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.32 }}>
              <ContactPanel />
            </motion.div>
          )}

          {stage === "results" && (
            <motion.div key="results" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.32 }}>
              <ResultsPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
