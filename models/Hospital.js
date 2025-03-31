const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
    hospitalName: { type: String, required: true },
    hospitalAddress: { type: String, required: true },
    hospitalPhone: { type: String, required: true },
    hospitalEmail: { type: String, required: true, unique: true },
    ambulanceTypes: [{ type: String, enum: ["Basic", "Advanced", "ICU", "Moksh Vahan"] }],
    numDrivers: { type: Number, required: true },
    numAmbulances: { type: Number, required: true },
    numDoctors: { type: Number, required: true },
    emergencyContact: { type: String, required: true }
}, { timestamps: true });

const Hospital = mongoose.model("Hospital", hospitalSchema);
module.exports = Hospital;
