// const express = require("express");
// const router = express.Router();
// const {
//   getContacts,
//   addContact,
//   updateContact,
//   deleteContact,
//   toggleFavorite,
//   resetContacts,
//   getRawFile,
//   updateRawFile,
// } = require("../controllers/contactController");

// // Base contact CRUD operations
// router.route("/").get(getContacts).post(addContact).put(updateContact).delete(deleteContact);

// // Favorite toggle
// router.post("/toggle-favorite", toggleFavorite);

// // Database reset
// router.post("/reset", resetContacts);

// // Raw pipe-delimited file inspection and import
// router.route("/raw-file").get(getRawFile).post(updateRawFile);

// module.exports = router;




const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getContacts,
  addContact,
  updateContact,
  deleteContact,
  toggleFavorite,
  getRawFile,
  updateRawFile,
} = require("../controllers/contactController");

// All contact routes require authentication
router.use(protect);

// Base contact CRUD operations
router.route("/")
  .get(getContacts)
  .post(addContact)
  .put(updateContact)
  .delete(deleteContact);

// Favorite toggle
router.post("/toggle-favorite", toggleFavorite);

// Database reset - temporarily disabled
// router.post("/reset", resetContacts);

// Raw file export/import
router.route("/raw-file")
  .get(getRawFile)
  .post(updateRawFile);

module.exports = router;
