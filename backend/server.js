const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');

dotenv.config();

const app = express();

// Middleware
// Relax CORS in development so any local frontend (localhost, 127.0.0.1, LAN IP, different ports) can access the API.
if (process.env.NODE_ENV === 'production') {
  app.use(cors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000',
      'https://HostelManagementSystem.vercel.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
} else {
  app.use(cors({
    origin: true, // reflect the request origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration for OAuth
app.use(
  session({
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Health check endpoint
// connectDB();
let isConnected = false;
async function connectToMongoDB()
{
 try{
   await mongoose.connect(process.env.MONGO_URI, { 
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
   isConnected = true;
   console.log("connected to mongodb");
 }
  catch(error) {
   console.log("Not Connecting to Mongo DB", error);
 }
}
app.use((req,res,next)=>{
  if(!isConnected)
  {
      connectToMongoDB();
  }
  next();
})
module.exports = app;

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
// OAuth routes removed
// app.use('/api/auth', require('./routes/authOAuth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/accountant', require('./routes/accountant'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/fees', require('./routes/fees'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/mess', require('./routes/mess'));

// MongoDB Connection
// const connectDB = async () => {
//   try {
//     if(isConnected)
//     {
//       return;
//     }
//     const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://muhammadfarrukhofficial_db_user:wYt6YGiti3MnIEeE@cluster0.yuxzjvg.mongodb.net/hostel_management?retryWrites=true&w=majority', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     // await mongoose.connect(process.env.MONGODB_URI);
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//     isConnected = true;
//   } catch (error) {
//     console.error('MongoDB connection error:', error.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

// export default async function handler(req,res) {
//   await connectDB();
//   res.json({database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}) 
// }

// handler();
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`CORS enabled for: http://localhost:3000 and production URLs`);
// });

