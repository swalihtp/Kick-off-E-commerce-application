import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("http://localhost:5000/users");
      const users = response.data;

      const userFound = users.find(
        (u) => u.email === form.email && u.password === form.password
      );

      if (userFound) {
        const { password, ...safeUser } = userFound;

        const normalizedUser = {
          ...safeUser,
          role: safeUser.role.toLowerCase().trim(),
        };

        login(normalizedUser);

        if (normalizedUser.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } else {
        alert("Invalid email or password");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="
          w-full max-w-md
          rounded-xl bg-white
          p-8 shadow-xl
          border border-[#1E1E1E]/10
        "
      >
        {/* Title */}
        <h1 className="mb-6 text-center text-3xl font-bold text-[#1E1E1E]">
          Login
        </h1>

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          required
          className="
            mb-4 w-full rounded-md
            border border-gray-300
            px-4 py-2
            text-sm
            focus:border-[#420300]
            focus:outline-none
            focus:ring-2 focus:ring-[#420300]/30
          "
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          required
          className="
            mb-6 w-full rounded-md
            border border-gray-300
            px-4 py-2
            text-sm
            focus:border-[#420300]
            focus:outline-none
            focus:ring-2 focus:ring-[#420300]/30
          "
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="
            w-full rounded-md
            bg-linear-to-r from-[#1E1E1E] to-[#420300]
            py-2 text-sm font-semibold text-white
            transition-all duration-300
            hover:scale-[1.02]
            hover:from-[#2A2A2A] hover:to-[#5A0A05]
          "
        >
          Login
        </button>

        {/* Register Link */}
        <p className="mt-5 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-[#0A84FF] hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
