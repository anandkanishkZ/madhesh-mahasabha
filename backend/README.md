# Madhesh Mahasabha Backend API

Enterprise-grade REST API backend for Madhesh Mahasabha using Node.js, TypeScript, Express, Prisma, and PostgreSQL.

## 🏗️ Architecture

```
backend/
├── src/
│   ├── index.ts              # Main application entry
│   ├── seed.ts               # Database seeding script
│   ├── lib/
│   │   ├── prisma.ts         # Prisma client instance
│   │   └── auth.ts           # Authentication utilities
│   ├── middleware/
│   │   ├── auth.middleware.ts    # JWT authentication
│   │   ├── error.middleware.ts   # Error handling
│   │   └── logger.middleware.ts  # Request logging
│   └── routes/
│       ├── auth.routes.ts        # Authentication endpoints
│       ├── admin.routes.ts       # Admin management
│       ├── mission.routes.ts     # Mission representatives
│       ├── contact.routes.ts     # Contact messages
│       ├── membership.routes.ts  # Membership applications
│       └── news.routes.ts        # News/updates management
├── prisma/
│   └── schema.prisma         # Database schema
├── package.json
├── tsconfig.json
└── .env.example
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 14.0
- npm >= 9.0.0

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up PostgreSQL Database

Install PostgreSQL and create a database:

```bash
# Using psql
createdb madhesh_mahasabha

# Or using pgAdmin GUI
# 1. Open pgAdmin
# 2. Create new database: madhesh_mahasabha
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Update `.env` with your configuration:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/madhesh_mahasabha?schema=public"
NEXTAUTH_SECRET="generate-a-strong-secret-key-here"
JWT_SECRET="another-strong-secret-key"
PORT=5000
FRONTEND_URL="http://localhost:3000"
```

**Generate secure secrets:**
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### 4. Initialize Database

Run Prisma migrations:

```bash
npm run prisma:push
npm run prisma:generate
```

### 5. Seed Database

Create initial admin user:

```bash
npm run seed
```

This will create an admin user with credentials from your `.env` file.

### 6. Start Development Server

```bash
npm run dev
```

Server will start on `http://localhost:5000`

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | Admin login | ❌ |
| POST | `/api/auth/logout` | Admin logout | ✅ |
| GET | `/api/auth/me` | Get current admin | ✅ |
| POST | `/api/auth/change-password` | Change password | ✅ |

### Admin Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin` | List admins | ✅ |
| POST | `/api/admin` | Create admin | ✅ |
| PUT | `/api/admin/:id` | Update admin | ✅ |
| DELETE | `/api/admin/:id` | Delete admin | ✅ |

### Mission Representatives

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/mission-representatives` | List applications | ✅ |
| GET | `/api/mission-representatives/:id` | Get application | ✅ |
| POST | `/api/mission-representatives` | Submit application | ❌ |
| PUT | `/api/mission-representatives/:id` | Update status | ✅ |

### Contact Messages

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/contact` | List messages | ✅ |
| POST | `/api/contact` | Submit message | ❌ |
| PUT | `/api/contact/:id` | Update status | ✅ |

### Memberships

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/memberships` | List applications | ✅ |
| POST | `/api/memberships` | Submit application | ❌ |
| PUT | `/api/memberships/:id` | Update status | ✅ |

### News

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/news` | List news (public) | ❌ |
| GET | `/api/news/:id` | Get news item | ❌ |
| POST | `/api/news` | Create news | ✅ |
| PUT | `/api/news/:id` | Update news | ✅ |
| DELETE | `/api/news/:id` | Delete news | ✅ |

## 🔐 Authentication

### Login Request

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your_password"
  }'
```

### Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "sessionToken": "1699999999-abc123def456",
    "admin": {
      "id": "clxxx...",
      "username": "admin",
      "email": "admin@madheshmahasabha.com",
      "name": "System Administrator",
      "role": "super_admin"
    }
  }
}
```

### Using the Token

Include the token in the `Authorization` header:

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run seed` - Seed database with initial data
- `npm run lint` - Run ESLint

### Database Management

#### View Database
```bash
npm run prisma:studio
```

#### Create Migration
```bash
npx prisma migrate dev --name your_migration_name
```

#### Reset Database
```bash
npx prisma migrate reset
```

## 🔒 Security Features

✅ **Password Hashing** - bcrypt with 12 salt rounds  
✅ **JWT Authentication** - Secure token-based auth  
✅ **Rate Limiting** - Prevent brute force attacks  
✅ **CORS** - Configured for frontend origin  
✅ **Helmet** - Security headers  
✅ **Input Validation** - Zod schema validation  
✅ **Activity Logging** - Audit trail for all actions  
✅ **Session Management** - Database-backed sessions  

## 📊 Database Schema

### Key Models

- **Admin** - Administrator accounts with roles
- **Session** - Active login sessions
- **MissionRepresentative** - Mission program applications
- **ContactMessage** - Contact form submissions
- **Membership** - Membership applications
- **News** - News articles and updates
- **ActivityLog** - Audit trail of all actions

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (Windows)
taskkill /PID <PID> /F

# Or change PORT in .env
```

### Database Connection Error
```bash
# Check PostgreSQL is running
# Windows
sc query postgresql-x64-14

# Verify DATABASE_URL in .env
# Test connection
npx prisma db pull
```

### Migration Errors
```bash
# Reset and recreate database
npx prisma migrate reset
npx prisma db push
npm run seed
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `NEXTAUTH_SECRET` | NextAuth secret key | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | Token expiry | 7d |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 (15min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |

## 🚢 Production Deployment

1. Set `NODE_ENV=production` in .env
2. Use strong, unique secrets
3. Enable SSL for database connection
4. Use a reverse proxy (nginx)
5. Set up monitoring (PM2, New Relic)
6. Configure proper CORS origins
7. Enable database backups
8. Use environment variables (not .env file)

## 📄 License

Copyright © 2025 Madhesh Mahasabha. All rights reserved.

## 🤝 Contributing

Please read the contributing guidelines before making any changes.

---

**Need Help?** Contact the development team or check the documentation.
