import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../layout/app-layout";
import { motion } from "framer-motion";
import axios from "axios";
import RefundResultModal from "./view-request";

const PAGE_SIZE = 10;

const formatStatus = (status) => {
  if (!status) return "Processing";

  return status.charAt(0).toUpperCase() + status.slice(1);
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function RequestList() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const res = await axios.get("http://localhost:8080/api/v1/request");

        setRequests(res.data.data || res.data || []);
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message ||
            "Unable to load your refund requests.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const totalPages = Math.ceil(requests.length / PAGE_SIZE);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedRequests = requests.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
  };

  return (
    <AppLayout>
      {selectedRequest && (
        <RefundResultModal
          onClose={() => setSelectedRequest(null)}
          selectedRequest={selectedRequest}
        />
      )}

      <motion.div
        key="history"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-4xl mx-auto my-6"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">
              My Refund Requests
            </h2>

            <p className="text-sm text-slate-500">
              Track and review the status of all your submitted refund claims.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/request-refund")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-100 text-sm"
          >
            Request a Refund
          </motion.button>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
            {errorMessage}
          </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Request ID</th>
                  <th className="py-4 px-6">Order</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      <td className="py-5 px-6">
                        <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
                      </td>
                      <td className="py-5 px-6">
                        <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
                      </td>
                      <td className="py-5 px-6">
                        <div className="h-4 w-16 bg-slate-100 rounded animate-pulse" />
                      </td>
                      <td className="py-5 px-6">
                        <div className="h-6 w-20 bg-slate-100 rounded-full animate-pulse" />
                      </td>
                      <td className="py-5 px-6">
                        <div className="h-4 w-20 bg-slate-100 rounded animate-pulse" />
                      </td>
                      <td className="py-5 px-6">
                        <div className="h-7 w-24 bg-slate-100 rounded-lg ml-auto animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : paginatedRequests.length > 0 ? (
                  paginatedRequests.map((req) => {
                    const status = formatStatus(req.status);
                    const statusKey = req.status?.toLowerCase();

                    return (
                      <tr
                        key={req._id || req.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-4 px-6 font-semibold text-slate-900">
                          {req._id || req.id}
                        </td>

                        <td className="py-4 px-6 font-medium text-slate-700">
                          {req.orderId?.orderNumber || "—"}
                        </td>

                        <td className="py-4 px-6 font-bold text-slate-900">
                          ${Number(req.amount || 0).toFixed(2)}
                        </td>

                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                              statusKey === "approved"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : statusKey === "denied"
                                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                                  : statusKey === "escalated"
                                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                                    : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                statusKey === "approved"
                                  ? "bg-emerald-600"
                                  : statusKey === "denied"
                                    ? "bg-rose-600"
                                    : statusKey === "escalated"
                                      ? "bg-amber-600"
                                      : "bg-indigo-600 animate-pulse"
                              }`}
                            />

                            {status}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-slate-500">
                          {formatDate(req.createdAt)}
                        </td>

                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setSelectedRequest(req)}
                            className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-all"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="py-16 px-6 text-center">
                      <div className="text-slate-400 mb-2">
                        No refund requests found.
                      </div>

                      <button
                        onClick={() => navigate("/request-refund")}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold"
                      >
                        Submit your first request
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {!loading && requests.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-700">
                  {startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-slate-700">
                  {Math.min(startIndex + PAGE_SIZE, requests.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700">
                  {requests.length}
                </span>{" "}
                requests
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, index) => index + 1)
                    .slice(
                      Math.max(0, currentPage - 3),
                      Math.min(totalPages, currentPage + 2),
                    )
                    .map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                          currentPage === page
                            ? "bg-indigo-600 text-white"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AppLayout>
  );
}
