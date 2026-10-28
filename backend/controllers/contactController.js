const Contact = require("../models/Contact");

// Default initial sample dataset for seeding / reset
const DEFAULT_SAMPLE_CONTACTS = [
  {
    name: "Ashwani Pandey",
    phone: "9978654598",
    email: "ashwani@contactx.dev",
    address: "New Delhi, India",
    favorite: true,
    dateAdded: "11-07-2026",
  },
  {
    name: "Bruce Wayne",
    phone: "9123456780",
    email: "bruce@wayneenterprises.com",
    address: "Gotham City",
    favorite: true,
    dateAdded: "20-09-2026",
  },
  {
    name: "Clark Kent",
    phone: "9012345678",
    email: "clark.kent@dailyplanet.com",
    address: "Metropolis",
    favorite: false,
    dateAdded: "25-09-2026",
  },
  {
    name: "Sarah Connor",
    phone: "9876543210",
    email: "sarah@cyberdyne.org",
    address: "Los Angeles, CA",
    favorite: true,
    dateAdded: "15-08-2026",
  },
  {
    name: "Vinay Kumar",
    phone: "9234567890",
    email: "vinay@contactx.dev",
    address: "Chandigarh, India",
    favorite: false,
    dateAdded: "11-07-2026",
  },
];

// Helper: Seed initial data if database is empty
const ensureDataSeeded = async () => {
  const count = await Contact.countDocuments();
  if (count === 0) {
    await Contact.insertMany(DEFAULT_SAMPLE_CONTACTS);
    console.log("🌱 Auto-seeded initial sample contacts into MongoDB");
  }
};

// @desc    Get contacts with search, filter, and sorting + DSA metrics
// @route   GET /api/contacts
exports.getContacts = async (req, res) => {
  const startTime = performance.now();
  try {
    await ensureDataSeeded();

    const { q, field = "all", favorites, sort = "none", order = "asc" } = req.query;

    let filter = {};

    // 1. Favorites Filter
    if (favorites === "true") {
      filter.favorite = true;
    }

    // 2. Search Query Handling
    let searchAlg = "MongoDB B-Tree Index";
    let bigO = "O(log N)";
    let comparisons = 0;

    if (q && q.trim()) {
      const term = q.trim();
      const regex = new RegExp(term, "i");

      if (field === "name") {
        filter.name = regex;
        searchAlg = "Name Index Search";
        bigO = "O(log N)";
      } else if (field === "phone") {
        filter.phone = new RegExp(term.replace(/\D/g, ""));
        searchAlg = "Phone Unique Hash Search";
        bigO = "O(1)";
      } else if (field === "email") {
        filter.email = regex;
        searchAlg = "Email Index Search";
        bigO = "O(log N)";
      } else {
        filter.$or = [
          { name: regex },
          { phone: new RegExp(term) },
          { email: regex },
          { address: regex },
        ];
        searchAlg = "Multi-field Regex Scan";
        bigO = "O(N)";
      }
    }

    // 3. Sorting Options
    let sortOptions = {};
    const sortDirection = order === "desc" ? -1 : 1;

    if (sort === "name") {
      sortOptions.name = sortDirection;
    } else if (sort === "phone") {
      sortOptions.phone = sortDirection;
    } else if (sort === "dateAdded" || sort === "date") {
      sortOptions.createdAt = sortDirection;
    } else {
      sortOptions.createdAt = -1; // Default newest first
    }

    const contacts = await Contact.find(filter).sort(sortOptions);
    const totalInDb = await Contact.countDocuments();
    const favoritesCount = await Contact.countDocuments({ favorite: true });

    const endTime = performance.now();
    const durationMs = (endTime - startTime).toFixed(3);
    comparisons = contacts.length;

    return res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
      stats: {
        totalContacts: totalInDb,
        filteredCount: contacts.length,
        favoritesCount: favoritesCount,
        lastAlgorithm: searchAlg,
        complexity: bigO,
        executionTimeMs: parseFloat(durationMs),
        comparisonsMade: comparisons,
        storageEngine: "MongoDB (Mongoose ODM)",
      },
    });
  } catch (error) {
    console.error("getContacts Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to retrieve contacts from MongoDB",
    });
  }
};

// @desc    Add new contact
// @route   POST /api/contacts
exports.addContact = async (req, res) => {
  try {
    const { name, phone, email, address = "", favorite = false } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({
        success: false,
        error: "Name, 10-digit phone number, and email are required",
      });
    }

    const cleanPhone = phone.trim();
    if (!/^\d{10}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        error: "Phone number must be exactly 10 digits",
      });
    }

    // Check duplicate phone
    const existing = await Contact.findOne({ phone: cleanPhone });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: `A contact with phone ${cleanPhone} already exists (${existing.name})`,
      });
    }

    const contact = await Contact.create({
      name: name.trim(),
      phone: cleanPhone,
      email: email.trim().toLowerCase(),
      address: address.trim(),
      favorite: Boolean(favorite),
    });

    return res.status(201).json({
      success: true,
      data: contact,
      message: `Contact "${contact.name}" added successfully to MongoDB!`,
    });
  } catch (error) {
    console.error("addContact Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to create contact",
    });
  }
};

// @desc    Update existing contact
// @route   PUT /api/contacts
exports.updateContact = async (req, res) => {
  try {
    const { targetPhone, name, phone, email, address, favorite } = req.body;

    const lookupPhone = (targetPhone || phone || "").trim();
    if (!lookupPhone) {
      return res.status(400).json({
        success: false,
        error: "Target phone number is required to update contact",
      });
    }

    const contact = await Contact.findOne({ phone: lookupPhone });
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: `Contact with phone ${lookupPhone} not found`,
      });
    }

    // If changing phone number, check duplicate
    if (phone && phone.trim() !== lookupPhone) {
      const cleanNewPhone = phone.trim();
      if (!/^\d{10}$/.test(cleanNewPhone)) {
        return res.status(400).json({
          success: false,
          error: "Updated phone number must be exactly 10 digits",
        });
      }
      const phoneTaken = await Contact.findOne({ phone: cleanNewPhone });
      if (phoneTaken) {
        return res.status(409).json({
          success: false,
          error: `Phone ${cleanNewPhone} is already registered to ${phoneTaken.name}`,
        });
      }
      contact.phone = cleanNewPhone;
    }

    if (name) contact.name = name.trim();
    if (email) contact.email = email.trim().toLowerCase();
    if (address !== undefined) contact.address = address.trim();
    if (favorite !== undefined) contact.favorite = Boolean(favorite);

    await contact.save();

    return res.status(200).json({
      success: true,
      data: contact,
      message: `Contact "${contact.name}" updated successfully!`,
    });
  } catch (error) {
    console.error("updateContact Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to update contact",
    });
  }
};

// @desc    Delete contact by phone
// @route   DELETE /api/contacts
exports.deleteContact = async (req, res) => {
  try {
    const phone = req.query.phone || req.body.phone;
    if (!phone) {
      return res.status(400).json({
        success: false,
        error: "Phone number is required for deletion",
      });
    }

    const deleted = await Contact.findOneAndDelete({ phone: phone.trim() });
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: `Contact with phone ${phone} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: deleted,
      message: `Contact "${deleted.name}" permanently deleted from MongoDB`,
    });
  } catch (error) {
    console.error("deleteContact Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to delete contact",
    });
  }
};

// @desc    Toggle favorite status
// @route   POST /api/contacts/toggle-favorite
exports.toggleFavorite = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({
        success: false,
        error: "Phone number is required to toggle favorite",
      });
    }

    const contact = await Contact.findOne({ phone: phone.trim() });
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: `Contact with phone ${phone} not found`,
      });
    }

    contact.favorite = !contact.favorite;
    await contact.save();

    return res.status(200).json({
      success: true,
      data: contact,
      message: `${contact.name} ${contact.favorite ? "added to" : "removed from"} favorites`,
    });
  } catch (error) {
    console.error("toggleFavorite Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to toggle favorite status",
    });
  }
};

// @desc    Reset contacts database to default sample dataset
// @route   POST /api/contacts/reset
exports.resetContacts = async (req, res) => {
  try {
    await Contact.deleteMany({});
    await Contact.insertMany(DEFAULT_SAMPLE_CONTACTS);

    return res.status(200).json({
      success: true,
      count: DEFAULT_SAMPLE_CONTACTS.length,
      message: "MongoDB contacts collection successfully reset to default sample dataset",
    });
  } catch (error) {
    console.error("resetContacts Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to reset contacts database",
    });
  }
};

// @desc    Export / Inspect raw pipe-delimited contact text (name|phone|email|address|favorite|dateAdded)
// @route   GET /api/contacts/raw-file
exports.getRawFile = async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({ name: 1 });
    const lines = contacts.map(
      (c) =>
        `${c.name}|${c.phone}|${c.email}|${c.address || ""}|${c.favorite ? 1 : 0}|${c.dateAdded || "11-07-2026"}`
    );
    const content = lines.join("\n");

    return res.status(200).json({
      success: true,
      content,
      lineCount: lines.length,
      filename: "contacts.txt (Synced from MongoDB)",
    });
  } catch (error) {
    console.error("getRawFile Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate raw contact file",
    });
  }
};

// @desc    Import / Sync raw pipe-delimited contact text into MongoDB
// @route   POST /api/contacts/raw-file
exports.updateRawFile = async (req, res) => {
  try {
    const { content } = req.body;
    if (typeof content !== "string") {
      return res.status(400).json({
        success: false,
        error: "Invalid file content format",
      });
    }

    const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const parsedContacts = [];
    const seenPhones = new Set();

    for (const line of lines) {
      const parts = line.split("|");
      if (parts.length >= 3) {
        const name = parts[0].trim();
        const phone = parts[1].trim();
        const email = parts[2].trim();
        const address = parts[3] ? parts[3].trim() : "";
        const favorite = parts[4] === "1" || parts[4] === "true";
        const dateAdded = parts[5] ? parts[5].trim() : "11-07-2026";

        if (name && /^\d{10}$/.test(phone) && !seenPhones.has(phone)) {
          seenPhones.add(phone);
          parsedContacts.push({
            name,
            phone,
            email,
            address,
            favorite,
            dateAdded,
          });
        }
      }
    }

    if (parsedContacts.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No valid contacts found in uploaded text. Format: Name|Phone(10)|Email|Address|Fav(0/1)|Date",
      });
    }

    await Contact.deleteMany({});
    await Contact.insertMany(parsedContacts);

    return res.status(200).json({
      success: true,
      lineCount: parsedContacts.length,
      message: `Successfully synchronized ${parsedContacts.length} contacts into MongoDB`,
    });
  } catch (error) {
    console.error("updateRawFile Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to sync raw file with MongoDB",
    });
  }
};

// @desc    Get aggregate statistics
// @route   GET /api/statistics
exports.getStatistics = async (req, res) => {
  try {
    const totalContacts = await Contact.countDocuments();
    const favoritesCount = await Contact.countDocuments({ favorite: true });

    return res.status(200).json({
      success: true,
      totalContacts,
      favorites: favoritesCount,
      nonFavorites: totalContacts - favoritesCount,
      storageType: "MongoDB Persistent Database",
      lastModified: new Date().toISOString(),
    });
  } catch (error) {
    console.error("getStatistics Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to calculate statistics",
    });
  }
};

