import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "../layout/app-layout";
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <AnimatePresence mode="wait">
        <motion.div
          key="home"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="text-center py-16 px-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            Instant AI-Powered Resolution
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-2xl mx-auto leading-tight">
            Hassle-free refunds, powered by intelligence.
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-xl mx-auto">
            Submit your refund request in seconds. Our automated system checks
            order eligibility and policy guidelines instantly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/request-refund")}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-xl shadow-indigo-200 text-base transition-all"
            >
              Start a Refund Request
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/requests")}
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 font-semibold px-8 py-4 rounded-2xl border border-slate-200 shadow-sm transition-all text-base"
            >
              View My Requests
            </motion.button>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4">
                ✓
              </div>
              <h3 className="font-bold text-slate-900 mb-1">
                Instant Approvals
              </h3>
              <p className="text-sm text-slate-500">
                Qualifying orders under policy guidelines are approved instantly
                without delay.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-4">
                ⚡
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Smart Analysis</h3>
              <p className="text-sm text-slate-500">
                AI context understanding ensures your specific issue is
                accurately evaluated against rules.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold mb-4">
                🛡️
              </div>
              <h3 className="font-bold text-slate-900 mb-1">
                Secure & Trusted
              </h3>
              <p className="text-sm text-slate-500">
                Your information is used strictly and securely for processing
                your refund claim.
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </AppLayout>
  );
}
