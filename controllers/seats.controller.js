const Seat = require('../models/seat.model');
const Client = require('../models/client.model');

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
    const { day, seat, clientName, email } = req.body;

    let client = await Client.findOne({ email: email });

    if (!client) {
      client = new Client({ name: clientName, email: email });
      await client.save();
    }

    const newSeat = new Seat({
      day,
      seat,
      client: client._id,
    });
    await newSeat.save();

    req.io.emit('seatsUpdated', newSeat);
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.edit = async (req, res) => {
  const { day, seat, clientName, email } = req.body;

  try {
    const existingSeat = await Seat.findById(req.params.id).populate('client');
    if (existingSeat) {
      existingSeat.day = day;
      existingSeat.seat = seat;

      existingSeat.client.name = clientName;
      existingSeat.client.email = email;

      await existingSeat.client.save();

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
      const clientId = seat.client;
      const seatCount = await Seat.countDocuments({ client: clientId });

      if (seatCount > 1) {
        await Seat.deleteOne({ _id: req.params.id });
      } else {
        await Client.deleteOne({ _id: clientId });
        await Seat.deleteOne({ _id: req.params.id });
      }

      res.json(seat);
    } else res.status(404).json({ message: 'Seat not found' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
