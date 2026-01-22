import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/accounts/reset-password/", {
        uid,
        token,
        password,
      });
      navigate("/login");
    } catch (err) {
      setError("Invalid or expired reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="px-6 py-5 border-b bg-gray-50 rounded-t-2xl">
          <h2 className="text-xl font-semibold text-gray-900">
            Reset Password
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input
            type="password"
            placeholder="New password"
            className="
              w-full px-4 py-2.5 rounded-lg border border-gray-300
              focus:ring-2 focus:ring-indigo-500 focus:outline-none
            "
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm password"
            className="
              w-full px-4 py-2.5 rounded-lg border border-gray-300
              focus:ring-2 focus:ring-indigo-500 focus:outline-none
            "
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Resetting..." : "Reset Password"}
          </button>

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

export default ResetPassword;
