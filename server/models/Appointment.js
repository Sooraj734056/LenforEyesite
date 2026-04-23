const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name:      { type: String, required: true },
  phone:     { type: String, required: true },
  email:     String,
  address:   { type: String, required: true },
  city:      { type: String, default: 'Jaipur' },
  pincode:   String,
  date:      { type: Date, required: true },
  timeSlot:  { type: String, required: true }, // e.g. "10:00 AM - 11:00 AM"
  notes:     String,
  status:    { type: String, enum: ['Pending', 'Confirmed', 'Assigned', 'Completed', 'Cancelled'], default: 'Pending' },
  assignedTechnician: { type: String, default: '' },
  technicianPhone:    String,
  adminNotes: String,
  completedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
