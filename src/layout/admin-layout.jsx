import { Bell, Search } from "lucide-react";
import Sidebar from "./sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased flex flex-row selection:bg-indigo-600 selection:text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                Overview
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Monitor, audit, and resolve customer refund claims.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search refunds, order #, email..."
                //   value={searchQuery}
                //   onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
            </div>
            <button
              onClick={() => {}}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600"></span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
