import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "./api";
import "./Dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!stored || !token) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(stored));

    fetch(`${API_URL}/complaints`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load complaints");
        return res.json();
      })
      .then(setComplaints)
      .catch(() => setError("Could not load complaints."));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="dashboard-page">
      <header className="dashboard-nav">
        <div className="logo">ResideFix</div>
        <div className="nav-right">
          <span>Hi, {user.name}</span>
          <button onClick={handleLogout} className="logout-btn">Log Out</button>
        </div>
      </header>

      <main className="dashboard-content">
        <h2>Your Complaints</h2>
        {error && <p className="error">{error}</p>}
        {!error && complaints.length === 0 && (
          <p className="empty-state">No complaints yet.</p>
        )}
        <ul className="complaint-list">
          {complaints.map((c) => (
            <li key={c._id} className="complaint-item">
              <div className="complaint-title">{c.title}</div>
              <div className="complaint-meta">
                <span className={`badge status-${c.status}`}>{c.status}</span>
                <span className={`badge priority-${c.priority}`}>{c.priority}</span>
                <span className="property">{c.property}</span>
              </div>
              <p className="complaint-desc">{c.description}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
