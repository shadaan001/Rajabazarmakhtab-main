import { useState, useEffect } from 'react'
import { Session, Student, Teacher, Test, Payment, Notice, AttendanceRecord, DashboardStats } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { SignOut, Users, Chalkboard, FileText, CurrencyDollar, Bell, Download, Plus, Check, Info } from '@phosphor-icons/react'
import { exportToCSV, isOTPDemoModeEnabled, toggleOTPDemoMode } from '@/lib/auth'
import { toast } from 'sonner'

interface AdminDashboardProps {
  session: Session
  onLogout: () => void
}

export default function AdminDashboard({ session, onLogout }: AdminDashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    pendingPayments: 0,
    upcomingTests: 0,
    averageAttendance: 0
  })

  const [students, setStudents] = useState<Student[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [tests, setTests] = useState<Test[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [notices, setNotices] = useState<Notice[]>([])
  const [otpDemo, setOtpDemo] = useState(isOTPDemoModeEnabled())

  const [showAddNotice, setShowAddNotice] = useState(false)
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    content: '',
    type: 'general' as 'general' | 'class-specific',
    targetClass: '',
    expiryDate: '',
    isPinned: false
  })

  // Student CRUD state
  const [showAddStudent, setShowAddStudent] = useState(false)
  const [showEditStudent, setShowEditStudent] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [studentForm, setStudentForm] = useState({ name: '', class: '', guardianName: '', guardianPhone: '', assignedTeachersStr: '' })

  // Teacher CRUD state
  const [showAddTeacher, setShowAddTeacher] = useState(false)
  const [showEditTeacher, setShowEditTeacher] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)
  const [teacherForm, setTeacherForm] = useState({ name: '', email: '', contact: '', subjectsStr: '' })

  // One-time versioned demo cleanup: remove the first 10 students and first 5 teachers (applies to already-cleaned installs)
  const DEMO_CLEANUP_VERSION = 3
  const ensureDemoCleanup = () => {
    try {
      const prevVersion = Number(localStorage.getItem('demoCleanupVersion') || '0')
      // If this version's cleanup already applied, still do a safety trim for students if unexpectedly large
      if (prevVersion >= DEMO_CLEANUP_VERSION) {
        const studentsData: Student[] = JSON.parse(localStorage.getItem('students') || '[]')
        if (studentsData.length > 10) {
          const newStudents = studentsData.slice(10)
          localStorage.setItem('students', JSON.stringify(newStudents))
          toast.success('Removed additional demo students')
        }
        return
      }

      const studentsData: Student[] = JSON.parse(localStorage.getItem('students') || '[]')
      const teachersData: Teacher[] = JSON.parse(localStorage.getItem('teachers') || '[]')

      const newStudents = studentsData.length > 10 ? studentsData.slice(10) : studentsData
      const newTeachers = teachersData.length > 5 ? teachersData.slice(5) : teachersData

      localStorage.setItem('students', JSON.stringify(newStudents))
      localStorage.setItem('teachers', JSON.stringify(newTeachers))
      localStorage.setItem('demoCleanupVersion', String(DEMO_CLEANUP_VERSION))

      if (newStudents.length !== studentsData.length || newTeachers.length !== teachersData.length) {
        toast.success(`Removed ${studentsData.length - newStudents.length} demo students and ${teachersData.length - newTeachers.length} demo teachers`)
      }
    } catch (err) {
      console.error('Demo cleanup failed', err)
    }
  }

  // Student handlers
  const handleAddStudent = () => {
    if (!studentForm.name || !studentForm.class) {
      toast.error('Please fill student name and class')
      return
    }

    const newStudent: Student = {
      id: 's' + Date.now(),
      name: studentForm.name,
      class: studentForm.class,
      guardianPhone: studentForm.guardianPhone,
      guardianName: studentForm.guardianName,
      assignedTeachers: studentForm.assignedTeachersStr
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
      enrollmentDate: new Date().toISOString().split('T')[0]
    }

    const updated = [...students, newStudent]
    localStorage.setItem('students', JSON.stringify(updated))
    setStudents(updated)
    setShowAddStudent(false)
    setStudentForm({ name: '', class: '', guardianName: '', guardianPhone: '', assignedTeachersStr: '' })
    loadData()
    toast.success('Student added')
  }

  const handleEditStudentSave = () => {
    if (!editingStudent) return
    if (!studentForm.name || !studentForm.class) {
      toast.error('Please fill student name and class')
      return
    }

    const updated = students.map(s => s.id === editingStudent.id ? {
      ...s,
      name: studentForm.name,
      class: studentForm.class,
      guardianName: studentForm.guardianName,
      guardianPhone: studentForm.guardianPhone,
      assignedTeachers: studentForm.assignedTeachersStr.split(',').map(x => x.trim()).filter(Boolean)
    } : s)

    localStorage.setItem('students', JSON.stringify(updated))
    setStudents(updated)
    setShowEditStudent(false)
    setEditingStudent(null)
    setStudentForm({ name: '', class: '', guardianName: '', guardianPhone: '', assignedTeachersStr: '' })
    loadData()
    toast.success('Student updated')
  }

  const handleDeleteStudent = (id: string) => {
    const updated = students.filter(s => s.id !== id)
    localStorage.setItem('students', JSON.stringify(updated))
    setStudents(updated)
    loadData()
    toast.success('Student removed')
  }

  // Teacher handlers
  const handleAddTeacher = () => {
    if (!teacherForm.name) {
      toast.error('Please enter teacher name')
      return
    }

    const newTeacher: Teacher = {
      id: 't' + Date.now(),
      name: teacherForm.name,
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(teacherForm.name),
      subjects: teacherForm.subjectsStr.split(',').map(s => s.trim()).filter(Boolean),
      contact: teacherForm.contact,
      email: teacherForm.email,
      weeklyAvailability: [],
      isEnabled: true
    }

    const updated = [...teachers, newTeacher]
    localStorage.setItem('teachers', JSON.stringify(updated))
    setTeachers(updated)
    setShowAddTeacher(false)
    setTeacherForm({ name: '', email: '', contact: '', subjectsStr: '' })
    loadData()
    toast.success('Teacher added')
  }

  const handleEditTeacherSave = () => {
    if (!editingTeacher) return
    const updated = teachers.map(t => t.id === editingTeacher.id ? {
      ...t,
      name: teacherForm.name,
      email: teacherForm.email,
      contact: teacherForm.contact,
      subjects: teacherForm.subjectsStr.split(',').map(s => s.trim()).filter(Boolean)
    } : t)

    localStorage.setItem('teachers', JSON.stringify(updated))
    setTeachers(updated)
    setShowEditTeacher(false)
    setEditingTeacher(null)
    setTeacherForm({ name: '', email: '', contact: '', subjectsStr: '' })
    loadData()
    toast.success('Teacher updated')
  }

  const handleDeleteTeacher = (id: string) => {
    const updated = teachers.filter(t => t.id !== id)
    localStorage.setItem('teachers', JSON.stringify(updated))
    setTeachers(updated)
    loadData()
    toast.success('Teacher removed')
  }

  useEffect(() => {
    ensureDemoCleanup()
    loadData()
  }, [])

  const loadData = () => {
    const studentsData: Student[] = JSON.parse(localStorage.getItem('students') || '[]')
    const teachersData: Teacher[] = JSON.parse(localStorage.getItem('teachers') || '[]')
    const testsData: Test[] = JSON.parse(localStorage.getItem('tests') || '[]')
    const paymentsData: Payment[] = JSON.parse(localStorage.getItem('payments') || '[]')
    const noticesData: Notice[] = JSON.parse(localStorage.getItem('notices') || '[]')
    const attendanceData: AttendanceRecord[] = JSON.parse(localStorage.getItem('attendance') || '[]')

    setStudents(studentsData)
    setTeachers(teachersData)
    setTests(testsData)
    setPayments(paymentsData)
    setNotices(noticesData)

    const pendingCount = paymentsData.filter(p => p.status === 'pending').length
    const upcomingCount = testsData.filter(t => new Date(t.date) > new Date()).length
    const heldClasses = attendanceData.filter(a => a.status === 'held')
    const avgAttendance = heldClasses.length > 0
      ? Math.round(
          (heldClasses.reduce((sum, a) => 
            sum + a.students.filter(s => s.status === 'present').length, 0
          ) / heldClasses.reduce((sum, a) => sum + a.students.length, 0)) * 100
        )
      : 0

    setStats({
      totalStudents: studentsData.length,
      totalTeachers: teachersData.length,
      pendingPayments: pendingCount,
      upcomingTests: upcomingCount,
      averageAttendance: avgAttendance
    })
  }

  const handleVerifyPayment = (paymentId: string) => {
    const updated = payments.map(p => 
      p.id === paymentId 
        ? { ...p, status: 'verified' as const, verifiedBy: 'admin', verifiedAt: new Date().toISOString() }
        : p
    )
    localStorage.setItem('payments', JSON.stringify(updated))
    setPayments(updated)
    toast.success('Payment verified!')
    loadData()
  }

  const handleToggleTeacher = (teacherId: string) => {
    const updated = teachers.map(t => 
      t.id === teacherId ? { ...t, isEnabled: !t.isEnabled } : t
    )
    localStorage.setItem('teachers', JSON.stringify(updated))
    setTeachers(updated)
    toast.success('Teacher status updated!')
  }

  const handleExportStudents = () => {
    const data = students.map(s => ({
      Name: s.name,
      Class: s.class,
      Guardian: s.guardianName,
      Phone: s.guardianPhone,
      Enrollment: s.enrollmentDate
    }))
    exportToCSV(data, 'students.csv')
    toast.success('Students exported!')
  }

  const handleExportPayments = () => {
    const data = payments.map(p => ({
      Student: p.studentName,
      Class: p.class,
      Amount: p.amount,
      Date: p.date,
      Method: p.method,
      Status: p.status
    }))
    exportToCSV(data, 'payments.csv')
    toast.success('Payments exported!')
  }

  const handleAddNotice = () => {
    if (!noticeForm.title || !noticeForm.content) {
      toast.error('Please fill in all required fields')
      return
    }

    const newNotice: Notice = {
      id: 'n' + Date.now(),
      title: noticeForm.title,
      content: noticeForm.content,
      type: noticeForm.type,
      targetClass: noticeForm.type === 'class-specific' ? noticeForm.targetClass : undefined,
      expiryDate: noticeForm.expiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isPinned: noticeForm.isPinned,
      createdAt: new Date().toISOString(),
      createdBy: 'admin'
    }

    const updated = [...notices, newNotice]
    localStorage.setItem('notices', JSON.stringify(updated))
    setNotices(updated)
    setShowAddNotice(false)
    setNoticeForm({
      title: '',
      content: '',
      type: 'general',
      targetClass: '',
      expiryDate: '',
      isPinned: false
    })
    toast.success('Notice published!')
  }

  const handleToggleOTPDemo = () => {
    toggleOTPDemoMode()
    setOtpDemo(!otpDemo)
    toast.success(`OTP Demo Mode ${!otpDemo ? 'enabled' : 'disabled'}`)
  }

  return (
    <div className="min-h-screen madarsa-bg">
      <div className="border-b border-accent/20 bg-card/50 backdrop-blur-md sticky top-0 z-10 shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-destructive calligraphy-text">ADMIN DASHBOARD</h1>
            <p className="text-sm text-muted-foreground">{session.name}</p>
          </div>
          <Button variant="outline" onClick={onLogout} className="border-primary/30 hover:bg-primary/5">
            <SignOut size={20} />
            Logout
          </Button>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        {otpDemo && (
          <Alert className="mb-6 bg-accent/10 border-2 border-accent/40 shadow-md">
            <Info size={20} weight="duotone" className="golden-accent" />
            <AlertDescription>
              <strong>🧪 OTP Demo Mode is ENABLED</strong> - OTPs are displayed for testing. 
              Disable this in production!
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="glass-card shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{stats.totalStudents}</p>
            </CardContent>
          </Card>

          <Card className="glass-card shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Teachers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{stats.totalTeachers}</p>
            </CardContent>
          </Card>

          <Card className="glass-card shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold golden-accent">{stats.pendingPayments}</p>
            </CardContent>
          </Card>

          <Card className="glass-card shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{stats.upcomingTests}</p>
            </CardContent>
          </Card>

          <Card className="glass-card shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{stats.averageAttendance}%</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="glass-card shadow-md">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
            <TabsTrigger value="notices">Notices</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card className="glass-card shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users size={24} weight="duotone" className="text-primary" />
                      Students ({students.length})
                    </CardTitle>
                    <CardDescription>Manage student records</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button onClick={handleExportStudents} variant="outline" className="border-primary/30 hover:bg-primary/5">
                      <Download size={20} />
                      Export CSV
                    </Button>

                    <Dialog open={showAddStudent} onOpenChange={setShowAddStudent}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus size={20} />
                          Add Student
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass-card sm:max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Add New Student</DialogTitle>
                          <DialogDescription>Enter student details</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Name</Label>
                            <Input value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <Label>Class</Label>
                            <Input value={studentForm.class} onChange={(e) => setStudentForm({ ...studentForm, class: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <Label>Guardian Name</Label>
                            <Input value={studentForm.guardianName} onChange={(e) => setStudentForm({ ...studentForm, guardianName: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <Label>Guardian Phone</Label>
                            <Input value={studentForm.guardianPhone} onChange={(e) => setStudentForm({ ...studentForm, guardianPhone: e.target.value.replace(/\D/g, '').slice(0, 10) })} />
                          </div>
                          <div className="space-y-2">
                            <Label>Assigned Teacher IDs (comma-separated)</Label>
                            <Input value={studentForm.assignedTeachersStr} onChange={(e) => setStudentForm({ ...studentForm, assignedTeachersStr: e.target.value })} />
                            <p className="text-xs text-muted-foreground">Tip: use teacher IDs like t6,t7 (see Teachers tab)</p>
                          </div>
                          <Button onClick={handleAddStudent} className="w-full">Add Student</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-accent/20">
                        <TableHead>Name</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Guardian</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Teachers</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.slice(0, 10).map(student => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{student.class}</Badge>
                          </TableCell>
                          <TableCell>{student.guardianName}</TableCell>
                          <TableCell className="font-mono text-sm">{student.guardianPhone}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{student.assignedTeachers.length}</Badge>
                          </TableCell>
                          <TableCell className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => {
                              setEditingStudent(student)
                              setStudentForm({ name: student.name, class: student.class, guardianName: student.guardianName, guardianPhone: student.guardianPhone, assignedTeachersStr: student.assignedTeachers.join(', ') })
                              setShowEditStudent(true)
                            }}>
                              Edit
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => {
                              if (confirm('Delete this student?')) handleDeleteStudent(student.id)
                            }}>
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {students.length > 10 && (
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Showing 10 of {students.length} students. Export for full list.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teachers">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Chalkboard size={24} weight="duotone" className="text-secondary" />
                      Teachers ({teachers.length})
                    </CardTitle>
                    <CardDescription>Manage teacher accounts and permissions</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog open={showAddTeacher} onOpenChange={setShowAddTeacher}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus size={20} />
                          Add Teacher
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass-card sm:max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Add New Teacher</DialogTitle>
                          <DialogDescription>Enter teacher details</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Name</Label>
                            <Input value={teacherForm.name} onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <Label>Email</Label>
                            <Input value={teacherForm.email} onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <Label>Contact</Label>
                            <Input value={teacherForm.contact} onChange={(e) => setTeacherForm({ ...teacherForm, contact: e.target.value.replace(/\D/g, '').slice(0, 10) })} />
                          </div>
                          <div className="space-y-2">
                            <Label>Subjects (comma-separated)</Label>
                            <Input value={teacherForm.subjectsStr} onChange={(e) => setTeacherForm({ ...teacherForm, subjectsStr: e.target.value })} />
                          </div>
                          <Button onClick={handleAddTeacher} className="w-full">Add Teacher</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Subjects</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teachers.map(teacher => (
                        <TableRow key={teacher.id}>
                          <TableCell className="font-medium">{teacher.name}</TableCell>
                          <TableCell>{teacher.subjects.slice(0, 2).join(', ')}</TableCell>
                          <TableCell className="font-mono text-sm">{teacher.contact}</TableCell>
                          <TableCell className="text-sm">{teacher.email}</TableCell>
                          <TableCell>
                            <Badge variant={teacher.isEnabled ? 'default' : 'secondary'}>
                              {teacher.isEnabled ? 'Enabled' : 'Disabled'}
                            </Badge>
                          </TableCell>
                          <TableCell className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => {
                              setEditingTeacher(teacher)
                              setTeacherForm({ name: teacher.name, email: teacher.email || '', contact: teacher.contact || '', subjectsStr: teacher.subjects.join(', ') })
                              setShowEditTeacher(true)
                            }}>
                              Edit
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => {
                              if (confirm('Delete this teacher?')) handleDeleteTeacher(teacher.id)
                            }}>
                              Delete
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleTeacher(teacher.id)}
                            >
                              {teacher.isEnabled ? 'Disable' : 'Enable'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CurrencyDollar size={24} weight="duotone" className="text-accent" />
                      Payments ({payments.length})
                    </CardTitle>
                    <CardDescription>
                      Verify and manage fee payments
                      {stats.pendingPayments > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {stats.pendingPayments} pending
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                  <Button onClick={handleExportPayments} variant="outline">
                    <Download size={20} />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map(payment => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.studentName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{payment.class}</Badge>
                          </TableCell>
                          <TableCell className="font-semibold">₹{payment.amount}</TableCell>
                          <TableCell className="text-sm">{payment.date}</TableCell>
                          <TableCell>
                            <Badge variant={payment.status === 'verified' ? 'default' : 'secondary'}>
                              {payment.status === 'verified' ? 'Verified' : 'Pending'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {payment.status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => handleVerifyPayment(payment.id)}
                                className="bg-accent hover:bg-accent/90"
                              >
                                <Check size={16} />
                                Verify
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tests">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText size={24} weight="duotone" className="text-primary" />
                  Tests ({tests.length})
                </CardTitle>
                <CardDescription>Manage tests and results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Max Marks</TableHead>
                        <TableHead>Results</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tests.map(test => (
                        <TableRow key={test.id}>
                          <TableCell className="font-medium">{test.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{test.class}</Badge>
                          </TableCell>
                          <TableCell>{test.subject}</TableCell>
                          <TableCell className="text-sm">{test.date}</TableCell>
                          <TableCell>{test.maxMarks}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{test.results.length}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notices">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Bell size={24} weight="duotone" className="text-secondary" />
                      Notices ({notices.length})
                    </CardTitle>
                    <CardDescription>Manage announcements and notifications</CardDescription>
                  </div>
                  <Dialog open={showAddNotice} onOpenChange={setShowAddNotice}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus size={20} />
                        Add Notice
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Create New Notice</DialogTitle>
                        <DialogDescription>Publish an announcement for students and teachers</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="notice-title">Title</Label>
                          <Input
                            id="notice-title"
                            value={noticeForm.title}
                            onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="notice-content">Content</Label>
                          <Textarea
                            id="notice-content"
                            value={noticeForm.content}
                            onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                            rows={4}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="notice-type">Type</Label>
                          <Select
                            value={noticeForm.type}
                            onValueChange={(v: 'general' | 'class-specific') => 
                              setNoticeForm({ ...noticeForm, type: v })
                            }
                          >
                            <SelectTrigger id="notice-type">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General</SelectItem>
                              <SelectItem value="class-specific">Class Specific</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {noticeForm.type === 'class-specific' && (
                          <div className="space-y-2">
                            <Label htmlFor="target-class">Target Class</Label>
                            <Input
                              id="target-class"
                              placeholder="e.g., Hifz-1"
                              value={noticeForm.targetClass}
                              onChange={(e) => setNoticeForm({ ...noticeForm, targetClass: e.target.value })}
                            />
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <Label htmlFor="pin-notice">Pin this notice</Label>
                          <Switch
                            id="pin-notice"
                            checked={noticeForm.isPinned}
                            onCheckedChange={(checked) => setNoticeForm({ ...noticeForm, isPinned: checked })}
                          />
                        </div>
                        <Button onClick={handleAddNotice} className="w-full">
                          Publish Notice
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notices.map(notice => (
                    <div key={notice.id} className="p-4 rounded-lg bg-muted/30">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold">{notice.title}</h4>
                        <div className="flex gap-2">
                          {notice.isPinned && <Badge variant="default">Pinned</Badge>}
                          <Badge variant="outline">
                            {notice.type === 'general' ? 'General' : notice.targetClass}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{notice.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Edit dialogs for students & teachers */}
          <Dialog open={showEditStudent} onOpenChange={setShowEditStudent}>
            <DialogContent className="glass-card sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit Student</DialogTitle>
                <DialogDescription>Update student details</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Class</Label>
                  <Input value={studentForm.class} onChange={(e) => setStudentForm({ ...studentForm, class: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Guardian Name</Label>
                  <Input value={studentForm.guardianName} onChange={(e) => setStudentForm({ ...studentForm, guardianName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Guardian Phone</Label>
                  <Input value={studentForm.guardianPhone} onChange={(e) => setStudentForm({ ...studentForm, guardianPhone: e.target.value.replace(/\D/g, '').slice(0, 10) })} />
                </div>
                <div className="space-y-2">
                  <Label>Assigned Teacher IDs (comma-separated)</Label>
                  <Input value={studentForm.assignedTeachersStr} onChange={(e) => setStudentForm({ ...studentForm, assignedTeachersStr: e.target.value })} />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => { setShowEditStudent(false); setEditingStudent(null) }}>Cancel</Button>
                  <Button onClick={handleEditStudentSave} className="flex-1">Save</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showEditTeacher} onOpenChange={setShowEditTeacher}>
            <DialogContent className="glass-card sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit Teacher</DialogTitle>
                <DialogDescription>Update teacher details</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={teacherForm.name} onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={teacherForm.email} onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Contact</Label>
                  <Input value={teacherForm.contact} onChange={(e) => setTeacherForm({ ...teacherForm, contact: e.target.value.replace(/\D/g, '').slice(0, 10) })} />
                </div>
                <div className="space-y-2">
                  <Label>Subjects (comma-separated)</Label>
                  <Input value={teacherForm.subjectsStr} onChange={(e) => setTeacherForm({ ...teacherForm, subjectsStr: e.target.value })} />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => { setShowEditTeacher(false); setEditingTeacher(null) }}>Cancel</Button>
                  <Button onClick={handleEditTeacherSave} className="flex-1">Save</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <TabsContent value="settings">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure application settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <h4 className="font-semibold">OTP Demo Mode</h4>
                    <p className="text-sm text-muted-foreground">
                      Display OTPs in UI for testing (disable in production)
                    </p>
                  </div>
                  <Switch
                    checked={otpDemo}
                    onCheckedChange={handleToggleOTPDemo}
                  />
                </div>

                <Alert className="bg-primary/10 border-primary/30">
                  <Info size={20} weight="duotone" className="text-primary" />
                  <AlertDescription className="text-sm space-y-2">
                    <p><strong>Backend Integration Notes:</strong></p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Replace localStorage with Firebase/Supabase/Node+Postgres backend</li>
                      <li>Integrate SMS API (Twilio/MSG91) for OTP delivery</li>
                      <li>Add PhonePe/Razorpay for automatic payment verification</li>
                      <li>Implement file upload for test papers and checked sheets</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
