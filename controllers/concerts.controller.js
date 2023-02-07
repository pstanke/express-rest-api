const Seat = require('../models/seat.model');
const Concert = require('../models/concert.model');

exports.getAll = async (req, res) => {
  try {
    const concerts = await Concert.find();
    const updatedConcerts = concerts.map(async (concert) => {
      const seats = await Seat.find({ day: concert.day });
      concert.freeSeats = 50 - seats.length;
      return concert;
    });
    const resolvedConcerts = await Promise.all(updatedConcerts);
    res.json(resolvedConcerts);
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
      concert.freeSeats = 50 - seats.length;
      res.json(concert);
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.create = async (req, res) => {
  try {
    const { performer, genre, price, day, image, freeSeats } = req.body;
    const newConcert = new Concert({
      performer,
      genre,
      price,
      day,
      image,
      freeSeats,
    });
    await newConcert.save();
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.edit = async (req, res) => {
  const { performer, genre, price, day, image, freeSeats } = req.body;

  try {
    const concert = await Concert.findById(req.params.id);
    if (concert) {
      concert.performer = performer;
      concert.genre = genre;
      concert.price = price;
      concert.day = day;
      concert.image = image;
      concert.freeSeats = freeSeats;
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
