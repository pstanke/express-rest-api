const Seat = require('../models/seat.model');
const Concert = require('../models/concert.model');
const sanitize = require('mongo-sanitize');
exports.getAll = async (req, res) => {
  try {
    const concerts = await Concert.find({});

    const seatPromises = concerts.map((concert) =>
      Seat.find({ day: concert.day })
    );
    const seats = await Promise.all(seatPromises);
    const updatedConcerts = [];
    for (let i = 0; i < concerts.length; i++) {
      const freeSeats = 50 - seats[i].length;
      updatedConcerts.push({ ...concerts[i].toObject(), freeSeats });
    }
    res.json(updatedConcerts);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const concert = await Concert.findById(req.params.id);
    if (!concert) {
      res.status(404).json({ message: 'Concert not found' });
    } else {
      const seats = await Seat.find({ day: concert.day });
      const freeSeats = 50 - seats.length;
      res.json({ ...concert.toObject(), freeSeats });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.create = async (req, res) => {
  try {
    const sanitizedBody = sanitize(req.body);
    const { performer, genre, price, day, image } = sanitizedBody;
    const newConcert = new Concert({
      performer,
      genre,
      price,
      day,
      image,
    });
    await newConcert.save();
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.edit = async (req, res) => {
  const { performer, genre, price, day, image } = req.body;

  try {
    const concert = await Concert.findById(req.params.id);
    if (concert) {
      concert.performer = performer;
      concert.genre = genre;
      concert.price = price;
      concert.day = day;
      concert.image = image;

      await concert.save();
      res.json(concert);
    } else res.status(404).json({ message: 'Concert not found' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.delete = async (req, res) => {
  try {
    const concert = await Concert.findById(req.params.id);
    if (concert) {
      await Concert.deleteOne({ _id: req.params.id });
      res.json(concert);
    } else res.status(404).json({ message: 'Concert not found' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
