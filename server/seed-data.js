// TEST DATA FOR STUDENT STORE
// Based on your MongoDB models
// Run this script with: node seed-data.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Import models
const User = require('./src/models/User');
const Inventory = require('./src/models/Inventory');
const Order = require('./src/models/Orders');
const CustomOrder = require('./src/models/CustomOrders');
const Testimonial = require('./src/models/Testimonials');

// ============================================
// TEST DATA
// ============================================

// 1. USERS (5 users)
const users = [
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    password: "password123",
    role: "admin"
  },
  {
    name: "Bob Smith",
    email: "bob@example.com",
    password: "password123",
    role: "user"
  },
  {
    name: "Charlie Brown",
    email: "charlie@example.com",
    password: "password123",
    role: "user"
  },
  {
    name: "Diana Martinez",
    email: "diana@example.com",
    password: "password123",
    role: "user"
  },
  {
    name: "Ethan Davis",
    email: "ethan@example.com",
    password: "password123",
    role: "user"
  }
];

// 2. INVENTORY (5 items)
const inventoryItems = [
  {
    itemName: "Custom Phone Case",
    itemPrice: "15.99",
    amountInStock: 50,
    filament: "PLA",
    imageURL: "https://picsum.photos/400/400?random=1"
  },
  {
    itemName: "Desk Organizer",
    itemPrice: "22.50",
    amountInStock: 30,
    filament: "PETG",
    imageURL: "https://picsum.photos/400/400?random=2"
  },
  {
    itemName: "Phone Stand",
    itemPrice: "12.99",
    amountInStock: 75,
    filament: "PLA",
    imageURL: "https://picsum.photos/400/400?random=3"
  },
  {
    itemName: "Cable Management Clip",
    itemPrice: "8.99",
    amountInStock: 100,
    filament: "ABS",
    imageURL: "https://picsum.photos/400/400?random=4"
  },
  {
    itemName: "Keycap Set",
    itemPrice: "35.00",
    amountInStock: 20,
    filament: "PETG",
    imageURL: "https://picsum.photos/400/400?random=5"
  }
];

// 3. ORDERS (Will be created after users - 5 orders)
const getOrdersData = (userIds) => [
  {
    customer: userIds[0],
    customerName: "Alice Johnson",
    customerEmail: "alice@example.com",
    orderDetails: [
      { item: "Custom Phone Case", quantity: 2, price: "15.99" },
      { item: "Phone Stand", quantity: 1, price: "12.99" }
    ]
  },
  {
    customer: userIds[1],
    customerName: "Bob Smith",
    customerEmail: "bob@example.com",
    orderDetails: [
      { item: "Desk Organizer", quantity: 1, price: "22.50" }
    ]
  },
  {
    customer: userIds[2],
    customerName: "Charlie Brown",
    customerEmail: "charlie@example.com",
    orderDetails: [
      { item: "Cable Management Clip", quantity: 5, price: "8.99" },
      { item: "Phone Stand", quantity: 2, price: "12.99" }
    ]
  },
  {
    customer: userIds[3],
    customerName: "Diana Martinez",
    customerEmail: "diana@example.com",
    orderDetails: [
      { item: "Keycap Set", quantity: 1, price: "35.00" }
    ]
  },
  {
    customer: userIds[0],
    customerName: "Alice Johnson",
    customerEmail: "alice@example.com",
    orderDetails: [
      { item: "Desk Organizer", quantity: 2, price: "22.50" },
      { item: "Custom Phone Case", quantity: 1, price: "15.99" }
    ]
  }
];

// 4. CUSTOM ORDERS (Will be created after users - 5 custom orders)
const getCustomOrdersData = (userIds) => [
  {
    customer: userIds[0],
    customerName: "Alice Johnson",
    customerEmail: "alice@example.com",
    orderDetails: [
      { description: "Custom laptop stand with university logo", specifications: "15 inch width, ergonomic angle" }
    ],
    orderFileURL: "https://example.com/files/custom-laptop-stand.stl"
  },
  {
    customer: userIds[1],
    customerName: "Bob Smith",
    customerEmail: "bob@example.com",
    orderDetails: [
      { description: "Personalized nameplate", specifications: "10cm x 3cm, cursive font" }
    ],
    orderFileURL: "https://example.com/files/nameplate-bob.stl"
  },
  {
    customer: userIds[2],
    customerName: "Charlie Brown",
    customerEmail: "charlie@example.com",
    orderDetails: [
      { description: "Custom game controller holder", specifications: "Fits PS5 controller, wall-mounted" }
    ],
    orderFileURL: "https://example.com/files/controller-holder.stl"
  },
  {
    customer: userIds[3],
    customerName: "Diana Martinez",
    customerEmail: "diana@example.com",
    orderDetails: [
      { description: "Customized pencil holder with initials DM", specifications: "5 compartments, rounded edges" }
    ],
    orderFileURL: "https://example.com/files/pencil-holder-dm.stl"
  },
  {
    customer: userIds[4],
    customerName: "Ethan Davis",
    customerEmail: "ethan@example.com",
    orderDetails: [
      { description: "Mini figurine of college mascot", specifications: "8cm tall, detailed features" }
    ],
    orderFileURL: "https://example.com/files/mascot-figurine.stl"
  }
];

// 5. TESTIMONIALS (Will be created after users - 5 testimonials)
const getTestimonialsData = (userIds) => [
  {
    writer: userIds[0],
    writerName: "Alice Johnson",
    writerEmail: "alice@example.com",
    testimonialWritten: "Amazing quality! The custom phone case fits perfectly and the print quality is outstanding. Highly recommend!"
  },
  {
    writer: userIds[1],
    writerName: "Bob Smith",
    writerEmail: "bob@example.com",
    testimonialWritten: "Great customer service and fast delivery. The desk organizer has really helped me stay productive."
  },
  {
    writer: userIds[2],
    writerName: "Charlie Brown",
    writerEmail: "charlie@example.com",
    testimonialWritten: "The cable clips are exactly what I needed. Clean design and very functional. Will order more!"
  },
  {
    writer: userIds[3],
    writerName: "Diana Martinez",
    writerEmail: "diana@example.com",
    testimonialWritten: "Love the keycap set! Colors are vibrant and they feel very durable. Worth every penny."
  },
  {
    writer: userIds[4],
    writerName: "Ethan Davis",
    writerEmail: "ethan@example.com",
    testimonialWritten: "The custom order service is fantastic! They brought my design to life perfectly. Five stars!"
  }
];

// ============================================
// SEEDING FUNCTION
// ============================================

async function seedDatabase() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI_JOSE);
    console.log('MongoDB Connected\n');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Inventory.deleteMany({});
    await Order.deleteMany({});
    await CustomOrder.deleteMany({});
    await Testimonial.deleteMany({});
    console.log('Existing data cleared\n');

    // 1. Create Users
    console.log('Creating users...');
    const createdUsers = [];
    for (const userData of users) {
      const passwordHash = await bcrypt.hash(userData.password, 12);
      const user = await User.create({
        name: userData.name,
        email: userData.email,
        passwordHash,
        role: userData.role || "user"
      });
      createdUsers.push(user);
      console.log(`   ✓ Created user: ${user.name}`);
    }
    const userIds = createdUsers.map(u => u._id);
    console.log(`✅ ${createdUsers.length} users created\n`);

    // 2. Create Inventory Items
    console.log('Creating inventory items...');
    const createdInventory = await Inventory.insertMany(inventoryItems);
    createdInventory.forEach(item => {
      console.log(`   ✓ Created item: ${item.itemName}`);
    });
    console.log(`Created ${createdInventory.length} inventory items\n`);

    // 3. Create Orders
    console.log('Creating orders...');
    const ordersData = getOrdersData(userIds);
    const createdOrders = await Order.insertMany(ordersData);
    createdOrders.forEach(order => {
      console.log(`   ✓ Created order for: ${order.customerName}`);
    });
    console.log(`Created ${createdOrders.length} orders\n`);

    // 4. Create Custom Orders
    console.log('Creating custom orders...');
    const customOrdersData = getCustomOrdersData(userIds);
    const createdCustomOrders = await CustomOrder.insertMany(customOrdersData);
    createdCustomOrders.forEach(order => {
      console.log(`✓ Created custom order for: ${order.customerName}`);
    });
    console.log(`Created ${createdCustomOrders.length} custom orders\n`);

    // 5. Create Testimonials
    console.log('Creating testimonials...');
    const testimonialsData = getTestimonialsData(userIds);
    const createdTestimonials = await Testimonial.insertMany(testimonialsData);
    createdTestimonials.forEach(testimonial => {
      console.log(`✓ Created testimonial by: ${testimonial.writerName}`);
    });
    console.log(`Created ${createdTestimonials.length} testimonials\n`);

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('DATABASE SEEDED SUCCESSFULLY!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✓ Users: ${createdUsers.length}`);
    console.log(`✓ Inventory Items: ${createdInventory.length}`);
    console.log(`✓ Orders: ${createdOrders.length}`);
    console.log(`✓ Custom Orders: ${createdCustomOrders.length}`);
    console.log(`✓ Testimonials: ${createdTestimonials.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('TEST LOGIN CREDENTIALS:');
    console.log('   Email: alice@example.com');
    console.log('   Password: password123');
    console.log('   (All users have the same password)\n');

    // Disconnect
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();