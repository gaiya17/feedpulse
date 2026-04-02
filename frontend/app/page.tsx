"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Send, MessageSquare, User, Tag } from "lucide-react";
import { motion } from "framer-motion";

export default function FeedbackPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Bug",
    submitterName: "",
    submitterEmail: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.title.trim().length === 0) return toast.error("Title is required");
    if (formData.description.length < 20) return toast.error("Description must be at least 20 characters");

    setLoading(true);
    try {

      await axios.post("http://127.0.0.1:4000/api/feedback", formData);
      
      toast.success("Feedback submitted! Our AI is analyzing it now.");
      setFormData({ title: "", description: "", category: "Bug", submitterName: "", submitterEmail: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center p-6 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white/40 backdrop-blur-lg border border-white/60 shadow-xl rounded-[2.5rem] p-8 md:p-12"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">FeedPulse Submission</h1>
          <p className="text-slate-600 mt-3 font-medium">Help us improve by reporting bugs or suggesting features.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
                <Tag className="w-4 h-4 text-blue-500" /> Category
              </label>
              <select 
                className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none transition-all cursor-pointer text-slate-900 font-semibold"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Bug">Bug</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Improvement">Improvement</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
                <User className="w-4 h-4 text-blue-500" /> Name (Optional)
              </label>
              <input 
                type="text" 
                placeholder="Your Name"
                className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                value={formData.submitterName}
                onChange={(e) => setFormData({...formData, submitterName: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Title</label>
            <input 
              type="text" 
              placeholder="Give your feedback a clear title"
              className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="space-y-2 relative">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
              <MessageSquare className="w-4 h-4 text-blue-500" /> Description
            </label>
            <textarea 
              rows={4}
              placeholder="Describe the issue or feature request in detail..."
              className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none transition-all resize-none text-slate-900 placeholder:text-slate-400 font-medium"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
            <div className={`absolute bottom-3 right-4 text-xs font-bold ${formData.description.length < 20 ? 'text-rose-500' : 'text-emerald-600'}`}>
              {formData.description.length} characters
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-black py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 text-lg"
          >
            {loading ? "Processing..." : <><Send className="w-5 h-5" /> Submit Feedback</>}
          </button>
        </form>
      </motion.div>
    </main>
  );
}