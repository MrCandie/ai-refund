import {
  AlertTriangle,
  FileText,
  Inbox,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex sticky top-0 h-screen z-20">
      <div>
        <div className="h-20 px-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-100">
            R
          </div>

          <div>
            <span className="font-bold text-base tracking-tight text-slate-900 block">
              RefundAI
            </span>

            <span className="text-xs text-slate-400 font-medium">
              Support Operations
            </span>
          </div>
        </div>
        <nav className="p-4 space-y-1.5 text-sm font-medium">
          <button
            onClick={() => navigate("/admin")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive("/admin")
                ? "bg-indigo-50 text-indigo-700 font-semibold shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => navigate("/request-list")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive("/request-list")
                ? "bg-indigo-50 text-indigo-700 font-semibold shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Refund Requests</span>
          </button>
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow">
            AM
          </div>

          <div className="overflow-hidden flex-1">
            <span className="font-bold text-slate-800 text-xs truncate block">
              Alex Morgan
            </span>

            <span className="text-slate-400 text-[11px] truncate block">
              agent@example.com
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
