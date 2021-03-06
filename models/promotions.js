const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const PromotionSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  price: {
    type: Currency,
    required: true,
    min: 0
  },
  featured: {
    type: Boolean,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
},
  {
    timestamps: true
  });



var Promotions = mongoose.model('Promotion', PromotionSchema);

module.exports = Promotions;