import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, GraduationCap, Book, Mosque } from '@phosphor-icons/react'

interface CoursesPageProps {
  onBack: () => void
}

const courses = [
  {
    id: 1,
    name: 'Hifz Program',
    description: 'Quran memorization with proper Tajweed under expert guidance',
    levels: ['Hifz-1', 'Hifz-2', 'Hifz-3'],
    duration: '3-5 years',
    icon: Book
  },
  {
    id: 2,
    name: 'Alim Course',
    description: 'Comprehensive Islamic studies including Fiqh, Hadith, Arabic Grammar, and Tafseer',
    levels: ['Alim-1', 'Alim-2', 'Alim-3'],
    duration: '6-8 years',
    icon: GraduationCap
  },
  {
    id: 3,
    name: 'Fazil Program',
    description: 'Advanced Islamic scholarship and specialization in Islamic jurisprudence',
    levels: ['Fazil-1', 'Fazil-2'],
    duration: '2-3 years',
    icon: Mosque
  },
  {
    id: 4,
    name: 'Nazra Classes',
    description: 'Basic Quran reading with correct pronunciation for beginners',
    levels: ['Nazra-1', 'Nazra-2'],
    duration: '1-2 years',
    icon: Book
  }
]

export default function CoursesPage({ onBack }: CoursesPageProps) {
  return (
    <div className="min-h-screen madarsa-bg">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full hover:bg-muted/50"
          >
            <ArrowLeft size={24} />
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-primary calligraphy-text">COURSES</h1>
            <p className="text-muted-foreground">Explore our Islamic education programs</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => {
            const Icon = course.icon
            return (
              <Card key={course.id} className="glass-card shadow-md hover:shadow-lg hover:border-primary/50 transition-all">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 border-2 border-primary/30 shadow-sm">
                      <Icon size={32} weight="duotone" className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="calligraphy-text">{course.name}</CardTitle>
                      <CardDescription className="mt-2">
                        {course.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Available Levels:</p>
                    <div className="flex flex-wrap gap-2">
                      {course.levels.map((level) => (
                        <Badge key={level} variant="outline" className="bg-secondary/20">
                          {level}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <span className="text-sm text-muted-foreground">Duration</span>
                    <span className="text-sm font-semibold">{course.duration}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="glass-card mt-8">
          <CardHeader>
            <CardTitle>Admission Information</CardTitle>
            <CardDescription>How to enroll in our programs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-card-foreground">
              For admission inquiries, please contact the administration office during working hours
              or submit your information through the Contact Us page.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-lg bg-muted/30">
                <h4 className="font-semibold mb-2">Office Hours</h4>
                <p className="text-sm text-muted-foreground">
                  Monday - Saturday<br />
                  9:00 AM - 5:00 PM
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30">
                <h4 className="font-semibold mb-2">Contact</h4>
                <p className="text-sm text-muted-foreground">
                  Phone: 9073040640<br />
                  Email: shadaan001@gmail.com
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
