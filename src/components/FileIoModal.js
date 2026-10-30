"use client";

import React, { useState, useEffect } from "react";
import { X, FileText, Download, Upload, Save, Check, RefreshCw } from "lucide-react";

export default function FileIoModal({ isOpen, onClose, onRefreshData }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  // const fetchRawFile = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await fetch("/api/contacts/raw-file");
  //     const text = await res.text();
  //     setContent(text);
  //   } catch (err) {
  //     setStatusMsg("Failed to load contacts.txt");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


const fetchRawFile = async () => {
  try {
    setLoading(true);

    const savedUser = JSON.parse(
      localStorage.getItem("contacthub_user") || "null"
    );

    const res = await fetch(
      "https://contactx-backend-7bbu.onrender.com/api/contacts/raw-file",
      {
        headers: {
          Authorization: `Bearer ${savedUser?.token || ""}`,
        },
      }
    );

    const text = await res.text();

    if (!res.ok) {
      throw new Error(text || "Failed to load file");
    }

    setContent(text);
  } catch (err) {
    setStatusMsg("Failed to load contacts.txt");
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    if (isOpen) {
      fetchRawFile();
      setStatusMsg("");
    }
  }, [isOpen]);

 if (!isOpen) return null;

const handleSave = async () => {
  try {
    setSaving(true);

    const savedUser = JSON.parse(
      localStorage.getItem("contacthub_user") || "null"
    );

    const res = await fetch(
      "https://contactx-backend-7bbu.onrender.com/api/contacts/raw-file",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${savedUser?.token || ""}`,
          "Content-Type": "text/plain",
        },
        body: content,
      }
    );

    const data = await res.json();

    if (data.success) {
      setStatusMsg("✅ Saved to contacts.txt successfully!");
      onRefreshData();
    } else {
      setStatusMsg(`❌ Error: ${data.error}`);
    }
  } catch (err) {
    setStatusMsg("Failed to save file");
  } finally {
    setSaving(false);
    setTimeout(() => setStatusMsg(""), 3000);
  }
};

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contacts.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setContent(event.target.result);
      setStatusMsg("File content loaded into editor. Click 'Save & Sync' to persist.");
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: "680px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FileText size={20} color="#818cf8" />
            <div>
              <h2 className="modal-title">contacts.txt File I/O Persistence</h2>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                Delimited format: name|phone|email|address|favorite|dateAdded
              </span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "12px",
              color: "var(--text-secondary)",
            }}
          >
            <span>Live Editor (Directly syncs with C++ backend file)</span>
            {statusMsg && (
              <span style={{ color: "#34d399", fontWeight: 600 }}>{statusMsg}</span>
            )}
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            rows={10}
            style={{
              width: "100%",
              padding: "14px",
              background: "#080c14",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              color: "#38bdf8",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              lineHeight: 1.6,
              resize: "vertical",
              outline: "none",
            }}
            placeholder="name|phone|email|address|favorite|dateAdded"
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <label
              className="btn btn-secondary btn-sm"
              style={{ cursor: "pointer" }}
            >
              <Upload size={14} />
              <span>Import .txt File</span>
              <input
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
            </label>

            <button
              className="btn btn-secondary btn-sm"
              onClick={handleDownload}
            >
              <Download size={14} />
              <span>Download contacts.txt</span>
            </button>

            <button
              className="btn btn-secondary btn-sm"
              onClick={fetchRawFile}
              disabled={loading}
              title="Reload file from disk"
            >
              <RefreshCw size={14} className={loading ? "spin-icon" : ""} />
              <span>Reload from Disk</span>
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            <Save size={14} />
            <span>{saving ? "Saving..." : "Save & Sync to Disk"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
