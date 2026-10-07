import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "./api";
import "./Dashboard.css";

export default function Dashboard() {
  const [user] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "electrical",
    priority: "medium",
    property: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!user || !token) {
      navigate("/login");
      return;
    }

    fetch(`${API_URL}/complaints`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load complaints");
        return res.json();
      })
      .then(setComplaints)
      .catch(() => setError("Could not load complaints."));
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateComplaint = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.title.trim() || !form.description.trim() || !form.property.trim()) {
      setFormError("Title, property, and description are required.");
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/complaints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.message || "Failed to submit complaint.");
        return;
      }

      setComplaints([data, ...complaints]);
      setForm({
        title: "",
        description: "",
        category: "electrical",
        priority: "medium",
        property: "",
      });
      setShowForm(false);
    } catch {
      setFormError("Could not connect to server.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/complaints/${complaintId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      const updated = await res.json();
      setComplaints(
        complaints.map((c) => (c._id === complaintId ? updated : c))
      );
    } catch {
      alert("Could not update complaint status.");
    }
  };

  if (!user) return null;

  return (
    <div className="dashboard-page">
      <header className="dashboard-nav">
        <div className="logo">ResideFix</div>
        <div className="nav-right">
          <span className="user-info">
            <strong>{user.name}</strong> ({user.role})
          </span>
          <button onClick={handleLogout} className="logout-btn">Log Out</button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-header">
          <h2>{user.role === "manager" ? "All Complaints" : "Your Complaints"}</h2>
          {user.role === "resident" && (
            <button
              className="btn-primary-sm"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Cancel" : "+ New Complaint"}
            </button>
          )}
        </div>

        {showForm && (
          <form className="complaint-form" onSubmit={handleCreateComplaint}>
            <h3>Report a Maintenance Issue</h3>
            {formError && <p className="error">{formError}</p>}

            <label htmlFor="title">Issue Title</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Leaking sink in kitchen"
              value={form.title}
              onChange={handleInputChange}
              required
            />

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleInputChange}
                >
                  <option value="electrical">Electrical</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="internet">Internet</option>
                  <option value="security">Security</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  name="priority"
                  value={form.priority}
                  onChange={handleInputChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <label htmlFor="property">Property / Unit / Room</label>
            <input
              id="property"
              name="property"
              type="text"
              placeholder="e.g. Sunrise Apartments, Room 302"
              value={form.property}
              onChange={handleInputChange}
              required
            />

            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              placeholder="Provide detail about the problem..."
              value={form.description}
              onChange={handleInputChange}
              required
            ></textarea>

            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Complaint"}
            </button>
          </form>
        )}

        {error && <p className="error">{error}</p>}
        {!error && complaints.length === 0 && (
          <p className="empty-state">No complaints found.</p>
        )}

        <ul className="complaint-list">
          {complaints.map((c) => (
            <li key={c._id} className="complaint-item">
              <div className="complaint-header-row">
                <div className="complaint-title">{c.title}</div>
                {user.role === "manager" ? (
                  <div className="status-selector">
                    <label htmlFor={`status-${c._id}`}>Status: </label>
                    <select
                      id={`status-${c._id}`}
                      value={c.status}
                      onChange={(e) => handleStatusChange(c._id, e.target.value)}
                      className={`status-select status-${c.status}`}
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                ) : (
                  <span className={`badge status-${c.status}`}>{c.status}</span>
                )}
              </div>

              <div className="complaint-meta">
                <span className={`badge priority-${c.priority}`}>{c.priority} priority</span>
                <span className="category-tag">{c.category}</span>
                <span className="property">{c.property}</span>
                {c.createdBy?.name && (
                  <span className="reporter">By: {c.createdBy.name}</span>
                )}
              </div>
              <p className="complaint-desc">{c.description}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
