import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const RefundResultModal = ({ selectedRequest, onClose }) => {
  const navigate = useNavigate();

  const status = selectedRequest?.status?.toLowerCase();

  const statusConfig = {
    approved: {
      title: "Refund Approved",
      description: "Your refund request has been approved successfully.",
      icon: "✓",
      header: "bg-gradient-to-br from-emerald-500 to-teal-600",
      iconBg: "bg-white/20",
    },
    denied: {
      title: "Refund Declined",
      description: "We couldn't approve this refund request.",
      icon: "!",
      header: "bg-gradient-to-br from-rose-500 to-pink-600",
      iconBg: "bg-white/20",
    },
    escalated: {
      title: "Review Required",
      description:
        "Your request has been sent to our support team for further review.",
      icon: "◐",
      header: "bg-gradient-to-br from-amber-500 to-orange-600",
      iconBg: "bg-white/20",
    },
    processing: {
      title: "Request Processing",
      description: "Your refund request is currently being reviewed.",
      icon: "◌",
      header: "bg-gradient-to-br from-indigo-500 to-blue-600",
      iconBg: "bg-white/20",
    },
  };

  const config = statusConfig[status] || statusConfig.processing;

  const policyResult = selectedRequest?.policyResult || {};
  const aiAnalysis = selectedRequest?.aiAnalysis || {};

  const reasons = policyResult.reasons || [];

  console.log(selectedRequest);

  const orderNumber =
    selectedRequest?.orderNumber || selectedRequest?.orderId?.orderNumber;

  const requestId = selectedRequest?._id || selectedRequest?.id;

  const amount = Number(selectedRequest?.amount || 0);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        key="result"
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className={`p-8 text-center text-white ${config.header}`}>
          <div className="flex justify-end -mt-2 -mr-2">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center text-lg"
            >
              ×
            </button>
          </div>

          <div
            className={`w-16 h-16 rounded-2xl ${config.iconBg} backdrop-blur-md mx-auto flex items-center justify-center text-3xl font-bold mb-4 shadow-inner`}
          >
            {config.icon}
          </div>

          <h2 className="text-2xl font-bold mb-1">{config.title}</h2>

          <p className="text-white/80 text-sm max-w-xs mx-auto">
            {config.description}
          </p>

          {status === "approved" && (
            <div className="mt-6 text-4xl font-extrabold tracking-tight">
              ${amount.toFixed(2)}
            </div>
          )}
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-1">
                Order number
              </span>
              <span className="font-bold text-slate-800 text-base">
                {orderNumber || "—"}
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold text-slate-400 block mb-1">
                Request ID
              </span>
              <span className="font-bold text-slate-800 text-base break-all">
                {requestId || "—"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <span className="text-xs font-semibold text-slate-400 block mb-1">
                Status
              </span>
              <span
                className={`text-sm font-bold capitalize ${
                  status === "approved"
                    ? "text-emerald-600"
                    : status === "denied"
                      ? "text-rose-600"
                      : status === "escalated"
                        ? "text-amber-600"
                        : "text-indigo-600"
                }`}
              >
                {status}
              </span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <span className="text-xs font-semibold text-slate-400 block mb-1">
                Refund amount
              </span>
              <span className="text-sm font-bold text-slate-800">
                ${amount.toFixed(2)}
              </span>
            </div>
          </div>

          {selectedRequest?.message && (
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-2">
                Your request
              </span>

              <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100 font-medium">
                {selectedRequest.message}
              </p>
            </div>
          )}

          {selectedRequest?.reason && !selectedRequest?.message && (
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-2">
                Reason
              </span>

              <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100 font-medium">
                {selectedRequest.reason}
              </p>
            </div>
          )}

          {aiAnalysis?.customerResponse && (
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-2">
                Assessment
              </span>

              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl">
                <p className="text-sm text-indigo-900 leading-6">
                  {aiAnalysis.customerResponse}
                </p>
              </div>
            </div>
          )}

          {reasons.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-3">
                Policy evaluation
              </span>

              <div className="space-y-2">
                {reasons.map((reason, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 text-sm text-slate-700"
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs shrink-0 mt-0.5">
                      {index + 1}
                    </span>

                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {policyResult?.refundableItems?.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-3">
                Eligible items
              </span>

              <div className="space-y-2">
                {policyResult.refundableItems.map((item, index) => (
                  <div
                    key={item._id || item.orderItemId || index}
                    className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl p-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {item.productName || "Order item"}
                      </p>

                      <p className="text-xs text-slate-500">
                        Qty: {item.quantity || 1}
                      </p>
                    </div>

                    <span className="text-sm font-bold text-emerald-700">
                      $
                      {(
                        Number(item.price || 0) * Number(item.quantity || 1)
                      ).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {policyResult?.ineligibleItems?.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-3">
                Ineligible items
              </span>

              <div className="space-y-2">
                {policyResult.ineligibleItems.map((item, index) => (
                  <div
                    key={item._id || item.orderItemId || index}
                    className="flex items-center justify-between bg-rose-50 border border-rose-100 rounded-xl p-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {item.productName || "Order item"}
                      </p>

                      <p className="text-xs text-rose-600">
                        {item.reason || "Not eligible for refund"}
                      </p>
                    </div>

                    <span className="text-sm font-bold text-slate-700">
                      $
                      {(
                        Number(item.price || 0) * Number(item.quantity || 1)
                      ).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {status === "approved" && (
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-xs text-emerald-800 font-medium flex items-center gap-3">
              <span className="text-emerald-600 font-bold text-base">ℹ</span>

              <span>
                Refunds typically appear on your original payment method within
                3–5 business days.
              </span>
            </div>
          )}

          {status === "escalated" && (
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl text-xs text-amber-800 font-medium flex items-center gap-3">
              <span className="text-amber-600 font-bold text-base">ℹ</span>

              <span>
                A support specialist will review your request and determine the
                next step.
              </span>
            </div>
          )}

          {status === "denied" && reasons.length > 0 && (
            <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl text-xs text-rose-800 font-medium">
              <span className="font-bold block mb-1">Why was this denied?</span>

              <span>{reasons[0]}</span>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onClose()}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl shadow-md shadow-indigo-100 transition-all text-sm text-center"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RefundResultModal;
