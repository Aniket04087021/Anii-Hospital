import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogout = async () => {
    await axios
      .get("http://localhost:4002/api/v1/user/patient/logout", { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(false);
        setShow(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Logout failed.");
      });
  };

  const goToLogin = () => { navigateTo("/login"); setShow(false); };
  const closeMenu = () => setShow(false);

  return (
    <>
      <style>{`
        /* ─── Hard-reset: fight App.css nav rule ─── */
        nav.nb-nav {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: auto !important;
          width: 100% !important;
          height: 68px !important;
          background: #fff !important;
          box-shadow: 0 2px 20px rgba(39,23,118,0.10) !important;
          z-index: 1000 !important;
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          justify-content: space-between !important;
          padding: 0 80px !important;
          border-radius: 0 !important;
          font-family: "Montserrat", sans-serif !important;
          overflow: visible !important;
          flex-wrap: nowrap !important;
        }

        /* kill the overflow-x:hidden from App.css * selector on nav children */
        nav.nb-nav * {
          overflow: visible !important;
          box-sizing: border-box !important;
        }

        /* ─── Logo ─── */
        nav.nb-nav .nb-logo {
          display: flex !important;
          align-items: center !important;
          flex-shrink: 0 !important;
          text-decoration: none !important;
          line-height: 1 !important;
        }
        nav.nb-nav .nb-logo img {
          width: 130px !important;
          height: auto !important;
          display: block !important;
        }

        /* ─── Desktop links ─── */
        nav.nb-nav .nb-links {
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          gap: 36px !important;
          position: static !important;
          width: auto !important;
          height: auto !important;
          background: transparent !important;
          padding: 0 !important;
          top: auto !important;
          left: auto !important;
          box-shadow: none !important;
          flex-shrink: 0 !important;
        }

        nav.nb-nav .nb-links a {
          text-decoration: none !important;
          color: #222 !important;
          font-size: 15px !important;
          font-weight: 600 !important;
          letter-spacing: 0.8px !important;
          position: relative !important;
          transition: color 0.2s !important;
          white-space: nowrap !important;
          display: inline-block !important;
        }
        nav.nb-nav .nb-links a::after {
          content: "" !important;
          position: absolute !important;
          bottom: -3px !important;
          left: 0 !important;
          width: 0 !important;
          height: 2px !important;
          background: linear-gradient(140deg, #9083d5, #271776) !important;
          border-radius: 2px !important;
          transition: width 0.25s ease !important;
        }
        nav.nb-nav .nb-links a:hover { color: #9083d5 !important; }
        nav.nb-nav .nb-links a:hover::after { width: 100% !important; }

        /* ─── Desktop auth button ─── */
        nav.nb-nav .nb-auth-btn {
          background: linear-gradient(140deg, #9083d5, #271776) !important;
          color: #fff !important;
          border: none !important;
          border-radius: 12px !important;
          padding: 9px 22px !important;
          font-size: 13px !important;
          font-weight: 700 !important;
          font-family: "Montserrat", sans-serif !important;
          letter-spacing: 1.5px !important;
          cursor: pointer !important;
          white-space: nowrap !important;
          transition: opacity 0.2s, transform 0.15s !important;
          line-height: normal !important;
          display: inline-block !important;
        }
        nav.nb-nav .nb-auth-btn:hover {
          opacity: 0.88 !important;
          transform: translateY(-1px) !important;
        }

        /* ─── Hamburger — hidden on desktop ─── */
        nav.nb-nav .nb-hamburger {
          display: none !important;
          background: none !important;
          border: none !important;
          cursor: pointer !important;
          color: #271776 !important;
          font-size: 28px !important;
          padding: 6px !important;
          line-height: 1 !important;
          flex-shrink: 0 !important;
        }
        nav.nb-nav .nb-hamburger:hover { color: #9083d5 !important; }

        /* ─── Overlay ─── */
        .nb-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 1001;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .nb-overlay.nb-open {
          opacity: 1;
          pointer-events: auto;
        }

        /* ─── Drawer — always in DOM, slides via transform ─── */
        .nb-drawer {
          position: fixed;
          top: 0;
          right: 0;
          width: 280px;
          height: 100vh;
          height: 100dvh;
          background: #fff;
          z-index: 1002;
          display: flex;
          flex-direction: column;
          box-shadow: -4px 0 32px rgba(39,23,118,0.15);
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
          font-family: "Montserrat", sans-serif;
          overflow: hidden !important;
        }
        .nb-drawer.nb-open {
          transform: translateX(0);
        }

        /* Drawer header */
        .nb-drawer-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1.5px solid #f0f0f0;
          flex-shrink: 0;
        }
        .nb-drawer-top img {
          width: 110px;
          height: auto;
          display: block;
        }
        .nb-close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #271776;
          font-size: 26px;
          line-height: 1;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
          flex-shrink: 0;
        }
        .nb-close-btn:hover { color: #9083d5; }

        /* Drawer nav links */
        .nb-drawer-links {
          display: flex;
          flex-direction: column;
          padding: 14px 14px;
          gap: 2px;
          flex: 1;
          overflow-y: auto;
        }
        .nb-drawer-links a {
          text-decoration: none !important;
          color: #222 !important;
          font-size: 15px !important;
          font-weight: 700 !important;
          letter-spacing: 0.5px !important;
          padding: 13px 16px !important;
          border-radius: 10px !important;
          transition: background 0.18s, color 0.18s !important;
          display: block !important;
        }
        .nb-drawer-links a:hover {
          background: rgba(144,131,213,0.10) !important;
          color: #271776 !important;
        }

        /* Drawer footer button */
        .nb-drawer-footer {
          padding: 18px 20px;
          border-top: 1.5px solid #f0f0f0;
          flex-shrink: 0;
        }
        .nb-drawer-auth-btn {
          width: 100%;
          background: linear-gradient(140deg, #9083d5, #271776);
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 13px 24px;
          font-size: 13px;
          font-weight: 700;
          font-family: "Montserrat", sans-serif;
          letter-spacing: 1.5px;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .nb-drawer-auth-btn:hover { opacity: 0.88; }

        /* ─── Spacer below fixed navbar ─── */
        .nb-spacer { height: 68px; }

        /* ─── Tablet ─── */
        @media (max-width: 1100px) {
          nav.nb-nav { padding: 0 32px !important; }
        }

        /* ─── Mobile ─── */
        @media (max-width: 768px) {
          nav.nb-nav { padding: 0 18px !important; }
          nav.nb-nav .nb-links { display: none !important; }
          nav.nb-nav .nb-hamburger { display: flex !important; }
        }
      `}</style>

      {/* Overlay — click to close */}
      <div
        className={`nb-overlay${show ? " nb-open" : ""}`}
        onClick={closeMenu}
      />

      {/* Slide-in Drawer (always mounted, slides via transform) */}
      <div className={`nb-drawer${show ? " nb-open" : ""}`}>
        <div className="nb-drawer-top">
          <img src="/logo.png" alt="logo" />
          <button className="nb-close-btn" onClick={closeMenu} aria-label="Close menu">
            <IoClose />
          </button>
        </div>

        <nav className="nb-drawer-links">
          <Link to="/"            onClick={closeMenu}>Home</Link>
          <Link to="/appointment" onClick={closeMenu}>Appointment</Link>
          <Link to="/about"       onClick={closeMenu}>About Us</Link>
          <Link to="/admin"       onClick={closeMenu}>Admin</Link>
        </nav>

        <div className="nb-drawer-footer">
          {isAuthenticated
            ? <button className="nb-drawer-auth-btn" onClick={handleLogout}>LOGOUT</button>
            : <button className="nb-drawer-auth-btn" onClick={goToLogin}>LOGIN</button>
          }
        </div>
      </div>

      {/* ─── Fixed Navbar ─── */}
      <nav className="nb-nav">
        <Link to="/" className="nb-logo">
          <img src="/logo.png" alt="logo" />
        </Link>

        {/* Desktop links */}
        <div className="nb-links">
          <Link to="/">Home</Link>
          <Link to="/appointment">Appointment</Link>
          <Link to="/about">About Us</Link>
          <Link to="/admin">Admin</Link>
          {isAuthenticated
            ? <button className="nb-auth-btn" onClick={handleLogout}>LOGOUT</button>
            : <button className="nb-auth-btn" onClick={goToLogin}>LOGIN</button>
          }
        </div>

        {/* Hamburger — mobile only */}
        <button
          className="nb-hamburger"
          onClick={() => setShow(true)}
          aria-label="Open menu"
        >
          <GiHamburgerMenu />
        </button>
      </nav>

      {/* Pushes content below fixed bar */}
      <div className="nb-spacer" />
    </>
  );
};

export default Navbar;