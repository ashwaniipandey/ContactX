"use client";

import React from "react";
import { Star, Phone, Mail, MapPin, Calendar, Edit3, Trash2 } from "lucide-react";

function getAvatarGradient(name) {
  const gradients = [
    "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
    "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
  ];
  let hash = 0;
  for (let i = 0; i < (name || "").length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

export default function ContactTable({
  contacts,
  onToggleFavorite,
  onEdit,
  onDelete,
}) {
  return (
    <div className="table-wrapper">
      <table className="contacts-table">
        <thead>
          <tr>
            <th style={{ width: "40px", textAlign: "center" }}>Fav</th>
            <th>Contact Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
            <th>Date Added</th>
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.phone}>
              {/* Favorite Toggle */}
              <td style={{ textAlign: "center" }}>
                <button
                  className={`fav-btn ${contact.favorite ? "is-fav" : ""}`}
                  onClick={() => onToggleFavorite(contact.phone)}
                  title={contact.favorite ? "Remove from Favorites" : "Mark as Favorite"}
                >
                  <Star
                    size={16}
                    fill={contact.favorite ? "#f59e0b" : "none"}
                    color={contact.favorite ? "#f59e0b" : "currentColor"}
                  />
                </button>
              </td>

              {/* Name & Avatar */}
              <td>
                <div className="table-user-cell">
                  <div
                    className="table-avatar"
                    style={{ background: getAvatarGradient(contact.name) }}
                  >
                    {contact.name ? contact.name.slice(0, 1).toUpperCase() : "?"}
                  </div>
                  <div>
                    <strong style={{ display: "block", color: "#fff" }}>
                      {contact.name}
                    </strong>
                    {contact.favorite && (
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#f59e0b",
                          fontWeight: 500,
                        }}
                      >
                        ★ Favorite
                      </span>
                    )}
                  </div>
                </div>
              </td>

              {/* Phone */}
              <td>
                <a
                  href={`tel:${contact.phone}`}
                  style={{
                    color: "var(--text-primary)",
                    textDecoration: "none",
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                  }}
                >
                  {contact.phone}
                </a>
              </td>

              {/* Email */}
              <td>
                <a
                  href={`mailto:${contact.email}`}
                  style={{ color: "var(--text-secondary)", textDecoration: "none" }}
                >
                  {contact.email}
                </a>
              </td>

              {/* Address */}
              <td>
                <span
                  style={{
                    color: "var(--text-muted)",
                    maxWidth: "200px",
                    display: "inline-block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {contact.address || "—"}
                </span>
              </td>

              {/* Date Added */}
              <td>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    color: "var(--text-muted)",
                  }}
                >
                  {contact.dateAdded || "—"}
                </span>
              </td>

              {/* Actions */}
              <td style={{ textAlign: "right" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "6px",
                  }}
                >
                  <button
                    className="btn btn-secondary btn-sm btn-icon"
                    onClick={() => onEdit(contact)}
                    title="Edit Contact"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    className="btn btn-danger btn-sm btn-icon"
                    onClick={() => onDelete(contact)}
                    title="Delete Contact"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
