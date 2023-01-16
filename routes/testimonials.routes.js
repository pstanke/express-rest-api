const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const db = require('./../db');

router.route('/testimonials/random').get((req, res) => {
  res.json(db.testimonials[Math.floor(Math.random() * db.testimonials.length)]);
});

router.route('/testimonials').get((req, res) => {
  res.json(db.testimonials);
});

router.route('/testimonials/:id').get((req, res) => {
  res.json(db.testimonials.find((elem) => elem.id === req.params.id));
});

router.route('/testimonials/:id').delete((req, res) => {
  db.testimonials.filter((elem) => elem.id !== req.params.id);
  res.json({ message: 'OK' });
});

router.route('/testimonials/:id').put((req, res) => {
  db.testimonials.map((elem) =>
    elem.id === req.params.id ? { ...elem, ...req.body } : elem
  );
  res.json({ message: 'OK' });
});

router.route('/testimonials/:id').post((req, res) => {
  [...db.testimonials, { id: uuidv4(), ...req.body }];
  res.json({ message: 'OK' });
});

module.exports = router;
