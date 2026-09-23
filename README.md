# Classroom Booking

A full-stack web application for managing and booking classrooms.

Classroom Booking is designed to simplify classroom reservation by allowing users to view available rooms, create bookings, and manage their reservations through a web interface.

> 🚧 This project is currently under development.

---

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- GSAP

### Backend

- Node.js
- Express.js
- REST API

### Database

- MySQL
- XAMPP
- phpMyAdmin

### Development Tools

- Visual Studio Code
- Postman
- Git & GitHub

---

## Features

### User Management

- Create users
- View users
- Update users
- Delete users

### Classroom Management

- Add classrooms
- View available classrooms
- Update classroom information
- Delete classrooms

### Booking Management

- Create classroom bookings
- View booking data
- Update booking status
- Delete bookings
- Validate classroom booking data

---

## Project Structure

```text
classroom-booking/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── server.js
│   │
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
Database

The application uses MySQL as its database.

Main Tables
Table	Description
users	Stores user information
rooms	Stores classroom information
bookings	Stores classroom booking records
Database Relationship
Users
  │
  └── Bookings
          │
          └── Rooms
API

The backend provides a REST API for communication between the frontend and database.

Users
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
Rooms
GET    /api/rooms
GET    /api/rooms/:id
POST   /api/rooms
PUT    /api/rooms/:id
DELETE /api/rooms/:id
Bookings
GET    /api/bookings
GET    /api/bookings/:id
POST   /api/bookings
PUT    /api/bookings/:id
DELETE /api/bookings/:id

API endpoints may change during development.

Installation
1. Clone the Repository
git clone <repository-url>
cd classroom-booking
2. Backend Setup

Navigate to the backend directory:

cd backend

Install dependencies:

npm install

Create a .env file inside the backend folder and configure the database:

PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=classroom_booking

Make sure MySQL is running through XAMPP.

Start the backend:

npm run dev
3. Frontend Setup

Open another terminal and navigate to the frontend directory:

cd frontend

Install dependencies:

npm install

Start the frontend:

npm run dev
Environment Variables

The actual .env file should not be committed to GitHub.

Use .env.example as a template for the required environment variables.

Development Status

🚧 This project is currently under development.