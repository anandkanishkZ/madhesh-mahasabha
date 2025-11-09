# Quick Start Guide - Mission Representatives

## Prerequisites
Make sure both frontend and backend servers are running:

### Backend Server
```powershell
cd backend
npm run dev
```
Backend should be running on: http://localhost:5000

### Frontend Server
```powershell
cd frontend
npm run dev
```
Frontend should be running on: http://localhost:3000

## Testing the Implementation

### 1. Test Application Submission (Public)

1. **Open the mission representative form:**
   - URL: http://localhost:3000/mission-representative

2. **Fill out the form with test data:**
   - Full Name: राम कुमार
   - Date of Birth: 1990-01-01
   - Gender: Male
   - Contact Number: 9876543210
   - Email: ram.kumar@example.com
   - Province: Madhesh
   - District: (select any)
   - Constituency: (select any)
   - Municipality: (select any)
   - Ward Number: 5
   - Current Address: Test Address
   - Education Level: Bachelor's Degree
   - Institution Name: Test University
   - Field of Study: Political Science
   - Position Interested: Ward Chairman
   - Political Experience: (optional)
   - Key Issues: (select at least one)
   - Why Join: (fill your reason)
   - Check both agreement boxes

3. **Submit the form**
   - You should see: "धन्यवाद!" (Thank you) success message
   - The application is now stored in the database

### 2. Test Admin Dashboard

1. **Login as admin:**
   - URL: http://localhost:3000/login
   - Username: `admin` (or Email: `admin@madheshmahasabha.com`)
   - Password: `Admin@123456`
   - Click Login

2. **Navigate to Mission Representatives:**
   - Click "Mission Representatives" in the left sidebar
   - Or directly visit: http://localhost:3000/dashboard/mission-representatives

3. **View applications:**
   - You should see the application you just submitted
   - Status should be "Pending" (yellow badge)

4. **Test Filtering:**
   - Click "Pending" button to see only pending applications
   - Click "All" to see all applications
   - Try searching by name or email

5. **View Details:**
   - Click "View Details" button on any application
   - You'll see full information organized in sections:
     - Contact Information
     - Address Information
     - Education
     - Political Interest

6. **Test Approve/Reject:**
   - Click "Approve" button → Status changes to "Approved" (green)
   - Or click "Reject" → Status changes to "Rejected" (red)
   - Click "Mark as Pending" to reset status

7. **Test Delete:**
   - Click "Delete Application" button
   - Confirm the deletion
   - Application is removed from the database

### 3. Test Pagination

1. Submit multiple applications (at least 21) to test pagination
2. The admin dashboard shows 20 items per page
3. Use Previous/Next buttons to navigate between pages

### 4. Verify Database

Connect to PostgreSQL to see the data:

```powershell
psql -U postgres -d mahasabha_db
```

Query the data:
```sql
-- View all mission representatives
SELECT id, "fullName", email, status, "submittedAt" 
FROM "MissionRepresentative" 
ORDER BY "submittedAt" DESC;

-- Count by status
SELECT status, COUNT(*) 
FROM "MissionRepresentative" 
GROUP BY status;

-- View specific representative
SELECT * FROM "MissionRepresentative" WHERE email = 'ram.kumar@example.com';
```

## Expected Behavior

### Application Submission
✅ Form validation works
✅ Success message in Nepali
✅ Data saved to database
✅ Status set to "pending"

### Admin Dashboard
✅ Protected route (requires login)
✅ List shows all applications
✅ Pagination works (20 per page)
✅ Search filters results
✅ Status filter works (All/Pending/Approved/Rejected)
✅ Detail view shows complete information
✅ Approve button changes status to "approved"
✅ Reject button changes status to "rejected"
✅ Delete removes application permanently

## API Endpoints Reference

### Public Endpoints
- `POST /api/mission-representatives` - Submit application

### Admin Endpoints (require authentication)
- `GET /api/mission-representatives?page=1&limit=20&status=pending` - List applications
- `GET /api/mission-representatives/:id` - Get single application
- `PUT /api/mission-representatives/:id` - Update status
- `DELETE /api/mission-representatives/:id` - Delete application

## Troubleshooting

### Backend not starting?
```powershell
cd backend
npm install
npx prisma generate
npm run dev
```

### Frontend not starting?
```powershell
cd frontend
npm install
npm run dev
```

### Can't login?
- Check backend server is running (http://localhost:5000)
- Verify admin credentials:
  - Username: `admin` OR Email: `admin@madheshmahasabha.com`
  - Password: `Admin@123456`
- Check browser console for errors

### Form submission fails?
- Check backend server is running
- Check CORS settings allow http://localhost:3000
- Check browser console for error messages
- Verify all required fields are filled

### Dashboard shows empty?
- Submit at least one application first
- Check you're logged in as admin
- Check browser network tab for API responses
- Verify database has records: `SELECT COUNT(*) FROM "MissionRepresentative";`

## Success Indicators

When everything is working correctly, you should see:

1. ✅ Application form submits without errors
2. ✅ Success message displays after submission
3. ✅ Login works with both username and email
4. ✅ Dashboard shows "Mission Representatives" link in sidebar
5. ✅ Applications list displays in admin dashboard
6. ✅ Status badges show with correct colors
7. ✅ Detail view opens with complete information
8. ✅ Approve/Reject buttons work and update status
9. ✅ Delete button removes application
10. ✅ Database contains the submitted records

## Next Steps

Once you've verified everything works:

1. **Customize the UI** (optional)
   - Update colors and styling
   - Add your logo
   - Modify text and labels

2. **Implement File Uploads** (optional)
   - Add file upload handler
   - Store files in cloud storage
   - Update URLs in database

3. **Add Email Notifications** (optional)
   - Configure SMTP
   - Send confirmation emails
   - Notify on status changes

4. **Deploy to Production**
   - Setup production database
   - Configure environment variables
   - Deploy backend and frontend
   - Setup HTTPS

Enjoy your fully functional mission representative management system! 🎉
