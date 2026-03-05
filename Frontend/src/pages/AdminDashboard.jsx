import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────────────────────────
   Theme tokens — pulled directly from App.css
   bg:       #e5e5e5
   primary:  linear-gradient(140deg, #9083d5, #271776)
   accent:   #9083d5  /  #8570ed (hover)
   text:     #111
   card bg:  #fff
   border:   #e5e7eb
   subtext:  #64748b / gray
   font:     Montserrat
───────────────────────────────────────────────────────────── */

const THEME_CSS = `
  /* Kill App.css "* { overflow-x: hidden }" scroll arrows on all dashboard elements */
  .adm, .adm * {
    overflow: visible !important;
  }

  .adm {
    font-family: "Montserrat", sans-serif;
    background: #e5e5e5;
    min-height: 100vh;
    padding-bottom: 60px;
  }

  /* Hero banner */
  .adm-hero {
    background: linear-gradient(140deg, #9083d5, #271776);
    color: #fff;
    border-radius: 14px;
    padding: 28px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }
  .adm-hero h2 {
    font-size: 26px;
    font-weight: 900;
    letter-spacing: 1px;
    margin-bottom: 4px;
    color: #fff;
  }
  .adm-hero p {
    font-size: 13px;
    color: rgba(255,255,255,0.75);
    margin: 0;
    letter-spacing: 0.5px;
  }

  /* Logout */
  .adm-logout-btn {
    background: rgba(255,255,255,0.15);
    border: 1.5px solid rgba(255,255,255,0.5);
    color: #fff;
    border-radius: 12px;
    padding: 9px 22px;
    font-size: 13px;
    font-weight: 700;
    font-family: "Montserrat", sans-serif;
    letter-spacing: 1.5px;
    cursor: pointer;
    transition: background 0.2s;
    white-space: nowrap;
  }
  .adm-logout-btn:hover { background: rgba(255,255,255,0.28); }

  /* Stat cards */
  .adm-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
  }
  .adm-stat {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    padding: 20px 22px;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .adm-stat:hover { box-shadow: 0 6px 24px rgba(144,131,213,0.18); transform: translateY(-2px); }
  .adm-stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: linear-gradient(140deg, #9083d5, #271776);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
  }
  .adm-stat-num {
    font-size: 32px;
    font-weight: 900;
    color: #111;
    line-height: 1;
  }
  .adm-stat-label {
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 3px;
  }

  /* Tabs */
  .adm-tabs {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .adm-tab {
    border: 1.5px solid #d1d5db;
    border-radius: 12px;
    padding: 9px 20px;
    background: #fff;
    font-size: 13px;
    font-weight: 700;
    font-family: "Montserrat", sans-serif;
    letter-spacing: 0.5px;
    cursor: pointer;
    color: #555;
    transition: all 0.2s;
  }
  .adm-tab:hover { border-color: #9083d5; color: #9083d5; }
  .adm-tab.active {
    background: linear-gradient(140deg, #9083d5, #271776);
    border-color: transparent;
    color: #fff;
  }

  /* Panel */
  .adm-panel {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 24px;
    display: grid;
    gap: 18px;
    animation: admFadeUp 0.22s ease both;
  }
  @keyframes admFadeUp {
    from { opacity:0; transform:translateY(8px); }
    to   { opacity:1; transform:translateY(0); }
  }

  .adm-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }
  .adm-panel-header h3 {
    font-size: 20px;
    font-weight: 900;
    color: #111;
    letter-spacing: 0.5px;
  }

  /* Search */
  .adm-search-wrap { position: relative; }
  .adm-search-wrap span {
    position: absolute;
    left: 13px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    color: #aaa;
    pointer-events: none;
  }
  .adm-search {
    border: 1.5px solid #e5e7eb;
    border-radius: 12px;
    padding: 9px 14px 9px 36px;
    font-family: "Montserrat", sans-serif;
    font-size: 13px;
    font-weight: 500;
    background: #f8fafc;
    color: #111;
    width: 280px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .adm-search:focus {
    border-color: #9083d5;
    box-shadow: 0 0 0 3px rgba(144,131,213,0.15);
    background: #fff;
  }

  /* Add Doctor form card */
  .adm-form-card {
    background: #f8f7ff;
    border: 1.5px solid rgba(144,131,213,0.25);
    border-radius: 14px;
    padding: 20px 22px;
  }
  .adm-form-card h4 {
    font-size: 14px;
    font-weight: 800;
    color: #271776;
    letter-spacing: 1px;
    margin-bottom: 16px;
  }
  .adm-form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 14px;
  }
  .adm-input {
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    padding: 10px 14px;
    font-family: "Montserrat", sans-serif;
    font-size: 13px;
    font-weight: 500;
    background: #fff;
    color: #111;
    width: 100%;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .adm-input:focus {
    border-color: #9083d5;
    box-shadow: 0 0 0 3px rgba(144,131,213,0.12);
  }
  .adm-submit-btn {
    background: linear-gradient(140deg, #9083d5, #271776);
    border: none;
    border-radius: 12px;
    padding: 10px 28px;
    color: #fff;
    font-family: "Montserrat", sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1.5px;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s;
  }
  .adm-submit-btn:hover { opacity: 0.88; transform: translateY(-1px); }

  .adm-section-label {
    font-size: 11px;
    font-weight: 700;
    color: #aaa;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    padding-bottom: 6px;
    border-bottom: 1.5px solid #f0f0f0;
  }

  /* Cards */
  .adm-list { display: grid; gap: 10px; }
  .adm-card {
    border: 1.5px solid #e5e7eb;
    border-radius: 12px;
    padding: 14px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 14px;
    background: #fafafa;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .adm-card:hover { border-color: #c4bcf0; box-shadow: 0 3px 12px rgba(144,131,213,0.1); }
  .adm-card-name {
    font-size: 15px;
    font-weight: 800;
    color: #111;
    margin-bottom: 3px;
  }
  .adm-card-meta {
    font-size: 12px;
    color: #64748b;
    font-weight: 500;
    margin-bottom: 2px;
  }
  .adm-dept-tag {
    display: inline-block;
    font-size: 11px;
    font-weight: 700;
    color: #7c6fcf;
    background: rgba(144,131,213,0.12);
    border: 1px solid rgba(144,131,213,0.25);
    border-radius: 6px;
    padding: 2px 10px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-top: 5px;
  }
  .adm-msg-text {
    font-size: 12px;
    color: #64748b;
    font-weight: 500;
    margin-top: 6px;
    line-height: 1.6;
    max-width: 480px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden !important;
  }

  .adm-remove-btn {
    background: #fff0f0;
    border: 1.5px solid #fecaca;
    color: #dc2626;
    border-radius: 10px;
    padding: 7px 16px;
    font-size: 12px;
    font-weight: 700;
    font-family: "Montserrat", sans-serif;
    letter-spacing: 0.5px;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.2s;
  }
  .adm-remove-btn:hover { background: #dc2626; color: #fff; border-color: #dc2626; }

  /* Status badges */
  .adm-badge {
    display: inline-block;
    font-size: 10px;
    font-weight: 800;
    border-radius: 6px;
    padding: 2px 10px;
    letter-spacing: 1px;
    text-transform: uppercase;
    font-family: "Montserrat", sans-serif;
  }
  .adm-badge-pending  { background: #fef9c3; color: #92400e; border: 1px solid #fde68a; }
  .adm-badge-accepted { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
  .adm-badge-rejected { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }

  .adm-status-select {
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    padding: 8px 12px;
    font-family: "Montserrat", sans-serif;
    font-size: 12px;
    font-weight: 600;
    background: #fff;
    color: #111;
    cursor: pointer;
    outline: none;
    flex-shrink: 0;
    transition: border-color 0.2s;
  }
  .adm-status-select:focus { border-color: #9083d5; }

  .adm-date-pill {
    display: inline-block;
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    background: #f1f5f9;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 2px 10px;
    margin-top: 5px;
  }

  .adm-row-top {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 3px;
  }

  .adm-empty {
    text-align: center;
    color: #aaa;
    font-size: 14px;
    font-weight: 600;
    padding: 36px 0;
    letter-spacing: 0.5px;
  }

  /* Loading */
  .adm-loading {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #e5e5e5;
    flex-direction: column;
    gap: 16px;
    font-family: "Montserrat", sans-serif;
  }
  .adm-spinner {
    width: 40px; height: 40px;
    border: 3px solid rgba(144,131,213,0.2);
    border-top-color: #9083d5;
    border-radius: 50%;
    animation: admSpin 0.8s linear infinite;
  }
  @keyframes admSpin { to { transform: rotate(360deg); } }
  .adm-loading p { font-size: 14px; font-weight: 600; color: #64748b; letter-spacing: 1px; }

  /* ── Mobile ── */
  @media (max-width: 768px) {
    .adm-stats       { grid-template-columns: 1fr 1fr; }
    .adm-form-grid   { grid-template-columns: 1fr; }
    .adm-card        { flex-direction: column; align-items: flex-start; }
    .adm-search      { width: 100%; }
    .adm-panel-header{ flex-direction: column; align-items: flex-start; }
    .adm-hero        { padding: 20px; }
    .adm-hero h2     { font-size: 20px; }
  }
  @media (max-width: 480px) {
    .adm-stats { grid-template-columns: 1fr; }
  }
`;

const AdminDashboard = () => {
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("doctors");

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [doctorSearch, setDoctorSearch] = useState("");
  const [appointmentSearch, setAppointmentSearch] = useState("");
  const [messageSearch, setMessageSearch] = useState("");

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    dob: "", gender: "", password: "", doctorDepartment: "Pediatrics",
  });

  const departments = ["Pediatrics","Orthopedics","Cardiology","Neurology","Oncology","Radiology","Physical Therapy","Dermatology","ENT"];
  const statusOptions = ["Pending", "Accepted", "Rejected"];
  const navigate = useNavigate();

  const stats = useMemo(() => ({
    doctors: doctors.length,
    appointments: appointments.length,
    messages: messages.length,
  }), [doctors.length, appointments.length, messages.length]);

  const checkAdminAuth = async () => {
    try {
      await axios.get("http://localhost:4002/api/v1/user/admin/me", { withCredentials: true });
      setIsAdminAuthenticated(true);
    } catch { setIsAdminAuthenticated(false); }
    finally { setLoadingAuth(false); }
  };

  const fetchDoctors = async () => {
    const { data } = await axios.get("http://localhost:4002/api/v1/user/doctors", { withCredentials: true });
    setDoctors(data.doctors || []);
  };
  const fetchAppointments = async () => {
    const { data } = await axios.get("http://localhost:4002/api/v1/appointment/all", { withCredentials: true });
    setAppointments(data.appointments || []);
  };
  const fetchMessages = async () => {
    const { data } = await axios.get("http://localhost:4002/api/v1/message/all", { withCredentials: true });
    setMessages(data.messages || []);
  };
  const fetchDashboardData = async () => {
    try { await Promise.all([fetchDoctors(), fetchAppointments(), fetchMessages()]); }
    catch (e) { toast.error(e.response?.data?.message || "Unable to load dashboard data."); }
  };

  useEffect(() => { checkAdminAuth(); }, []);
  useEffect(() => { if (isAdminAuthenticated) fetchDashboardData(); }, [isAdminAuthenticated]);

  const onChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      const payload = Object.fromEntries(Object.entries(formData).map(([k, v]) => [k, v?.toString().trim()]));
      const missing = Object.entries(payload).filter(([, v]) => !v).map(([k]) => k);
      if (missing.length) { toast.error(`Please fill: ${missing.join(", ")}`); return; }
      const { data } = await axios.post("http://localhost:4002/api/v1/user/doctor/add", payload, {
        withCredentials: true, headers: { "Content-Type": "application/json" },
      });
      toast.success(data.message || "Doctor added.");
      setFormData({ firstName:"",lastName:"",email:"",phone:"",dob:"",gender:"",password:"",doctorDepartment:"Pediatrics" });
      fetchDoctors();
    } catch (e) { toast.error(e.response?.data?.message || "Unable to add doctor."); }
  };

  const handleDeleteDoctor = async (id) => {
    try {
      const { data } = await axios.delete(`http://localhost:4002/api/v1/user/doctor/${id}`, { withCredentials: true });
      toast.success(data.message || "Doctor removed."); fetchDoctors();
    } catch (e) { toast.error(e.response?.data?.message || "Unable to remove doctor."); }
  };

  const handleAppointmentStatus = async (id, status) => {
    try {
      const { data } = await axios.put(`http://localhost:4002/api/v1/appointment/${id}/status`, { status },
        { withCredentials: true, headers: { "Content-Type": "application/json" } });
      toast.success(data.message || "Status updated."); fetchAppointments();
    } catch (e) { toast.error(e.response?.data?.message || "Unable to update status."); }
  };

  const handleDeleteMessage = async (id) => {
    try {
      const { data } = await axios.delete(`http://localhost:4002/api/v1/message/${id}`, { withCredentials: true });
      toast.success(data.message || "Message deleted."); fetchMessages();
    } catch (e) { toast.error(e.response?.data?.message || "Unable to delete message."); }
  };

  const handleAdminLogout = async () => {
    try {
      const { data } = await axios.get("http://localhost:4002/api/v1/user/admin/logout", { withCredentials: true });
      toast.success(data.message || "Logged out.");
      setIsAdminAuthenticated(false); navigate("/admin/login");
    } catch (e) { toast.error(e.response?.data?.message || "Logout failed."); }
  };

  const formatDate = (v) => {
    if (!v) return "-";
    const d = new Date(v);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const filteredDoctors = useMemo(() => {
    const q = doctorSearch.trim().toLowerCase();
    return !q ? doctors : doctors.filter(d =>
      `${d.firstName} ${d.lastName} ${d.email} ${d.doctorDepartment}`.toLowerCase().includes(q));
  }, [doctors, doctorSearch]);

  const filteredAppointments = useMemo(() => {
    const q = appointmentSearch.trim().toLowerCase();
    return !q ? appointments : appointments.filter(a =>
      `${a.firstName} ${a.lastName} ${a.email} ${a.department} ${a.status}`.toLowerCase().includes(q));
  }, [appointments, appointmentSearch]);

  const filteredMessages = useMemo(() => {
    const q = messageSearch.trim().toLowerCase();
    return !q ? messages : messages.filter(m =>
      `${m.firstName} ${m.lastName} ${m.email} ${m.phone} ${m.message}`.toLowerCase().includes(q));
  }, [messages, messageSearch]);

  const badgeClass = (status) => {
    const map = { pending: "adm-badge-pending", accepted: "adm-badge-accepted", rejected: "adm-badge-rejected" };
    return `adm-badge ${map[status?.toLowerCase()] || "adm-badge-pending"}`;
  };

  if (loadingAuth) return (
    <>
      <style>{THEME_CSS}</style>
      <div className="adm-loading">
        <div className="adm-spinner" />
        <p>CHECKING ADMIN SESSION…</p>
      </div>
    </>
  );

  if (!isAdminAuthenticated) return <Navigate to="/admin/login" />;

  const STAT_CARDS = [
    { label: "Total Doctors",      value: stats.doctors,      icon: "🩺" },
    { label: "Total Appointments", value: stats.appointments, icon: "📅" },
    { label: "Total Messages",     value: stats.messages,     icon: "💬" },
  ];

  const TABS = [
    { key: "doctors",      label: "Doctor Management" },
    { key: "appointments", label: "Appointment Queue" },
    { key: "messages",     label: "Patient Messages" },
  ];

  return (
    <>
      <style>{THEME_CSS}</style>
      <div className="adm container">
        <div className="admin-dashboard">

          {/* Hero */}
          <section className="adm-hero">
            <div>
              <h2>Hospital Admin Workspace</h2>
              <p>Track operations, manage staff and respond quickly to patient activity.</p>
            </div>
            <button className="adm-logout-btn" onClick={handleAdminLogout}>LOGOUT</button>
          </section>

          {/* Stats */}
          <div className="adm-stats">
            {STAT_CARDS.map(({ label, value, icon }) => (
              <div className="adm-stat" key={label}>
                <div className="adm-stat-icon">{icon}</div>
                <div>
                  <div className="adm-stat-num">{value}</div>
                  <div className="adm-stat-label">{label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="adm-tabs">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                className={`adm-tab${activeTab === key ? " active" : ""}`}
                onClick={() => setActiveTab(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ══ DOCTORS ══ */}
          {activeTab === "doctors" && (
            <section className="adm-panel">
              <div className="adm-panel-header">
                <h3>Doctor Management</h3>
                <div className="adm-search-wrap">
                  <span>🔍</span>
                  <input
                    className="adm-search"
                    value={doctorSearch}
                    onChange={e => setDoctorSearch(e.target.value)}
                    placeholder="Search name, email, department…"
                  />
                </div>
              </div>

              <div className="adm-form-card">
                <h4>＋ ADD NEW DOCTOR</h4>
                <form onSubmit={handleAddDoctor}>
                  <div className="adm-form-grid">
                    {[
                      { name: "firstName", placeholder: "First Name" },
                      { name: "lastName",  placeholder: "Last Name" },
                      { name: "email",     placeholder: "Email Address" },
                      { name: "phone",     placeholder: "Phone Number" },
                    ].map(f => (
                      <input key={f.name} name={f.name} value={formData[f.name]} onChange={onChange}
                        placeholder={f.placeholder} className="adm-input" />
                    ))}
                    <input type="date" name="dob" value={formData.dob} onChange={onChange} className="adm-input" />
                    <select name="gender" value={formData.gender} onChange={onChange} className="adm-input">
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    <input type="password" name="password" value={formData.password} onChange={onChange}
                      placeholder="Password" className="adm-input" />
                    <select name="doctorDepartment" value={formData.doctorDepartment} onChange={onChange} className="adm-input">
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button type="submit" className="adm-submit-btn">ADD DOCTOR</button>
                  </div>
                </form>
              </div>

              <div className="adm-section-label">Directory ({filteredDoctors.length})</div>
              <div className="adm-list">
                {filteredDoctors.length === 0
                  ? <p className="adm-empty">No doctors found.</p>
                  : filteredDoctors.map(doc => (
                    <article key={doc._id} className="adm-card">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="adm-card-name">{doc.firstName} {doc.lastName}</div>
                        <div className="adm-card-meta">{doc.email}</div>
                        <div className="adm-card-meta">{doc.phone}</div>
                        <span className="adm-dept-tag">{doc.doctorDepartment}</span>
                      </div>
                      <button className="adm-remove-btn" onClick={() => handleDeleteDoctor(doc._id)}>Remove</button>
                    </article>
                  ))}
              </div>
            </section>
          )}

          {/* ══ APPOINTMENTS ══ */}
          {activeTab === "appointments" && (
            <section className="adm-panel">
              <div className="adm-panel-header">
                <h3>Appointment Queue</h3>
                <div className="adm-search-wrap">
                  <span>🔍</span>
                  <input className="adm-search" value={appointmentSearch}
                    onChange={e => setAppointmentSearch(e.target.value)}
                    placeholder="Search patient, dept, status…" />
                </div>
              </div>
              <div className="adm-list">
                {filteredAppointments.length === 0
                  ? <p className="adm-empty">No appointments found.</p>
                  : filteredAppointments.map(appt => (
                    <article key={appt._id} className="adm-card">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="adm-row-top">
                          <span className="adm-card-name">{appt.firstName} {appt.lastName}</span>
                          <span className={badgeClass(appt.status)}>{appt.status}</span>
                        </div>
                        <div className="adm-card-meta">{appt.email} · {appt.phone}</div>
                        <div className="adm-card-meta">{appt.department} · Dr. {appt.doctor_firstName} {appt.doctor_lastName}</div>
                        <span className="adm-date-pill">📅 {formatDate(appt.appointment_date)}</span>
                      </div>
                      <select className="adm-status-select" value={appt.status}
                        onChange={e => handleAppointmentStatus(appt._id, e.target.value)}>
                        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </article>
                  ))}
              </div>
            </section>
          )}

          {/* ══ MESSAGES ══ */}
          {activeTab === "messages" && (
            <section className="adm-panel">
              <div className="adm-panel-header">
                <h3>Patient Messages</h3>
                <div className="adm-search-wrap">
                  <span>🔍</span>
                  <input className="adm-search" value={messageSearch}
                    onChange={e => setMessageSearch(e.target.value)}
                    placeholder="Search name, email, message…" />
                </div>
              </div>
              <div className="adm-list">
                {filteredMessages.length === 0
                  ? <p className="adm-empty">No messages found.</p>
                  : filteredMessages.map(msg => (
                    <article key={msg._id} className="adm-card">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="adm-card-name">{msg.firstName} {msg.lastName}</div>
                        <div className="adm-card-meta">{msg.email} · {msg.phone}</div>
                        <div className="adm-msg-text">{msg.message}</div>
                      </div>
                      <button className="adm-remove-btn" onClick={() => handleDeleteMessage(msg._id)}>Delete</button>
                    </article>
                  ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </>
  );
};

export default AdminDashboard;