import { useEffect, useState } from 'react'
import { initializeLocalStorage } from './lib/seedData'
import { getSession, clearSession } from './lib/auth'
import { Session } from './lib/types'
import { Toaster } from '@/components/ui/sonner'

import Hero from './components/Hero'
import OTPLogin from './components/OTPLogin'
import TeacherLogin from './components/TeacherLogin'
import PaymentModal from './components/PaymentModal'
import StudentDashboard from './components/StudentDashboard'
import TeacherDashboard from './components/TeacherDashboard'
import AdminDashboard from './components/AdminDashboard'
import NoticesPage from './components/NoticesPage'
import CoursesPage from './components/CoursesPage'
import ContactPage from './components/ContactPage'

type View = 'hero' | 'student-dashboard' | 'teacher-dashboard' | 'admin-dashboard' | 'notices' | 'courses' | 'contact'

function App() {
  const [currentView, setCurrentView] = useState<View>('hero')
  const [session, setSession] = useState<Session | null>(null)
  
  const [showStudentOTP, setShowStudentOTP] = useState(false)
  const [showTeacherLogin, setShowTeacherLogin] = useState(false)
  const [showAdminOTP, setShowAdminOTP] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  useEffect(() => {
    initializeLocalStorage()
    const existingSession = getSession()
    if (existingSession) {
      setSession(existingSession)
      if (existingSession.role === 'student') {
        setCurrentView('student-dashboard')
      } else if (existingSession.role === 'teacher') {
        setCurrentView('teacher-dashboard')
      } else if (existingSession.role === 'admin') {
        setCurrentView('admin-dashboard')
      }
    }
  }, [])

  const handleLoginSuccess = () => {
    const newSession = getSession()
    setSession(newSession)
    
    if (newSession?.role === 'student') {
      setCurrentView('student-dashboard')
      setShowStudentOTP(false)
    } else if (newSession?.role === 'teacher') {
      setCurrentView('teacher-dashboard')
      setShowTeacherLogin(false)
    } else if (newSession?.role === 'admin') {
      setCurrentView('admin-dashboard')
      setShowAdminOTP(false)
    }
  }

  const handleLogout = () => {
    clearSession()
    setSession(null)
    setCurrentView('hero')
  }

  const handleBackToHome = () => {
    setCurrentView('hero')
  }

  return (
    <>
      {currentView === 'hero' && (
        <Hero
          onStudentLogin={() => setShowStudentOTP(true)}
          onTeacherLogin={() => setShowTeacherLogin(true)}
          onAdminLogin={() => setShowAdminOTP(true)}
          onPayments={() => setShowPaymentModal(true)}
          onCourses={() => setCurrentView('courses')}
          onNotices={() => setCurrentView('notices')}
          onContact={() => setCurrentView('contact')}
        />
      )}

      {currentView === 'student-dashboard' && session?.role === 'student' && (
        <StudentDashboard
          session={session}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'teacher-dashboard' && session?.role === 'teacher' && (
        <TeacherDashboard
          session={session}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'admin-dashboard' && session?.role === 'admin' && (
        <AdminDashboard
          session={session}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'notices' && (
        <NoticesPage onBack={handleBackToHome} />
      )}

      {currentView === 'courses' && (
        <CoursesPage onBack={handleBackToHome} />
      )}

      {currentView === 'contact' && (
        <ContactPage onBack={handleBackToHome} />
      )}

      <OTPLogin
        open={showStudentOTP}
        onClose={() => setShowStudentOTP(false)}
        onSuccess={handleLoginSuccess}
        role="student"
      />

      <TeacherLogin
        open={showTeacherLogin}
        onClose={() => setShowTeacherLogin(false)}
        onSuccess={handleLoginSuccess}
      />

      <OTPLogin
        open={showAdminOTP}
        onClose={() => setShowAdminOTP(false)}
        onSuccess={handleLoginSuccess}
        role="admin"
      />

      <PaymentModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
      />

      <Toaster position="top-right" />
    </>
  )
}

export default App
