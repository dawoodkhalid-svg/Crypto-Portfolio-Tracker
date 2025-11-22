# Crypto Portfolio Tracker

A simple web app to track your cryptocurrency investments. Built with Node.js, Express, MongoDB, and EJS.

## What It Does

- Add cryptocurrencies you own or want to buy
- Enter buy prices and target sell prices
- Write personal notes and predictions
- Edit or delete any entry
- Filter between portfolio and watchlist
- See potential gain percentage automatically calculated

## Technologies Used

- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - Database (hosted on MongoDB Atlas)
- **EJS** - Template engine
- **Custom CSS** - Styling (no Bootstrap, made my own design)

## How To Run Locally

1. Clone the repo
```
git clone https://github.com/yourusername/crypto-tracker.git
```

2. Install dependencies
```
npm install
```

3. Create a `.env` file in the root folder with:
```
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

4. Start the app
```
npm start
```

5. Open browser to `http://localhost:3000`

## Features

- Full CRUD (Create, Read, Update, Delete)
- Delete confirmation popup
- Filter tabs (All / Portfolio / Watchlist)
- Responsive design
- Shared header and footer
- Clean, professional look

## Live Demo

https://crypto-portfolio-tracker-qi6b.onrender.com/

## Notes

- CSS is custom made (not Bootstrap)
- All code is commented
- Database credentials are secured with .env file

## Author

Dawood Khalid
INFR3120 - Fall 2025  
Assignment 3
