"use client";

import React from "react";
import { Search, X, LayoutGrid, List, Star } from "lucide-react";

export default function Toolbar({
  searchQuery,
  onSearchChange,
  searchField,
  onSearchFieldChange,
  favoritesOnly,
  onToggleFavoritesOnly,
  sortBy,
  sortOrder,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalCount,
  filteredCount,
}) {
  return (
    <div className="toolbar">
      {/* Top Row: Search Input & Field Selector & Sort Selector */}
      <div className="toolbar-top-row">
        <div className="search-container">
          <Search className="search-icon" size={17} />
          <input
            id="search-contacts-input"
            type="text"
            className="search-input"
            placeholder={`Search contacts by ${searchField === "all" ? "name, phone, email, address..." : searchField}...`}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              className="search-clear-btn"
              onClick={() => onSearchChange("")}
              title="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Search Field Filter */}
        <select
          id="select-search-field"
          className="custom-select"
          value={searchField}
          onChange={(e) => onSearchFieldChange(e.target.value)}
        >
          <option value="all">🔍 All Fields</option>
          <option value="name">👤 Name</option>
          <option value="phone">📞 Phone Number</option>
          <option value="email">✉️ Email Address</option>
        </select>

        {/* Sorting Dropdown */}
        <select
          id="select-sort"
          className="custom-select"
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split("-");
            onSortChange(field, order);
          }}
        >
          <option value="none-asc">⚡ Default Order</option>
          <option value="name-asc">🔤 Name (A → Z)</option>
          <option value="name-desc">🔤 Name (Z → A)</option>
          <option value="phone-asc">📱 Phone Number</option>
          <option value="date-desc">📅 Newest Added</option>
          <option value="date-asc">📅 Oldest Added</option>
        </select>
      </div>

      {/* Bottom Row: Filter Chips & View Mode Toggle */}
      <div className="toolbar-bottom-row">
        <div className="filter-chips">
          <button
            className={`filter-chip ${!favoritesOnly ? "active" : ""}`}
            onClick={() => onToggleFavoritesOnly(false)}
          >
            <span>All Contacts</span>
            <span className="chip-count">{totalCount}</span>
          </button>

          <button
            className={`filter-chip ${favoritesOnly ? "active-fav" : ""}`}
            onClick={() => onToggleFavoritesOnly(!favoritesOnly)}
            title="Show VIP contacts only"
          >
            <Star
              size={13}
              fill={favoritesOnly ? "#f59e0b" : "none"}
              color={favoritesOnly ? "#f59e0b" : "currentColor"}
            />
            <span>VIP Favorites</span>
            {favoritesOnly && <span className="chip-count">{filteredCount}</span>}
          </button>

          {searchQuery && (
            <span style={{ fontSize: "12px", color: "var(--text-sub)" }}>
              Found {filteredCount} {filteredCount === 1 ? "match" : "matches"}
            </span>
          )}
        </div>

        {/* Grid vs Table Toggle */}
        <div className="view-toggle-group">
          <button
            className={`view-toggle-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => onViewModeChange("grid")}
            title="Card Grid View"
          >
            <LayoutGrid size={14} />
            <span>Cards</span>
          </button>
          <button
            className={`view-toggle-btn ${viewMode === "table" ? "active" : ""}`}
            onClick={() => onViewModeChange("table")}
            title="Compact Table View"
          >
            <List size={14} />
            <span>Table</span>
          </button>
        </div>
      </div>
    </div>
  );
}
