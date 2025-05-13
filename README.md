# Content API

A RESTful API for user authentication and content management built with Node.js, Express, and MongoDB.

## Technologies Used

- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Token)
- **Validation**: Express Validator
- **Logging**: Winston and Morgan
- **Security**: Helmet for HTTP headers, rate limiting

## API Endpoints

### Authentication

#### 1. Signup API
- **Endpoint**: `POST /api/signup`
- **Parameters**:
  - `name` (String, required)
  - `email` (String, required, unique)
  - `password` (String, required, min 6 chars)
- **Returns**: User details and JWT token

#### 2. Login API
- **Endpoint**: `POST /api/login`
- **Parameters**:
  - `email` (String, required)
  - `password` (String, required)
- **Returns**: User details and JWT token

### Posts

#### 3. Create Post API
- **Endpoint**: `POST /api/posts`
- **Authentication**: Required (JWT Bearer token)
- **Parameters**:
  - `postName` (String, required)
  - `description` (String, required)
  - `tags` (Array of Strings, optional)
  - `imageUrl` (String, optional)
- **Returns**: Created post details

#### 4. Fetch Posts with Filters API
- **Endpoint**: `GET /api/posts`
- **Parameters** (all optional):
  - `searchText` (String, searches in postName and description)
  - `startDate` (Date, filters from upload time)
  - `endDate` (Date, filters to upload time)
  - `tags` (Array of Strings, filters posts with matching tags)
  - `page` (Number, default 1)
  - `limit` (Number, default 10, max 100)
- **Returns**: Posts and pagination details

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/content_api
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   ```
4. Start the server:
   ```
   npm start
   ```
   Or for development with nodemon:
   ```
   npm run dev
   ```

## API Usage Examples

### Signup

```bash
curl -X POST http://localhost:3000/api/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Post

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "postName": "My First Post",
    "description": "This is the content of my first post",
    "tags": ["tech", "tutorial"],
    "imageUrl": "https://example.com/image.jpg"
  }'
```

### Get Posts with Filters

```bash
curl -X GET "http://localhost:3000/api/posts?searchText=tech&startDate=2023-01-01&tags=tutorial&page=1&limit=10"
```

## Security Features

- Password hashing with bcrypt
- JWT authentication
- HTTP security headers with Helmet
- Rate limiting to prevent abuse
- Input validation with Express Validator
- Detailed logging with Winston # napworld-assignment
