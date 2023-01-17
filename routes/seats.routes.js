const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const db = require('./../db');

router.route('/seats').get((req, res) => {
  res.json(db.seats);
});

router.route('/seats/:id').get((req, res) => {
  const seatIndex = db.seats.findIndex((elem) => elem.id === req.params.id);
  if (seatIndex === -1) {
    return res.status(404).json({ message: 'Seat not found...' });
  }

  res.json(db.seats.find((elem) => elem.id === req.params.id));
});

router.route('/seats/:id').delete((req, res) => {
  const seatIndex = db.seats.findIndex((elem) => elem.id === req.params.id);
  if (seatIndex === -1) {
    return res.status(404).json({ message: 'Seat not found...' });
  }

  db.seats = db.seats.filter((elem) => elem.id !== req.params.id);
  res.json({ message: 'OK' });
});

router.route('/seats/:id').put((req, res) => {
  const seatIndex = db.seats.findIndex((elem) => elem.id === req.params.id);
  if (seatIndex === -1) {
    return res.status(404).json({ message: 'Seat not found...' });
  }

  db.seats = db.seats.map((elem) =>
    elem.id === req.params.id ? { ...elem, ...req.body } : elem
  );
  res.json({ message: 'OK' });
});

router.route('/seats').post((req, res) => {
  db.seats = [...db.seats, { id: uuidv4(), ...req.body }];
  res.json({ message: 'OK' });
});

module.exports = router;
