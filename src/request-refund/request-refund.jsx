import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../layout/app-layout";
import axios from "axios";
import RefundResultModal from "../request-list/view-request";

const refundCategories = [
  "damaged_item",
  "incorrect_item",
  "missing_item",
  "defective_item",
  "not_as_described",
  "wrong_quantity",
  "late_delivery",
  "changed_mind",
  "duplicate_order",
  "unauthorized_order",
  "other",
];

const categoryLabels = {
  damaged_item: "Damaged item",
  incorrect_item: "Incorrect item",
  missing_item: "Missing item",
  defective_item: "Defective item",
  not_as_described: "Not as described",
  wrong_quantity: "Wrong quantity",
  late_delivery: "Late delivery",
  changed_mind: "Changed my mind",
  duplicate_order: "Duplicate order",
  unauthorized_order: "Unauthorized order",
  other: "Other",
};

export default function RequestRefund() {
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("damaged_item");
  const [processingStep, setProcessingStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/v1/request/orders",
        );

        setOrders(res.data.data || res.data || []);
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message ||
            "Unable to load your orders. Please try again.",
        );
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleSubmitRequest = async (e) => {
    e.preventDefault();

    if (!orderId) {
      setErrorMessage("Please select an order.");
      return;
    }

    if (!description.trim() || description.length < 10) {
      setErrorMessage(
        "Please provide a detailed description (at least 10 characters).",
      );
      return;
    }

    setErrorMessage("");
    setLoading(true);
    setProcessingStep(0);

    const stepTimer = setInterval(() => {
      setProcessingStep((current) => {
        if (current >= 2) {
          clearInterval(stepTimer);
          return current;
        }

        return current + 1;
      });
    }, 700);

    try {
      const res = await axios.post("http://localhost:8080/api/v1/request", {
        orderId,
        category: selectedCategory,
        reason: description.trim(),
      });

      clearInterval(stepTimer);
      setProcessingStep(2);

      const result = res.data;
      setResult(result?.data);
      console.log(result);
      setLoading(false);
    } catch (error) {
      clearInterval(stepTimer);
      setLoading(false);

      setErrorMessage(
        error?.response?.data?.message ||
          "We couldn't process your refund request. Please try again.",
      );
    }
  };

  return (
    <AppLayout>
      {result && (
        <RefundResultModal
          onClose={() => setResult(null)}
          selectedRequest={result}
        />
      )}
      {!loading ? (
        <motion.div
          key="form"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 md:p-12 w-full max-w-xl mx-auto my-6"
        >
          <div className="mb-8">
            <span className="text-indigo-600 font-semibold text-xs tracking-wider uppercase mb-2 block">
              Step 1 of 2
            </span>

            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Request a Refund
            </h2>

            <p className="text-slate-500 text-sm">
              Tell us what happened with your order and we'll evaluate it
              instantly.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-3">
              <span className="font-bold">!</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmitRequest} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Order
              </label>

              <select
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                disabled={ordersLoading}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-900 font-medium text-sm disabled:bg-slate-50 disabled:text-slate-400"
              >
                <option value="">
                  {ordersLoading ? "Loading orders..." : "Select an order"}
                </option>

                {orders?.map((order) => (
                  <option key={order._id} value={order.orderNumber}>
                    {order.orderNumber} — $
                    {Number(order.totalAmount || 0).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Issue Category
              </label>

              <div className="flex flex-wrap gap-2">
                {refundCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      selectedCategory === category
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {categoryLabels[category]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                What happened?
              </label>

              <textarea
                rows="4"
                placeholder="Tell us what happened with your order..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-900 font-medium placeholder:text-slate-400 text-sm resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-slate-500 hover:text-slate-800 text-sm font-semibold"
              >
                Cancel
              </button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={ordersLoading || !orders.length}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all text-sm flex items-center gap-2"
              >
                <span>Submit Request</span>

                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </motion.button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              Your information is used only to process your refund request
              securely.
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="processing"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-12 w-full max-w-md mx-auto text-center my-12"
        >
          <div className="relative w-20 h-20 mx-auto mb-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-100 animate-pulse" />
            <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
            <span className="text-2xl font-bold text-indigo-600">AI</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Reviewing request
          </h2>

          <p className="text-slate-500 text-sm mb-8">
            We're checking your order details and refund eligibility.
          </p>

          <div className="space-y-3 text-left bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                  processingStep >= 0
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {processingStep >= 0 ? "✓" : "◌"}
              </span>

              <span>Order information verified</span>
            </div>

            <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                  processingStep >= 1
                    ? "bg-emerald-500 text-white"
                    : processingStep === 0
                      ? "bg-indigo-600 text-white animate-pulse"
                      : "bg-slate-200 text-slate-500"
                }`}
              >
                {processingStep >= 1 ? "✓" : "◌"}
              </span>

              <span>Refund policy criteria checked</span>
            </div>

            <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                  processingStep >= 2
                    ? "bg-emerald-500 text-white"
                    : processingStep === 1
                      ? "bg-indigo-600 text-white animate-pulse"
                      : "bg-slate-200 text-slate-500"
                }`}
              >
                {processingStep >= 2 ? "✓" : "◌"}
              </span>

              <span>AI analysis & decision validation</span>
            </div>
          </div>
        </motion.div>
      )}
    </AppLayout>
  );
}
