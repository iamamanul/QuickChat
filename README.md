﻿
# QuickChat - Full Stack Chat Application by AMANUL HASAN

QuickChat is a modern, real-time chat application showcasing full-stack development expertise with containerized deployment. Built using React 19, Node.js, Express, MongoDB, and Socket.io, it delivers seamless instant messaging with JWT authentication. The project demonstrates advanced DevOps practices through Docker containerization, enabling consistent development and production environments. Features include responsive design with Tailwind CSS, real-time bidirectional communication, and scalable architecture. Containerized with Docker Compose for easy deployment, the application supports both development and production configurations. This project exemplifies modern web development workflows, emphasizing security, scalability, and deployment automation through comprehensive CI/CD integration.

## 🚀 Features

- Real-time messaging
- User authentication
- Responsive design
- DevOps & Infrastructure
    Docker containerization for consistent environments
    Multi-stage Docker builds (development & production)
    Docker Compose orchestration for seamless deployment
    CI/CD ready architecture with automated workflows
    Environment-based configuration management
    Network-accessible development server
    Production-optimized builds and deployments


## 🛠️ Tech Stack

**Frontend:**
- React 19
- Vite
- Tailwind CSS
- Socket.io Client

**Backend:**
- Node.js
- Express.js
- MongoDB
- Socket.io
- JWT Authentication

**DevOps**
- Docker
- CI/CD
- AWS

## 📋 Prerequisites

- Node.js (v18 or higher)
- Docker & Docker Compose
- MongoDB Atlas account (for production)

## 🔧 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/QuickChat-Full-Stack.git
cd QuickChat-Full-Stack
```

### 2. Environment Variables Setup

#### Frontend Environment Variables
cd client
`client/.env` and 
add: VITE_BACKEND_URL=http://localhost:5000


#### Backend Environment Variables

cd ../server
.env.example .env`server/.env` and add your actual values:
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

### 3. Using Docker (Recommended)

# Start development environment
docker-compose up frontend-dev

# Start production environment
docker-compose up frontend-prod

### 4. Manual Setup (Alternative)

#### Install Dependencies
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

#### Run the Application
```bash
# Start backend (in one terminal)
cd server
npm run dev

# Start frontend (in another terminal)
cd client
npm run dev
```

### Environment Variables for Production

**Frontend (Vercel):**
- `VITE_BACKEND_URL`: Your backend URL

**Backend (Render):**
- `NODE_ENV`: production
- `MONGODB_URI`: Your MongoDB connection string


## 🔒 Security Notes

- Never commit `.env` files to version control
- Use strong JWT secrets in production
- Use HTTPS in production

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

# QuickChat
# QuickChat
