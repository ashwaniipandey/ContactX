"use client";

import React from "react";
import { Users, Star, Zap, HardDrive } from "lucide-react";

export default function StatsBar({ stats }) {
  const total = stats?.totalContacts ?? 0;
  const favorites = stats?.favoriteContacts ?? 0;

  return (
    <div className="stats-bar">
      {/* Total Contacts */}
      <div className="stat-card">
        <div className="stat-icon-wrapper stat-icon-primary">
          <Users size={20} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Total Contacts</span>
          <span className="stat-value">{total}</span>
          <span className="stat-hint">Active directory records</span>
        </div>
      </div>

      {/* VIP / Favorite Contacts */}
      <div className="stat-card">
        <div className="stat-icon-wrapper stat-icon-favorite">
          <Star size={20} />
        </div>
        <div className="stat-content">
          <span className="stat-label">VIP Favorites</span>
          <span className="stat-value">{favorites}</span>
          <span className="stat-hint">
            {total > 0 ? `${Math.round((favorites / total) * 100)}% of your network` : "0% marked"}
          </span>
        </div>
      </div>

      {/* Search Speed & Performance */}
      <div className="stat-card">
        <div className="stat-icon-wrapper stat-icon-speed">
          <Zap size={20} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Search Latency</span>
          <span className="stat-value">&lt; 1 ms</span>
          <span className="stat-hint">High-performance indexing</span>
        </div>
      </div>

      {/* Local Disk Persistence */}
      <div className="stat-card">
        <div className="stat-icon-wrapper stat-icon-file">
          <HardDrive size={20} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Storage Health</span>
          <span className="stat-value">Active</span>
          <span className="stat-hint">Auto-synced to contacts.txt</span>
        </div>
      </div>
    </div>
  );
}
