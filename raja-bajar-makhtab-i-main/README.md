# RAJA BAJAR MAKHTAB - Islamic Education Management System

A comprehensive futuristic web application for managing an Islamic education center (madarsa) in Kolkata. Built with React, TypeScript, and Tailwind CSS.

## 🌟 Features

### Multi-Role Authentication
- **Student OTP Login**: SMS-based OTP authentication (demo mode for testing)
- **Teacher Login**: Email/password authentication with admin-controlled access
- **Admin OTP Login**: Restricted to authorized personnel only (9073040640 / shadaan001@gmail.com)

### Student Management
- Complete student profiles with class, guardian info, and assigned teachers
- Personal dashboard with attendance, test results, payment history, and notices
- Progress tracking with visual charts (monthly averages, subject-wise performance)

### Teacher Management
- Teacher profiles with subjects, contact info, and weekly schedules
- Teacher dashboard showing assigned students and schedule
- Admin can enable/disable teacher login access
- Weekly availability scheduling for attendance tracking

### Attendance System
- Teacher-wise and date-wise attendance tracking
- Calendar view with scheduled/held/cancelled class status
- Per-student present/absent marking for held classes
- Monthly attendance reports with percentages
- CSV/PDF export functionality

### Test Management
- Create tests with title, class, subject, date, and max marks
- Upload question papers (placeholder for PDF upload)
- Enter marks manually or upload checked answer sheets
- Auto-calculate percentage and grades (A+ to F)
- Student progress charts based on test history

### Payment System
- Flexible UPI payment with QR code display
- UPI ID: 9073040640@ybl (MD SHADAAN)
- Manual payment submission with admin verification
- Payment history with status tracking (Pending/Verified)
- CSV/PDF export for payment records

### Notice Board
- Two-tier notices: General and Class-specific
- Rich text content with expiry dates
- Pin important notices
- Filtered views by type and class

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will start at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 🔐 Login Credentials

### Admin
- **Method**: OTP (restricted to authorized personnel)
- **Authorized Phone**: 9073040640
- **Authorized Email**: shadaan001@gmail.com
- **Alternative**: username: `admin`, password: `admin123` (OTP-based login recommended)

### Teacher
- **Method**: Email/Password
- **Email**: Any teacher email from seed data (e.g., `rahman@rajabazar.edu`)
- **Password**: `teacher123` (default for all teachers)
- **Note**: Teacher must be enabled by admin to login

### Student
- **Method**: OTP or Demo Login
- **OTP**: Enter guardian phone number (e.g., `9123456780` for Ahmed Hassan)
- **Demo**: Enter name and phone for quick testing
- **Demo Mode**: When enabled, OTP is displayed in the UI for testing

## 📊 Seed Data

The application comes pre-seeded with:
- **10 Teachers** with various subjects and schedules
- **25 Students** across different classes (Hifz-1, Hifz-2, Alim-1, Alim-2, Fazil-1, Fazil-2, Nazra-1, Nazra-2)
- **6 Tests** with student results and grades
- **Sample Attendance** records for recent dates
- **4 Notices** including pinned and class-specific
- **3 Payments** with different statuses

## 🔧 Backend Integration Guide

### Current Setup
The application uses **localStorage** as a mock backend for demonstration purposes. All data is stored in the browser's local storage.

### Production Integration

#### 1. Database Migration
Replace localStorage with a real database:

**Option A: Firebase**
```typescript
// Replace in src/lib/auth.ts and other files
import { getFirestore, collection, doc, setDoc, getDoc } from 'firebase/firestore'

const db = getFirestore()

// Example: Save student
await setDoc(doc(db, 'students', studentId), studentData)

// Example: Get students
const studentsSnap = await getDocs(collection(db, 'students'))
```

**Option B: Supabase**
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Example: Save student
await supabase.from('students').insert(studentData)

// Example: Get students
const { data: students } = await supabase.from('students').select('*')
```

**Option C: Node.js + PostgreSQL**
```typescript
// Create REST API endpoints
POST /api/students
GET /api/students
PUT /api/students/:id
DELETE /api/students/:id

// Use fetch or axios to call endpoints
const response = await fetch('/api/students', {
  method: 'POST',
  body: JSON.stringify(studentData)
})
```

#### 2. SMS Integration for OTP

**Twilio Example**
```typescript
// Install: npm install twilio

import twilio from 'twilio'

const client = twilio(ACCOUNT_SID, AUTH_TOKEN)

export async function sendOTP(phone: string, otp: string) {
  await client.messages.create({
    body: `Your RAJA BAJAR MAKHTAB OTP is: ${otp}. Valid for 5 minutes.`,
    from: TWILIO_PHONE,
    to: '+91' + phone
  })
}
```

**MSG91 Example**
```typescript
// Install: npm install axios

import axios from 'axios'

export async function sendOTP(phone: string, otp: string) {
  await axios.get('https://api.msg91.com/api/v5/otp', {
    params: {
      authkey: MSG91_AUTH_KEY,
      mobile: '91' + phone,
      otp: otp,
      template_id: TEMPLATE_ID
    }
  })
}
```

**Integration Location**: 
- Update `src/lib/auth.ts` → `createOTPRecord()` function
- Replace the demo OTP display with actual SMS sending
- Remove or disable OTP demo mode in production

#### 3. Payment Gateway Integration

**PhonePe Example**
```typescript
// Install: npm install axios crypto

import axios from 'axios'
import crypto from 'crypto'

export async function initiatePayment(amount: number, studentId: string) {
  const payload = {
    merchantId: MERCHANT_ID,
    merchantTransactionId: 'TXN' + Date.now(),
    amount: amount * 100, // in paisa
    merchantUserId: studentId,
    redirectUrl: REDIRECT_URL,
    callbackUrl: CALLBACK_URL,
    paymentInstrument: { type: 'UPI_INTENT' }
  }
  
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64')
  const signature = crypto
    .createHmac('sha256', SALT_KEY)
    .update(base64Payload + '/pg/v1/pay' + SALT_INDEX)
    .digest('hex')
  
  const response = await axios.post(
    'https://api.phonepe.com/apis/hermes/pg/v1/pay',
    { request: base64Payload },
    { headers: { 'X-VERIFY': signature + '###' + SALT_INDEX } }
  )
  
  return response.data
}
```

**Razorpay Example**
```typescript
// Install: npm install razorpay

import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET
})

export async function createPaymentOrder(amount: number) {
  const order = await razorpay.orders.create({
    amount: amount * 100, // in paisa
    currency: 'INR',
    receipt: 'RBM' + Date.now()
  })
  
  return order
}
```

**Integration Location**:
- Update `src/components/PaymentModal.tsx`
- Replace manual verification flow with gateway callback
- Auto-update payment status on successful transaction

#### 4. File Upload (Test Papers, Checked Sheets)

**Firebase Storage Example**
```typescript
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const storage = getStorage()

export async function uploadFile(file: File, path: string) {
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  const url = await getDownloadURL(storageRef)
  return url
}
```

**Supabase Storage Example**
```typescript
export async function uploadFile(file: File, path: string) {
  const { data, error } = await supabase.storage
    .from('test-papers')
    .upload(path, file)
  
  if (error) throw error
  
  const { data: urlData } = supabase.storage
    .from('test-papers')
    .getPublicUrl(path)
  
  return urlData.publicUrl
}
```

**Integration Locations**:
- Add file input in test creation form
- Store URLs in test records
- Display download links in test results

## 🎨 Customization

### Theme Colors
Edit `src/index.css` to change the color scheme:
```css
:root {
  --primary: oklch(0.65 0.25 250);      /* Electric Blue */
  --secondary: oklch(0.45 0.20 290);    /* Deep Purple */
  --accent: oklch(0.75 0.18 210);       /* Neon Cyan */
  --background: oklch(0.12 0.02 270);   /* Dark Cosmic */
}
```

### Logo
Replace the placeholder logo in `src/components/Hero.tsx`:
```tsx
// Add your logo image to /public/assets/logo.png
import logo from '@/assets/images/logo.png'

<img src={logo} alt="Raja Bajar Makhtab" />
```

### Payment QR Code
Place your PhonePe QR code at:
```
/public/assets/phonepe_qr_shadaan.jpeg
```

Then update `src/components/PaymentModal.tsx` to display it:
```tsx
<img src="/assets/phonepe_qr_shadaan.jpeg" alt="PhonePe QR" />
```

## 📱 Mobile Responsive

The application is fully responsive:
- **Desktop**: Full dashboard with side-by-side charts and tables
- **Tablet**: Adjusted grid layouts, collapsible tables
- **Mobile**: Single column layout, stacked components, touch-optimized buttons

## 🔒 Security Notes

### Production Checklist
- [ ] Disable OTP Demo Mode in Settings
- [ ] Change default admin password
- [ ] Change default teacher password
- [ ] Use HTTPS for all communications
- [ ] Implement rate limiting for OTP requests
- [ ] Add CAPTCHA for login forms
- [ ] Validate all user inputs on backend
- [ ] Use secure session management (JWT tokens)
- [ ] Enable CORS only for trusted domains
- [ ] Regular security audits

### Admin Access Restrictions
The admin OTP login is restricted to:
- **Mobile**: 9073040640
- **Email**: shadaan001@gmail.com

To change these, edit `src/components/OTPLogin.tsx`:
```typescript
const restrictedPhones = ['9073040640', 'YOUR_NEW_PHONE']
const restrictedEmails = ['shadaan001@gmail.com', 'YOUR_NEW_EMAIL']
```

## 📦 Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **Icons**: Phosphor Icons
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **Notifications**: Sonner (toast)
- **Build Tool**: Vite
- **State Management**: React Hooks + localStorage

## 📄 License

© 2024 Raja Bajar Makhtab, Kolkata. All Rights Reserved.

## 🆘 Support

For technical support or questions:
- **Phone**: 9073040640
- **Email**: shadaan001@gmail.com

## 🚧 Roadmap

Future enhancements:
- [ ] Real-time notifications via WebSockets
- [ ] Mobile app (React Native)
- [ ] Biometric attendance (face recognition)
- [ ] Video lectures integration
- [ ] Parent mobile app
- [ ] SMS notifications for attendance/payments
- [ ] Online test portal
- [ ] Certificate generation
- [ ] Library management
- [ ] Transport management

---

Built with ❤️ for Islamic Education
