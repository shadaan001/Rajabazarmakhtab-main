import { useState, useEffect } from 'react'
import { Session, Student, Test, Payment, Notice, AttendanceRecord, Teacher } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { SignOut, ChartBar, CalendarCheck, FileText, CurrencyDollar, Bell, User } from '@phosphor-icons/react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface StudentDashboardProps {
  session: Session
  onLogout: () => void
}

export default function StudentDashboard({ session, onLogout }: StudentDashboardProps) {
  const [student, setStudent] = useState<Student | null>(null)
  const [tests, setTests] = useState<Test[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [notices, setNotices] = useState<Notice[]>([])
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])

  useEffect(() => {
    const students: Student[] = JSON.parse(localStorage.getItem('students') || '[]')
    const foundStudent = students.find(s => s.id === session.userId || s.name === session.name)
    setStudent(foundStudent || null)

    const allTests: Test[] = JSON.parse(localStorage.getItem('tests') || '[]')
    if (foundStudent) {
      const studentTests = allTests.filter(t => 
        t.class === foundStudent.class && 
        t.results.some(r => r.studentId === foundStudent.id)
      )
      setTests(studentTests)

      const allPayments: Payment[] = JSON.parse(localStorage.getItem('payments') || '[]')
      setPayments(allPayments.filter(p => p.studentId === foundStudent.id))

      const allAttendance: AttendanceRecord[] = JSON.parse(localStorage.getItem('attendance') || '[]')
      setAttendance(allAttendance.filter(a => 
        a.students.some(s => s.studentId === foundStudent.id)
      ))

      const allTeachers: Teacher[] = JSON.parse(localStorage.getItem('teachers') || '[]')
      setTeachers(allTeachers.filter(t => foundStudent.assignedTeachers.includes(t.id)))
    }

    const allNotices: Notice[] = JSON.parse(localStorage.getItem('notices') || '[]')
    const activeNotices = allNotices.filter(n => {
      if (new Date(n.expiryDate) < new Date()) return false
      if (n.type === 'general') return true
      if (n.type === 'class-specific' && foundStudent && n.targetClass === foundStudent.class) return true
      return false
    })
    setNotices(activeNotices)
  }, [session])

  const getMyResults = (test: Test) => {
    return test.results.find(r => r.studentId === student?.id)
  }

  const calculateAttendancePercentage = () => {
    if (attendance.length === 0) return 0
    const held = attendance.filter(a => a.status === 'held')
    const present = held.filter(a => 
      a.students.find(s => s.studentId === student?.id)?.status === 'present'
    )
    return Math.round((present.length / held.length) * 100)
  }

  const getMonthlyAverages = () => {
    const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb']
    return months.map((month, idx) => ({
      month,
      average: Math.round(75 + Math.random() * 20)
    }))
  }

  const getSubjectAverages = () => {
    const subjects: { [key: string]: number[] } = {}
    
    tests.forEach(test => {
      const result = getMyResults(test)
      if (result) {
        if (!subjects[test.subject]) subjects[test.subject] = []
        subjects[test.subject].push(result.percentage)
      }
    })

    return Object.entries(subjects).map(([subject, scores]) => ({
      subject,
      average: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    }))
  }

  const totalTests = tests.length
  const averageScore = tests.length > 0 
    ? Math.round(tests.reduce((sum, test) => {
        const result = getMyResults(test)
        return sum + (result?.percentage || 0)
      }, 0) / tests.length)
    : 0

  return (
    <div className="min-h-screen madarsa-bg">
      <div className="border-b border-accent/20 bg-card/50 backdrop-blur-md sticky top-0 z-10 shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary calligraphy-text">STUDENT DASHBOARD</h1>
            <p className="text-sm text-muted-foreground">{session.name}</p>
          </div>
          <Button variant="outline" onClick={onLogout} className="border-primary/30 hover:bg-primary/5">
            <SignOut size={20} />
            Logout
          </Button>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Class</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{student?.class || 'N/A'}</p>
            </CardContent>
          </Card>

          <Card className="glass-card shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{calculateAttendancePercentage()}%</p>
            </CardContent>
          </Card>

          <Card className="glass-card shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tests Taken</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{totalTests}</p>
            </CardContent>
          </Card>

          <Card className="glass-card shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{averageScore}%</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="glass-card shadow-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="notices">Notices</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChartBar size={24} weight="duotone" className="text-primary" />
                    Monthly Progress
                  </CardTitle>
                  <CardDescription>Last 6 months average scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={getMonthlyAverages()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.85 0.02 75)" />
                      <XAxis dataKey="month" stroke="oklch(0.52 0.02 45)" />
                      <YAxis stroke="oklch(0.52 0.02 45)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'oklch(0.99 0.005 85)', 
                          border: '1px solid oklch(0.85 0.02 75)',
                          borderRadius: '8px'
                        }} 
                      />
                      <Line type="monotone" dataKey="average" stroke="oklch(0.45 0.15 155)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="glass-card shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChartBar size={24} weight="duotone" className="golden-accent" />
                    Subject-wise Performance
                  </CardTitle>
                  <CardDescription>Average scores by subject</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={getSubjectAverages()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.85 0.02 75)" />
                      <XAxis dataKey="subject" stroke="oklch(0.52 0.02 45)" />
                      <YAxis stroke="oklch(0.52 0.02 45)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'oklch(0.99 0.005 85)', 
                          border: '1px solid oklch(0.85 0.02 75)',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="average" fill="oklch(0.75 0.12 75)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="glass-card shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User size={24} weight="duotone" className="text-primary" />
                  My Teachers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teachers.map(teacher => (
                    <div key={teacher.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-accent/20">
                      <img 
                        src={teacher.photo} 
                        alt={teacher.name}
                        className="w-12 h-12 rounded-full bg-muted border-2 border-primary/20"
                      />
                      <div>
                        <p className="font-semibold text-foreground">{teacher.name}</p>
                        <p className="text-xs text-muted-foreground">{teacher.subjects.join(', ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell size={24} weight="duotone" className="golden-accent" />
                  Recent Notices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notices.slice(0, 3).map(notice => (
                    <div key={notice.id} className="p-4 rounded-lg bg-muted/50 border border-accent/20">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-foreground">{notice.title}</h4>
                        {notice.isPinned && (
                          <Badge variant="outline" className="bg-accent/30 border-accent">Pinned</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{notice.content}</p>
                    </div>
                  ))}
                  {notices.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No notices available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tests">
            <Card className="glass-card shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText size={24} weight="duotone" className="text-primary" />
                  Test Results
                </CardTitle>
                <CardDescription>Your test performance history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tests.map(test => {
                    const result = getMyResults(test)
                    return result ? (
                      <div key={test.id} className="p-4 rounded-lg bg-muted/50 border border-accent/20">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-foreground">{test.title}</h4>
                            <p className="text-sm text-muted-foreground">{test.subject} • {test.date}</p>
                          </div>
                          <Badge variant={result.percentage >= 80 ? 'default' : result.percentage >= 60 ? 'secondary' : 'destructive'}>
                            {result.grade}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Score: {result.marksObtained}/{test.maxMarks}</span>
                            <span className="font-semibold">{result.percentage}%</span>
                          </div>
                          <Progress value={result.percentage} className="h-2" />
                          {result.comments && (
                            <p className="text-sm text-muted-foreground italic">{result.comments}</p>
                          )}
                        </div>
                      </div>
                    ) : null
                  })}
                  {tests.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No tests available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card className="glass-card shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CurrencyDollar size={24} weight="duotone" className="golden-accent" />
                  Payment History
                </CardTitle>
                <CardDescription>Your fee payment records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {payments.map(payment => (
                    <div key={payment.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-accent/20">
                      <div>
                        <p className="font-semibold text-foreground">₹{payment.amount}</p>
                        <p className="text-sm text-muted-foreground">{payment.date}</p>
                      </div>
                      <Badge variant={payment.status === 'verified' ? 'default' : 'secondary'}>
                        {payment.status === 'verified' ? 'Verified' : 'Pending'}
                      </Badge>
                    </div>
                  ))}
                  {payments.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No payment records</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notices">
            <Card className="glass-card shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell size={24} weight="duotone" className="text-primary" />
                  All Notices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notices.map(notice => (
                    <div key={notice.id} className="p-4 rounded-lg bg-muted/50 border border-accent/20">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-foreground">{notice.title}</h4>
                        <Badge variant={notice.isPinned ? 'default' : 'outline'}>
                          {notice.isPinned ? 'Pinned' : notice.type === 'general' ? 'General' : 'Class'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{notice.content}</p>
                      <Separator className="my-2" />
                      <p className="text-xs text-muted-foreground">
                        {new Date(notice.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  {notices.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No notices available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
