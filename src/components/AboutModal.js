"use client";

import React from "react";
import { X, ShieldCheck, Zap, HardDrive, Sparkles, Globe, Heart, ExternalLink } from "lucide-react";

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: "600px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-md)",
                background: "var(--primary-gradient)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 800,
                fontSize: "16px",
              }}
            >
              CH
            </div>
            <div>
              <h2 className="modal-title">About ContactHub</h2>
              <span style={{ fontSize: "12px", color: "var(--text-sub)" }}>
                The Independent, Privacy-First Contact Platform
              </span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ gap: "18px" }}>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "var(--text-main)" }}>
            <strong>ContactHub</strong> is built for developers, entrepreneurs, and privacy-conscious professionals who demand full ownership of their address book without relying on walled-garden corporate ecosystems.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <div
              style={{
                padding: "14px",
                background: "var(--surface-pill)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "13px" }}>
                <ShieldCheck size={16} color="#10b981" />
                <span>100% Private</span>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-sub)", lineHeight: "1.4" }}>
                Data resides exclusively on your own machine. Zero telemetries, tracking, or cloud surveillance.
              </p>
            </div>

            <div
              style={{
                padding: "14px",
                background: "var(--surface-pill)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "13px" }}>
                <HardDrive size={16} color="#6366f1" />
                <span>Direct File Sync</span>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-sub)", lineHeight: "1.4" }}>
                Auto-synced with plain-text <code>contacts.txt</code> format. Effortlessly backup, edit, or migrate.
              </p>
            </div>

            <div
              style={{
                padding: "14px",
                background: "var(--surface-pill)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "13px" }}>
                <Zap size={16} color="#ec4899" />
                <span>Sub-Millisecond</span>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-sub)", lineHeight: "1.4" }}>
                High-performance backend indexing with instant live multi-field filtering across all contacts.
              </p>
            </div>

            <div
              style={{
                padding: "14px",
                background: "var(--surface-pill)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "13px" }}>
                <Sparkles size={16} color="#f59e0b" />
                <span>Modern Experience</span>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-sub)", lineHeight: "1.4" }}>
                Calibrated Dark and Light themes, quick phone copying, direct calling, and responsive layouts.
              </p>
            </div>
          </div>

          <div
            style={{
              padding: "12px 16px",
              background: "rgba(99, 102, 241, 0.08)",
              border: "1px solid rgba(99, 102, 241, 0.2)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "12px",
            }}
          >
            <span style={{ color: "var(--text-main)", fontWeight: 600 }}>
              Version 2.4.0 • Built with Next.js &amp; React
            </span>
            <span style={{ color: "#10b981", fontWeight: 700 }}>
              ● Operational
            </span>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Back to Directory
          </button>
        </div>
      </div>
    </div>
  );
}
