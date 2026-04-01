"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Sparkles, ArrowUpRight, Clock, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const token = localStorage.getItem("feedpulse_token"); // Requirement 4.3
        const response = await axios.get("http://127.0.0.1:4000/api/feedback", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFeedbacks(response.data.data); 
      } catch (error) {
        console.error("Failed to fetch feedback", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Intelligence Dashboard</h1>
          <p className="text-slate-500 font-bold mt-1 italic">Real-time analysis from Gemini 3</p>
        </div>
        
        {/* Bonus AI Summary Button */}
        <button className="glass-light px-6 py-3 rounded-2xl flex items-center gap-2 font-black text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
          <Sparkles size={18} /> Generate Trend Report
        </button>
      </header>

      {/* Stats Bar - Requirement 3.8 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-light p-8 rounded-[2rem] flex flex-col gap-2">
          <span className="text-slate-500 font-bold text-sm uppercase tracking-widest">Total Reports</span>
          <span className="text-4xl font-black text-slate-900">{feedbacks.length}</span>
        </div>
        {/* ... More stat cards here ... */}
      </div>

      {/* Main Feedback List - Requirement 3.2 */}
      <div className="glass-light rounded-[2.5rem] overflow-hidden border border-white/80 p-4">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-slate-400 font-bold text-sm">
              <th className="px-6 py-4">USER FEEDBACK</th>
              <th className="px-6 py-4">CATEGORY</th>
              <th className="px-6 py-4">SENTIMENT</th>
              <th className="px-6 py-4">PRIORITY</th>
              <th className="px-6 py-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((item: any) => (
              <motion.tr 
                key={item._id}
                whileHover={{ scale: 1.01 }}
                className="bg-white/40 hover:bg-white/60 transition-all cursor-pointer group"
              >
                <td className="px-6 py-5 rounded-l-2xl">
                  <div className="font-black text-slate-800">{item.title}</div>
                  <div className="text-sm text-slate-500 font-medium truncate max-w-[250px]">{item.description}</div>
                </td>
                <td className="px-6 py-5 text-sm font-bold text-slate-600">
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full">{item.category}</span>
                </td>
                <td className="px-6 py-5">
                   {/* Requirement 2.4: Sentiment Badge */}
                   <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                     item.ai_sentiment === "Positive" ? "bg-emerald-100 text-emerald-700" :
                     item.ai_sentiment === "Negative" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                   }`}>
                     {item.ai_sentiment || "Analyzing..."}
                   </span>
                </td>
                <td className="px-6 py-5">
                   <span className="font-black text-slate-700">{item.ai_priority || 0}/10</span>
                </td>
                <td className="px-6 py-5 rounded-r-2xl text-right">
                  <button className="p-3 bg-white/50 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                    <ArrowUpRight size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}