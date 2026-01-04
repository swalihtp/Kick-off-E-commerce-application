import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Registration.css";

function RegistrationForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    image:"",
    status: "active",
    role: "user",
    cart: [],
    wishlist: [],
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function validation(value) {
    const errors = {};
    if (value.name.length < 2) {
      errors.name = "Enter a valid name";
    }
    if (!value.email.includes("@")) {
      errors.email = "Enter a valid email address";
    }
    if (value.password.length < 8) {
      errors.password = "password must contain 8 charechters";
    }
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validation(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    try {
      await axios.post(`http://localhost:5000/users`, form);
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("userEmail", form.email);
    } catch (err) {
      console.error(err);
      alert("something went wrong");
    } finally {
      setForm({
        name: "",
        email: "", 
        password: "",
        image:"",
        status: "active",
        role: "user",
        cart: [],
        wishlist: [],
      });
    }
    navigate("/");
  }

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h1 className="form-title">Register</h1>

        <input
          type="text"
          placeholder="Full Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}

        <input
          type="email"
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}

        <input
          type="password"
          placeholder="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}

        <button type="submit" className="btn-submit">
          Register
        </button>

        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
export default RegistrationForm;
