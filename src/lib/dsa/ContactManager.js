import fs from "fs";
import path from "path";
import { Contact } from "./Contact.js";
import { ContactVector } from "./ContactVector.js";

/**
 * Helper to convert text to lower case
 * Mirrors C++ string toLowerCase(string text)
 */
function toLowerCase(text) {
  return String(text || "").toLowerCase();
}

/**
 * ContactManager
 * Complete full-stack implementation of ContactManager.h and ContactManager.cpp
 * 
 * Data Structures & Algorithms used:
 * - Dynamic Array (ContactVector) for contiguous storage
 * - Linear Search for Name, Phone, Email lookup (O(N))
 * - Custom Predicate Filtering for Favorites & Multi-field search
 * - Custom Comparator Sorting (std::sort equivalent, O(N log N))
 * - Uniqueness and Validity Constraints
 * - File I/O Persistence: loads and saves the exact pipe-delimited format (name|phone|email|address|favorite|dateAdded)
 */
export class ContactManager {
  constructor(storageFilePath = null) {
    this.contacts = new ContactVector(16);
    this.primaryFilePath = storageFilePath || path.join(process.cwd(), "contacts.txt");
    this.secondaryFilePath = path.join(process.cwd(), "ContactHub", "contacts.txt");
    this.lastOperationMetrics = null;

    // Load from disk automatically upon initialization
    this.loadFromFile();
  }

  // ===================== CRUD OPERATIONS =====================

  /**
   * Add a new contact to the dynamic array
   * Mirrors ContactManager::addContact(Contact contact)
   * Big-O: O(N) duplicate check + O(1) amortized push_back
   */
  addContact(contact) {
    const startTime = performance.now();

    // Validation
    if (!contact.getName()) {
      throw new Error("Name cannot be empty!");
    }

    if (!this.isValidPhone(contact.getPhone())) {
      throw new Error("Invalid phone number! Must be exactly 10 numeric digits.");
    }

    if (this.isDuplicatePhone(contact.getPhone())) {
      throw new Error(`Phone number ${contact.getPhone()} already exists!`);
    }

    if (!this.isValidEmail(contact.getEmail())) {
      throw new Error("Invalid email address! Must contain '@' and a valid domain '.'.");
    }

    this.contacts.push_back(contact);
    this.saveToFile();

    const elapsed = performance.now() - startTime;
    this.lastOperationMetrics = {
      action: "addContact",
      timeComplexity: "O(1) amortized insertion (with O(N) duplicate check)",
      durationMs: Number(elapsed.toFixed(3)),
      totalCount: this.contacts.size(),
    };

    return contact;
  }

  /**
   * Returns all contacts as an array of Contact objects
   * Mirrors ContactManager::viewContacts()
   * Big-O: O(N)
   */
  viewContacts() {
    return this.contacts.toArray();
  }

  // ===================== SEARCH ALGORITHMS =====================

  /**
   * Linear Search by Name (case-insensitive)
   * Mirrors ContactManager::searchByName(string name)
   * Big-O: O(N) time complexity, where N is the total number of contacts
   */
  searchByName(name, exactMatch = false) {
    const startTime = performance.now();
    const query = toLowerCase(name);
    const matches = [];
    let comparisons = 0;

    for (let i = 0; i < this.contacts.size(); i++) {
      comparisons++;
      const contact = this.contacts.at(i);
      const contactName = toLowerCase(contact.getName());

      if (exactMatch ? contactName === query : contactName.includes(query)) {
        matches.push(contact);
      }
    }

    const elapsed = performance.now() - startTime;
    this.lastOperationMetrics = {
      action: "searchByName",
      query,
      algorithm: "Linear Search (case-insensitive)",
      timeComplexity: "O(N)",
      comparisons,
      matchesCount: matches.length,
      durationMs: Number(elapsed.toFixed(3)),
    };

    return matches;
  }

  /**
   * Linear Search by Phone
   * Mirrors ContactManager::searchByPhone(string phone)
   * Big-O: O(N)
   */
  searchByPhone(phone, exactMatch = false) {
    const startTime = performance.now();
    const query = String(phone || "").trim();
    const matches = [];
    let comparisons = 0;

    for (let i = 0; i < this.contacts.size(); i++) {
      comparisons++;
      const contact = this.contacts.at(i);
      const contactPhone = contact.getPhone();

      if (exactMatch ? contactPhone === query : contactPhone.includes(query)) {
        matches.push(contact);
      }
    }

    const elapsed = performance.now() - startTime;
    this.lastOperationMetrics = {
      action: "searchByPhone",
      query,
      algorithm: "Linear Search (phone equality)",
      timeComplexity: "O(N)",
      comparisons,
      matchesCount: matches.length,
      durationMs: Number(elapsed.toFixed(3)),
    };

    return matches;
  }

  /**
   * Linear Search by Email (case-insensitive)
   * Mirrors ContactManager::searchByEmail(string email)
   * Big-O: O(N)
   */
  searchByEmail(email, exactMatch = false) {
    const startTime = performance.now();
    const query = toLowerCase(email);
    const matches = [];
    let comparisons = 0;

    for (let i = 0; i < this.contacts.size(); i++) {
      comparisons++;
      const contact = this.contacts.at(i);
      const contactEmail = toLowerCase(contact.getEmail());

      if (exactMatch ? contactEmail === query : contactEmail.includes(query)) {
        matches.push(contact);
      }
    }

    const elapsed = performance.now() - startTime;
    this.lastOperationMetrics = {
      action: "searchByEmail",
      query,
      algorithm: "Linear Search (case-insensitive)",
      timeComplexity: "O(N)",
      comparisons,
      matchesCount: matches.length,
      durationMs: Number(elapsed.toFixed(3)),
    };

    return matches;
  }

  /**
   * Multi-field search across Name, Phone, Email, and Address
   */
  search(query, field = "all") {
    if (!query || !query.trim()) {
      return this.viewContacts();
    }

    const q = toLowerCase(query.trim());
    if (field === "name") return this.searchByName(q);
    if (field === "phone") return this.searchByPhone(q);
    if (field === "email") return this.searchByEmail(q);

    // Multi-field search
    const startTime = performance.now();
    const matches = [];
    let comparisons = 0;

    for (let i = 0; i < this.contacts.size(); i++) {
      comparisons++;
      const c = this.contacts.at(i);
      if (
        toLowerCase(c.getName()).includes(q) ||
        c.getPhone().includes(q) ||
        toLowerCase(c.getEmail()).includes(q) ||
        toLowerCase(c.getAddress()).includes(q)
      ) {
        matches.push(c);
      }
    }

    const elapsed = performance.now() - startTime;
    this.lastOperationMetrics = {
      action: "search(multi-field)",
      query: q,
      algorithm: "Multi-Field Linear Scan",
      timeComplexity: "O(N)",
      comparisons,
      matchesCount: matches.length,
      durationMs: Number(elapsed.toFixed(3)),
    };

    return matches;
  }

  // ===================== UPDATE & DELETE =====================

  /**
   * Update an existing contact identified by oldPhone
   * Mirrors ContactManager::updateContact(string oldPhone, Contact updatedContact)
   * Big-O: O(N) linear search + O(1) in-place update
   */
  updateContact(oldPhone, updatedContact) {
    const startTime = performance.now();

    // Validation
    if (!updatedContact.getName()) {
      throw new Error("Name cannot be empty!");
    }

    if (!this.isValidPhone(updatedContact.getPhone())) {
      throw new Error("Invalid phone number! Must be exactly 10 digits.");
    }

    // Allow keeping same phone number, but prevent conflict with another contact's phone
    if (
      updatedContact.getPhone() !== oldPhone &&
      this.isDuplicatePhone(updatedContact.getPhone())
    ) {
      throw new Error(`Phone number ${updatedContact.getPhone()} already belongs to another contact!`);
    }

    if (!this.isValidEmail(updatedContact.getEmail())) {
      throw new Error("Invalid email! Must contain '@' and domain '.'.");
    }

    let found = false;
    for (let i = 0; i < this.contacts.size(); i++) {
      if (this.contacts.at(i).getPhone() === oldPhone) {
        this.contacts.set(i, updatedContact);
        found = true;
        break;
      }
    }

    if (found) {
      this.saveToFile();
    }

    const elapsed = performance.now() - startTime;
    this.lastOperationMetrics = {
      action: "updateContact",
      success: found,
      timeComplexity: "O(N) search + O(1) update",
      durationMs: Number(elapsed.toFixed(3)),
    };

    return found;
  }

  /**
   * Toggle favorite status by phone
   */
  toggleFavorite(phone) {
    for (let i = 0; i < this.contacts.size(); i++) {
      const c = this.contacts.at(i);
      if (c.getPhone() === phone) {
        c.setFavorite(!c.getFavorite());
        this.saveToFile();
        return c;
      }
    }
    return null;
  }

  /**
   * Delete contact by phone number
   * Mirrors ContactManager::deleteContact(string phone)
   * Big-O: O(N) search + O(N) vector element shifting
   */
  deleteContact(phone) {
    const startTime = performance.now();
    let found = false;

    for (let i = 0; i < this.contacts.size(); i++) {
      if (this.contacts.at(i).getPhone() === phone) {
        this.contacts.erase(i);
        found = true;
        break;
      }
    }

    if (found) {
      this.saveToFile();
    }

    const elapsed = performance.now() - startTime;
    this.lastOperationMetrics = {
      action: "deleteContact",
      phone,
      success: found,
      timeComplexity: "O(N) search + O(N) dynamic array shift",
      durationMs: Number(elapsed.toFixed(3)),
    };

    return found;
  }

  // ===================== SORTING ALGORITHMS =====================

  /**
   * Sort contacts lexicographically by Name
   * Mirrors ContactManager::sortByName()
   * Big-O: O(N log N) with comparison tracking
   */
  sortByName(order = "asc") {
    const startTime = performance.now();

    this.contacts.sort((a, b) => {
      const nameA = toLowerCase(a.getName());
      const nameB = toLowerCase(b.getName());
      if (nameA < nameB) return order === "asc" ? -1 : 1;
      if (nameA > nameB) return order === "asc" ? 1 : -1;
      return 0;
    });

    this.saveToFile();

    const elapsed = performance.now() - startTime;
    this.lastOperationMetrics = {
      action: "sortByName",
      order,
      algorithm: "std::sort comparator (Timsort/Quicksort)",
      timeComplexity: "O(N log N)",
      comparisons: this.contacts.stats.comparisons,
      durationMs: Number(elapsed.toFixed(3)),
    };

    return this.contacts.toArray();
  }

  /**
   * Sort contacts numerically/lexicographically by Phone
   * Mirrors ContactManager::sortByPhone()
   * Big-O: O(N log N)
   */
  sortByPhone(order = "asc") {
    const startTime = performance.now();

    this.contacts.sort((a, b) => {
      const phoneA = a.getPhone();
      const phoneB = b.getPhone();
      if (phoneA < phoneB) return order === "asc" ? -1 : 1;
      if (phoneA > phoneB) return order === "asc" ? 1 : -1;
      return 0;
    });

    this.saveToFile();

    const elapsed = performance.now() - startTime;
    this.lastOperationMetrics = {
      action: "sortByPhone",
      order,
      algorithm: "std::sort comparator",
      timeComplexity: "O(N log N)",
      comparisons: this.contacts.stats.comparisons,
      durationMs: Number(elapsed.toFixed(3)),
    };

    return this.contacts.toArray();
  }

  /**
   * Sort contacts by Date Added (DD-MM-YYYY)
   * Big-O: O(N log N)
   */
  sortByDateAdded(order = "desc") {
    const startTime = performance.now();

    const parseDate = (dStr) => {
      if (!dStr) return 0;
      const parts = dStr.split("-");
      if (parts.length === 3) {
        // DD-MM-YYYY to timestamp
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day).getTime() || 0;
      }
      return 0;
    };

    this.contacts.sort((a, b) => {
      const timeA = parseDate(a.getDateAdded());
      const timeB = parseDate(b.getDateAdded());
      if (timeA < timeB) return order === "asc" ? -1 : 1;
      if (timeA > timeB) return order === "asc" ? 1 : -1;
      return 0;
    });

    this.saveToFile();

    const elapsed = performance.now() - startTime;
    this.lastOperationMetrics = {
      action: "sortByDateAdded",
      order,
      algorithm: "std::sort comparator",
      timeComplexity: "O(N log N)",
      comparisons: this.contacts.stats.comparisons,
      durationMs: Number(elapsed.toFixed(3)),
    };

    return this.contacts.toArray();
  }

  // ===================== FAVORITES & STATS =====================

  /**
   * Filter and view favorite contacts
   * Mirrors ContactManager::viewFavoriteContacts()
   * Big-O: O(N)
   */
  viewFavoriteContacts() {
    const result = [];
    for (let i = 0; i < this.contacts.size(); i++) {
      const c = this.contacts.at(i);
      if (c.getFavorite()) {
        result.push(c);
      }
    }
    return result;
  }

  /**
   * Statistics computation
   * Mirrors ContactManager::showStatistics()
   * Computes total contacts, favorites, email domains count, etc.
   * Big-O: O(N)
   */
  showStatistics() {
    let favoriteCount = 0;
    const emailDomains = {};
    const total = this.contacts.size();

    for (let i = 0; i < total; i++) {
      const contact = this.contacts.at(i);
      if (contact.getFavorite()) {
        favoriteCount++;
      }
      const email = contact.getEmail();
      const atIdx = email.indexOf("@");
      if (atIdx !== -1) {
        const domain = email.slice(atIdx + 1).toLowerCase();
        emailDomains[domain] = (emailDomains[domain] || 0) + 1;
      }
    }

    return {
      totalContacts: total,
      favoriteContacts: favoriteCount,
      nonFavoriteContacts: total - favoriteCount,
      emailDomains,
      vectorCapacity: this.contacts.capacity,
      vectorShiftsTotal: this.contacts.stats.shifts,
      vectorReallocations: this.contacts.stats.reallocations,
      lastMetrics: this.lastOperationMetrics,
    };
  }

  // ===================== VALIDATION LOGIC =====================

  /**
   * Checks if phone is exactly 10 digits
   * Mirrors ContactManager::isValidPhone(string phone)
   */
  isValidPhone(phone) {
    if (!phone) return false;
    const cleaned = String(phone).trim();
    if (cleaned.length !== 10) return false;
    for (let i = 0; i < cleaned.length; i++) {
      const ch = cleaned.charCodeAt(i);
      if (ch < 48 || ch > 57) {
        return false;
      }
    }
    return true;
  }

  /**
   * Validates email format: must contain '@' and '.' after '@'
   * Mirrors ContactManager::isValidEmail(string email)
   */
  isValidEmail(email) {
    if (!email) return false;
    const str = String(email).trim();
    const atPos = str.indexOf("@");
    if (atPos <= 0) return false;
    const dotPos = str.indexOf(".", atPos);
    if (dotPos <= atPos + 1 || dotPos >= str.length - 1) return false;
    return true;
  }

  /**
   * Checks if phone number already exists in contact list
   * Mirrors ContactManager::isDuplicatePhone(string phone)
   * Big-O: O(N) linear search
   */
  isDuplicatePhone(phone) {
    const target = String(phone || "").trim();
    for (let i = 0; i < this.contacts.size(); i++) {
      if (this.contacts.at(i).getPhone() === target) {
        return true;
      }
    }
    return false;
  }

  // ===================== FILE HANDLING =====================

  /**
   * Save contacts to contacts.txt in pipe-delimited format
   * Mirrors ContactManager::saveToFile()
   * Syncs to both root and ContactHub/contacts.txt
   */
  saveToFile() {
    try {
      const lines = [];
      for (let i = 0; i < this.contacts.size(); i++) {
        lines.push(this.contacts.at(i).toPipeString());
      }
      const fileData = lines.join("\n") + (lines.length > 0 ? "\n" : "");

      // Save to primary path
      fs.writeFileSync(this.primaryFilePath, fileData, "utf8");

      // Also sync to nested ContactHub directory if it exists
      const secondaryDir = path.dirname(this.secondaryFilePath);
      if (fs.existsSync(secondaryDir)) {
        fs.writeFileSync(this.secondaryFilePath, fileData, "utf8");
      }
      return true;
    } catch (err) {
      console.error("Error saving contacts.txt:", err);
      return false;
    }
  }

  /**
   * Load contacts from contacts.txt in pipe-delimited format
   * Mirrors ContactManager::loadFromFile()
   */
  loadFromFile() {
    this.contacts.clear();

    // Look for existing contacts.txt
    let filePathToRead = null;
    if (fs.existsSync(this.primaryFilePath)) {
      filePathToRead = this.primaryFilePath;
    } else if (fs.existsSync(this.secondaryFilePath)) {
      filePathToRead = this.secondaryFilePath;
    }

    if (!filePathToRead) {
      // Default initial seeds from user's sample data
      const defaultContacts = [
        new Contact("Vinay", "1234567890", "vinay@gmail.com", "Dhanas", true, "11-07-2026"),
        new Contact("Ash", "1234567899", "ash@gmail.com", "Varanasi", false, "11-07-2026"),
      ];
      for (const c of defaultContacts) {
        this.contacts.push_back(c);
      }
      this.saveToFile();
      return;
    }

    try {
      const content = fs.readFileSync(filePathToRead, "utf8");
      const lines = content.split(/\r?\n/);

      for (const line of lines) {
        const contact = Contact.fromPipeString(line);
        if (contact) {
          this.contacts.push_back(contact);
        }
      }

      // If empty file, seed with user's initial contacts
      if (this.contacts.empty()) {
        this.contacts.push_back(
          new Contact("Vinay", "1234567890", "vinay@gmail.com", "Dhanas", true, "11-07-2026")
        );
        this.contacts.push_back(
          new Contact("Ash", "1234567899", "ash@gmail.com", "Varanasi", false, "11-07-2026")
        );
        this.saveToFile();
      }
    } catch (err) {
      console.error("Error loading contacts.txt:", err);
    }
  }

  /**
   * Reset contacts to default sample data
   */
  resetToDefaults() {
    this.contacts.clear();
    const defaults = [
      new Contact("Vinay", "1234567890", "vinay@gmail.com", "Dhanas", true, "11-07-2026"),
      new Contact("Ash", "1234567899", "ash@gmail.com", "Varanasi", false, "11-07-2026"),
      new Contact("Sarah Connor", "9876543210", "sarah@cyberdyne.org", "Los Angeles, CA", true, "15-08-2026"),
      new Contact("Bruce Wayne", "9123456780", "bruce@wayneenterprises.com", "Gotham City", true, "20-09-2026"),
      new Contact("Clark Kent", "9012345678", "clark.kent@dailyplanet.com", "Metropolis", false, "25-09-2026"),
    ];
    for (const c of defaults) {
      this.contacts.push_back(c);
    }
    this.saveToFile();
    return this.contacts.toArray();
  }
}

// Global singleton instance for API route handling across Next.js invocations
let globalContactManager = null;

export function getContactManager() {
  if (!globalContactManager) {
    globalContactManager = new ContactManager();
  }
  return globalContactManager;
}
