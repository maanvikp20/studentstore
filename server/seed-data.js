require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const User        = require('./src/models/User');
const Inventory   = require('./src/models/Inventory');
const Order       = require('./src/models/Orders');
const CustomOrder = require('./src/models/CustomOrders');
const Testimonial = require('./src/models/Testimonials');

// ── Users ────────────────────────────────────────────────────────
const users = [
  { name: "Alice Johnson",  email: "alice@example.com",   password: "password123", role: "admin" },
  { name: "Bob Smith",      email: "bob@example.com",      password: "password123", role: "user"  },
  { name: "Charlie Brown",  email: "charlie@example.com",  password: "password123", role: "user"  },
  { name: "Diana Martinez", email: "diana@example.com",    password: "password123", role: "user"  },
  { name: "Ethan Davis",    email: "ethan@example.com",    password: "password123", role: "user"  },
];

// ── Inventory ────────────────────────────────────────────────────
const inventoryItems = [
  { itemName: "Custom Phone Case",       itemPrice: "15.99", amountInStock: 50,  filament: "PLA",  imageURL: "https://picsum.photos/400/400?random=1", description: "Slim-fit phone case printed in matte PLA. Available for most models." },
  { itemName: "Desk Organizer",          itemPrice: "22.50", amountInStock: 30,  filament: "PETG", imageURL: "https://picsum.photos/400/400?random=2", description: "Six-compartment desk organizer, durable PETG construction." },
  { itemName: "Phone Stand",             itemPrice: "12.99", amountInStock: 75,  filament: "PLA",  imageURL: "https://picsum.photos/400/400?random=3", description: "Adjustable phone stand, compatible with all smartphones." },
  { itemName: "Cable Management Clip",   itemPrice: "8.99",  amountInStock: 100, filament: "ABS",  imageURL: "https://picsum.photos/400/400?random=4", description: "Keep your cables tidy. Pack of 10 clips." },
  { itemName: "Keycap Set",              itemPrice: "35.00", amountInStock: 20,  filament: "PETG", imageURL: "https://picsum.photos/400/400?random=5", description: "Custom PETG keycap set, vibrant colors, standard layout." },
  { itemName: "Raspberry Pi Case",       itemPrice: "18.00", amountInStock: 3,   filament: "PLA",  imageURL: "https://picsum.photos/400/400?random=6", description: "Vented case for Raspberry Pi 4, fits official cooling fan." },
  { itemName: "Earphone Holder",         itemPrice: "9.50",  amountInStock: 0,   filament: "TPU",  imageURL: "https://picsum.photos/400/400?random=7", description: "Flexible TPU earphone holder, attaches to desk edge." },
];

// ── Orders ───────────────────────────────────────────────────────
const getOrdersData = (ids) => [
  {
    customer: ids[0], customerName: "Alice Johnson", customerEmail: "alice@example.com",
    status: "Completed",
    orderDetails: ["Custom Phone Case x2 @ $15.99", "Phone Stand x1 @ $12.99"],
  },
  {
    customer: ids[1], customerName: "Bob Smith", customerEmail: "bob@example.com",
    status: "Processing",
    orderDetails: ["Desk Organizer x1 @ $22.50"],
  },
  {
    customer: ids[2], customerName: "Charlie Brown", customerEmail: "charlie@example.com",
    status: "Pending",
    orderDetails: ["Cable Management Clip x5 @ $8.99", "Phone Stand x2 @ $12.99"],
  },
  {
    customer: ids[3], customerName: "Diana Martinez", customerEmail: "diana@example.com",
    status: "Completed",
    orderDetails: ["Keycap Set x1 @ $35.00"],
  },
  {
    customer: ids[0], customerName: "Alice Johnson", customerEmail: "alice@example.com",
    status: "Cancelled",
    orderDetails: ["Desk Organizer x2 @ $22.50", "Custom Phone Case x1 @ $15.99"],
  },
];

// ── Custom Orders ─────────────────────────────────────────────────
const getCustomOrdersData = (ids) => [
  {
    customer: ids[0], customerName: "Alice Johnson", customerEmail: "alice@example.com",
    orderDetails: ["Custom laptop stand with university logo", "15 inch width, ergonomic angle"],
    orderFileURL: "https://example.com/files/custom-laptop-stand.stl",
    fileName: "custom-laptop-stand.stl", fileType: "stl",
    material: "PLA", color: "White", quantity: 1,
    sliceStatus: "done",
    gcodeURL: "https://example.com/gcode/custom-laptop-stand.gcode",
    gcodeStats: { printTimeMins: 145, filamentUsedG: 38.4, filamentUsedMm: 12820, layerCount: 580 },
    estimatedCost: {
      low: 14.20, high: 21.10, currency: "USD",
      breakdown: { materialCost: 0.96, laborCost: 5.50, complexityCost: 5.00, quantityTotal: 1, discountPct: 0, estimatedGrams: 38.4, complexityTier: "Moderate" },
      disclaimer: "Based on actual slicer data: 38.4g of PLA. Estimated print time: 2h 25m. Final price confirmed by admin.",
    },
    confirmedPrice: 18.00,
    status: "Quoted",
    notes: "Please use matte finish if possible.",
  },
  {
    customer: ids[1], customerName: "Bob Smith", customerEmail: "bob@example.com",
    orderDetails: ["Personalized nameplate", "10cm x 3cm, cursive font"],
    orderFileURL: "https://example.com/files/nameplate-bob.stl",
    fileName: "nameplate-bob.stl", fileType: "stl",
    material: "PETG", color: "Galaxy Black", quantity: 2,
    sliceStatus: "done",
    gcodeURL: "https://example.com/gcode/nameplate-bob.gcode",
    gcodeStats: { printTimeMins: 42, filamentUsedG: 8.1, filamentUsedMm: 2700, layerCount: 168 },
    estimatedCost: {
      low: 10.50, high: 15.60, currency: "USD",
      breakdown: { materialCost: 0.49, laborCost: 6.50, complexityCost: 2.00, quantityTotal: 2, discountPct: 0, estimatedGrams: 8.1, complexityTier: "Simple" },
      disclaimer: "Based on actual slicer data: 8.1g of PETG per unit. Final price confirmed by admin.",
    },
    status: "In Progress",
    notes: "",
  },
  {
    customer: ids[2], customerName: "Charlie Brown", customerEmail: "charlie@example.com",
    orderDetails: ["Custom game controller holder", "Fits PS5 controller, wall-mounted"],
    orderFileURL: "https://example.com/files/controller-holder.stl",
    fileName: "controller-holder.stl", fileType: "stl",
    material: "ABS", color: "Matte Gray", quantity: 1,
    sliceStatus: "error",
    estimatedCost: {
      low: 12.80, high: 19.10, currency: "USD",
      breakdown: { materialCost: 1.12, laborCost: 5.50, complexityCost: 5.00, quantityTotal: 1, discountPct: 0, estimatedGrams: 40.0, complexityTier: "Moderate" },
      disclaimer: "Estimate based on file size (~1.8MB, Moderate geometry). Slicer error — admin will process manually. Final price confirmed by admin.",
    },
    status: "Reviewing",
    notes: "Slicer failed — might need mesh repair.",
  },
  {
    customer: ids[3], customerName: "Diana Martinez", customerEmail: "diana@example.com",
    orderDetails: ["Customized pencil holder with initials DM", "5 compartments, rounded edges"],
    orderFileURL: "https://example.com/files/pencil-holder-dm.stl",
    fileName: "pencil-holder-dm.stl", fileType: "stl",
    material: "PLA", color: "Lavender", quantity: 3,
    sliceStatus: "pending",
    estimatedCost: {
      low: 19.40, high: 28.80, currency: "USD",
      breakdown: { materialCost: 1.88, laborCost: 8.50, complexityCost: 5.00, quantityTotal: 3, discountPct: 0, estimatedGrams: 25.0, complexityTier: "Moderate" },
      disclaimer: "Estimate based on file size. Awaiting slicing. Final price confirmed by admin.",
    },
    status: "Pending",
    notes: "Wants all 3 in the same color.",
  },
  {
    customer: ids[4], customerName: "Ethan Davis", customerEmail: "ethan@example.com",
    orderDetails: ["Mini figurine of college mascot", "8cm tall, detailed features"],
    orderFileURL: "https://example.com/files/mascot-figurine.obj",
    fileName: "mascot-figurine.obj", fileType: "obj",
    material: "RESIN", color: "Clear", quantity: 1,
    sliceStatus: "unsupported",
    estimatedCost: {
      low: 16.40, high: 24.40, currency: "USD",
      breakdown: { materialCost: 4.00, laborCost: 5.50, complexityCost: 5.00, quantityTotal: 1, discountPct: 0, estimatedGrams: 50.0, complexityTier: "Moderate" },
      disclaimer: "OBJ file — manual slicing required. Estimate based on file size. Final price confirmed by admin.",
    },
    status: "Pending",
    notes: "Wants ultra-fine detail, 0.05mm layer height if possible.",
  },
];

// ── Testimonials ──────────────────────────────────────────────────
const getTestimonialsData = (ids) => [
  { writer: ids[0], writerName: "Alice Johnson",  writerEmail: "alice@example.com",   testimonialWritten: "Amazing quality! The custom phone case fits perfectly and the print quality is outstanding. Highly recommend!" },
  { writer: ids[1], writerName: "Bob Smith",      writerEmail: "bob@example.com",      testimonialWritten: "Great customer service and fast delivery. The desk organizer has really helped me stay productive." },
  { writer: ids[2], writerName: "Charlie Brown",  writerEmail: "charlie@example.com",  testimonialWritten: "The cable clips are exactly what I needed. Clean design and very functional. Will order more!" },
  { writer: ids[3], writerName: "Diana Martinez", writerEmail: "diana@example.com",    testimonialWritten: "Love the keycap set! Colors are vibrant and they feel very durable. Worth every penny." },
  { writer: ids[4], writerName: "Ethan Davis",    writerEmail: "ethan@example.com",    testimonialWritten: "The custom order service is fantastic! They brought my design to life perfectly. Five stars!" },
];

// ── Seed ──────────────────────────────────────────────────────────
async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI_JOSE);
    console.log('MongoDB Connected\n');

    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Inventory.deleteMany({}),
      Order.deleteMany({}),
      CustomOrder.deleteMany({}),
      Testimonial.deleteMany({}),
    ]);
    console.log('Cleared\n');

    // Users
    console.log('Creating users...');
    const createdUsers = [];
    for (const u of users) {
      const passwordHash = await bcrypt.hash(u.password, 12);
      const created = await User.create({ name: u.name, email: u.email, passwordHash, role: u.role });
      createdUsers.push(created);
      console.log(`   ✓ ${created.name} (${created.role})`);
    }
    const ids = createdUsers.map(u => u._id);
    console.log(`${createdUsers.length} users\n`);

    // Inventory
    console.log('Creating inventory...');
    const createdInv = await Inventory.insertMany(inventoryItems);
    createdInv.forEach(i => console.log(`   ✓ ${i.itemName} — $${i.itemPrice} (${i.amountInStock} in stock)`));
    console.log(`${createdInv.length} items\n`);

    // Orders
    console.log('Creating orders...');
    const createdOrders = await Order.insertMany(getOrdersData(ids));
    createdOrders.forEach(o => console.log(`   ✓ ${o.customerName} — ${o.status}`));
    console.log(`${createdOrders.length} orders\n`);

    // Custom Orders
    console.log('Creating custom orders...');
    const createdCustom = await CustomOrder.insertMany(getCustomOrdersData(ids));
    createdCustom.forEach(o => console.log(`   ✓ ${o.customerName} — ${o.material} / ${o.sliceStatus}`));
    console.log(`${createdCustom.length} custom orders\n`);

    // Testimonials
    console.log('Creating testimonials...');
    const createdTest = await Testimonial.insertMany(getTestimonialsData(ids));
    createdTest.forEach(t => console.log(`   ✓ ${t.writerName}`));
    console.log(`${createdTest.length} testimonials\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('DATABASE SEEDED SUCCESSFULLY!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  Users:         ${createdUsers.length}`);
    console.log(`  Inventory:     ${createdInv.length}  (1 out of stock, 2 low stock)`);
    console.log(`  Orders:        ${createdOrders.length}  (mixed statuses)`);
    console.log(`  Custom Orders: ${createdCustom.length}  (all slice statuses represented)`);
    console.log(`  Testimonials:  ${createdTest.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('TEST LOGIN:');
    console.log('  Admin → alice@example.com / password123');
    console.log('  User  → bob@example.com   / password123\n');

    await mongoose.disconnect();
    console.log('Disconnected.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seedDatabase();

// NOTE: The seeded data was made by AI only for filling out more accounts, everything else was made by us.