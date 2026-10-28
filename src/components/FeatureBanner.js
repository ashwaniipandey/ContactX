"use client";

import React from "react";
import { ShieldCheck, Zap, Sparkles, FolderSync } from "lucide-react";

export default function FeatureBanner() {
  return (
    <div className="classy-banner">
      <div className="classy-banner-item">
        <ShieldCheck size={16} className="classy-banner-icon" color="#10b981" />
        <span>100% Private &amp; Local Storage</span>
      </div>

      <div className="classy-banner-divider" />

      <div className="classy-banner-item">
        <Zap size={16} className="classy-banner-icon" color="#6366f1" />
        <span>Instant Sub-Millisecond Search</span>
      </div>

      <div className="classy-banner-divider" />

      <div className="classy-banner-item">
        <FolderSync size={16} className="classy-banner-icon" color="#ec4899" />
        <span>Live Disk Persistence (contacts.txt)</span>
      </div>

      <div className="classy-banner-divider" />

      <div className="classy-banner-item">
        <Sparkles size={16} className="classy-banner-icon" color="#f59e0b" />
        <span>Smart VIP Network Management</span>
      </div>
    </div>
  );
}
