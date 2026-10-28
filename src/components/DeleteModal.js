"use client";

import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  contact,
  isDeleting = false,
}) {
  if (!isOpen || !contact) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: "460px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "rgba(244, 63, 94, 0.15)",
                color: "#fb7185",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AlertTriangle size={18} />
            </div>
            <h2 className="modal-title">Delete Contact</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Cancel">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ gap: "12px" }}>
          <p style={{ fontSize: "14px", color: "var(--text-primary)" }}>
            Are you sure you want to delete <strong>{contact.name}</strong>?
          </p>
          <div
            style={{
              padding: "12px 14px",
              background: "rgba(0, 0, 0, 0.3)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-subtle)",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              color: "var(--text-secondary)",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <div>📱 Phone: {contact.phone}</div>
            <div>✉️ Email: {contact.email}</div>
            <div style={{ color: "var(--text-muted)", marginTop: "4px" }}>
              This will permanently remove this contact from your directory and local file.
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel (N)
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(contact.phone)}
            disabled={isDeleting}
          >
            <Trash2 size={14} />
            <span>{isDeleting ? "Deleting..." : "Yes, Delete (Y)"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
