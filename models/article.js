const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      minLength: [5, 'Title is too short'],
      maxLength: [400, 'Title is to long'],
      required: [true, 'This field is required']
    },
    subtitle: {
      type: String,
      minLength: [5, 'Subtitle is too short']
    },
    description: {
      type: String,
      minLength: [5, 'Description is too short'],
      maxLength: [5000, 'Description is to long'],
      required: [true, 'This field is required']
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'This field is required']
    },
    category: {
      type: String,
      enum: {values: ['sport', 'games', 'history'], message: '{VALUE} is not a valid category'}
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Article', ProductSchema);
