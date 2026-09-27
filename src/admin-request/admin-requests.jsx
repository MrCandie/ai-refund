import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AdminLayout from "../layout/admin-layout";
import RefundRequestModal from "./view-admin-request";

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatAmount = (amount) => {
  return `$${Number(amount || 0).toFixed(2)}`;
};

const formatIssue = (req) => {
  const issueType = req.message;

  if (issueType) {
    return issueType
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  if (req.category) {
    return req.category
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  return "Other";
};

const formatStatus = (status) => {
  if (!status) return "Processing";

  return status.charAt(0).toUpperCase() + status.slice(1);
};

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const res = await axios.get("http://localhost:8080/api/v1/request");

        setRequests(res.data.data || res.data.requests || res.data || []);
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message || "Unable to load refund requests.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();

    return requests.filter((req) => {
      const status = req.status?.toLowerCase() || "";

      const orderNumber =
        req.order?.orderNumber || req.orderNumber || req.orderId || "";

      const customerName = req.customer?.name || req.customerId?.name || "";

      const customerEmail = req.customer?.email || req.customerId?.email || "";

      const requestId = req._id || req.id || "";

      const matchesStatus = statusFilter === "all" || status === statusFilter;

      const matchesSearch =
        !search ||
        requestId.toLowerCase().includes(search) ||
        String(orderNumber)?.toLowerCase().includes(search) ||
        customerName?.toLowerCase().includes(search) ||
        customerEmail?.toLowerCase().includes(search);

      return matchesStatus && matchesSearch;
    });
  }, [requests, statusFilter, searchQuery]);

  const handleReview = (request) => {
    setSelected(request);
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
      <motion.div
        key="requests"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Refund Requests
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Review and manage customer refund requests.
              </p>
            </div>

            <div className="relative w-full lg:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search request, order or customer..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
              />
            </div>
          </div>

          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
                Status:
              </span>

              {["all", "approved", "escalated", "denied", "processing"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      statusFilter === status
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-sm text-rose-700">
            {errorMessage}
          </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Request ID</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Order</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Issue</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <tr key={index}>
                      {Array.from({ length: 8 }).map((_, cellIndex) => (
                        <td key={cellIndex} className="py-5 px-6">
                          <div
                            className={`h-4 bg-slate-100 rounded animate-pulse ${
                              cellIndex === 1
                                ? "w-28"
                                : cellIndex === 7
                                  ? "w-16 ml-auto"
                                  : "w-20"
                            }`}
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filteredRequests.length > 0 ? (
                  filteredRequests.map((req) => {
                    const requestId = req._id || req.id;
                    const status = req.status?.toLowerCase() || "processing";
                    const customerName =
                      req.customer?.name ||
                      req.customerId?.name ||
                      "Unknown customer";

                    const orderNumber =
                      req.order?.orderNumber ||
                      req.orderNumber ||
                      req.orderId?.orderNumber ||
                      "—";

                    const issue = formatIssue(req);

                    return (
                      <tr
                        key={requestId}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-4 px-6 font-semibold text-slate-900">
                          <span className="block max-w-28 truncate">
                            {requestId}
                          </span>
                        </td>

                        <td className="py-4 px-6">
                          <div>
                            <p className="font-medium text-slate-800">
                              {customerName}
                            </p>

                            <p className="text-xs text-slate-400 mt-0.5">
                              {req.customer?.email ||
                                req.customerId?.email ||
                                "—"}
                            </p>
                          </div>
                        </td>

                        <td className="py-4 px-6 font-medium text-slate-600">
                          {orderNumber}
                        </td>

                        <td className="py-4 px-6 font-bold text-slate-900">
                          {formatAmount(req.amount)}
                        </td>

                        <td className="py-4 px-6 text-slate-600">{issue}</td>

                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                              status === "approved"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : status === "denied"
                                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                                  : status === "escalated"
                                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                                    : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                status === "approved"
                                  ? "bg-emerald-600"
                                  : status === "denied"
                                    ? "bg-rose-600"
                                    : status === "escalated"
                                      ? "bg-amber-600 animate-pulse"
                                      : "bg-indigo-600 animate-pulse"
                              }`}
                            />

                            {formatStatus(status)}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-slate-500 text-xs">
                          {formatDate(req.createdAt)}
                        </td>

                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleReview(req)}
                            className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-all"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-12 text-slate-400 font-medium text-sm"
                    >
                      No refund requests found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
