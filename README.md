# Civic Solver Frontend

Civic Solver is a community-driven civic issue reporting platform where citizens can report local issues such as potholes, garbage, water leakage, street light problems, and more.

This is the frontend application built using React, Vite, Tailwind CSS, and Leaflet.

## Live Demo

Frontend: [https://civic-solver-frontend.vercel.app](https://civic-solver-frontend.vercel.app)
Backend API: [https://civic-solver-backend.onrender.com](https://civic-solver-backend.onrender.com)

---

## Features

* User Authentication (Register/Login)
* Email OTP Verification
* Create Civic Issues
* Upload Issue Images
* Cloudinary Image Storage
* Location-based Issue Reporting
* Interactive Map View
* Issue Categories (AI-based classification)
* Upvote Issues
* Comment System
* Delete Comments
* Real-time Notifications
* User Profile Page
* Admin Panel
* Admin Dashboard
* Filter Issues by Status
* Responsive UI

---

## Tech Stack

### Core

* React.js
* Vite
* React Router DOM
* Axios
* Tailwind CSS

### Maps

* Leaflet
* React Leaflet
* react-leaflet-cluster

### Real-time

* Socket.IO Client

---

## Project Structure

src/
│── api/
│── components/
│── pages/
│── App.jsx
│── main.jsx

---

## Installation

Clone repository:

```bash
git clone https://github.com/Charan08Teja/civic-solver-frontend.git
```

Go into project:

```bash
cd civic-solver-frontend
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

---

## Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

For production:

```env
VITE_API_URL=https://civic-solver-backend.onrender.com/api
```

---

## Pages

* Home
* Login
* Register
* Create Issue
* Issue Details
* Profile
* Notifications
* Map View
* Admin Panel
* Dashboard

---

## Deployment

Frontend deployed on:

* Vercel

---

## Future Improvements

* Search and Filter
* Issue Resolution Timeline
* Better Analytics Dashboard
* Push Notifications
* Dark Mode

---

## Author

Charan
