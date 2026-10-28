const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: "Phone number must be exactly 10 digits",
      },
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    dateAdded: {
      type: String,
      default: () => {
        const d = new Date();
        const dd = String(d.getDate()).padStart(2, "0");
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const yyyy = d.getFullYear();
        return `${dd}-${mm}-${yyyy}`;
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for high performance searches
ContactSchema.index({ name: 1 });
ContactSchema.index({ email: 1 });

module.exports = mongoose.model("Contact", ContactSchema);

