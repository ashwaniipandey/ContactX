"use client";

import React, { useState, useEffect } from "react";
import { X, User, Phone, Mail, MapPin, Star, AlertCircle } from "lucide-react";

export default function ContactModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  existingPhones = [],
  isSubmitting = false,
}) {
  const isEditing = Boolean(initialData);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setPhone(initialData.phone || "");
      setEmail(initialData.email || "");
      setAddress(initialData.address || "");
      setFavorite(Boolean(initialData.favorite));
    } else {
      setName("");
      setPhone("");
      setEmail("");
      setAddress("");
      setFavorite(false);
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Validation mirroring ContactManager C++ validation methods
  const validateForm = () => {
    const newErrors = {};

    // 1. Name validation
    if (!name.trim()) {
      newErrors.name = "Name cannot be empty!";
    }

    // 2. Phone validation (ContactManager::isValidPhone: exactly 10 digits)
    const cleanedPhone = phone.trim();
    if (!/^\d{10}$/.test(cleanedPhone)) {
      newErrors.phone = "Invalid phone number! Must be exactly 10 digits.";
    } else {
      // 3. Duplicate phone validation (ContactManager::isDuplicatePhone)
      const isDuplicate = existingPhones.some((p) => {
        if (isEditing && p === initialData.phone) {
          return false; // allowed to keep own phone
        }
        return p === cleanedPhone;
      });

      if (isDuplicate) {
        newErrors.phone = `Phone number ${cleanedPhone} already exists!`;
      }
    }

    // 4. Email validation (ContactManager::isValidEmail)
    const cleanedEmail = email.trim();
    const atPos = cleanedEmail.indexOf("@");
    const dotPos = cleanedEmail.indexOf(".", atPos);
    if (!cleanedEmail || atPos <= 0 || dotPos <= atPos + 1 || dotPos >= cleanedEmail.length - 1) {
      newErrors.email = "Invalid email! Must contain '@' and domain extension (e.g. user@gmail.com).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit({
      oldPhone: isEditing ? initialData.phone : undefined,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      favorite,
      dateAdded: isEditing ? initialData.dateAdded : undefined,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? "Edit Contact" : "Add New Contact"}
          </h2>
          <button className="modal-close-btn" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="input-contact-name">
                <span>Contact Name *</span>
                <User size={14} />
              </label>
              <input
                id="input-contact-name"
                type="text"
                className={`form-input ${errors.name ? "error" : ""}`}
                placeholder="e.g. Vinay Sharma"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                }}
                autoFocus
              />
              {errors.name && (
                <div className="form-error">
                  <AlertCircle size={12} style={{ display: "inline", marginRight: "4px" }} />
                  {errors.name}
                </div>
              )}
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label className="form-label" htmlFor="input-contact-phone">
                <span>Phone Number (10 Digits) *</span>
                <Phone size={14} />
              </label>
              <input
                id="input-contact-phone"
                type="tel"
                maxLength={10}
                className={`form-input ${errors.phone ? "error" : ""}`}
                placeholder="e.g. 1234567890"
                value={phone}
                onChange={(e) => {
                  // Allow only numeric characters
                  const val = e.target.value.replace(/\D/g, "");
                  setPhone(val);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }));
                }}
              />
              <span className="form-hint">
                Must be exactly 10 numeric digits. Duplicates not allowed.
              </span>
              {errors.phone && (
                <div className="form-error">
                  <AlertCircle size={12} style={{ display: "inline", marginRight: "4px" }} />
                  {errors.phone}
                </div>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="input-contact-email">
                <span>Email Address *</span>
                <Mail size={14} />
              </label>
              <input
                id="input-contact-email"
                type="email"
                className={`form-input ${errors.email ? "error" : ""}`}
                placeholder="e.g. vinay@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                }}
              />
              {errors.email && (
                <div className="form-error">
                  <AlertCircle size={12} style={{ display: "inline", marginRight: "4px" }} />
                  {errors.email}
                </div>
              )}
            </div>

            {/* Address */}
            <div className="form-group">
              <label className="form-label" htmlFor="input-contact-address">
                <span>Physical Address</span>
                <MapPin size={14} />
              </label>
              <input
                id="input-contact-address"
                type="text"
                className="form-input"
                placeholder="e.g. Dhanas, Chandigarh"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* Favorite Switch (mirrors C++ cin >> fav; fav == 'Y' || fav == 'y') */}
            <div className="form-switch-row">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Star
                  size={18}
                  fill={favorite ? "#f59e0b" : "none"}
                  color={favorite ? "#f59e0b" : "var(--text-muted)"}
                />
                <div>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>
                    Mark as Favorite
                  </span>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    Included in viewFavoriteContacts() filter
                  </p>
                </div>
              </div>

              <input
                id="checkbox-favorite"
                type="checkbox"
                checked={favorite}
                onChange={(e) => setFavorite(e.target.checked)}
                style={{ width: "18px", height: "18px", accentColor: "#6366f1", cursor: "pointer" }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Add Contact"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
