"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Sparkles, 
  Settings, 
  LogOut, 
  Activity 
} from "lucide-react";
import { motion } from "framer-motion";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

const navItems = [
  { name: "Overview", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
];

  const handleLogout = () => {
    localStorage.removeItem("feedpulse_token"); 
    router.push("/login");
  };

  return (
    <aside className="w-72 h-screen p-6 fixed left-0 top-0 hidden lg:flex flex-col">
      <div className="glass-light h-full rounded-[2.5rem] flex flex-col p-8 border border-white/80">
        {/* Branding */}
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Activity className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-black text-slate-800 tracking-tighter">FeedPulse</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-3">
          {navItems.map((item) => (
            <Link key={item.name} href={item.path}>
              <motion.div
                whileHover={{ x: 5 }}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 font-bold ${
                  pathname === item.path 
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-100" 
                    : "text-slate-500 hover:bg-white/50 hover:text-blue-600"
                }`}
              >
                {item.icon}
                {item.name}
              </motion.div>
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-white/40 space-y-3">
          <button className="flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-500 hover:bg-white/50 hover:text-blue-600 transition-all font-bold w-full">
            <Settings size={20} /> Settings
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all font-bold w-full"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;