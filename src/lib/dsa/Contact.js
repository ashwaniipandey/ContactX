/**
 * Contact Model
 * Direct JavaScript equivalent of Contact.h and Contact.cpp
 * 
 * Fields:
 * - name: string
 * - phone: string (10 digits)
 * - email: string
 * - address: string
 * - favorite: boolean
 * - dateAdded: string (DD-MM-YYYY)
 */
export class Contact {
  constructor(name = "", phone = "", email = "", address = "", favorite = false, dateAdded = "") {
    this.name = String(name || "").trim();
    this.phone = String(phone || "").trim();
    this.email = String(email || "").trim();
    this.address = String(address || "").trim();
    this.favorite = Boolean(favorite);
    this.dateAdded = String(dateAdded || Contact.getCurrentDate()).trim();
  }

  // Getters
  getName() {
    return this.name;
  }

  getPhone() {
    return this.phone;
  }

  getEmail() {
    return this.email;
  }

  getAddress() {
    return this.address;
  }

  getFavorite() {
    return this.favorite;
  }

  getDateAdded() {
    return this.dateAdded;
  }

  // Setters
  setName(name) {
    this.name = String(name || "").trim();
  }

  setPhone(phone) {
    this.phone = String(phone || "").trim();
  }

  setEmail(email) {
    this.email = String(email || "").trim();
  }

  setAddress(address) {
    this.address = String(address || "").trim();
  }

  setFavorite(favorite) {
    this.favorite = Boolean(favorite);
  }

  setDateAdded(dateAdded) {
    this.dateAdded = String(dateAdded || "").trim();
  }

  // Utility to generate formatted date matching C++ sprintf("%02d-%02d-%04d")
  static getCurrentDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    return `${day}-${month}-${year}`;
  }

  /**
   * Serializes contact to pipe-delimited line matching contacts.txt
   * Format: name|phone|email|address|favorite|dateAdded
   */
  toPipeString() {
    const fav = this.favorite ? "1" : "0";
    return `${this.name}|${this.phone}|${this.email}|${this.address}|${fav}|${this.dateAdded}`;
  }

  /**
   * Deserializes a pipe-delimited line from contacts.txt into a Contact instance
   */
  static fromPipeString(line) {
    if (!line || !line.trim()) return null;
    const parts = line.split("|");
    if (parts.length < 6) return null;

    const [name, phone, email, address, favoriteStr, dateAdded] = parts;
    const favorite = favoriteStr.trim() === "1";
    return new Contact(name, phone, email, address, favorite, dateAdded);
  }

  // Plain JSON representation for API responses
  toJSON() {
    return {
      name: this.name,
      phone: this.phone,
      email: this.email,
      address: this.address,
      favorite: this.favorite,
      dateAdded: this.dateAdded,
    };
  }
}
