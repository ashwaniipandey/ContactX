"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Globe,
  Mail,
  Check,
  ArrowRight,
  Share2,
} from "lucide-react";

export default function Footer({ onOpenAboutModal, onOpenFileIo }) {
  const [emailSub, setEmailSub] = useState("");
  const [subSuccess, setSubSuccess] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailSub.trim()) {
      setSubSuccess(true);
      setTimeout(() => {
        setEmailSub("");
        setSubSuccess(false);
      }, 3000);
    }
  };

  return (
    <footer className="website-footer">
      {/* Top Banner / Newsletter Bar */}
      <div className="footer-top-card">
        <div className="footer-top-left">
          <div className="status-indicator-badge">
            <span className="status-dot-pulse" />
            <span>Operational &amp; Live Synced</span>
          </div>
          <h3 className="footer-hero-title">
            Take complete ownership of your personal network
          </h3>
          <p className="footer-hero-subtitle">
            Zero vendor lock-in, zero privacy compromises. Synced directly to your local files.
          </p>
        </div>

        <form className="footer-sub-form" onSubmit={handleSubscribe}>
          <div className="footer-input-group">
            <Mail size={16} className="footer-input-icon" />
            <input
              type="email"
              className="footer-sub-input"
              placeholder="Enter your email for updates..."
              value={emailSub}
              onChange={(e) => setEmailSub(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary btn-sm footer-sub-btn">
              {subSuccess ? (
                <>
                  <Check size={14} /> Subscribed!
                </>
              ) : (
                <>
                  Join Newsletter <ArrowRight size={13} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Main 4-Column Footer Navigation */}
      <div className="footer-grid">
        {/* Col 1: Brand & Mission */}
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <div className="brand-logo-icon" style={{ width: "34px", height: "34px", fontSize: "15px" }}>
              CH
            </div>
            <span className="footer-brand-name">ContactHub</span>
          </div>
          <p className="footer-brand-desc">
            A high-performance contact directory designed for professionals who value privacy, sub-millisecond search, and direct file persistence.
          </p>
          <div className="footer-trust-badge">
            <ShieldCheck size={16} color="#10b981" />
            <span>100% Private • Local File Sync</span>
          </div>
        </div>

        {/* Col 2: Product Features */}
        <div className="footer-col">
          <h4 className="footer-col-title">Product</h4>
          <ul className="footer-links">
            <li>
              <a href="#search-contacts-input">All Contacts Directory</a>
            </li>
            <li>
              <a href="#search-contacts-input">VIP &amp; Favorite Contacts</a>
            </li>
            <li>
              <a href="#search-contacts-input">Multi-Field Search</a>
            </li>
            <li>
              <button className="footer-link-btn" onClick={onOpenFileIo}>
                Local File Sync (contacts.txt)
              </button>
            </li>
            <li>
              <a href="#select-sort">Custom Sorters (A-Z / Date)</a>
            </li>
          </ul>
        </div>

        {/* Col 3: Architecture & Formats */}
        <div className="footer-col">
          <h4 className="footer-col-title">Architecture</h4>
          <ul className="footer-links">
            <li>
              <button className="footer-link-btn" onClick={onOpenFileIo}>
                Pipe-Delimited Storage
              </button>
            </li>
            <li>
              <span className="footer-link-dim">C++ Terminal Engine Sync</span>
            </li>
            <li>
              <span className="footer-link-dim">Sub-Millisecond Search</span>
            </li>
            <li>
              <span className="footer-link-dim">Dynamic Memory Vector</span>
            </li>
            <li>
              <span className="footer-link-dim">RESTful JSON API</span>
            </li>
          </ul>
        </div>

        {/* Col 4: About & Links */}
        <div className="footer-col">
          <h4 className="footer-col-title">About &amp; Community</h4>
          <ul className="footer-links">
            <li>
              <button className="footer-link-btn" onClick={onOpenAboutModal}>
                About ContactHub
              </button>
            </li>
            <li>
              <button className="footer-link-btn" onClick={onOpenAboutModal}>
                Help &amp; Documentation
              </button>
            </li>
            <li>
              <span className="footer-link-dim">Privacy Policy (Local-Only)</span>
            </li>
            <li>
              <span className="footer-link-dim">Terms of Service</span>
            </li>
            <li>
              <span className="footer-link-dim">API Documentation</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Social Links */}
      <div className="footer-bottom">
        <div className="footer-bottom-left">
          <span>&copy; {new Date().getFullYear()} ContactHub Directory. All rights reserved.</span>
          <span className="footer-bullet">•</span>
          <span>Crafted with precision for modern contact management.</span>
        </div>

        <div className="footer-socials">
          <a
            href="mailto:support@contacthub.com"
            className="footer-social-btn"
            title="Customer Support"
          >
            <Mail size={16} />
          </a>
          <a
            href="https://localhost:3000"
            className="footer-social-btn"
            title="Share ContactHub"
          >
            <Share2 size={16} />
          </a>
          <a
            href="https://localhost:3000"
            className="footer-social-btn"
            title="Official Website"
          >
            <Globe size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
