# Roomify

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application for managing hostel operations digitally. The system supports three roles: Student, Accountant, and Admin, each with specific features and permissions.

## Features

### Student Features
- Submit complaints (mess issue, general issue, other)
- View personal fee status (paid, pending, fines)
- Check mess menu and mess timings
- Receive notifications from admin
- View room allocation details (2-person, 3-person, 4-person rooms with charges)
- Submit room allocation form

### Accountant Features
- View all students' fee records
- Check pending fines
- Maintain payment records
- Generate and send financial reports to admin

### Admin Features
- Update mess menu and timings
- Update room charges for each room type (2, 3, 4 person)
- Send notifications to students
- Manage student complaints (view, resolve, delete)
- Process room allocation requests (accept/reject)
- View all room allocations with student details
- Receive and view accountant financial reports

## Tech Stack

- **Frontend**: React.js with React Router, Context API, Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT-based authentication
- **Authorization**: Role-based access control (RBAC)

## Project Structure

```
Hostel_Project/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication & authorization middleware
│   ├── scripts/         # Data seeding script
│   ├── server.js        # Express server entry point
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # Context API for state management
│   │   ├── pages/       # Page components
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Start the backend server:
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

5. Seed the database with dummy data (optional):
```bash
npm run seed
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000` by default.

## Default Login Credentials

After running the seed script, you can use these credentials:

### Admin
- Email: `admin@hostel.com`
- Password: `admin123`

### Accountant
- Email: `accountant@hostel.com`
- Password: `accountant123`

### Student
- Email: `john@student.com`
- Password: `student123`

Additional students:
- `jane@student.com` / `student123`
- `bob@student.com` / `student123`
- `alice@student.com` / `student123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Students
- `POST /api/students/room-allocation` - Submit room allocation request
- `GET /api/students/room-details` - Get room allocation details

### Complaints
- `POST /api/complaints` - Create a complaint (Student)
- `GET /api/complaints` - Get complaints (Student: own, Admin: all)
- `GET /api/complaints/:id` - Get single complaint
- `PUT /api/complaints/:id/resolve` - Resolve complaint (Admin)
- `DELETE /api/complaints/:id` - Delete complaint (Admin)

### Fees
- `GET /api/fees` - Get fees (Student: own, Accountant/Admin: all)
- `GET /api/fees/status` - Get fee status summary (Student)
- `GET /api/fees/pending-fines` - Get pending fines (Accountant)
- `POST /api/fees` - Create fee record (Accountant/Admin)
- `PUT /api/fees/:id/pay` - Update fee payment status (Accountant)

### Rooms
- `GET /api/rooms` - Get all rooms with charges
- `GET /api/rooms/charges` - Get room charges for each type
- `PUT /api/rooms/charges` - Update room charges (Admin)
- `GET /api/rooms/allocations` - Get all room allocations (Admin)
- `POST /api/rooms` - Create a room (Admin)

### Notifications
- `POST /api/notifications` - Create notification (Admin)
- `GET /api/notifications` - Get notifications
- `GET /api/notifications/:id` - Get single notification
- `DELETE /api/notifications/:id` - Delete notification (Admin)

### Mess
- `GET /api/mess/menu` - Get mess menu
- `GET /api/mess/timings` - Get mess timings
- `PUT /api/mess/menu` - Update mess menu (Admin)
- `PUT /api/mess/timings` - Update mess timings (Admin)

### Admin
- `GET /api/admin/room-requests` - Get all pending room allocation requests
- `PUT /api/admin/room-requests/:id/approve` - Approve room allocation request
- `PUT /api/admin/room-requests/:id/reject` - Reject room allocation request
- `GET /api/admin/students` - Get all students

### Accountant
- `GET /api/accountant/reports` - Generate financial report
- `GET /api/accountant/students` - Get all students for fee management

## Deployment

### Backend Deployment (Render/Heroku)

1. Create a new web service on Render/Heroku
2. Connect your GitHub repository
3. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRE`
   - `NODE_ENV=production`
4. Set build command: `npm install`
5. Set start command: `npm start`

### Frontend Deployment (Vercel/Netlify)

1. Create a new project on Vercel/Netlify
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `build`
5. Update API base URL in frontend code to point to your deployed backend

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for all IPs)
5. Get your connection string and update `MONGODB_URI` in `.env`

## Development Notes

- All API requests require JWT authentication (except login/register)
- Token is stored in localStorage on the frontend
- Role-based access control is enforced on both frontend and backend
- Password hashing is done using bcryptjs
- CORS is enabled for frontend-backend communication

## Troubleshooting

### Backend Issues
- Ensure MongoDB connection string is correct
- Check that all environment variables are set
- Verify JWT_SECRET is set and secure

### Frontend Issues
- Ensure backend server is running on port 5000
- Check CORS settings if API calls fail
- Clear browser cache and localStorage if authentication issues occur

### Database Issues
- Run the seed script to populate initial data
- Check MongoDB Atlas connection and network access
- Verify database name and collection names match

## License

This project is open source and available under the MIT License.

## Contributing

Contributions, issues, and feature requests are welcome!

## Support

For support, please open an issue in the repository or contact the development team.








