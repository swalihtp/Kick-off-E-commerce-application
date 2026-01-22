import { useState } from "react";
import api from "../api/axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await api.post("/accounts/forgot-password/", { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="px-6 py-5 border-b bg-gray-50 rounded-t-2xl">
          <h2 className="text-xl font-semibold text-gray-900">
            Forgot Password
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            We’ll send a reset link to your email
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="
              w-full px-4 py-2.5 rounded-lg border border-gray-300
              focus:ring-2 focus:ring-indigo-500 focus:outline-none
            "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            disabled={loading}
            className="
              w-full flex items-center justify-center gap-2
              bg-indigo-600 text-white py-2.5 rounded-lg
              font-semibold hover:bg-indigo-700 transition
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {loading && (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          {message && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              {message}
            </p>
          )}

          {error && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
