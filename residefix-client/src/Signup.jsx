import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "resident",
  });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (!form.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    // Backend call goes here later (POST /api/auth/signup)
    console.log("Signup submitted:", form);
    setSuccess(true);
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>ResideFix</h1>
        <p className="subtitle">Create your account</p>

        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Your full name"
          value={form.name}
          onChange={handleChange}
          required
        />

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

        <label htmlFor="role">I am a</label>
        <select id="role" name="role" value={form.role} onChange={handleChange}>
          <option value="resident">Resident</option>
          <option value="manager">Property Manager / Landlord</option>
        </select>

        <label htmlFor="password">Password</label>
        <div className="pw-row">
          <input
            id="password"
            name="password"
            type={showPw ? "text" : "password"}
            placeholder="Create a password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="button" onClick={() => setShowPw(!showPw)}>
            {showPw ? "Hide" : "Show"}
          </button>
        </div>

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type={showPw ? "text" : "password"}
          placeholder="Re-enter your password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        {error && <p className="error">{error}</p>}
        {success && <p className="success">Account created! You can now log in.</p>}

        <button type="submit" className="submit-btn">Sign Up</button>
        <p className="footer-text">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </form>
    </div>
  );
}
