const Testimonial = require('../models/testimonial.model');
const sanitize = require('mongo-sanitize');

exports.getAll = async (req, res) => {
  try {
    res.json(await Testimonial.find());
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Testimonial.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const testimonial = await Testimonial.findOne().skip(rand);
    if (!testimonial)
      res.status(404).json({ message: 'Testimonial not found' });
    else res.json(testimonial);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial)
      res.status(404).json({ message: 'Testimonial not found' });
    else res.json(testimonial);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.create = async (req, res) => {
  try {
    const sanitizedBody = sanitize(req.body);
    const { author, text } = sanitizedBody;

    const newTestimonial = new Testimonial({
      author,
      text,
    });
    await newTestimonial.save();
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.edit = async (req, res) => {
  const { author, text } = req.body;

  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (testimonial) {
      testimonial.author = author;
      testimonial.text = text;
      await testimonial.save();
      res.json(testimonial);
    } else res.status(404).json({ message: 'Testimonial not found' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.delete = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (testimonial) {
      await Testimonial.deleteOne({ _id: req.params.id });
      res.json(testimonial);
    } else res.status(404).json({ message: 'Testimonial not found' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
