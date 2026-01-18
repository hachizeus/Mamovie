# Mamovie - MERN Stack Movie Application

A full-stack movie streaming application built with the MERN stack (MongoDB, Express, React, Node.js).

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- MongoDB Atlas account or local MongoDB installation
- M-Pesa API credentials (if using payment functionality)

### Environment Variables

1. Server Environment Variables (server/.env):
```
PORT=5000
MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/mamovie?retryWrites=true&w=majority
TOKEN_SECRET=your_jwt_secret_key
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_SHORTCODE=your_mpesa_shortcode
MPESA_PASSKEY=your_mpesa_passkey
MPESA_CALLBACK_URL=https://your-deployed-app.com/api/v1/mpesa/callback
```

2. Client Environment Variables:
   - For development (client/.env.development):
   ```
   REACT_APP_API_BASE_URL=http://localhost:5000/api/v1
   ```
   
   - For production (client/.env.production):
   ```
   REACT_APP_API_BASE_URL=https://your-deployed-backend-url.com/api/v1
   ```

### Installation

1. Clone the repository:
```
git clone https://github.com/hachizeus/Mamovie.git
cd Mamovie
```

2. Install server dependencies:
```
cd server
npm install
```

3. Install client dependencies:
```
cd ../client
npm install
```

4. Start the development server:
```
cd ..
npm run dev
```

### Deployment

#### Backend Deployment (Render, Heroku, etc.)
1. Create an account on your preferred hosting platform
2. Connect your GitHub repository
3. Set the environment variables
4. Deploy the server

#### Frontend Deployment (Netlify)
1. Build the client:
```
cd client
npm run build
```
2. Upload the build folder to Netlify
3. Set the environment variables in Netlify

## Features
- User authentication
- Movie browsing and searching
- Favorites list
- M-Pesa payment integration
- Responsive design

## Technologies Used
- MongoDB
- Express.js
- React.js
- Node.js
- Redux Toolkit
- Material UI
- JWT Authentication