import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import axios from "axios";
import "./Login.css";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h1 className="form-title">Login</h1>

        <input
          type="email"
          name="email"
          placeholder="Enter Your Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Your Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn-submit">Login</button>

        <p className="switch-link">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
