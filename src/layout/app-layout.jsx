import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function AppLayout({ children }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
              R
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-indigo-950 bg-clip-text text-transparent">
              RefundAI
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button
              onClick={() => navigate("/requests")}
              className="hover:text-indigo-600 transition-colors"
            >
              My Requests
            </button>
          </nav>

          <div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/request-refund")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-indigo-200 transition-all text-sm flex items-center gap-2"
            >
              <span>Request a Refund</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full">
        {children}
      </main>
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 RefundAI Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button className="hover:text-slate-900">Privacy Policy</button>
            <button className="hover:text-slate-900">Terms of Service</button>
            <button className="hover:text-slate-900">Support API</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
