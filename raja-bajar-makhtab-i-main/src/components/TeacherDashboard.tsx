import { useState, useEffect } from 'react'
import { Session, Teacher, Student, AttendanceRecord } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SignOut, CalendarCheck, Users, Chalkboard } from '@phosphor-icons/react'
import { getDayName } from '@/lib/auth'

interface TeacherDashboardProps {
  session: Session
  onLogout: () => void
}

export default function TeacherDashboard({ session, onLogout }: TeacherDashboardProps) {
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])

  useEffect(() => {
    const teachers: Teacher[] = JSON.parse(localStorage.getItem('teachers') || '[]')
    const foundTeacher = teachers.find(t => t.id === session.userId)
    setTeacher(foundTeacher || null)

    if (foundTeacher) {
      const allStudents: Student[] = JSON.parse(localStorage.getItem('students') || '[]')
      setStudents(allStudents.filter(s => s.assignedTeachers.includes(foundTeacher.id)))

      const allAttendance: AttendanceRecord[] = JSON.parse(localStorage.getItem('attendance') || '[]')
      setAttendance(allAttendance.filter(a => a.teacherId === foundTeacher.id))
    }
  }, [session])

  const classesHeld = attendance.filter(a => a.status === 'held').length
  const classesScheduled = teacher?.weeklyAvailability.length || 0

  return (
    <div className="min-h-screen madarsa-bg">
      <div className="border-b border-accent/20 bg-card/50 backdrop-blur-md sticky top-0 z-10 shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary calligraphy-text">TEACHER DASHBOARD</h1>
            <p className="text-sm text-muted-foreground">{session.name}</p>
          </div>
          <Button variant="outline" onClick={onLogout} className="border-primary/30 hover:bg-primary/5">
            <SignOut size={20} />
            Logout
          </Button>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="glass-card shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">My Students</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{students.length}</p>
            </CardContent>
          </Card>

          <Card className="glass-card shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Classes Held</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{classesHeld}</p>
            </CardContent>
          </Card>

          <Card className="glass-card shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Weekly Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{classesScheduled} slots</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="glass-card shadow-md">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="students">My Students</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="glass-card shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Chalkboard size={24} weight="duotone" className="text-primary" />
                  Teacher Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  {teacher?.photo && (
                    <img 
                      src={teacher.photo} 
                      alt={teacher.name}
                      className="w-24 h-24 rounded-full bg-muted border-2 border-primary/20"
                    />
                  )}
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{teacher?.name}</h3>
                    <p className="text-muted-foreground">{teacher?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50 border border-accent/20">
                    <h4 className="font-semibold mb-2 text-foreground">Contact</h4>
                    <p className="text-sm">{teacher?.contact}</p>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50 border border-accent/20">
                    <h4 className="font-semibold mb-2 text-foreground">Subjects</h4>
                    <div className="flex flex-wrap gap-2">
                      {teacher?.subjects.map(subject => (
                        <Badge key={subject} variant="outline" className="border-primary/30">{subject}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <Card className="glass-card shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users size={24} weight="duotone" className="text-primary" />
                  My Students ({students.length})
                </CardTitle>
                <CardDescription>Students assigned to your classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {students.map(student => (
                    <div key={student.id} className="p-4 rounded-lg bg-muted/50 border border-accent/20">
                      <h4 className="font-semibold text-foreground">{student.name}</h4>
                      <p className="text-sm text-muted-foreground">Class: {student.class}</p>
                      <p className="text-xs text-muted-foreground mt-2">Guardian: {student.guardianPhone}</p>
                    </div>
                  ))}
                  {students.length === 0 && (
                    <p className="col-span-full text-center text-muted-foreground py-8">
                      No students assigned yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card className="glass-card shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarCheck size={24} weight="duotone" className="golden-accent" />
                  Weekly Schedule
                </CardTitle>
                <CardDescription>Your teaching schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teacher?.weeklyAvailability.map((slot, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-accent/20">
                      <div>
                        <p className="font-semibold text-foreground">{getDayName(slot.day)}</p>
                        <p className="text-sm text-muted-foreground">
                          {slot.startTime} - {slot.endTime}
                        </p>
                      </div>
                      <Badge variant="outline" className="border-primary/30">Active</Badge>
                    </div>
                  ))}
                  {(!teacher?.weeklyAvailability || teacher.weeklyAvailability.length === 0) && (
                    <p className="text-center text-muted-foreground py-8">
                      No schedule set. Contact admin to set your schedule.
                    </p>
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
