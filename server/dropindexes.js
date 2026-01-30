require('dotenv').config();
const mongoose = require('mongoose');

async function dropUniqueIndexes() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI_JOSE);
    console.log('✅ MongoDB Connected\n');

    const db = mongoose.connection.db;

    // Drop unique indexes from Orders collection
    console.log('🗑️  Dropping unique index from Orders...');
    try {
      await db.collection('orders').dropIndex('customerEmail_1');
      console.log('✅ Dropped customerEmail_1 index from orders');
    } catch (err) {
      if (err.code === 27) {
        console.log('ℹ️  Index customerEmail_1 does not exist on orders');
      } else {
        console.log('⚠️  Error dropping orders index:', err.message);
      }
    }

    // Drop unique indexes from CustomOrders collection
    console.log('\n🗑️  Dropping unique index from CustomOrders...');
    try {
      await db.collection('customorders').dropIndex('customerEmail_1');
      console.log('✅ Dropped customerEmail_1 index from customorders');
    } catch (err) {
      if (err.code === 27) {
        console.log('ℹ️  Index customerEmail_1 does not exist on customorders');
      } else {
        console.log('⚠️  Error dropping customorders index:', err.message);
      }
    }

    // Drop unique indexes from Testimonials collection
    console.log('\n🗑️  Dropping unique index from Testimonials...');
    try {
      await db.collection('testimonials').dropIndex('writerEmail_1');
      console.log('✅ Dropped writerEmail_1 index from testimonials');
    } catch (err) {
      if (err.code === 27) {
        console.log('ℹ️  Index writerEmail_1 does not exist on testimonials');
      } else {
        console.log('⚠️  Error dropping testimonials index:', err.message);
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ INDEXES DROPPED SUCCESSFULLY!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('📝 Next steps:');
    console.log('   1. Replace your model files with the fixed versions');
    console.log('   2. Restart your server');
    console.log('   3. Run: node seed-data.js\n');

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

dropUniqueIndexes();