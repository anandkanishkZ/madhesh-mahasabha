# Mission Representatives Implementation

## Overview
The mission representative application system is now fully functional with both frontend and backend integration.

## Backend Implementation

### API Endpoints
Located in: `backend/src/routes/mission.routes.ts`

1. **GET /api/mission-representatives**
   - Fetch all mission representative applications with pagination
   - Query Parameters:
     - `page` (default: 1)
     - `limit` (default: 10)
     - `status` (optional: 'pending', 'approved', 'rejected')
   - Returns: List of representatives + pagination metadata

2. **GET /api/mission-representatives/:id**
   - Get a single mission representative by ID
   - Returns: Representative data or 404 error

3. **POST /api/mission-representatives**
   - Public endpoint for submitting applications (no auth required)
   - Validates 20+ fields using Zod schema
   - Creates new representative with status='pending'

4. **PUT /api/mission-representatives/:id**
   - Admin-only endpoint to update application status
   - Requires authentication and admin role
   - Updates status (pending/approved/rejected) and optional notes

5. **DELETE /api/mission-representatives/:id**
   - Admin-only endpoint to delete applications
   - Requires authentication and admin role

### Database Schema
Located in: `backend/prisma/schema.prisma`

**Model: MissionRepresentative**
- Personal Info: fullName, dateOfBirth, gender, contactNumber, email
- Address: province, district, constituency, municipality, wardNumber, currentAddress
- Education: educationLevel, institutionName, fieldOfStudy
- Political: politicalExperience, positionInterested, keyIssues[], whyJoin
- Documents: photoUrl, citizenshipUrl, educationCertUrl (optional)
- Agreements: agreeTerms, agreePrivacy
- Status: status (default: 'pending'), submittedAt, reviewedAt, reviewedBy, notes

## Frontend Implementation

### 1. Public Application Form
Located in: `frontend/app/(site)/mission-representative/page.tsx`

**Features:**
- 20+ form fields for comprehensive application
- Province → District → Constituency → Municipality cascading dropdowns
- Multiple key issues selection
- File upload fields (photo, citizenship, education certificate)
- Form validation
- Real-time submission to backend API
- Success/error messages in Nepali

**API Integration:**
- Calls `submitMissionRepresentative(data)` from `lib/api.ts`
- Maps form fields to backend schema
- Handles success and error responses

### 2. Admin Dashboard
Located in: `frontend/app/(dashboard)/dashboard/mission-representatives/page.tsx`

**Features:**
- List view of all mission representative applications
- Status filtering (All, Pending, Approved, Rejected)
- Search by name, email, or district
- Pagination controls (20 items per page)
- Detailed view for each application
- Approve/Reject/Delete actions (admin only)
- Status badges with color coding:
  - Yellow for Pending
  - Green for Approved
  - Red for Rejected

**UI Components:**
- Card-based layout for list view
- Detailed modal view with organized sections:
  - Contact Information
  - Address Information
  - Education Information
  - Political Interest
- Action buttons:
  - Approve (green)
  - Reject (red)
  - Mark as Pending
  - Delete Application

**API Integration:**
- `getMissionRepresentatives(page, limit, status)` - Fetch list
- `updateMissionRepresentativeStatus(id, status, notes)` - Update status
- `deleteMissionRepresentative(id)` - Delete application

### 3. API Client Functions
Located in: `frontend/lib/api.ts`

Added 5 new functions:
1. `submitMissionRepresentative(data)` - Submit new application
2. `getMissionRepresentatives(page, limit, status)` - Get paginated list
3. `getMissionRepresentativeById(id)` - Get single record
4. `updateMissionRepresentativeStatus(id, status, notes)` - Update status
5. `deleteMissionRepresentative(id)` - Delete record

All functions use Bearer token authentication (automatically injected from localStorage).

### 4. Dashboard Navigation
Updated: `frontend/app/(dashboard)/dashboard/page.tsx`

Added "Mission Representatives" link to the sidebar navigation with Target icon.

## Data Flow

### Application Submission Flow
1. User fills out form at `/mission-representative`
2. On submit, data is validated client-side
3. Form data is mapped to backend schema (field name transformations)
4. POST request to `/api/mission-representatives`
5. Backend validates with Zod schema
6. Prisma creates record in PostgreSQL with status='pending'
7. Success response returned and displayed to user

### Admin Management Flow
1. Admin logs in at `/login`
2. Navigates to `/dashboard/mission-representatives`
3. Backend fetches applications with GET `/api/mission-representatives?page=1&limit=20`
4. Admin can:
   - Filter by status (pending/approved/rejected)
   - Search by name/email/district
   - View full details of any application
   - Approve/Reject/Delete applications
5. Status updates sent via PUT `/api/mission-representatives/:id`
6. List refreshes to show updated status

## Security

### Authentication
- Login with username OR email
- JWT tokens stored in localStorage
- Admin role required for update/delete operations
- Public submission endpoint (no auth required)

### Authorization
- GET (list): Admin only
- GET (single): Admin only
- POST (submit): Public
- PUT (update): Admin only
- DELETE: Admin only

### Validation
- Frontend: React form validation
- Backend: Zod schema validation for all fields
- Database: Prisma schema constraints

## Testing

### To Test Application Submission:
1. Visit: http://localhost:3000/mission-representative
2. Fill out all required fields
3. Submit the form
4. Check success message

### To Test Admin Dashboard:
1. Login at: http://localhost:3000/login
   - Username: `admin` OR Email: `admin@madheshmahasabha.com`
   - Password: `Admin@123456`
2. Navigate to "Mission Representatives" in sidebar
3. Or directly visit: http://localhost:3000/dashboard/mission-representatives
4. View, filter, search, and manage applications

## Database

### Check Submissions in Database:
```sql
-- Connect to PostgreSQL
psql -U postgres -d mahasabha_db

-- View all mission representatives
SELECT id, "fullName", email, status, "submittedAt" 
FROM "MissionRepresentative" 
ORDER BY "submittedAt" DESC;

-- Count by status
SELECT status, COUNT(*) 
FROM "MissionRepresentative" 
GROUP BY status;
```

## Next Steps (Optional Enhancements)

1. **File Upload Implementation**
   - Add file upload endpoint for photos and documents
   - Integrate with storage solution (local or cloud)
   - Update schema to store file URLs

2. **Email Notifications**
   - Send confirmation email on submission
   - Notify applicants when status changes
   - Setup SMTP configuration

3. **Export Functionality**
   - Export applications to CSV/Excel
   - Generate PDF reports

4. **Advanced Filtering**
   - Filter by district, province
   - Date range filters
   - Position interested filter

5. **Analytics Dashboard**
   - Statistics by district
   - Approval rates
   - Timeline graphs

## File Structure

```
backend/
├── src/
│   ├── routes/
│   │   └── mission.routes.ts         ✅ COMPLETE
│   └── ...
└── prisma/
    └── schema.prisma                  ✅ COMPLETE

frontend/
├── app/
│   ├── (site)/
│   │   └── mission-representative/
│   │       └── page.tsx               ✅ COMPLETE (Form)
│   └── (dashboard)/
│       └── dashboard/
│           ├── page.tsx               ✅ UPDATED (Navigation)
│           └── mission-representatives/
│               └── page.tsx           ✅ NEW (Admin View)
└── lib/
    └── api.ts                         ✅ UPDATED (API Functions)
```

## Status: ✅ FULLY FUNCTIONAL

All requested features have been implemented:
- ✅ Mission representative form working
- ✅ Data stored in PostgreSQL database
- ✅ Admin dashboard shows submitted data
- ✅ Approve/Reject functionality
- ✅ Pagination and filtering
- ✅ Search functionality
- ✅ Status badges and detailed views
