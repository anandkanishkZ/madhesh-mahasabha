# Backend Setup Guide

## Quick Start

Follow these steps to set up and run the backend server:

### 1. Install Dependencies ✅
Already completed! Dependencies have been installed.

### 2. Set up PostgreSQL Database

You need to create a PostgreSQL database. You have two options:

#### Option A: Using pgAdmin (GUI)
1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click on "Databases" → "Create" → "Database"
4. Name it `madhesh_mahasabha`
5. Click "Save"

#### Option B: Using Command Line
```bash
# Using psql
psql -U postgres -c "CREATE DATABASE madhesh_mahasabha;"

# Or using createdb
createdb -U postgres madhesh_mahasabha
```

### 3. Configure Environment Variables ✅
Already completed! `.env` file has been created with default values.

**⚠️ Important:** Update the `DATABASE_URL` in `.env` if your PostgreSQL credentials are different:
```
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/madhesh_mahasabha?schema=public"
```

Default credentials used:
- Username: `postgres`
- Password: `postgres`
- Database: `madhesh_mahasabha`

### 4. Initialize Database Schema

Run Prisma migrations to create the database tables:

```bash
cd backend
npm run prisma:push
```

This will create all the necessary tables:
- `admins` - Admin users
- `sessions` - JWT sessions
- `mission_representatives` - Mission representative applications
- `contact_messages` - Contact form submissions
- `memberships` - Membership registrations
- `news` - News articles
- `activity_logs` - Audit trail

### 5. Generate Prisma Client

```bash
npm run prisma:generate
```

### 6. Seed Database (Create Initial Admin)

```bash
npm run seed
```

This will create an admin user with credentials from your `.env` file:
- Username: `admin`
- Password: `Admin@123456`
- Email: `admin@madheshmahasabha.com`

**⚠️ Change the default password after first login!**

### 7. Start the Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

### 8. Test the API

Visit `http://localhost:5000/health` in your browser or use curl:

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Madhesh Mahasabha Backend API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

### 9. Test Authentication

Try logging in with the admin credentials:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin@123456"
  }'
```

You should receive a JWT token in the response.

## Next Steps

1. **Implement Route Handlers**: Complete the placeholder routes in:
   - `src/routes/admin.routes.ts`
   - `src/routes/mission.routes.ts`
   - `src/routes/contact.routes.ts`
   - `src/routes/membership.routes.ts`
   - `src/routes/news.routes.ts`

2. **Connect Frontend**: Update the frontend to use the backend API instead of localStorage

3. **Test Full Flow**: Test login → dashboard → logout flow

4. **Security**: Update secrets in `.env` for production

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database `madhesh_mahasabha` exists

### Port Already in Use
- Change `PORT` in `.env` file
- Or stop the process using port 5000

### Prisma Errors
```bash
# Reset database (⚠️ deletes all data)
npm run prisma:reset

# View database in browser
npm run prisma:studio
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run prisma:push` - Push schema to database
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:studio` - Open Prisma Studio (DB GUI)
- `npm run seed` - Seed database with initial data

## API Documentation

See `README.md` for complete API documentation including:
- All available endpoints
- Request/response examples
- Authentication requirements
- Error codes
