const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
}, { timestamps: true });

// Hash password before saving
AdminSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10); // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash password
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare password (for login)
AdminSchema.methods.comparePassword = async function(password) {
  try {
    return await bcrypt.compare(password, this.password); // Compare input password with hashed password
  } catch (err) {
    throw new Error("Error comparing password");
  }
};

module.exports = mongoose.model("Admin", AdminSchema);
