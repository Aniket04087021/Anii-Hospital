import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4002/api/v1/user/admin/login",
        { email: email.trim(), password: password.trim() },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message || "Admin login successful.");
      setIsAuthenticated(true);
      navigate("/admin");
    } catch (error) {
      toast.error(error.response?.data?.message || "Admin login failed.");
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="container form-component login-form">
      <h2>Admin Login</h2>
      <p>Sign in with admin credentials.</p>
      <form onSubmit={handleAdminLogin}>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div style={{ justifyContent: "center", alignItems: "center" }}>
          <button type="submit">Login as Admin</button>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;
