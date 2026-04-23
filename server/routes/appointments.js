const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { protect } = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// POST /api/appointments — Book appointment
router.post('/', async (req, res) => {
  try {
    const appointment = await Appointment.create({
      ...req.body,
      user: req.user?._id || undefined
    });
    res.status(201).json({ success: true, appointment, message: 'Appointment booked! Our team will confirm shortly.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/appointments/my — User's appointments
router.get('/my', protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id }).sort({ date: -1 });
    res.json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/appointments/admin — Admin: all appointments
router.get('/admin', adminAuth, async (req, res) => {
  try {
    const { date, status, month, year } = req.query;
    const query = {};
    if (status) query.status = status;
    if (date) {
      const start = new Date(date); start.setHours(0,0,0,0);
      const end = new Date(date); end.setHours(23,59,59,999);
      query.date = { $gte: start, $lte: end };
    } else if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      query.date = { $gte: start, $lte: end };
    }
    const appointments = await Appointment.find(query).sort({ date: 1, timeSlot: 1 });
    res.json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/appointments — Fallback for generic list
router.get('/', adminAuth, async (req, res) => {
  try {
    const { date, status, month, year } = req.query;
    const query = {};
    if (status) query.status = status;
    if (date) {
      const start = new Date(date); start.setHours(0,0,0,0);
      const end = new Date(date); end.setHours(23,59,59,999);
      query.date = { $gte: start, $lte: end };
    } else if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      query.date = { $gte: start, $lte: end };
    }
    const appointments = await Appointment.find(query).sort({ date: 1, timeSlot: 1 });
    res.json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/appointments/:id — Admin: update status/assign
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { status, assignedTechnician, technicianPhone, adminNotes } = req.body;
    const updates = {};
    if (status) updates.status = status;
    if (assignedTechnician) updates.assignedTechnician = assignedTechnician;
    if (technicianPhone) updates.technicianPhone = technicianPhone;
    if (adminNotes) updates.adminNotes = adminNotes;
    if (status === 'Completed') updates.completedAt = new Date();
    const appt = await Appointment.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, appointment: appt });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/appointments/:id
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Appointment deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
