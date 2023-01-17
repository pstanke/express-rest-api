const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const db = require('./../db');

router.route('/concerts').get((req, res) => {
  res.json(db.concerts);
});

router.route('/concerts/:id').get((req, res) => {
  const concertIndex = db.concerts.findIndex(
    (elem) => elem.id === req.params.id
  );
  if (concertIndex === -1) {
    return res.status(404).json({ message: 'Concert not found...' });
  }

  res.json(db.concerts.find((elem) => elem.id === req.params.id));
});

router.route('/concerts/:id').delete((req, res) => {
  const concertIndex = db.concerts.findIndex(
    (elem) => elem.id === req.params.id
  );
  if (concertIndex === -1) {
    return res.status(404).json({ message: 'Concert not found...' });
  }

  db.concerts = db.concerts.filter((elem) => elem.id !== req.params.id);
  res.json({ message: 'OK' });
});

router.route('/concerts/:id').put((req, res) => {
  const concertIndex = db.concerts.findIndex(
    (elem) => elem.id === req.params.id
  );
  if (concertIndex === -1) {
    return res.status(404).json({ message: 'Concert not found...' });
  }

  db.concerts[concertIndex] = { ...db.concerts[concertIndex], ...req.body };

  res.json({ message: 'OK' });
});

router.route('/concerts').post((req, res) => {
  db.concerts = [...db.concerts, { id: uuidv4(), ...req.body }];
  res.json({ message: 'OK' });
});

module.exports = router;
