import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import axios from "axios";
import AdminLayout from "../layout/admin-layout";
import RefundRequestModal from "../admin-request/view-admin-request";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080";

const statusMap = {
  approved: "Approved",
  denied: "Denied",
  escalated: "Escalated",
  processing: "Processing",
};

const formatAmount = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount || 0));

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "-";

const getIssue = (request) => {
  const category = request.aiAnalysis?.classification || request.category;

  if (!category) return "Other";

  return category
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const getCustomerName = (customer) => {
  if (!customer) return "Unknown customer";

  if (customer.name) return customer.name;

  return (
    [customer.firstName, customer.lastName].filter(Boolean).join(" ") ||
    "Unknown customer"
  );
};

export default function Support() {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    denied: 0,
    escalated: 0,
  });
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchOverview = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await axios.get(`${API_URL}/api/v1/request/overview`);

      const result = response.data;

      setStats({
        total: result.data?.stats?.total || 0,
        approved: result.data?.stats?.approved || 0,
        denied: result.data?.stats?.denied || 0,
        escalated: result.data?.stats?.escalated || 0,
      });

      setRequests(result.data?.recentRequests || []);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load refund overview",
        );
      } else {
        setError("Failed to load refund overview");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const renderStatus = (status) => {
    const normalizedStatus = status?.toLowerCase();
    const label = statusMap[normalizedStatus] || status || "Processing";

    const styles = {
      approved: {
        wrapper: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        dot: "bg-emerald-600",
      },
      denied: {
        wrapper: "bg-rose-50 text-rose-700 border border-rose-200",
        dot: "bg-rose-600",
      },
      escalated: {
        wrapper: "bg-amber-50 text-amber-700 border border-amber-200",
        dot: "bg-amber-600 animate-pulse",
      },
      processing: {
        wrapper: "bg-blue-50 text-blue-700 border border-blue-200",
        dot: "bg-blue-600 animate-pulse",
      },
    };

    const style = styles[normalizedStatus] || styles.processing;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style.wrapper}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
        {label}
      </span>
    );
  };

  return (
    <AdminLayout>
      {selected && (
        <RefundRequestModal
          selectedRequest={selected}
          onClose={() => setSelected(null)}
          onUpdated={setRequests}
        />
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key="overview"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="space-y-8 max-w-6xl mx-auto"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900">
                Refund Operations
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Monitor and resolve customer refund requests.
              </p>
            </div>

            <button
              onClick={() => fetchOverview(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl px-5 py-4 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-300 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total Requests
                </span>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  📋
                </div>
              </div>

              <div className="text-3xl font-black text-slate-900 mb-1">
                {loading ? "—" : stats.total}
              </div>

              <p className="text-xs text-slate-500 font-medium">
                All customer submissions
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm cursor-pointer hover:border-emerald-300 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Approved
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  ✓
                </div>
              </div>

              <div className="text-3xl font-black text-emerald-600 mb-1">
                {loading ? "—" : stats.approved}
              </div>

              <p className="text-xs text-slate-500 font-medium">
                Processed automatically or manually
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm cursor-pointer hover:border-amber-300 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Escalated
                </span>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  ⚠
                </div>
              </div>

              <div className="text-3xl font-black text-amber-600 mb-1">
                {loading ? "—" : stats.escalated}
              </div>

              <p className="text-xs text-slate-500 font-medium">
                Requires agent review
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm cursor-pointer hover:border-rose-300 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Denied
                </span>
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  ✕
                </div>
              </div>

              <div className="text-3xl font-black text-rose-600 mb-1">
                {loading ? "—" : stats.denied}
              </div>

              <p className="text-xs text-slate-500 font-medium">
                Policy violation or rejection
              </p>
            </motion.div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Recent Refund Requests
                </h3>
                <p className="text-xs text-slate-500">
                  Your 10 most recent customer refund requests.
                </p>
              </div>

              <button
                onClick={() => navigate("/request-list")}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-all"
              >
                View All Requests
              </button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-14 bg-slate-100 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : requests.length === 0 ? (
              <div className="py-16 text-center">
                <div className="text-3xl mb-3">📋</div>
                <h4 className="font-bold text-slate-900">
                  No refund requests yet
                </h4>
                <p className="text-sm text-slate-500 mt-1">
                  Refund requests will appear here when customers submit them.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-4 px-6">Customer</th>
                      <th className="py-4 px-6">Order</th>
                      <th className="py-4 px-6">Amount</th>
                      <th className="py-4 px-6">Issue</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 text-sm">
                    {requests.slice(0, 10).map((request) => {
                      const customer = request.customerId;
                      const order = request.orderId;

                      return (
                        <tr
                          key={request._id}
                          className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                        >
                          <td className="py-4 px-6">
                            <div className="font-semibold text-slate-900">
                              {getCustomerName(customer)}
                            </div>
                            {customer?.email && (
                              <div className="text-xs text-slate-400 mt-0.5">
                                {customer.email}
                              </div>
                            )}
                          </td>

                          <td className="py-4 px-6 font-medium text-slate-700">
                            {order?.orderNumber || order?._id || "-"}
                          </td>

                          <td className="py-4 px-6 font-bold text-slate-900">
                            {formatAmount(request.amount)}
                          </td>

                          <td className="py-4 px-6 text-slate-600">
                            {getIssue(request)}
                          </td>

                          <td className="py-4 px-6">
                            {renderStatus(request.status)}
                          </td>

                          <td className="py-4 px-6 text-right">
                            <span
                              onClick={() => setSelected(request)}
                              className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-all"
                            >
                              Inspect
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </AdminLayout>
  );
}
