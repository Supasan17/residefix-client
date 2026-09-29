import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    // Backend call goes here later (POST /api/auth/login)
    console.log("Login submitted:", form);
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>ResideFix</h1>
        <p className="subtitle">Sign in to manage your complaints</p>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <div className="pw-row">
          <input
            id="password"
            name="password"
            type={showPw ? "text" : "password"}
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="button" onClick={() => setShowPw(!showPw)}>
            {showPw ? "Hide" : "Show"}
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="submit-btn">Log In</button>
        <p className="footer-text">
          No account? <Link to="/signup">Register</Link>
        </p>
      </form>
    </div>
  );
}