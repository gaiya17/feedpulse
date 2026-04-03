"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Sparkles, Activity, ShieldCheck, ArrowLeft } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentMsg, setCurrentMsg] = useState(0);
  const router = useRouter();

  const messages = [
    { title: "AI-Powered Analysis", desc: "Automated categorization and sentiment detection using Gemini 3.", icon: <Sparkles className="w-8 h-8" /> },
    { title: "Strategic Roadmap", desc: "Identify high-impact blockers across your entire product.", icon: <Activity className="w-8 h-8" /> },
    { title: "Secure Insights", desc: "Manage user requests with a protected admin ecosystem.", icon: <ShieldCheck className="w-8 h-8" /> }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentMsg(prev => (prev + 1) % messages.length), 5000);
    return () => clearInterval(timer);
  }, [messages.length]);

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const rawApiUrl = process.env.NEXT_PUBLIC_API_URL;
    const API_URL = rawApiUrl && rawApiUrl !== "undefined" ? rawApiUrl : "http://localhost:4000/api";
    const response = await axios.post(`${API_URL}/auth/login`, { 
      email: email.trim(), 
      password: password.trim() 
    });
    
    if (response.data.success) {
      localStorage.setItem("feedpulse_token", response.data.token);
      toast.success("Welcome back, Admin!");
      router.push("/dashboard");
    }
  } catch (error: any) {
    
    console.error("Login Error Details:", error.response);
    
    const message = error.response?.data?.message || "Server connection failed";
    toast.error(message); 
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* LEFT SIDE: Animated Branding */}
      <div className="hidden lg:flex lg:w-[60%] relative bg-gradient-to-br from-blue-50 to-indigo-100 items-center justify-center p-20 border-r border-white/40">
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200">
              <Activity className="text-white w-7 h-7" />
            </div>
            <span className="text-3xl font-black text-slate-800 tracking-tighter">FeedPulse</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentMsg}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-blue-600 mb-6 bg-white/60 w-fit p-4 rounded-2xl shadow-sm border border-white">
                {messages[currentMsg].icon}
              </div>
              <h1 className="text-5xl font-black text-slate-900 leading-[1.1] mb-6">{messages[currentMsg].title}</h1>
              <p className="text-xl text-slate-600 leading-relaxed font-semibold">{messages[currentMsg].desc}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT SIDE: The Portal Form */}
      <div className="w-full lg:w-[40%] flex items-center justify-center p-8 bg-white/10 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white/50 backdrop-blur-xl border border-white/80 shadow-2xl rounded-[2.5rem] p-10 md:p-14"
        >
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Admin Portal</h2>
            <p className="text-slate-600 mt-2 font-bold italic">Secure Access Required</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 ml-1">Email</label>
              <input 
                type="email" 
                required
                className="w-full px-5 py-4 bg-white/70 border border-white outline-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all text-slate-900 font-semibold"
                placeholder="admin@feedpulse.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 ml-1">Password</label>
              <input 
                type="password" 
                required
                className="w-full px-5 py-4 bg-white/70 border border-white outline-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all text-slate-900 font-semibold"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 text-lg active:scale-95"
            >
              {loading ? "Authenticating..." : <><LogIn className="w-5 h-5" /> Sign In</>}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/50 text-center">
             <Link href="/" className="text-sm font-bold text-slate-500 hover:text-blue-600 flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Return to Public Page
             </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}