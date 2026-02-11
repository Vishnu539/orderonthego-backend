# OrderOnTheGo – Backend

## Overview

OrderOnTheGo is a full-stack multi-role food ordering web application.  
This repository contains the backend implementation built using Node.js, Express, and MongoDB.

The backend handles:

- Authentication (User, Restaurant, Admin)
- Role-based access control
- Product management
- Cart management
- Multi-restaurant order splitting
- Order lifecycle management
- Admin moderation and analytics

---

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Bcrypt
- Multer (File Uploads)
- Cloudinary (Image Storage)
- Render (Deployment)

---

## User Roles & Capabilities

### User
- Register & Login
- Browse restaurants
- Add products to cart
- Place orders
- View order history

### Restaurant
- Register (with image upload)
- Login (after admin approval)
- Add / Delete products
- View restaurant-specific orders
- Update order status

### Admin
- Login
- View all users
- Delete users (with email confirmation)
- Approve restaurants
- Delete restaurants (with email confirmation)
- View all orders
- View dashboard analytics

---

## Key Architectural Feature

### Multi-Restaurant Order Splitting

If a user adds items from multiple restaurants:

- Cart items are grouped by restaurant
- One order is created per restaurant
- Restaurants only see their own orders
- Order status updates are isolated

This ensures proper data separation and system integrity.

---

## Project Structure

controllers/  
models/  
routes/  
middleware/  
config/

---

## Environment Variables

Create a `.env` file in the root directory with:

PORT=5000  
MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_secret_key  
CLOUDINARY_CLOUD_NAME=your_cloud_name  
CLOUDINARY_API_KEY=your_api_key  
CLOUDINARY_API_SECRET=your_api_secret  

---

## Run Locally

npm install  
npm start  

Server runs at:

http://localhost:5000

---

## Deployment

Backend deployed on Render:

https://orderonthego-backend-5dmw.onrender.com

---

## Important API Endpoints

Authentication  
POST /api/auth/register  
POST /api/auth/login  
POST /api/admin/login  
POST /api/restaurant/login  

Orders  
POST /api/orders  
GET /api/orders  
GET /api/restaurant/orders  
PUT /api/orders/:orderId  

Admin  
GET /api/admin/users  
GET /api/admin/restaurants  
GET /api/admin/orders  
DELETE /api/admin/users/:id  
DELETE /api/admin/restaurants/:id  

---

## Internship Submission

Developed as part of the Long-Term Internship Program – Full Stack Development.

All project deliverables including code, documentation, screenshots, and deployment links are included in this repository.
