"use client";

import React, { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import StatsBar from "@/components/StatsBar";
import FeatureBanner from "@/components/FeatureBanner";
import Toolbar from "@/components/Toolbar";
import ContactCard from "@/components/ContactCard";
import ContactTable from "@/components/ContactTable";
import ContactModal from "@/components/ContactModal";
import DeleteModal from "@/components/DeleteModal";
import FileIoModal from "@/components/FileIoModal";
import AboutModal from "@/components/AboutModal";
import AuthModal from "@/components/AuthModal";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import { UserPlus, SearchX, RefreshCw } from "lucide-react";

export default function Home() {
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Theme state ('dark' | 'light')
  const [theme, setTheme] = useState("dark");

  // User Authentication state
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState("none");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("grid");

  // Modals state
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [deletingContact, setDeletingContact] = useState(null);
  const [isFileIoOpen, setIsFileIoOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  // Async action states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success") => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initialize theme and user from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("contacthub_theme") || "dark";
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);

      const savedUser = localStorage.getItem("contacthub_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, []);

  // Toggle Theme handler
  const handleToggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    try {
      localStorage.setItem("contacthub_theme", nextTheme);
    } catch (e) {}
    addToast(`Switched to ${nextTheme === "dark" ? "Dark 🌙" : "Light ☀️"} mode`, "info");
  };

  // Auth Handlers
  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    try {
      localStorage.setItem("contacthub_user", JSON.stringify(authenticatedUser));
    } catch (e) {}
    addToast(`Welcome back, ${authenticatedUser.name}!`, "success");
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem("contacthub_user");
    } catch (e) {}
    addToast("Signed out successfully", "info");
  };

  // Fetch contacts from backend API (DSA logic executes efficiently in backend)
  const fetchContacts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) {
        params.append("q", searchQuery.trim());
        params.append("field", searchField);
      }
      if (favoritesOnly) {
        params.append("favorites", "true");
      }
      if (sortBy !== "none") {
        params.append("sort", sortBy);
        params.append("order", sortOrder);
      }

      // const res = await fetch(`/api/contacts?

   const res = await fetch(`https://contactx-backend-7bbu.onrender.com/api/contacts?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        setContacts(json.data || []);
        if (json.stats) setStats(json.stats);
      } else {
        addToast(json.error || "Failed to load contacts", "error");
      }
    } catch (err) {
      addToast("Network error connecting to API", "error");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, searchField, favoritesOnly, sortBy, sortOrder]);

  // Debounced search query & initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContacts();
    }, 150);
    return () => clearTimeout(timer);
  }, [fetchContacts]);

  // Add or Update Contact
  const handleSaveContact = async (formData) => {
    try {
      setIsSubmitting(true);
      const isEditing = Boolean(formData.oldPhone);
      const endpoint = "https://contactx-backend-7bbu.onrender.com/api/contacts";
      // const endpoint = "/api/contacts";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (json.success) {
        addToast(
          isEditing ? "✅ Contact Updated Successfully!" : "✅ Contact Added Successfully!",
          "success"
        );
        setIsContactModalOpen(false);
        setEditingContact(null);
        fetchContacts();
      } else {
        addToast(json.error || "Operation failed", "error");
      }
    } catch (err) {
      addToast("Network error saving contact", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Favorite Status
  const handleToggleFavorite = async (phone) => {
    // Optimistic UI update
    setContacts((prev) =>
      prev.map((c) => (c.phone === phone ? { ...c, favorite: !c.favorite } : c))
    );

    try {
      const res = await fetch("/api/contacts/toggle-favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const json = await res.json();
      if (json.success) {
        addToast(
          json.favorite ? "⭐ Added to VIP Favorites!" : "Removed from Favorites",
          "info"
        );
        fetchContacts();
      } else {
        fetchContacts();
        addToast(json.error || "Failed to update favorite", "error");
      }
    } catch (err) {
      fetchContacts();
      addToast("Failed to toggle favorite", "error");
    }
  };

  // Delete Contact
  const handleConfirmDelete = async (phone) => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/contacts?phone=${encodeURIComponent(phone)}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (json.success) {
        addToast("✅ Contact Deleted Successfully!", "success");
        setDeletingContact(null);
        fetchContacts();
      } else {
        addToast(json.error || "Failed to delete contact", "error");
      }
    } catch (err) {
      addToast("Network error deleting contact", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = (contact) => {
    setEditingContact(contact);
    setIsContactModalOpen(true);
  };

  const handleDeleteClick = (contact) => {
    setDeletingContact(contact);
  };

  const existingPhones = contacts.map((c) => c.phone);

  return (
    <main className="app-container">
      {/* Top Classy Header */}
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        user={user}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onAddContact={() => {
          setEditingContact(null);
          setIsContactModalOpen(true);
        }}
        onOpenFileIo={() => setIsFileIoOpen(true)}
        onOpenAboutModal={() => setIsAboutModalOpen(true)}
        onFilterFavorites={(favOnly) => setFavoritesOnly(favOnly)}
      />

      {/* Top Stats Overview */}
      <StatsBar stats={stats} />

      {/* Classy Features Bar */}
      <FeatureBanner />

      {/* Search, Filter, and View Toolbar */}
      <Toolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchField={searchField}
        onSearchFieldChange={setSearchField}
        favoritesOnly={favoritesOnly}
        onToggleFavoritesOnly={setFavoritesOnly}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={(field, order) => {
          setSortBy(field);
          setSortOrder(order);
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalCount={stats?.totalContacts ?? contacts.length}
        filteredCount={contacts.length}
      />

      {/* Content Area: Cards or Table */}
      {loading ? (
        <div className="empty-state">
          <RefreshCw size={36} className="spin-icon" color="#6366f1" />
          <h2 className="empty-title">Loading ContactHub Directory...</h2>
          <p className="empty-desc">
            Synchronizing local files and preparing your address book
          </p>
        </div>
      ) : contacts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <SearchX size={30} />
          </div>
          <h2 className="empty-title">No Contacts Found</h2>
          <p className="empty-desc">
            {searchQuery
              ? `No contacts match "${searchQuery}" in ${searchField}. Try a different search term.`
              : favoritesOnly
              ? "No VIP favorite contacts marked yet. Click the star icon (★) on any contact to mark them as a VIP!"
              : "Your contact list is currently empty. Add your first contact or load contacts from file!"}
          </p>

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            {searchQuery && (
              <button
                className="btn btn-secondary"
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </button>
            )}
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditingContact(null);
                setIsContactModalOpen(true);
              }}
            >
              <UserPlus size={15} />
              <span>Add First Contact</span>
            </button>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        <div className="contacts-grid">
          {contacts.map((contact) => (
            <ContactCard
              key={contact.phone}
              contact={contact}
              onToggleFavorite={handleToggleFavorite}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <ContactTable
          contacts={contacts}
          onToggleFavorite={handleToggleFavorite}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Real Website Footer with Links, About, and Newsletter */}
      <Footer
        onOpenAboutModal={() => setIsAboutModalOpen(true)}
        onOpenFileIo={() => setIsFileIoOpen(true)}
      />

      {/* Add / Edit Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => {
          setIsContactModalOpen(false);
          setEditingContact(null);
        }}
        onSubmit={handleSaveContact}
        initialData={editingContact}
        existingPhones={existingPhones}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(deletingContact)}
        contact={deletingContact}
        onClose={() => setDeletingContact(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* contacts.txt File I/O Modal */}
      <FileIoModal
        isOpen={isFileIoOpen}
        onClose={() => setIsFileIoOpen(false)}
        onRefreshData={fetchContacts}
      />

      {/* Platform About & Information Modal */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      {/* User Login & Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </main>
  );
}
