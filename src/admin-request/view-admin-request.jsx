import { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

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

const formatIssue = (request) => {
  const issue = request?.aiAnalysis?.issueType || request?.message || "other";

  return issue
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export default function RefundRequestModal({
  selectedRequest,
  onClose,
  onUpdated,
}) {
  const [updating, setUpdating] = useState(false);

  if (!selectedRequest) return null;

  const status = selectedRequest.status?.toLowerCase() || "processing";

  const requestId = selectedRequest._id || selectedRequest.id || "—";

  const customerName =
    selectedRequest.customer?.name ||
    selectedRequest.customerId?.name ||
    selectedRequest.customerName ||
    "Unknown customer";

  const customerEmail =
    selectedRequest.customer?.email ||
    selectedRequest.customerId?.email ||
    selectedRequest.customerEmail ||
    "—";

  const order = selectedRequest.order || selectedRequest.orderId || {};

  const orderNumber =
    order?.orderNumber ||
    selectedRequest.orderNumber ||
    selectedRequest.orderId ||
    "—";

  const orderStatus = order?.status || selectedRequest.orderStatus || "—";

  const orderDate = order?.orderedAt || selectedRequest.orderDate || null;

  const items = order?.items || selectedRequest.items || [];

  const policy = selectedRequest.policyResult || {};
  const aiAnalysis = selectedRequest.aiAnalysis || {};

  const policyReasons = policy.reasons || [];

  const customerSince =
    selectedRequest.customerSince ||
    selectedRequest.customer?.createdAt ||
    selectedRequest.customerId?.createdAt;

  const previousRequests = selectedRequest.previousRequests ?? "—";

  const suspicious =
    aiAnalysis.suspicious ||
    aiAnalysis.promptInjectionDetected ||
    policy.rules?.suspicious;

  const policyStatus = policy.escalate
    ? "Escalated"
    : policy.requiresReview
      ? "Requires Review"
      : policy.eligible
        ? "Eligible"
        : "Not Eligible";

  const updateStatus = async (nextStatus) => {
    try {
      setUpdating(true);

      const response = await axios.post(
        "https://ai-refund-backend.onrender.com/api/v1/request/update",
        {
          requestId,
          status: nextStatus,
        },
      );

      const updatedRequest =
        response.data?.data || response.data?.request || response.data;

      onUpdated?.(updatedRequest);
      onClose?.();
    } catch (error) {
      console.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update refund request",
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm p-4 md:p-6 lg:p-8 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 15 }}
          transition={{ duration: 0.2 }}
          onClick={(event) => event.stopPropagation()}
          className="w-full max-w-7xl max-h-[92vh] bg-slate-50 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="bg-white px-6 py-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h2 className="text-xl md:text-2xl font-black text-slate-900">
                  Refund Request #{requestId}
                </h2>

                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
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
                            ? "bg-amber-600"
                            : "bg-indigo-600"
                    }`}
                  />

                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>

              <p className="text-xs text-slate-500 font-medium">
                Created on {formatDate(selectedRequest.createdAt)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {status === "escalated" && (
                <>
                  <button
                    disabled={updating}
                    onClick={() => updateStatus("approve")}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-4 py-2.5 rounded-xl shadow-md text-xs transition-all flex items-center gap-2"
                  >
                    {updating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    Approve Refund
                  </button>

                  <button
                    disabled={updating}
                    onClick={() => updateStatus("deny")}
                    className="bg-rose-600 hover:bg-rose-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-4 py-2.5 rounded-xl shadow-md text-xs transition-all flex items-center gap-2"
                  >
                    {updating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                    Deny Refund
                  </button>
                </>
              )}

              <button
                onClick={onClose}
                disabled={updating}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all disabled:opacity-60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="max-w-6xl mx-auto space-y-6">
              {suspicious && (
                <div className="bg-amber-50 border border-amber-200 p-5 rounded-3xl flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-md">
                    ⚠
                  </div>

                  <div>
                    <h4 className="font-bold text-amber-900 text-sm mb-1">
                      Suspicious Request / Prompt Injection Attempt
                    </h4>

                    <p className="text-xs text-amber-800 leading-relaxed">
                      The customer message contains signals that require human
                      review. Policy evaluation remains independent of the
                      customer message and AI output.
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Customer Request
                    </h3>

                    <blockquote className="text-slate-800 font-medium text-base bg-slate-50 p-4 rounded-2xl border border-slate-100 italic">
                      "{selectedRequest.message || "No message provided."}"
                    </blockquote>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Policy Evaluation
                      </h3>

                      <span
                        className={`text-xs font-extrabold px-2.5 py-1 rounded-lg ${
                          policyStatus === "Eligible"
                            ? "bg-emerald-50 text-emerald-700"
                            : policyStatus === "Escalated" ||
                                policyStatus === "Requires Review"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {policyStatus}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {policyReasons.length > 0 ? (
                        policyReasons.map((reason, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 text-sm font-medium text-slate-700"
                          >
                            <span className="w-5 h-5 mt-0.5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                              ✓
                            </span>

                            <span>{reason}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">
                          No policy evaluation details available.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        AI Analysis & Decision Support
                      </h3>

                      {aiAnalysis.confidence !== undefined && (
                        <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-lg">
                          Confidence:{" "}
                          {Math.round(Number(aiAnalysis.confidence) * 100)}%
                        </span>
                      )}
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <span className="text-xs font-bold text-slate-400 block mb-1">
                          Issue Classification
                        </span>

                        <span className="font-bold text-slate-800">
                          {formatIssue(selectedRequest)}
                        </span>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <span className="text-xs font-bold text-slate-400 block mb-1">
                          Analysis
                        </span>

                        <p className="text-slate-700 leading-relaxed">
                          {aiAnalysis.reasoning ||
                            aiAnalysis.summary ||
                            "No AI reasoning available."}
                        </p>
                      </div>

                      {aiAnalysis.customerResponse && (
                        <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                          <span className="text-xs font-bold text-indigo-500 block mb-1">
                            Customer Response
                          </span>

                          <p className="text-indigo-900 leading-relaxed">
                            {aiAnalysis.customerResponse}
                          </p>
                        </div>
                      )}

                      <p className="text-[11px] text-slate-400 italic">
                        AI analysis is decision support and does not override
                        deterministic refund policy rules.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                      Customer Information
                    </h3>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-lg">
                        {customerName.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 text-base truncate">
                          {customerName}
                        </h4>

                        <span className="text-xs text-slate-500 break-all">
                          {customerEmail}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-medium text-slate-600">
                      <div className="flex justify-between py-1 gap-4">
                        <span className="text-slate-400">Customer since</span>

                        <span className="font-bold text-slate-800">
                          {formatDate(customerSince)}
                        </span>
                      </div>

                      <div className="flex justify-between py-1 gap-4">
                        <span className="text-slate-400">
                          Previous refund requests
                        </span>

                        <span className="font-bold text-slate-800">
                          {previousRequests}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                      Order Information
                    </h3>

                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-center pb-3 border-b border-slate-100 gap-3">
                        <span className="font-bold text-slate-800 text-sm">
                          #{orderNumber}
                        </span>

                        <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold">
                          {orderStatus}
                        </span>
                      </div>

                      <div className="flex justify-between text-slate-500">
                        <span>Order Date</span>

                        <span className="font-semibold text-slate-700">
                          {formatDate(orderDate)}
                        </span>
                      </div>

                      {items.length > 0 && (
                        <div className="pt-2">
                          <span className="text-[11px] font-bold text-slate-400 block mb-2 uppercase">
                            Items
                          </span>

                          <div className="space-y-2">
                            {items.map((item, index) => (
                              <div
                                key={item._id || item.id || index}
                                className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100 gap-3"
                              >
                                <div>
                                  <span className="font-bold text-slate-800 block">
                                    {item.productName || item.name}
                                  </span>

                                  {item.quantity && (
                                    <span className="text-xs text-slate-400">
                                      Qty: {item.quantity}
                                    </span>
                                  )}
                                </div>

                                <span className="font-extrabold text-slate-900 whitespace-nowrap">
                                  {formatAmount(
                                    Number(item.price || 0) *
                                      Number(item.quantity || 1),
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Final Decision
                    </h3>

                    <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
                      <span className="text-xs font-bold text-slate-400 block mb-1">
                        Decision Status
                      </span>

                      <span
                        className={`text-xl font-black ${
                          status === "approved"
                            ? "text-emerald-600"
                            : status === "denied"
                              ? "text-rose-600"
                              : "text-amber-600"
                        }`}
                      >
                        {status.toUpperCase()}
                      </span>

                      <span className="text-2xl font-extrabold text-slate-900 block mt-2">
                        {formatAmount(selectedRequest.amount)}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 space-y-2">
                      <p>
                        <strong className="text-slate-700">Source:</strong>{" "}
                        {selectedRequest.decisionSource ||
                          (status === "escalated"
                            ? "Requires human review"
                            : "Policy Engine")}
                      </p>

                      <p>
                        <strong className="text-slate-700">Reason:</strong>{" "}
                        {policyReasons.join(" ") ||
                          aiAnalysis.reasoning ||
                          "No reason provided."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
