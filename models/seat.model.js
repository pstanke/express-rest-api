const mongoose = require('mongoose');
const Client = require('./client.model');

const seatSchema = new mongoose.Schema({
  day: { type: Number, required: true },
  seat: { type: Number, required: true },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  email: { type: String, required: true },
});

module.exports = mongoose.model('Seat', seatSchema);
