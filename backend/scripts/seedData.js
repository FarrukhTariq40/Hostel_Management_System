const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Room = require('../models/Room');
const Fee = require('../models/Fee');
const MessMenu = require('../models/MessMenu');
const Notification = require('../models/Notification');

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hostel_management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Room.deleteMany({});
    await Fee.deleteMany({});
    await MessMenu.deleteMany({});
    await Notification.deleteMany({});

    console.log('Cleared existing data');

    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@hostel.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create Accountant
    const accountant = await User.create({
      name: 'Accountant User',
      email: 'accountant@hostel.com',
      password: 'accountant123',
      role: 'accountant',
    });

    // Create Students
    const students = await User.create([
      {
        name: 'John Doe',
        email: 'john@student.com',
        password: 'student123',
        role: 'student',
        studentId: 'STU001',
        roomAllocationStatus: 'approved',
        roomNumber: '101',
        roomType: '2-person',
      },
      {
        name: 'Jane Smith',
        email: 'jane@student.com',
        password: 'student123',
        role: 'student',
        studentId: 'STU002',
        roomAllocationStatus: 'pending',
        roomType: '3-person',
      },
      {
        name: 'Bob Johnson',
        email: 'bob@student.com',
        password: 'student123',
        role: 'student',
        studentId: 'STU003',
        roomAllocationStatus: 'approved',
        roomNumber: '102',
        roomType: '4-person',
      },
      {
        name: 'Alice Williams',
        email: 'alice@student.com',
        password: 'student123',
        role: 'student',
        studentId: 'STU004',
        roomAllocationStatus: 'none',
      },
    ]);

    console.log('Created users');

    // Create Rooms
    const rooms = await Room.create([
      {
        roomNumber: '101',
        roomType: '2-person',
        capacity: 2,
        currentOccupancy: 1,
        charge: 5000,
        students: [students[0]._id],
        isAvailable: true,
      },
      {
        roomNumber: '102',
        roomType: '4-person',
        capacity: 4,
        currentOccupancy: 1,
        charge: 3000,
        students: [students[2]._id],
        isAvailable: true,
      },
      {
        roomNumber: '103',
        roomType: '3-person',
        capacity: 3,
        currentOccupancy: 0,
        charge: 4000,
        isAvailable: true,
      },
      {
        roomNumber: '201',
        roomType: '2-person',
        capacity: 2,
        currentOccupancy: 0,
        charge: 5000,
        isAvailable: true,
      },
      {
        roomNumber: '202',
        roomType: '3-person',
        capacity: 3,
        currentOccupancy: 0,
        charge: 4000,
        isAvailable: true,
      },
      {
        roomNumber: '203',
        roomType: '4-person',
        capacity: 4,
        currentOccupancy: 0,
        charge: 3000,
        isAvailable: true,
      },
    ]);

    console.log('Created rooms');

    // Create Fees
    const fees = await Fee.create([
      {
        studentId: students[0]._id,
        studentName: students[0].name,
        studentEmail: students[0].email,
        amount: 5000,
        roomCharge: 5000,
        messCharge: 2000,
        fine: 0,
        status: 'paid',
        dueDate: new Date('2024-01-15'),
        paidDate: new Date('2024-01-10'),
        paymentMethod: 'Online',
      },
      {
        studentId: students[1]._id,
        studentName: students[1].name,
        studentEmail: students[1].email,
        amount: 4000,
        roomCharge: 4000,
        messCharge: 2000,
        fine: 500,
        status: 'pending',
        dueDate: new Date('2024-02-15'),
      },
      {
        studentId: students[2]._id,
        studentName: students[2].name,
        studentEmail: students[2].email,
        amount: 3000,
        roomCharge: 3000,
        messCharge: 2000,
        fine: 0,
        status: 'paid',
        dueDate: new Date('2024-01-15'),
        paidDate: new Date('2024-01-12'),
        paymentMethod: 'Cash',
      },
      {
        studentId: students[0]._id,
        studentName: students[0].name,
        studentEmail: students[0].email,
        amount: 7000,
        roomCharge: 5000,
        messCharge: 2000,
        fine: 0,
        status: 'pending',
        dueDate: new Date('2024-03-15'),
      },
    ]);

    console.log('Created fees');

    // Create Mess Menu
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const menuItems = {
      breakfast: [
        ['Bread', 'Butter', 'Jam', 'Tea'],
        ['Paratha', 'Curry', 'Tea'],
        ['Poha', 'Tea'],
        ['Sandwich', 'Tea'],
        ['Idli', 'Sambar', 'Tea'],
        ['Dosa', 'Chutney', 'Tea'],
        ['Puri', 'Sabzi', 'Tea'],
      ],
      lunch: [
        ['Rice', 'Dal', 'Sabzi', 'Roti'],
        ['Rice', 'Rajma', 'Sabzi', 'Roti'],
        ['Rice', 'Chole', 'Sabzi', 'Roti'],
        ['Rice', 'Dal', 'Paneer', 'Roti'],
        ['Rice', 'Dal', 'Sabzi', 'Roti'],
        ['Biryani', 'Raita'],
        ['Rice', 'Dal', 'Sabzi', 'Roti'],
      ],
      dinner: [
        ['Rice', 'Dal', 'Sabzi', 'Roti'],
        ['Rice', 'Dal', 'Paneer', 'Roti'],
        ['Rice', 'Dal', 'Sabzi', 'Roti'],
        ['Rice', 'Dal', 'Chole', 'Roti'],
        ['Rice', 'Dal', 'Sabzi', 'Roti'],
        ['Rice', 'Dal', 'Sabzi', 'Roti'],
        ['Rice', 'Dal', 'Sabzi', 'Roti'],
      ],
    };

    const messMenus = [];
    for (let i = 0; i < days.length; i++) {
      const menu = await MessMenu.create({
        day: days[i],
        breakfast: {
          items: menuItems.breakfast[i],
          timing: { start: '08:00', end: '10:00' },
        },
        lunch: {
          items: menuItems.lunch[i],
          timing: { start: '12:00', end: '14:00' },
        },
        dinner: {
          items: menuItems.dinner[i],
          timing: { start: '19:00', end: '21:00' },
        },
        updatedBy: admin._id,
      });
      messMenus.push(menu);
    }

    console.log('Created mess menu');

    // Create Notifications
    await Notification.create([
      {
        title: 'Welcome to Hostel Management System',
        message: 'Welcome! Please update your profile and check the mess menu.',
        recipient: 'all',
        createdBy: admin._id,
      },
      {
        title: 'Fee Payment Reminder',
        message: 'Please pay your pending fees before the due date to avoid fines.',
        recipient: 'student',
        createdBy: admin._id,
      },
      {
        title: 'Mess Menu Updated',
        message: 'The mess menu for this week has been updated. Please check the new menu.',
        recipient: 'student',
        createdBy: admin._id,
      },
    ]);

    console.log('Created notifications');

    console.log('\n=== Seed Data Summary ===');
    console.log(`Admin: ${admin.email} / admin123`);
    console.log(`Accountant: ${accountant.email} / accountant123`);
    console.log(`Students: ${students.length} created`);
    console.log(`Rooms: ${rooms.length} created`);
    console.log(`Fees: ${fees.length} created`);
    console.log(`Mess Menu: ${messMenus.length} days created`);
    console.log('Notifications: 3 created');
    console.log('\nSeed data created successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();











