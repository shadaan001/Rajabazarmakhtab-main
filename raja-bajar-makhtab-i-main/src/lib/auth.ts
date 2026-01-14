import { Session, OTPRecord, Student, Teacher } from './types'

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function createOTPRecord(phone: string, role: 'student' | 'admin'): OTPRecord {
  const otp = generateOTP()
  const expiresAt = Date.now() + 5 * 60 * 1000
  
  const otpRecords: OTPRecord[] = JSON.parse(localStorage.getItem('otpRecords') || '[]')
  const newRecord: OTPRecord = { phone, otp, expiresAt, role }
  
  const filtered = otpRecords.filter(r => r.phone !== phone || r.role !== role)
  filtered.push(newRecord)
  
  localStorage.setItem('otpRecords', JSON.stringify(filtered))
  
  return newRecord
}

export function verifyOTP(phone: string, otp: string, role: 'student' | 'admin'): boolean {
  const otpRecords: OTPRecord[] = JSON.parse(localStorage.getItem('otpRecords') || '[]')
  const record = otpRecords.find(r => r.phone === phone && r.role === role)
  
  if (!record) return false
  if (Date.now() > record.expiresAt) {
    const filtered = otpRecords.filter(r => !(r.phone === phone && r.role === role))
    localStorage.setItem('otpRecords', JSON.stringify(filtered))
    return false
  }
  
  if (record.otp === otp) {
    const filtered = otpRecords.filter(r => !(r.phone === phone && r.role === role))
    localStorage.setItem('otpRecords', JSON.stringify(filtered))
    return true
  }
  
  return false
}

export function createSession(userId: string, role: 'student' | 'teacher' | 'admin', name: string, phone: string, loginMethod: 'otp' | 'credentials' | 'demo'): Session {
  const session: Session = {
    userId,
    role,
    name,
    phone,
    loginMethod,
    loginTime: new Date().toISOString()
  }
  
  localStorage.setItem('session', JSON.stringify(session))
  return session
}

export function getSession(): Session | null {
  const sessionData = localStorage.getItem('session')
  if (!sessionData) return null
  return JSON.parse(sessionData)
}

export function clearSession() {
  localStorage.removeItem('session')
}

export function isAuthenticated(): boolean {
  return !!getSession()
}

export function requireRole(allowedRoles: Array<'student' | 'teacher' | 'admin'>): boolean {
  const session = getSession()
  if (!session) return false
  return allowedRoles.includes(session.role)
}

export function getStudentByPhone(phone: string): Student | null {
  const students: Student[] = JSON.parse(localStorage.getItem('students') || '[]')
  return students.find(s => s.guardianPhone === phone) || null
}

export function getTeacherByCredentials(username: string, password: string): Teacher | null {
  const teachers: Teacher[] = JSON.parse(localStorage.getItem('teachers') || '[]')
  const teacher = teachers.find(t => 
    t.email === username && t.isEnabled
  )
  
  if (teacher && password === 'teacher123') {
    return teacher
  }
  
  return null
}

export function verifyAdminCredentials(username: string, password: string): boolean {
  return username === 'admin' && password === 'admin123'
}

export function isOTPDemoModeEnabled(): boolean {
  return localStorage.getItem('otpDemoMode') === 'true'
}

export function toggleOTPDemoMode(): void {
  const current = isOTPDemoModeEnabled()
  localStorage.setItem('otpDemoMode', String(!current))
}

export function calculateGrade(percentage: number): string {
  if (percentage >= 90) return 'A+'
  if (percentage >= 85) return 'A'
  if (percentage >= 80) return 'A-'
  if (percentage >= 75) return 'B+'
  if (percentage >= 70) return 'B'
  if (percentage >= 65) return 'B-'
  if (percentage >= 60) return 'C+'
  if (percentage >= 55) return 'C'
  if (percentage >= 50) return 'C-'
  return 'F'
}

export function getDayName(dayNumber: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[dayNumber]
}

export function formatPhoneNumber(phone: string): string {
  if (phone.length === 10) {
    return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`
  }
  return phone
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text)
  }
  
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
  return Promise.resolve()
}

export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return
  
  const headers = Object.keys(data[0])
  const csv = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`
        }
        return value
      }).join(',')
    )
  ].join('\n')
  
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
