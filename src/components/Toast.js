"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isError = toast.type === "error";

        return (
          <div
            key={toast.id}
            className={`toast ${isSuccess ? "toast-success" : isError ? "toast-error" : ""}`}
          >
            {isSuccess && <CheckCircle2 size={18} color="#34d399" />}
            {isError && <AlertCircle size={18} color="#fb7185" />}
            {!isSuccess && !isError && <Info size={18} color="#818cf8" />}

            <div style={{ flex: 1 }}>{toast.message}</div>

            <button
              onClick={() => onDismiss(toast.id)}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "2px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
