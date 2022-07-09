const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Article = require('./article');

const ProductSchema = new Schema({
  firstName: {
    type: String,
    minLength: [4, 'Name is too short'],
    maxLength: [50, 'Name is to long'],
    required: [true, 'This field is required']
  },
  lastName: {
    type: String,
    minLength: [3, 'Name is too short'],
    maxLength: [60, 'Name is to long'],
    required: [true, 'This field is required']
  },
  role: {
    type: String,
    enum: {values: ['admin', 'writer', 'guest'], message: '{VALUE} is not a valid role'}
  },
  createdAt: {type: Date, default: Date.now},
  numberOfArticles: {type: Number, default: 0},
  nickname: {type: String}
});

ProductSchema.pre('findOneAndDelete', async function (res, next) {
  await Article.deleteMany({owner: this._conditions._id});
  next();
});

module.exports = mongoose.model('User', ProductSchema);
