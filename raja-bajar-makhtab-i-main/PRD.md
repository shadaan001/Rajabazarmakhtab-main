# RAJA BAJAR MAKHTAB - Islamic Education Management System

A comprehensive web platform for managing an Islamic education center (madarsa) in Kolkata, featuring student management, teacher scheduling, attendance tracking, test management, payments, and notice boards with futuristic UI design.

**Experience Qualities**:
1. **Secure & Trustworthy** - Multi-tiered authentication with OTP verification ensures only authorized access to sensitive student and payment data
2. **Efficient & Organized** - Streamlined workflows for attendance tracking, test management, and payment verification reduce administrative overhead
3. **Transparent & Connected** - Real-time notices, progress tracking, and payment records keep students, parents, and teachers informed

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This is a full-featured school management system with role-based dashboards (admin, teacher, student), attendance management, test tracking, payment processing, and data visualization requiring multiple interconnected views and sophisticated state management.

## Essential Features

### 1. Multi-Role Authentication System
- **Functionality**: Three-tier login (Student OTP, Teacher credential, Admin OTP) with session management
- **Purpose**: Secure access control ensuring students, teachers, and admin have appropriate permissions
- **Trigger**: User clicks role-specific login button from hero section
- **Progression**: Select role → Enter credentials (phone for OTP or username/password) → OTP verification (if applicable) → Session creation → Role-specific dashboard redirect
- **Success criteria**: Correct credentials create persistent session; invalid attempts show clear error; OTP expires in 5 minutes; demo mode displays OTP for testing

### 2. Teacher Management & Scheduling
- **Functionality**: CRUD operations for teachers with photo, subjects, weekly availability, and assignment to students
- **Purpose**: Organize teaching staff and create structured schedules for attendance tracking
- **Trigger**: Admin accesses Teachers section from dashboard
- **Progression**: View teacher list → Add/Edit teacher (name, photo, subjects, contact, weekly slots) → Assign to students → Enable/disable teacher login → Save
- **Success criteria**: 10 pre-seeded teachers; teachers can be assigned multiple subjects and time slots; only enabled teachers can log in

### 3. Student Management & Profiles
- **Functionality**: Complete student records with class, guardian contact, assigned teachers, attendance, tests, and payments
- **Purpose**: Centralized student information accessible by admin and individual students
- **Trigger**: Admin adds students; students access via OTP login
- **Progression**: Admin creates student → Assigns teachers → Student logs in → Views dashboard with attendance/tests/payments/notices
- **Success criteria**: 25 pre-seeded students; each student sees only their own data; admin sees all students with filtering

### 4. Teacher-wise Attendance System
- **Functionality**: Calendar-based attendance with teacher schedules, class status (Held/Cancelled), and per-student marking
- **Purpose**: Accurate attendance tracking tied to teacher schedules with monthly reports
- **Trigger**: Admin/teacher selects attendance module
- **Progression**: Select teacher → View monthly calendar with scheduled days → Mark class Held/Cancelled → For held classes mark each student Present/Absent → Generate monthly report with percentages → Export CSV/PDF
- **Success criteria**: Calendar highlights scheduled days; reports show total sessions, individual student counts, attendance percentage; exportable data

### 5. Test Management & Progress Tracking
- **Functionality**: Create tests, upload question papers, enter marks, auto-calculate grades, visualize student progress
- **Purpose**: Track academic performance over time with visual analytics
- **Trigger**: Admin creates test; teacher uploads marks; student views results
- **Progression**: Create test (title, class, subject, date, max marks) → Upload question paper PDF → After marking, upload checked sheets OR enter marks manually → Auto-calculate percentage/grade → Students view results → Progress charts update
- **Success criteria**: Test archive with downloads; student dashboard shows line chart (6-month average), bar chart (subject-wise), comparison with class average; filters by date/subject/teacher

### 6. Notice Board System
- **Functionality**: Two-tier notices (General + Class-specific) with rich text, attachments, expiry, and pinning
- **Purpose**: Communicate announcements, events, and important information to relevant audiences
- **Trigger**: Admin creates notice; students/teachers view in dashboard or dedicated page
- **Progression**: Admin creates notice → Select type (General/Class-specific) → Enter title, rich text content → Attach files → Set expiry date → Pin if urgent → Publish → Users see in dashboard feed
- **Success criteria**: Home shows pinned/latest notices; Notices page has filters; expired notices auto-hide; class-specific notices only visible to that class

### 7. Flexible Payment System
- **Functionality**: Manual UPI payment submission with QR code, UPI ID, admin verification workflow
- **Purpose**: Streamline fee collection with digital payments and verification tracking
- **Trigger**: Student/parent accesses Payments page
- **Progression**: View payment options (PhonePe QR, UPI ID, phone) → Enter amount (suggestions: 1100/1200/1600) → Click "Pay with UPI App" (opens UPI deep link) → After paying, click "I HAVE PAID - NOTIFY ADMIN" → Record saved as Pending → Admin verifies → Status changes to Confirmed
- **Success criteria**: Payment records in localStorage with status tracking; admin can filter/verify/export; UPI deep link works on mobile; success toast after submission

### 8. Admin Dashboard with Analytics
- **Functionality**: Comprehensive overview with KPIs, data tables, bulk actions, and exports
- **Purpose**: Single control panel for all administrative tasks and insights
- **Trigger**: Admin logs in successfully
- **Progression**: View KPIs (total students/teachers, pending payments, upcoming tests, monthly attendance avg) → Access data tables (students, teachers, tests, payments, attendance) → Perform actions (verify payments, upload marks, export CSV/PDF) → Manage users
- **Success criteria**: Real-time KPI updates; tables with search/filter/sort; export functionality; quick actions accessible

## Edge Case Handling

- **Expired OTP**: After 5 minutes, OTP becomes invalid; user must request new OTP with clear error message
- **Duplicate Student Login**: If student already logged in elsewhere, show warning; allow new session or require logout
- **Missing Payment Amount**: If user doesn't enter amount before UPI deep link, open without amount parameter (user enters in UPI app)
- **Teacher Without Schedule**: If teacher has no weekly availability set, attendance calendar shows empty; prompt admin to set schedule
- **Test Without Students**: If no students enrolled in test's class, show empty state with suggestion to add students
- **Offline PDF Upload**: If PDF upload fails, allow retry with progress indicator; store partial data
- **Class-Average Edge Case**: If student is only one in class, show individual performance without comparison
- **Demo Mode OTP in Production**: Include prominent warning banner if OTP demo mode is enabled in production build
- **Unauthorized Access Attempt**: If user tries to access wrong dashboard (e.g., student URL as teacher), redirect to appropriate login with error
- **Payment QR Missing**: If QR image not found, show placeholder with UPI ID and phone as fallback

## Design Direction

The design should evoke a sense of cutting-edge technology meeting traditional Islamic education values—creating a futuristic, premium experience that feels secure, professional, and inspiring. Think cyber-Islamic aesthetic: dark cosmic backgrounds with luminous accents suggesting enlightenment through knowledge, smooth glass morphism representing transparency and clarity, and bold typography conveying confidence and authority.

## Color Selection

A dark cosmic theme with electric blue and mystical purple accents, representing the fusion of modern technology with timeless knowledge.

- **Primary Color**: Electric Blue (oklch(0.65 0.25 250)) - Represents knowledge, trust, and digital innovation; used for primary CTAs and key interactive elements
- **Secondary Colors**: 
  - Deep Purple (oklch(0.45 0.20 290)) - Mystical and spiritual undertones, used for secondary actions and accents
  - Dark Cosmic Base (oklch(0.12 0.02 270)) - Deep space background creating premium feel
- **Accent Color**: Neon Cyan (oklch(0.75 0.18 210)) - Bright highlight for hover states, focus indicators, and attention-grabbing elements like payment CTAs
- **Foreground/Background Pairings**:
  - Primary Electric Blue (oklch(0.65 0.25 250)): White text (oklch(0.98 0 0)) - Ratio 7.2:1 ✓
  - Dark Cosmic Base (oklch(0.12 0.02 270)): Light Gray text (oklch(0.85 0.01 270)) - Ratio 11.5:1 ✓
  - Accent Neon Cyan (oklch(0.75 0.18 210)): Dark text (oklch(0.15 0.02 270)) - Ratio 12.8:1 ✓
  - Card Glass (oklch(0.18 0.03 270) with 50% opacity): Light text (oklch(0.90 0.01 270)) - Ratio 9.3:1 ✓

## Font Selection

Typography should convey authority and modernity while maintaining readability for educational content, combining a bold display font for impact with a clean sans-serif for body content.

**Primary**: Orbitron (Google Fonts) - Futuristic geometric display font for headlines and hero text, conveying technology and precision
**Secondary**: Inter (Google Fonts) - Clean, highly legible sans-serif for body text, forms, and data tables

- **Typographic Hierarchy**:
  - H1 (Hero Title): Orbitron Bold / 56px / tight tracking (-0.02em) / line-height 1.1
  - H2 (Section Headers): Orbitron SemiBold / 36px / normal tracking / line-height 1.2
  - H3 (Card Titles): Orbitron Medium / 24px / normal tracking / line-height 1.3
  - Body (Paragraph): Inter Regular / 16px / normal tracking / line-height 1.6
  - Small (Captions): Inter Regular / 14px / slight tracking (0.01em) / line-height 1.5
  - Button Text: Inter SemiBold / 16px / uppercase / tracking 0.05em

## Animations

Animations should create a sense of smooth, liquid movement suggesting advanced technology while maintaining performance. Use sparingly for functional feedback (button presses, modal transitions, data loading) with one signature animation: the "data stream" effect on the hero section suggesting flowing knowledge/information.

**Micro-interactions**: 100-150ms spring animations on button hover/press, form focus states
**Transitions**: 300ms ease-out for modal/drawer open/close, page transitions
**Signature**: Subtle flowing particle effect on hero background (using CSS gradients with animation), glowing pulse on active elements
**Loading**: Shimmer effect on skeleton loaders, circular progress for uploads

## Component Selection

- **Components**:
  - **Dialog**: For OTP input modal, demo OTP display, confirmation dialogs (delete teacher/student)
  - **Card**: Glass-morphism styled cards for dashboard KPIs, teacher profiles, student info cards - add `backdrop-blur-xl bg-card/50` for frosted glass effect
  - **Table**: For admin data tables (students, teachers, payments, tests) with sorting, pagination
  - **Tabs**: For switching between dashboard sections (Overview, Attendance, Tests, Payments)
  - **Calendar** (react-day-picker): For attendance date selection and schedule visualization
  - **Form + Input + Label**: All login forms, data entry (students, teachers, tests) with validation via react-hook-form
  - **Select**: For dropdowns (class selection, teacher assignment, month/year pickers)
  - **Button**: Primary (electric blue), Secondary (deep purple), Destructive (red for delete), Ghost (for secondary actions)
  - **Textarea**: Rich text notice content, test comments
  - **Badge**: Status indicators (Pending/Verified payments, Present/Absent attendance, Held/Cancelled classes)
  - **Progress**: For attendance percentages, test score visualization
  - **Sonner Toast**: Success/error notifications for all actions (payment submitted, marks uploaded, login success)
  - **Separator**: Dividing dashboard sections
  - **Avatar**: Teacher and student profile pictures with fallback to initials

- **Customizations**:
  - **OTP Input Component**: Custom 6-digit OTP input using Input-OTP with auto-focus progression
  - **Payment QR Display**: Custom component rendering QR image with copy buttons for UPI ID and phone
  - **Attendance Calendar Grid**: Custom calendar component built on react-day-picker showing color-coded scheduled/held/cancelled days
  - **Progress Chart Component**: Using Recharts library for line/bar charts with custom styling matching theme
  - **Glass Card**: Custom Card variant with `bg-card/30 backdrop-blur-xl border-primary/20` creating frosted glass effect
  - **Neon Button**: Custom Button variant with glowing box-shadow animation on hover

- **States**:
  - **Button**: Default (gradient primary), Hover (brighten + glow shadow), Active (scale 0.98), Disabled (opacity 50% + no pointer events), Loading (spinner icon)
  - **Input**: Default (border-input), Focus (border-primary + ring-primary glow), Error (border-destructive), Success (border-green-500), Disabled (opacity 50%)
  - **Card**: Default (glass effect), Hover (border brightens, slight lift with shadow), Active/Selected (border-primary glow)
  - **Badge**: Pending (yellow), Verified/Confirmed (green), Cancelled (red), Held (blue), Absent (orange)

- **Icon Selection** (Phosphor Icons):
  - Student: UserCircle, GraduationCap
  - Teacher: Chalkboard, UserGear
  - Admin: ShieldCheck, Gear
  - Attendance: CalendarCheck, ClipboardText
  - Tests: FileText, PencilSimple, ChartBar
  - Payments: CurrencyDollar, QrCode, CreditCard
  - Notices: Megaphone, Bell
  - Login/Logout: SignIn, SignOut
  - Actions: Plus, Pencil, Trash, Download, Upload, Eye, Check, X
  - Navigation: House, List, CaretLeft, CaretRight

- **Spacing**: Consistent use of Tailwind scale - 4px base unit; component padding (p-6 for cards, p-4 for compact), gaps (gap-6 for sections, gap-4 for form fields), margins (mb-8 for section separation)

- **Mobile**: 
  - Hero: Stack buttons vertically on <768px, reduce hero font to 32px
  - Dashboard: Single column layout on mobile with tab navigation at bottom
  - Tables: Horizontal scroll with sticky first column, or convert to card list on mobile
  - Attendance Calendar: Reduce to week view on mobile with swipe navigation
  - Forms: Full-width inputs, larger touch targets (min 44px)
  - Navigation: Hamburger menu with drawer for mobile, persistent top bar for desktop
