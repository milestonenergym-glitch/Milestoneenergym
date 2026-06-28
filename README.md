# Milestone Energym — Gym Management Platform
## Complete Production-Ready Gym ERP + CRM + SaaS

> **Train Hard. Stay Strong.**
> A premium full-stack gym management system built with Next.js 15, Express.js, MongoDB, and TypeScript.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, Shadcn UI |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB Atlas |
| Storage | Cloudinary |
| Auth | JWT + Google OAuth + Phone OTP |
| Payments | Razorpay |
| Email | Resend / SMTP |
| AI | Gemini API |
| Maps | Google Maps API |
| Analytics | Google Analytics 4 + Meta Pixel |
| Push | Firebase Cloud Messaging |
| Deployment | Vercel (Frontend) + Railway/Render (Backend) |

---

## 📁 Project Structure

```
milestone-energym/
├── frontend/         # Next.js 15 App (Port 3000)
├── backend/          # Express.js API (Port 5000)
└── README.md
```

---

## ⚙️ Environment Variables

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=https://milestoneenergym.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
```

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/milestone-energym
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=30d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Email (Resend)
RESEND_API_KEY=re_XXXXXXXXXX
EMAIL_FROM=noreply@milestoneenergym.com

# WhatsApp Business API (optional)
WHATSAPP_API_TOKEN=your_whatsapp_api_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
ADMIN_WHATSAPP=+918875305442

# AI Chatbot
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key  # fallback

# Firebase (Push Notifications)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

# Default branch ID (for single-branch setup)
DEFAULT_BRANCH_ID=your_branch_object_id

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://milestoneenergym.com
```

---

## 🛠️ Installation

### Prerequisites
- Node.js 20+
- npm 10+
- MongoDB Atlas account
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/milestone-energym.git
cd milestone-energym
```

### 2. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your values
npm run dev
```

### 3. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

### 4. Seed Database (Optional)
```bash
cd backend
npm run seed
```

---

## 🚀 Development

```bash
# Run both frontend and backend
# Terminal 1:
cd frontend && npm run dev      # http://localhost:3000

# Terminal 2:
cd backend && npm run dev       # http://localhost:5000
```

---

## 🏗️ Build & Production

### Frontend
```bash
cd frontend
npm run build
npm start
```

### Backend
```bash
cd backend
npm run build
npm start
```

---

## 🐳 Docker Deployment

```bash
# Build and run all services
docker-compose up -d

# View logs
docker-compose logs -f
```

---

## 🔗 API Documentation

Once the backend is running, access Swagger docs at:
```
http://localhost:5000/api/docs
```

### Key API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /api/leads | Create enquiry (public) | None |
| POST | /api/auth/login | Login | None |
| GET | /api/members | Get members | Admin+ |
| POST | /api/payments | Record payment | Receptionist+ |
| GET | /api/dashboard | Dashboard stats | Admin+ |
| GET | /api/reports/revenue | Revenue report | Admin+ |

---

## 👥 User Roles & Access

| Role | Access Level |
|---|---|
| Super Admin | Everything |
| Admin | All modules except super admin settings |
| Manager | Members, Leads, Reports, Calendar |
| Receptionist | Members, Attendance, Payments, Walk-in |
| Trainer | Assigned members, Classes, Workout plans |
| Nutritionist | Member diet plans |
| Accountant | Payments, Expenses, Reports |
| Member | Member portal only |

---

## 📱 Portals

- **Public Website**: `https://milestoneenergym.com`
- **Admin Panel**: `https://milestoneenergym.com/admin`
- **Member Portal**: `https://milestoneenergym.com/member`
- **Trainer Portal**: `https://milestoneenergym.com/trainer`
- **Reception Panel**: `https://milestoneenergym.com/reception`

---

## 🔒 Security Features

- JWT Authentication with refresh tokens
- Role-Based Access Control (RBAC)
- Rate limiting on all endpoints
- Input validation with Zod
- MongoDB injection prevention
- XSS protection (Helmet.js)
- CORS configuration
- Account lockout after failed attempts
- Password history enforcement
- 2FA support (TOTP)
- Audit logging
- Device session management

---

## 📊 Features Overview

- ✅ Premium Public Website (18 pages)
- ✅ CRM & Lead Management
- ✅ Membership Lifecycle Automation
- ✅ Razorpay Payment Integration
- ✅ GST Invoice Generation
- ✅ QR Code Attendance
- ✅ Email & WhatsApp Automation
- ✅ AI Fitness Chatbot (Gemini)
- ✅ Staff Management + Payroll
- ✅ Expense & P&L Reports
- ✅ Coupon & Discount Management
- ✅ Referral & Loyalty Program
- ✅ Google Maps Integration
- ✅ SEO Optimized (Lighthouse 95+)
- ✅ PWA Ready
- ✅ Multi-Branch Architecture

---

## 🤝 Support

For technical support:
- 📧 Email: tech@milestoneenergym.com
- 💬 WhatsApp: +91 88753 05442

---

## 📄 License

© 2025 Milestone Energym. All rights reserved.
