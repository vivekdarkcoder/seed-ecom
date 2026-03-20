const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String, required: true },
  shortDescription: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, default: 0 },
  images: [{ type: String }],
  stock: { type: Number, required: true, default: 0 },
  sku: { type: String, unique: true },
  weight: { type: String },           // e.g. "50g", "100g"
  packSize: { type: String },         // e.g. "500 seeds"
  germinationRate: { type: String },  // e.g. "85%"
  daysToHarvest: { type: String },    // e.g. "60-70 days"
  season: { type: String, enum: ['Summer', 'Winter', 'All Season', 'Kharif', 'Rabi'] },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
  isOrganic: { type: Boolean, default: false },
  isHeirloom: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  tags: [{ type: String }],
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  soldCount: { type: Number, default: 0 },
  plantingInstructions: { type: String },
  careInstructions: { type: String },
}, { timestamps: true });

productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
  if (this.reviews && this.reviews.length > 0) {
    this.numReviews = this.reviews.length;
    this.rating = this.reviews.reduce((acc, r) => acc + r.rating, 0) / this.reviews.length;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
