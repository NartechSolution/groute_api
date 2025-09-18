# Groute API

A robust Node.js REST API built with Express.js, Prisma ORM, and Redis for managing products, categories, and members. This API provides comprehensive CRUD operations with file upload capabilities and background job processing.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![SQL Server](https://img.shields.io/badge/SQL%20Server-CC2927?style=for-the-badge&logo=microsoft%20sql%20server&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

## 🚀 Features

- **RESTful API Design**: Clean and intuitive API endpoints
- **Authentication & Authorization**: JWT-based authentication with refresh tokens
- **File Upload Management**: Image upload for products and categories
- **Database ORM**: Prisma with SQL Server integration
- **Background Jobs**: Redis-based job queue with BullMQ
- **Input Validation**: Schema validation using Joi
- **Error Handling**: Centralized error handling middleware
- **Email Integration**: Nodemailer for email notifications
- **CORS Support**: Cross-origin resource sharing enabled
- **Static File Serving**: Public and upload directory serving
- **Template Engine**: EJS for email templates

## 📋 Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** >= 16.0.0
- **npm** or **pnpm** (recommended)
- **SQL Server** database instance
- **Redis** server for job queues
- **Git** for version control

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Wasim-Zaman/groute_api.git
   cd groute_api
   ```

2. **Install dependencies**

   ```bash
   # Using pnpm (recommended)
   pnpm install

   # Or using npm
   npm install
   ```

3. **Environment Setup**

   Create a `.env` file in the root directory:

   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database Configuration
   DATABASE_URL="sqlserver://localhost:1433;database=groute_db;user=your_user;password=your_password;encrypt=true;trustServerCertificate=true"

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-super-secret-refresh-key
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d

   # Redis Configuration
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=your_redis_password

   # Email Configuration (Optional)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   ```

4. **Database Setup**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev

   # Seed database (if seed file exists)
   npx prisma db seed
   ```

## 🚀 Usage

### Development Mode

```bash
# Start the development server with hot reload
npm run dev
# or
pnpm dev
```

### Production Mode

```bash
# Start the production server
npm start
# or
pnpm start
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api/v1
```

### Authentication Endpoints

#### Login Member

```http
POST /api/v1/members/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Refresh Token

```http
POST /api/v1/members/refresh-token
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

### Category Endpoints

#### Get All Categories

```http
GET /api/v1/categories
```

#### Get Category by ID

```http
GET /api/v1/categories/:id
```

#### Create Category

```http
POST /api/v1/categories
Content-Type: multipart/form-data

{
  "name": "Category Name",
  "description": "Category Description",
  "image": [file upload]
}
```

#### Update Category

```http
PUT /api/v1/categories/:id
Content-Type: multipart/form-data
```

#### Delete Category

```http
DELETE /api/v1/categories/:id
```

### Product Endpoints

#### Get All Products

```http
GET /api/v1/products
```

#### Get Product by ID

```http
GET /api/v1/products/:id
```

#### Create Product

```http
POST /api/v1/products
Content-Type: multipart/form-data

{
  "name": "Product Name",
  "description": "Product Description",
  "price": 99.99,
  "categoryId": 1,
  "image": [file upload]
}
```

#### Update Product

```http
PUT /api/v1/products/:id
Content-Type: multipart/form-data
```

#### Delete Product

```http
DELETE /api/v1/products/:id
```

## 🏗️ Project Structure

```
groute_api/
├── src/
│   ├── config/
│   │   └── prisma.mjs           # Prisma client configuration
│   ├── controller/
│   │   ├── categoryController.mjs
│   │   ├── memberController.mjs
│   │   └── productController.mjs
│   ├── middlewares/
│   │   ├── auth.mjs             # JWT authentication middleware
│   │   ├── cors.mjs             # CORS configuration
│   │   └── error.mjs            # Error handling middleware
│   ├── radis/
│   │   ├── queue.mjs            # Redis job queue setup
│   │   └── workers/
│   │       └── index.mjs        # Background job workers
│   ├── routes/
│   │   ├── categoryRoutes.mjs
│   │   ├── memberRoutes.mjs
│   │   └── productRoutes.mjs
│   ├── schemas/
│   │   ├── category.schema.mjs  # Joi validation schemas
│   │   ├── member.schema.mjs
│   │   └── product.schema.mjs
│   ├── utils/
│   │   ├── error.mjs            # Error utilities
│   │   ├── file.mjs             # File handling utilities
│   │   ├── password.mjs         # Password hashing utilities
│   │   ├── response.mjs         # Response formatting utilities
│   │   └── token.mjs            # JWT token utilities
│   ├── view/
│   │   ├── layouts/
│   │   │   ├── footer.ejs
│   │   │   └── header.ejs
│   │   └── templates/
│   │       ├── message-received.ejs
│   │       └── message-received.html
│   ├── routes.mjs               # Main routes configuration
│   └── server.mjs               # Express server setup
├── prisma/
│   └── schema/
│       ├── category.prisma
│       ├── member.prisma
│       ├── product.prisma
│       └── schema.prisma        # Main Prisma schema
├── public/                      # Static public files
├── uploads/                     # User uploaded files
├── package.json
└── README.md
```

## 🔧 Configuration

### Database Configuration

The application uses Prisma with SQL Server. Update your `DATABASE_URL` in the `.env` file to match your database configuration.

### Redis Configuration

Redis is used for background job processing. Ensure Redis is running and update the Redis connection settings in your `.env` file.

### File Upload Configuration

- **Categories**: Images uploaded to `uploads/categories/`
- **Products**: Images uploaded to `uploads/products/`
- **Static Files**: Served from `public/` directory

## 🧪 Testing

```bash
# Run tests (if test suite exists)
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

## 📦 Dependencies

### Production Dependencies

- **express**: Fast, unopinionated web framework
- **@prisma/client**: Type-safe database client
- **bcryptjs**: Password hashing library
- **jsonwebtoken**: JWT implementation
- **joi**: Schema validation library
- **cors**: CORS middleware
- **multermate-es**: File upload middleware
- **bullmq**: Redis-based job queue
- **ioredis**: Redis client
- **nodemailer**: Email sending library
- **ejs**: Template engine
- **dotenv**: Environment variable loader

### Development Dependencies

- **prisma**: Database toolkit and ORM
- **nodemon**: Development server with hot reload

## 🚀 Deployment

### Using Docker

```dockerfile
# Dockerfile example
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]
```

### Using PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start src/server.mjs --name "groute-api"

# Save PM2 configuration
pm2 save
pm2 startup
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Wasim Zaman** - _Initial work_ - [Wasim-Zaman](https://github.com/Wasim-Zaman)

## 🙏 Acknowledgments

- Express.js team for the excellent web framework
- Prisma team for the amazing ORM
- Redis team for the robust caching solution
- All contributors who help improve this project

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/Wasim-Zaman/groute_api/issues) page
2. Create a new issue if your problem isn't already reported
3. Contact the maintainers directly

---

**Happy Coding! 🎉**
