# HRMS Lite – Frontend

HRMS Lite is a lightweight **Human Resource Management System** frontend application built using React.  
It allows users to manage employees and track attendance through a simple and intuitive interface.

The application communicates with a backend API to perform operations such as:

- Adding employees
- Viewing employees
- Deleting employees
- Marking attendance
- Viewing attendance records

---

## Tech Stack

- React – UI development  
- Vite – Build tool and development server  
- Zustand – Global state management  
- Tailwind CSS – Styling  
- Lucide React – Icons  
- date-fns – Date formatting  

The application is deployed using **Vercel**.

---

## Features

### Employee Management
- Add new employees
- View employee list
- Delete employees

### Attendance Management
- Search employees
- Mark attendance (Present / Absent)
- View attendance history per employee

### UI Features
- Responsive layout
- Modal forms
- Loading indicators
- Error handling
- Success notifications

---

## API Flow

The application follows a simple architecture:

React Component  
↓  
Zustand Store  
↓  
API Service  
↓  
Backend API  

Example flow when marking attendance:

User Action  
↓  
Attendance Component  
↓  
Zustand Store (markAttendance)  
↓  
API Service  
↓  
Backend API  
↓  
Database  

---

## Installation

Clone the repository
git clone https://github.com/jyotiprakashb23/hrms-lite-frontend
Navigate to the project directory
cd hrms-lite-frontend
Install dependencies
npm install 
Run the development server
npm run dev

The application will run at
http://localhost:5173

## Environment Configuration

Update the backend API URL inside:
src/services/apiService.js
Example: const BASE_URL = "https://your-backend-url.com" 


---

## Error Handling

The application includes centralized error handling for API responses.

Examples handled:

- Invalid email format
- Employee already exists
- Attendance already marked
- Employee not found

---

## Deployment

The frontend is deployed using **Vercel**.

Deployment steps:

1. Push project to GitHub
2. Connect the repository to Vercel
3. Vercel builds and deploys the application automatically

---

## Known Behavior

If the backend is hosted on a free service (such as Render), the first request may take longer due to server cold start.

Refreshing the page after the backend wakes up will load the data normally.

---

## Author

Jyoti Prakash Behera