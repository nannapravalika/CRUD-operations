const mongoose = require('mongoose');

const industrySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  icon: {
    data: Buffer, // Store icon image as buffer
    contentType: String // Store icon image content type
  },
  image: {
    data: Buffer, // Store image as buffer
    contentType: String // Store image content type
  },
  active: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Industry', industrySchema);
