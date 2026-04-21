const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Product = require('../models/Product');
const Collection = require('../models/Collection');

async function checkImages() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');

  const products = await Product.find({}, 'image');
  const collections = await Collection.find({}, 'image');

  const usedImages = new Set();
  products.forEach(p => { if (p.image) usedImages.add(p.image); });
  collections.forEach(c => { if (c.image) usedImages.add(c.image); });

  console.log('Used Images in DB:');
  usedImages.forEach(img => console.log(img));

  await mongoose.disconnect();
}

checkImages().catch(err => {
  console.error(err);
  process.exit(1);
});
