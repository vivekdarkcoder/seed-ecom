const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const connectDB = require('./db');

// Load env from project root so seeding works when run from anywhere
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const logMongoUri = () => {
  try {
    const uri = connectDB.buildMongoUri ? connectDB.buildMongoUri() : process.env.MONGO_URI;
    const parsed = new URL(uri);
    const maskedAuth = parsed.username ? '***:***@' : '';
    console.log(`Using Mongo URI: ${parsed.protocol}//${maskedAuth}${parsed.host}${parsed.pathname}`);
  } catch (err) {
    console.warn('Could not parse Mongo URI for logging. Raw value:', process.env.MONGO_URI || '(empty)');
  }
};

const slugify = (str, suffix = '') =>
  `${str}`.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .concat(suffix ? `-${suffix}` : '');

const categories = [
  { name: 'Tomato', slug: 'tomato', description: 'All varieties of tomato seeds', icon: '🍅', color: '#E53E3E', sortOrder: 1 },
  { name: 'Leafy Greens', slug: 'leafy-greens', description: 'Spinach, lettuce, kale & more', icon: '🥬', color: '#38A169', sortOrder: 2 },
  { name: 'Root Vegetables', slug: 'root-vegetables', description: 'Carrot, radish, beetroot seeds', icon: '🥕', color: '#DD6B20', sortOrder: 3 },
  { name: 'Cucurbits', slug: 'cucurbits', description: 'Cucumber, gourd, pumpkin seeds', icon: '🥒', color: '#48BB78', sortOrder: 4 },
  { name: 'Legumes', slug: 'legumes', description: 'Beans, peas, soybean seeds', icon: '🫘', color: '#805AD5', sortOrder: 5 },
  { name: 'Herbs & Spices', slug: 'herbs-spices', description: 'Coriander, fenugreek, basil', icon: '🌿', color: '#2C7A7B', sortOrder: 6 },
  { name: 'Brinjal & Peppers', slug: 'brinjal-peppers', description: 'Brinjal, chilli, capsicum', icon: '🫑', color: '#9B2C2C', sortOrder: 7 },
  { name: 'Exotic Vegetables', slug: 'exotic-vegetables', description: 'Broccoli, zucchini, asparagus', icon: '🥦', color: '#276749', sortOrder: 8 },
];

const seedData = async () => {
  logMongoUri();
  try {
    await connectDB();
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Create admin
    await User.create({
      name: 'Admin User',
      email: 'admin@seedscraft.com',
      password: 'admin123',
      role: 'admin',
      phone: '9999999999'
    });

    // Create test user
    await User.create({
      name: 'Test User',
      email: 'user@seedscraft.com',
      password: 'user1234',
      role: 'user',
      phone: '8888888888'
    });

    const createdCategories = await Category.insertMany(categories);
    console.log('✅ Categories seeded');

    const tomatoCat = createdCategories.find(c => c.slug === 'tomato');
    const leafyCat = createdCategories.find(c => c.slug === 'leafy-greens');
    const rootCat = createdCategories.find(c => c.slug === 'root-vegetables');

    const products = [
      {
        name: 'Cherry Tomato F1 Hybrid',
        sku: 'SKU-CT-F1',
        description: 'High-yielding cherry tomato variety with sweet taste. Perfect for home gardens and commercial farming.',
        shortDescription: 'Sweet, high-yielding cherry tomatoes',
        category: tomatoCat._id,
        price: 149, discountPrice: 129, stock: 500,
        weight: '10g', packSize: '100 seeds', germinationRate: '90%', daysToHarvest: '65-70 days',
        season: 'All Season', difficulty: 'Easy', isOrganic: false, isHeirloom: false, isFeatured: true,
        tags: ['tomato', 'cherry', 'hybrid', 'high-yield'],
        images: ['https://images.unsplash.com/photo-1546094096-0df4bcabd09a?w=400'],
        plantingInstructions: 'Sow seeds 5mm deep in well-draining soil. Transplant after 4 weeks.',
        careInstructions: 'Water regularly, provide support stakes when 30cm tall.'
      },
      {
        name: 'Pusa Ruby Tomato',
        sku: 'SKU-PUSA-RUBY',
        description: 'IARI developed variety with excellent shelf life. Popular across India for its firm texture.',
        shortDescription: 'IARI certified, excellent shelf life',
        category: tomatoCat._id,
        price: 89, discountPrice: 79, stock: 800,
        weight: '5g', packSize: '50 seeds', germinationRate: '85%', daysToHarvest: '75-80 days',
        season: 'Rabi', difficulty: 'Easy', isOrganic: false, isHeirloom: true, isFeatured: true,
        tags: ['tomato', 'pusa', 'IARI', 'heirloom'],
        images: ['https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=400'],
      },
      {
        name: 'Spinach (Palak) Seeds',
        sku: 'SKU-SPINACH',
        description: 'Fast-growing palak variety rich in iron. Thrives in cool weather and can be harvested multiple times.',
        shortDescription: 'Iron-rich, multi-harvest palak',
        category: leafyCat._id,
        price: 59, stock: 1200,
        weight: '25g', packSize: '200+ seeds', germinationRate: '88%', daysToHarvest: '30-45 days',
        season: 'Winter', difficulty: 'Easy', isOrganic: true, isFeatured: true,
        tags: ['spinach', 'palak', 'leafy', 'organic', 'winter'],
        images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400'],
      },
      {
        name: 'Nantes Carrot Seeds',
        sku: 'SKU-NANTES-CARROT',
        description: 'Classic cylindrical carrot with sweet, crisp flesh. Excellent for both kitchen gardens and commercial production.',
        shortDescription: 'Sweet, crisp Nantes variety carrot',
        category: rootCat._id,
        price: 79, discountPrice: 69, stock: 600,
        weight: '5g', packSize: '500+ seeds', germinationRate: '82%', daysToHarvest: '70-80 days',
        season: 'Winter', difficulty: 'Medium', isOrganic: false,
        tags: ['carrot', 'nantes', 'root', 'winter'],
        images: ['https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400'],
      },
    ];

    const productsWithSlugs = products.map((p, idx) => ({
      ...p,
      slug: p.slug || slugify(p.name, idx + 1), // ensure unique slugs for insertMany (pre-save hooks don't run)
      sku: p.sku || `SKU-${slugify(p.name, idx + 1)}`, // ensure unique SKU
    }));

    await Product.insertMany(productsWithSlugs);
    console.log('✅ Products seeded');
    console.log('\n🌱 Seeding complete!');
    console.log('Admin: admin@seedscraft.com / admin123');
    console.log('User:  user@seedscraft.com / user1234');
    process.exit(0);
  } catch (err) {
    console.error('Seeder error:', err);
    process.exit(1);
  }
};

seedData();
