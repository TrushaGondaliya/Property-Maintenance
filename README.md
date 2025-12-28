# Laravel + React Project

A simple full‑stack application built with **Laravel** (backend API) and
**React** (frontend UI).

------------------------------------------------------------------------

## 🚀 Features

-   REST API built with Laravel
-   React frontend using functional components
-   Token‑based authentication
-   Axios for API communication
-   Environment‑based configuration
-   Reusable components & clean folder structure

------------------------------------------------------------------------

## 📦 Requirements

-   PHP 8+
-   Composer
-   Node.js 16+
-   npm
-   MySQL / PostgreSQL (or any DB supported by Laravel)

------------------------------------------------------------------------

## 🛠️ Installation

### 1. Clone the Repository

    git clone https://github.com/TrushaGondaliya/Property-Maintenance.git
    cd Property Maintenance

------------------------------------------------------------------------

## 🔧 Backend Setup (Laravel)

### Install Dependencies

    cd backend
    composer install

### Environment Setup

    cp .env.example .env
    php artisan key:generate

### Configure `.env`

Update database name, username, password, and CORS.

### Run Migration

    php artisan migrate

### Start Laravel Server

    php artisan serve

Laravel will run on:

    http://127.0.0.1:8000

------------------------------------------------------------------------

## 🎨 Frontend Setup (React)

### Install Dependencies

    cd frontend
    npm install

### Create `.env` File

    REACT_APP_API_URL=http://127.0.0.1:8000/api

### Run React App

    npm start

React will run on:

    http://localhost:3000

------------------------------------------------------------------------

## 📁 Folder Structure

    project/
    │── backend/        # Laravel API
    │── frontend/       # React UI
    │── README.md

------------------------------------------------------------------------

## 🔗 API Usage Example (Axios)

Example React component calling Laravel API:

``` javascript
import axios from "axios";

const fetchData = async () => {
  const response = await axios.get(
    process.env.REACT_APP_API_URL + "/workorders"
  );
  console.log(response.data);
};
```

------------------------------------------------------------------------

## 🧪 Run Website

    cd frontend
    npm run both

------------------------------------------------------------------------

## 📤 Build for Production

### React Production Build

    npm run build

### Laravel Optimization

    php artisan optimize

------------------------------------------------------------------------


## ✨ Author

Developed by **Trusha**.
