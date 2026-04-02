"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { 
  Sparkles, 
  Search,
  ChevronLeft,
  ChevronRight,
  MessageCircle, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ArrowUpDown,
  X 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function DashboardPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering & Search
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sorting
  const [sortBy, setSortBy] = useState("date"); 

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals & AI States
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [summary, setSummary] = useState(""); 
  const [showSummary, setShowSummary] = useState(false);
  const [summarizing, setSummarizing] = useState(false);

  const fetchFeedback = async () => {
    try {
      const token = localStorage.getItem("feedpulse_token");
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

  useEffect(() => {
    fetchFeedback();
  }, []);

  // Update Status
  const handleUpdateStatus = async (e: any, id: string, newStatus: string) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("feedpulse_token");
      await axios.patch(`http://127.0.0.1:4000/api/feedback/${id}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Status updated to ${newStatus}`);
      fetchFeedback(); 
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // AI Summary
  const handleGenerateSummary = async () => {
    setSummarizing(true);
    try {
      const token = localStorage.getItem("feedpulse_token");
      const response = await axios.get("http://127.0.0.1:4000/api/feedback/summary", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSummary(response.data.data.summary);
      setShowSummary(true);
    } catch (error) {
      toast.error("AI Summary generation failed");
    } finally {
      setSummarizing(false);
    }
  };

  const allTags = feedbacks.flatMap((f: any) => f.ai_tags || []);
  const tagCounts = allTags.reduce((acc: any, tag: string) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});
  const mostCommonTag = Object.keys(tagCounts).length 
    ? Object.keys(tagCounts).reduce((a, b) => tagCounts[a] > tagCounts[b] ? a : b) 
    : "N/A";

  const stats = {
    total: feedbacks.length,
    open: feedbacks.filter((f: any) => f.status === "New").length,
    avgPriority: feedbacks.length 
      ? (feedbacks.reduce((acc, curr: any) => acc + (curr.ai_priority || 0), 0) / feedbacks.length).toFixed(1) 
      : 0,
    hotTag: mostCommonTag
  };

  //  Logic for Sorting, Filtering & Search 
  const filteredData = feedbacks
    .filter((item: any) => {
      const matchCategory = categoryFilter === "All" || item.category === categoryFilter;
      const matchStatus = statusFilter === "All" || item.status === statusFilter;
      const searchLower = searchQuery.toLowerCase();
      return matchCategory && matchStatus && (
        item.title.toLowerCase().includes(searchLower) || 
        (item.ai_summary && item.ai_summary.toLowerCase().includes(searchLower))
      );
    })
    .sort((a: any, b: any) => {
      if (sortBy === "priority") return (b.ai_priority || 0) - (a.ai_priority || 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedFeedback = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Chart Data
  const chartData = [
    { name: 'New', value: feedbacks.filter((f: any) => f.status === 'New').length, color: '#6366f1' },
    { name: 'In Review', value: feedbacks.filter((f: any) => f.status === 'In Review').length, color: '#f59e0b' },
    { name: 'Resolved', value: feedbacks.filter((f: any) => f.status === 'Resolved').length, color: '#10b981' },
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen font-black text-blue-600 animate-pulse">
      SYNCING WITH GEMINI...
    </div>
  );

  const handleReanalyze = async (e: React.MouseEvent, id: string) => {
  e.stopPropagation();
  const toastId = toast.loading("Gemini is re-thinking...");
  try {
    const token = localStorage.getItem("feedpulse_token");
    await axios.post(`http://127.0.0.1:4000/api/feedback/${id}/analyze`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success("AI analysis updated!", { id: toastId });
    fetchFeedback();
  } catch (error) {
    toast.error("Re-analysis failed", { id: toastId });
  }
};

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Intelligence Dashboard</h1>
          <p className="text-slate-500 font-bold mt-1 italic">Decision-ready insights for product teams</p>
        </div>
        
        <button 
          onClick={handleGenerateSummary}
          disabled={summarizing}
          className="glass-light px-8 py-4 rounded-2xl flex items-center gap-2 font-black text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-xl disabled:opacity-50"
        >
          <Sparkles size={20} className={summarizing ? "animate-spin" : ""} />
          {summarizing ? "Analyzing Trends..." : "Generate Trend Report"}
        </button>
      </header>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Reports" value={stats.total} icon={<MessageCircle className="text-blue-500" />} />
        <StatCard label="Open Items" value={stats.open} icon={<AlertCircle className="text-amber-500" />} />
        <StatCard label="Avg Priority" value={`${stats.avgPriority}/10`} icon={<CheckCircle2 className="text-emerald-500" />} />
        <StatCard label="Common Tag" value={`#${stats.hotTag}`} icon={<Tag className="text-indigo-500" />} />
      </div>

      {/* AI Trends Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-light p-8 rounded-[2.5rem] border border-white/60">
          <div className="flex items-center gap-2 mb-6 text-blue-600">
            <Sparkles size={20} />
            <h3 className="font-black uppercase text-xs tracking-widest">Latest AI Summary</h3>
          </div>
          <div className="bg-white/60 p-6 rounded-3xl italic text-slate-800 font-medium border border-white min-h-[120px] flex items-center justify-center text-center">
            {summary ? `"${summary}"` : "Click 'Generate Trend Report' to see the executive analysis of your feedback."}
          </div>
        </div>

        <div className="glass-light p-8 rounded-[2.5rem] border border-white/60 h-[280px]">
          <h3 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Toolbar - Filters & Sorting */}
      <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-end">
        <div className="w-full xl:w-1/3 space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Keyword Search</p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search titles or AI summaries..."
              className="w-full pl-12 pr-4 py-3 bg-white/40 border border-white/60 rounded-2xl outline-none focus:ring-2 focus:ring-blue-400/50 text-slate-900 font-semibold shadow-sm"
              value={searchQuery}
              onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-end">
          <FilterGroup label="Category" active={categoryFilter} options={["All", "Bug", "Feature Request", "Improvement"]} onChange={setCategoryFilter} />
          <FilterGroup label="Status" active={statusFilter} options={["All", "New", "In Review", "Resolved"]} onChange={setStatusFilter} />
          
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sort By</p>
            <div className="flex gap-2 bg-white/40 p-1.5 rounded-2xl border border-white/60">
               <button onClick={() => setSortBy("date")} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${sortBy === "date" ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-white/60"}`}>Date</button>
               <button onClick={() => setSortBy("priority")} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${sortBy === "priority" ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-white/60"}`}>Priority</button>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="glass-light rounded-[2.5rem] overflow-hidden border border-white/80 p-4">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-slate-400 font-bold text-xs uppercase tracking-widest">
              <th className="px-6 py-4">User Feedback</th>
              <th className="px-6 py-4">AI Category</th>
              <th className="px-6 py-4">Sentiment</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Priority</th>
            </tr>
          </thead>
          <tbody>
            {paginatedFeedback.map((item: any) => (
              <motion.tr key={item._id} whileHover={{ scale: 1.005 }} onClick={() => setSelectedFeedback(item)} className="bg-white/40 hover:bg-white/70 transition-all cursor-pointer group">
                <td className="px-6 py-5 rounded-l-2xl max-w-md">
                  <div className="font-black text-slate-900 leading-tight mb-1 group-hover:text-blue-600">{item.title}</div>
                  <div className="text-sm text-slate-500 font-medium line-clamp-1 italic">{item.ai_summary || "Analysis in progress..."}</div>
                </td>
                <td className="px-6 py-5">
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-black">{item.category}</span>
                </td>
                <td className="px-6 py-5">
                   <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase ${
                     item.ai_sentiment === "Positive" ? "bg-emerald-100 text-emerald-700" :
                     item.ai_sentiment === "Negative" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                   }`}>
                     {item.ai_sentiment || "Analyzing"}
                   </span>
                </td>
                <td className="px-6 py-5">
                  <select value={item.status} onClick={(e) => e.stopPropagation()} onChange={(e) => handleUpdateStatus(e as any, item._id, e.target.value)}
                    className="bg-transparent font-bold text-slate-700 text-sm outline-none cursor-pointer hover:text-blue-600 transition-colors">
                    <option value="New">New</option>
                    <option value="In Review">In Review</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>
                <td className="px-6 py-5 rounded-r-2xl text-right">
  <div className="flex items-center justify-end gap-3">
    <button 
      onClick={(e) => handleReanalyze(e, item._id)}
      className="p-2 hover:bg-blue-50 rounded-lg text-blue-400 hover:text-blue-600 transition-colors"
      title="Re-run AI Analysis"
    >
      <Sparkles size={16} />
    </button>
    <span className="font-black text-slate-900 bg-white/80 border border-white px-3 py-2 rounded-xl text-xs">
      {item.ai_priority || 0}/10
    </span>
  </div>
</td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6 px-4">
            <p className="text-xs font-bold text-slate-400">Page {currentPage} of {totalPages}</p>
            <div className="flex gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 glass-light rounded-xl disabled:opacity-30"><ChevronLeft size={20}/></button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 glass-light rounded-xl disabled:opacity-30"><ChevronRight size={20}/></button>
            </div>
          </div>
        )}
      </div>

      {/* Modal - Single View */}
      <AnimatePresence>
        {selectedFeedback && (
          <ModalWrapper onClose={() => setSelectedFeedback(null)}>
            <div className="mb-8">
              <div className="flex gap-2 mb-4">
                <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase">{selectedFeedback.category}</span>
                <span className="bg-slate-100 text-slate-600 px-4 py-1 rounded-full text-[10px] font-black uppercase">{selectedFeedback.status}</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 leading-tight">{selectedFeedback.title}</h2>
              <p className="text-slate-500 font-bold mt-2 italic text-sm">Submitted on {new Date(selectedFeedback.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">User Description</h3>
                <div className="bg-white/50 p-6 rounded-3xl border border-white text-slate-700 font-medium text-sm leading-relaxed max-h-60 overflow-y-auto">
                  {selectedFeedback.description}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2"><Sparkles size={14}/> Gemini Insight</h3>
                <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 space-y-4">
                  <p className="text-slate-800 font-bold italic text-sm">"{selectedFeedback.ai_summary || "Analysis pending..."}"</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedFeedback.ai_tags?.map((tag: string) => <span key={tag} className="bg-white px-3 py-1 rounded-lg text-[9px] font-black text-slate-500">#{tag}</span>)}
                  </div>
                </div>
              </div>
            </div>
          </ModalWrapper>
        )}
      </AnimatePresence>

      {/* AI Summary Modal */}
      <AnimatePresence>
        {showSummary && (
          <ModalWrapper onClose={() => setShowSummary(false)}>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-blue-600 rounded-[1.5rem] text-white shadow-xl shadow-blue-200"><Sparkles size={32} /></div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">AI Intelligence Trend Report</h2>
            </div>
            <div className="bg-white/80 p-8 rounded-[2rem] border border-white text-slate-900 leading-relaxed font-bold italic text-lg shadow-inner">
              "{summary}"
            </div>
            <button onClick={() => setShowSummary(false)} className="mt-10 w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-black transition-all">Dismiss</button>
          </ModalWrapper>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModalWrapper({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/10 backdrop-blur-md" />
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="glass-light max-w-4xl w-full p-12 rounded-[3.5rem] shadow-2xl relative z-10 border border-white/80">
        <button onClick={onClose} className="absolute top-10 right-10 text-slate-400 hover:text-slate-900"><X size={24}/></button>
        {children}
      </motion.div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="glass-light p-8 rounded-[2.5rem] flex flex-col gap-3 group hover:border-blue-200 transition-all border border-white/60 shadow-sm">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        <div className="p-2 bg-white/60 rounded-xl">{icon}</div>
      </div>
      <span className="text-4xl font-black text-slate-900 tracking-tighter">{value}</span>
    </div>
  );
}

function FilterGroup({ label, active, options, onChange }: any) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</p>
      <div className="flex gap-2 bg-white/40 p-1.5 rounded-2xl border border-white/60">
        {options.map((opt: string) => (
          <button key={opt} onClick={() => onChange(opt)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${active === opt ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-white/60"}`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function Tag({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/>
    </svg>
  );
}