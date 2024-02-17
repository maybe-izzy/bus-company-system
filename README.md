# Must do this before starting the software: 
1. Create a file in the "server" directory named ".env"
2. Paste into the file:
EMAIL = testuser@gmail.com
PASSWORD = testuser123
jwt_secret = secret
PORT = 5000
mongo_url = mongodb+srv://admin:123password@busprojectdatabase.wqutfuh.mongodb.net/?retryWrites=true&w=majority
3. Save the file
4. Go to MongoDB database
5. Add your IP address to the whitelist, or else your computer won't be able to connect to the database 


original description: 

# MERN Stack Bus Ticket Booking App

### This website will include the following features :

- Separate User Interfaces for Users, Admins.
- Search available bookings before being authenticated.
- JWT Authentication and Password Hashing.
- Seats Availability Checking.
- Stripe Payment Gateway Integration.
- Handling negative payment scenarios.
- Manage Tickets and User from the Admin Panel.

### The tools and technologies used :

- MongoDB
- Express
- React
- Node
- Tailwind
- Redux
- Antd
- Stripe

## Available Scripts

### `cd client`
### `npm install`
### `npm start`

### `cd server`
### `npm install`
### `npm start`

# API documentation link :
### https://documenter.getpostman.com/view/19939427/2s847LMr5Q
