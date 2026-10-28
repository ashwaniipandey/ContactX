"use client";

import React from "react";
import { UserPlus, FileText, Sun, Moon, LogIn, LogOut, Info, ShieldCheck, Sparkles } from "lucide-react";

export default function Header({
  theme,
  onToggleTheme,
  user,
  onOpenAuthModal,
  onLogout,
  onAddContact,
  onOpenFileIo,
  onOpenAboutModal,
  onFilterFavorites,
}) {
  return (
    <header className="header">
      {/* Brand Logo & Tagline */}
      <div className="brand-wrapper">
        <div className="brand-logo-icon">CH</div>
        <div className="brand-info">
          <div className="brand-title-row">
            <h1 className="brand-title">ContactHub</h1>
            <span className="badge-pro">PRO DIRECTORY</span>
          </div>
          <p className="brand-subtitle">
            Private, ultra-fast personal &amp; professional contact manager
          </p>
        </div>
      </div>

      {/* Header Quick Navigation Links */}
      <nav className="header-nav">
        <button
          className="header-nav-link"
          onClick={() => onFilterFavorites(false)}
          title="View all contacts"
        >
          Directory
        </button>
        <button
          className="header-nav-link"
          onClick={() => onFilterFavorites(true)}
          title="View VIP / Starred contacts"
        >
          ⭐ VIPs
        </button>
        <button
          className="header-nav-link"
          onClick={onOpenAboutModal}
          title="About ContactHub"
        >
          About
        </button>
      </nav>

      {/* Header Actions */}
      <div className="header-actions">
        {/* Light / Dark Mode Toggle */}
        <button
          id="btn-toggle-theme"
          className="btn-theme-toggle"
          onClick={onToggleTheme}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? <Sun size={17} color="#fbbf24" /> : <Moon size={17} color="#6366f1" />}
        </button>

        {/* contacts.txt File I/O */}
        <button
          id="btn-file-io"
          onClick={onOpenFileIo}
          className="btn btn-secondary btn-sm"
          title="Inspect & sync local contacts.txt file"
        >
          <FileText size={15} />
          <span>Local Sync</span>
        </button>

        {/* Add Contact Button */}
        <button
          id="btn-add-contact"
          onClick={onAddContact}
          className="btn btn-primary btn-sm"
        >
          <UserPlus size={15} />
          <span>Add Contact</span>
        </button>

        {/* User Auth Section */}
        {user ? (
          <div className="user-profile-badge" title={`Signed in as ${user.email}`}>
            <div className="user-avatar-mini">
              {user.name ? user.name.slice(0, 1).toUpperCase() : "U"}
            </div>
            <span>{user.name.split(" ")[0]}</span>
            <button
              className="btn-logout-mini"
              onClick={onLogout}
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut size={13} />
            </button>
          </div>
        ) : (
          <button
            id="btn-login"
            className="btn btn-secondary btn-sm"
            onClick={onOpenAuthModal}
            title="Sign in or try 1-click demo"
          >
            <LogIn size={15} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
