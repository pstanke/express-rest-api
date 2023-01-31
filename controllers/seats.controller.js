const Seat = require('../models/seat.model');

exports.getAll = async (req, res) => {
  try {
    res.json(await Seat.find().populate('client'));
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id).populate('client');
    if (!seat) res.status(404).json({ message: 'Seat not found' });
    else res.json(seat);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.create = async (req, res) => {
  try {
    const { day, seat, client, email } = req.body;

    const newSeat = new Seat({
      day,
      seat,
      client,
      email,
    });
    await newSeat.save();

    req.io.emit('seatsUpdated', newSeat);
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.edit = async (req, res) => {
  const { day, seat, client, email } = req.body;

  try {
    const existingSeat = await Seat.findById(req.params.id);
    if (existingSeat) {
      existingSeat.day = day;
      existingSeat.seat = seat;
      existingSeat.client = client;
      existingSeat.email = email;
      await existingSeat.save();
      res.json(existingSeat);
    } else res.status(404).json({ message: 'Seat not found' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.delete = async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id);
    if (seat) {
      await Seat.deleteOne({ _id: req.params.id });
      res.json(seat);
    } else res.status(404).json({ message: 'Seat not found' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
