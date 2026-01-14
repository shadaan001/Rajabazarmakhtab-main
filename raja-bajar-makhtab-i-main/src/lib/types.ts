export interface User {
  id: string
  role: 'student' | 'teacher' | 'admin'
  name: string
  phone: string
  email?: string
}

export interface Student {
  id: string
  name: string
  class: string
  guardianPhone: string
  guardianName: string
  assignedTeachers: string[]
  enrollmentDate: string
}

export interface Teacher {
  id: string
  name: string
  photo?: string
  subjects: string[]
  contact: string
  email?: string
  weeklyAvailability: WeeklySlot[]
  isEnabled: boolean
}

export interface WeeklySlot {
  day: number
  startTime: string
  endTime: string
}

export interface AttendanceRecord {
  id: string
  teacherId: string
  date: string
  status: 'held' | 'cancelled'
  students: {
    studentId: string
    status: 'present' | 'absent'
  }[]
}

export interface Test {
  id: string
  title: string
  class: string
  subject: string
  date: string
  maxMarks: number
  teacherId: string
  questionPaperUrl?: string
  results: TestResult[]
}

export interface TestResult {
  studentId: string
  marksObtained: number
  percentage: number
  grade: string
  comments?: string
  checkedSheetUrl?: string
}

export interface Notice {
  id: string
  title: string
  content: string
  type: 'general' | 'class-specific'
  targetClass?: string
  attachments?: string[]
  expiryDate: string
  isPinned: boolean
  createdAt: string
  createdBy: string
}

export interface Payment {
  id: string
  studentId: string
  studentName: string
  class: string
  amount: number
  date: string
  method: string
  status: 'pending' | 'verified'
  transactionNote?: string
  verifiedBy?: string
  verifiedAt?: string
}

export interface DashboardStats {
  totalStudents: number
  totalTeachers: number
  pendingPayments: number
  upcomingTests: number
  averageAttendance: number
}

export interface Session {
  userId: string
  role: 'student' | 'teacher' | 'admin'
  name: string
  phone: string
  loginMethod: 'otp' | 'credentials' | 'demo'
  loginTime: string
}

export interface OTPRecord {
  phone: string
  otp: string
  expiresAt: number
  role: 'student' | 'admin'
}
