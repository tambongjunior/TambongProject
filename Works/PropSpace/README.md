# PropSpace — Real Estate Listing Platform

PropSpace is a comprehensive full-stack web platform designed to empower users to seamlessly list, browse, modify, and remove properties available for rent or purchase.

## Key Features
- **User Authentication**: Secure registration and login flows utilizing JWT and Bcrypt for robust password hashing.
- **Property Management**: End-to-end CRUD capabilities for managing property listings.
- **Account Dashboard**: A centralized hub to manage personal profiles, update contact information, and securely reset passwords.
- **Public Feed**: A robust search and filtering system allowing users to find properties by city, price range, and category.
- **Ownership Validation**: Strict backend authorization mechanisms ensure that only the original creators can edit or delete their listings.
- **Premium UI**: A sleek, modern dark-mode interface featuring glassmorphism elements and fully responsive layouts.

## Technology Stack
- **Frontend**: React (via Vite), Axios, Lucide React, and CSS3.
- **Backend**: Node.js paired with Express.
- **Database**: MongoDB (using Mongoose).
- **Security**: JSON Web Tokens (JWT), BcryptJS, and CORS.

## Project Structure
- `frontend/`: Contains the React frontend source code.
- `backend/`: Houses the Express backend source code.

## Getting Started

### Prerequisites
- Node.js installed on your machine.
- A local MongoDB instance or a remote MongoDB Atlas cluster.

### Installation Guide
1. **Clone the repository** (or download and extract the project files).
2. **Backend Setup**:
   - Navigate to the backend folder: `cd backend`
   - Install dependencies: `npm install`
   - Create a `.env` file at the root of the backend directory containing: `PORT`, `MONGO_URI`, and `JWT_SECRET`.
   - Start the backend server: `node index.js`
3. **Frontend Setup**:
   - Navigate to the frontend folder: `cd frontend`
   - Install dependencies: `npm install`
   - Run the development server: `npm run dev`

## API Endpoints

### Authentication
- `POST /api/users/register`: Create a new user account.
- `POST /api/users/login`: Authenticate a user and return a JWT.
- `GET /api/users/profile`: Retrieve the details of the currently authenticated user.
- `PUT /api/users/profile`: Update the user's profile information.

### Properties
- `GET /api/properties`: Fetch all properties. Supports query parameters for filtering (`city`, `type`, `minPrice`, `maxPrice`).
- `GET /api/properties/detail/:id`: Retrieve detailed information for a specific property.
- `GET /api/properties/mine`: Fetch all listings created by the authenticated user.
- `POST /api/properties`: Publish a new property listing.
- `PUT /api/properties/:id`: Modify an existing listing.
- `DELETE /api/properties/:id`: Delete a listing.

## API Error Testing Guide

This section outlines how to simulate various HTTP error boundaries and test specific API behaviors using tools like Postman against your local API (`http://localhost:5001/api`).

### 1. 201 Created (Success)
- **Method**: `POST`
- **URL**: `/api/users/register`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "username": "Tester",
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Expected Outcome**: Returns `201 Created` along with a securely generated JWT.

### 2. 200 OK (Success)
- **Method**: `GET`
- **URL**: `/api/properties`
- **Expected Outcome**: Returns `200 OK` and an array of property listings.

### 3. 400 Bad Request
Triggered when validation checks fail on required fields.
- **Method**: `POST`
- **URL**: `/api/properties`
- **Headers**: `Content-Type: application/json`, `Authorization: Bearer <valid_token>`
- **Body**:
  ```json
  {
    "description": "Missing title and price"
  }
  ```
- **Expected Outcome**: Returns `400 Bad Request` with an error message:
  ```json
  {
    "message": "Missing required fields"
  }
  ```

### 4. 401 Unauthorized
Triggered when simulating missing or expired access tokens.
- **Method**: `GET`
- **URL**: `/api/users/profile`
- **Headers**: *Omit the Authorization header*
- **Expected Outcome**: Returns `401 Unauthorized` with an error message:
  ```json
  {
    "message": "Not authorized, no token"
  }
  ```

### 5. 403 Forbidden
Triggered when attempting to modify or delete a resource owned by another user.
- **Method**: `DELETE`
- **URL**: `/api/properties/<id_owned_by_account_a>`
- **Headers**: `Authorization: Bearer <token_belonging_to_account_b>`
- **Expected Outcome**: Returns `403 Forbidden` with an error message:
  ```json
  {
    "message": "Unauthorized to delete this listing"
  }
  ```

### 6. 404 Not Found
Triggered when a requested resource does not exist in the database.
- **Method**: `GET`
- **URL**: `/api/properties/detail/64f000000000000000000000` *(using a syntactically valid but non-existent hex ID)*
- **Expected Outcome**: Returns `404 Not Found` with an error message:
  ```json
  {
    "message": "Property not found"
  }
  ```
