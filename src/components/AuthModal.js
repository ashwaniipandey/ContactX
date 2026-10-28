"use client";

import React, { useState } from "react";
import { X, Mail, Lock, User, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isSignUp ? "signup" : "login",
          name,
          email,
          password,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onAuthSuccess(data.user);
        onClose();
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "demo" }),
      });
      const data = await res.json();
      if (data.success) {
        onAuthSuccess(data.user);
        onClose();
      } else {
        setError(data.error || "Demo login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content auth-modal-card"
        style={{ maxWidth: "440px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header" style={{ padding: "20px 24px" }}>
          <div>
            <h2 className="modal-title" style={{ fontSize: "19px" }}>
              {isSignUp ? "Create an Account" : "Welcome Back"}
            </h2>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
              {isSignUp
                ? "Sign up to securely access and sync ContactHub"
                : "Sign in to manage and persist your contacts"}
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        {/* 1-Click Quick Demo Login Banner */}
        <div style={{ padding: "16px 24px 0" }}>
          <button
            type="button"
            className="btn btn-demo-quick"
            onClick={handleDemoLogin}
            disabled={loading}
          >
            <Sparkles size={16} color="#fbbf24" />
            <span style={{ fontWeight: 600 }}>1-Click Instant Demo Login</span>
            <ArrowRight size={14} style={{ marginLeft: "auto" }} />
          </button>

          <div className="auth-divider">
            <span>or continue with email</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: "16px 24px 20px", gap: "14px" }}>
            {error && (
              <div
                style={{
                  padding: "10px 14px",
                  background: "rgba(244, 63, 94, 0.12)",
                  border: "1px solid rgba(244, 63, 94, 0.3)",
                  borderRadius: "var(--radius-sm)",
                  color: "#fb7185",
                  fontSize: "12px",
                }}
              >
                {error}
              </div>
            )}

            {isSignUp && (
              <div className="form-group">
                <label className="form-label" htmlFor="auth-name">
                  Full Name
                </label>
                <div className="auth-input-wrapper">
                  <User size={15} className="auth-input-icon" />
                  <input
                    id="auth-name"
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: "38px" }}
                    placeholder="e.g. Vinay Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={isSignUp}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="auth-email">
                Email Address
              </label>
              <div className="auth-input-wrapper">
                <Mail size={15} className="auth-input-icon" />
                <input
                  id="auth-email"
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: "38px" }}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="auth-password">
                Password
              </label>
              <div className="auth-input-wrapper">
                <Lock size={15} className="auth-input-icon" />
                <input
                  id="auth-password"
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: "38px" }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {!isSignUp && (
                <span style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                  Demo credentials: <code>admin@contacthub.com</code> / <code>password123</code>
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "6px", height: "42px" }}
              disabled={loading}
            >
              {loading ? "Processing..." : isSignUp ? "Create Free Account" : "Sign In to ContactHub"}
            </button>
          </div>

          <div
            className="modal-footer"
            style={{
              justifyContent: "center",
              padding: "16px 24px",
              background: "rgba(0,0,0,0.06)",
            }}
          >
            <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              {isSignUp ? "Already have an account?" : "Don't have an account yet?"}
            </span>
            <button
              type="button"
              style={{
                background: "transparent",
                border: "none",
                color: "#818cf8",
                fontWeight: 600,
                fontSize: "13px",
                cursor: "pointer",
                padding: "2px 6px",
              }}
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
