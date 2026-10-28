"use client";

import React, { useState } from "react";
import { Star, Phone, Mail, MapPin, Calendar, Edit3, Trash2, Copy, Check } from "lucide-react";

// Generate consistent vibrant gradient based on string name
function getAvatarGradient(name) {
  const gradients = [
    "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
    "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
  ];
  let hash = 0;
  for (let i = 0; i < (name || "").length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function ContactCard({
  contact,
  onToggleFavorite,
  onEdit,
  onDelete,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyPhone = (e) => {
    e.stopPropagation();
    if (contact.phone) {
      navigator.clipboard.writeText(contact.phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const gradient = getAvatarGradient(contact.name);
  const initials = getInitials(contact.name);

  return (
    <div className="contact-card">
      {/* Card Header */}
      <div className="card-header">
        <div className="card-avatar-wrapper">
          <div className="avatar" style={{ background: gradient }}>
            {initials}
          </div>
          <div className="card-name-group">
            <h3 className="card-name">{contact.name}</h3>
            <span className="card-date">
              <Calendar size={11} style={{ display: "inline", marginRight: "4px" }} />
              Added: {contact.dateAdded || "N/A"}
            </span>
          </div>
        </div>

        {/* Favorite Star Button */}
        <button
          className={`fav-btn ${contact.favorite ? "is-fav" : ""}`}
          onClick={() => onToggleFavorite(contact.phone)}
          title={contact.favorite ? "Remove from Favorites" : "Mark as Favorite"}
        >
          <Star
            size={20}
            fill={contact.favorite ? "#f59e0b" : "none"}
            color={contact.favorite ? "#f59e0b" : "currentColor"}
          />
        </button>
      </div>

      {/* Card Body / Details */}
      <div className="card-details">
        {/* Phone */}
        <div className="detail-row">
          <Phone size={15} className="detail-icon" />
          <a href={`tel:${contact.phone}`} className="detail-link" title="Call">
            {contact.phone}
          </a>
          <button
            onClick={handleCopyPhone}
            style={{
              background: "transparent",
              border: "none",
              color: copied ? "#34d399" : "var(--text-muted)",
              cursor: "pointer",
              padding: "2px",
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
            }}
            title={copied ? "Copied!" : "Copy Phone Number"}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
        </div>

        {/* Email */}
        <div className="detail-row">
          <Mail size={15} className="detail-icon" />
          <a href={`mailto:${contact.email}`} className="detail-link" title="Send Email">
            {contact.email}
          </a>
        </div>

        {/* Address */}
        <div className="detail-row">
          <MapPin size={15} className="detail-icon" />
          <span title={contact.address || "No address provided"}>
            {contact.address || "No address provided"}
          </span>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="card-footer">
        <span
          style={{
            fontSize: "11px",
            color: contact.favorite ? "#f59e0b" : "var(--text-muted)",
            fontWeight: 600,
          }}
        >
          {contact.favorite ? "★ VIP Contact" : "Personal Network"}
        </span>

        <div className="card-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onEdit(contact)}
            title="Edit Contact"
          >
            <Edit3 size={13} />
            <span>Edit</span>
          </button>

          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(contact)}
            title="Delete Contact"
          >
            <Trash2 size={13} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
