require('dotenv').config();
const mongoose = require('mongoose');

async function dropIndex(db, collection, index) {
  try {
    await db.collection(collection).dropIndex(index);
    console.log(`   ✓ Dropped "${index}" from ${collection}`);
  } catch (err) {
    if (err.code === 27) {
      console.log(`   – "${index}" not found on ${collection} (skip)`);
    } else {
      console.log(`   ✗ ${collection}/${index}: ${err.message}`);
    }
  }
}

async function main() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI_JOSE);
    console.log('Connected\n');

    const db = mongoose.connection.db;

    // Orders
    console.log('Orders:');
    await dropIndex(db, 'orders', 'customerEmail_1');

    // CustomOrders — old index + any new ones that might be stale
    console.log('\nCustomOrders:');
    await dropIndex(db, 'customorders', 'customerEmail_1');
    await dropIndex(db, 'customorders', 'orderFileURL_1');

    // Testimonials
    console.log('\nTestimonials:');
    await dropIndex(db, 'testimonials', 'writerEmail_1');

    // Users — just in case
    console.log('\nUsers:');
    await dropIndex(db, 'users', 'email_1');

    // Inventory — just in case
    console.log('\nInventory:');
    await dropIndex(db, 'inventory', 'itemName_1');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('DONE. Next steps:');
    console.log('  1. node seed-data.js');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();