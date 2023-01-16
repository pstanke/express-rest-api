const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const db = require('./../db');

router.route('/seats').get((req, res) => {
  res.json(db.seats);
});

router.route('/seats/:id').get((req, res) => {
  res.json(db.seats.find((elem) => elem.id === req.params.id));
});

router.route('/seats/:id').delete((req, res) => {
  db.seats.filter((elem) => elem.id !== req.params.id);
  res.json({ message: 'OK' });
});

router.route('/seats/:id').put((req, res) => {
  db.seats.map((elem) =>
    elem.id === req.params.id ? { ...elem, ...req.body } : elem
  );
  res.json({ message: 'OK' });
});

router.route('/seats/:id').post((req, res) => {
  [...db.seats, { id: uuidv4(), ...req.body }];
  res.json({ message: 'OK' });
});

module.exports = router;
