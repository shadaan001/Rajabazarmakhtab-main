import { UserCircle, ShieldCheck, Chalkboard, CurrencyDollar, Bell, Envelope, GraduationCap } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'

interface HeroProps {
  onStudentLogin: () => void
  onTeacherLogin: () => void
  onAdminLogin: () => void
  onPayments: () => void
  onCourses: () => void
  onNotices: () => void
  onContact: () => void
}

export default function Hero({
  onStudentLogin,
  onTeacherLogin,
  onAdminLogin,
  onPayments,
  onCourses,
  onNotices,
  onContact
}: HeroProps) {
  return (
    <div className="min-h-screen madarsa-bg flex flex-col">
      <header className="p-4 md:p-6 flex items-center justify-between border-b border-accent/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg bg-primary/10 border-2 border-primary/30 flex items-center justify-center shadow-md">
            <GraduationCap size={32} weight="duotone" className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-primary calligraphy-text">RAJA BAJAR</h2>
            <p className="text-xs md:text-sm text-muted-foreground">Islamic Education Center</p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-6xl w-full text-center space-y-8 md:space-y-12">
          <div className="space-y-4 animate-float">
            <div className="mb-4">
              <p className="text-2xl md:text-3xl calligraphy-text golden-accent mb-2" dir="rtl">بسم الله الرحمن الرحيم</p>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary calligraphy-text tracking-wide leading-tight">
              RAJA BAJAR<br />MAKHTAB
            </h1>
            <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto font-medium">
              Excellence in Islamic Education · Kolkata
            </p>
            <p className="text-base calligraphy-text golden-accent" dir="rtl">العلم نور</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Button
              size="lg"
              className="h-14 md:h-16 text-base md:text-lg gap-3 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all hover:translate-y-[-2px]"
              onClick={onStudentLogin}
            >
              <UserCircle size={24} weight="duotone" />
              STUDENT LOGIN
            </Button>

            <Button
              size="lg"
              className="h-14 md:h-16 text-base md:text-lg gap-3 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all hover:translate-y-[-2px]"
              onClick={onTeacherLogin}
            >
              <Chalkboard size={24} weight="duotone" />
              TEACHER LOGIN
            </Button>

            <Button
              size="lg"
              className="h-14 md:h-16 text-base md:text-lg gap-3 bg-destructive hover:bg-destructive/90 shadow-lg hover:shadow-xl transition-all hover:translate-y-[-2px]"
              onClick={onAdminLogin}
            >
              <ShieldCheck size={24} weight="duotone" />
              ADMIN LOGIN
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-14 md:h-16 text-base md:text-lg gap-3 border-2 border-primary/40 hover:bg-primary/5 shadow hover:shadow-md transition-all hover:translate-y-[-2px]"
              onClick={onPayments}
            >
              <CurrencyDollar size={24} weight="duotone" />
              PAYMENTS
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-14 md:h-16 text-base md:text-lg gap-3 border-2 border-accent/40 hover:bg-accent/5 shadow hover:shadow-md transition-all hover:translate-y-[-2px]"
              onClick={onCourses}
            >
              <GraduationCap size={24} weight="duotone" />
              COURSES
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-14 md:h-16 text-base md:text-lg gap-3 border-2 border-muted-foreground/30 hover:bg-muted shadow hover:shadow-md transition-all hover:translate-y-[-2px]"
              onClick={onNotices}
            >
              <Bell size={24} weight="duotone" />
              NOTICES
            </Button>
          </div>

          <Button
            size="lg"
            variant="ghost"
            className="text-base gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            onClick={onContact}
          >
            <Envelope size={20} weight="duotone" />
            Contact Us
          </Button>
        </div>
      </main>

      <footer className="p-4 text-center text-sm text-muted-foreground border-t border-accent/20 bg-card/30">
        <p>© 2024 Raja Bajar Makhtab · Kolkata · All Rights Reserved</p>
      </footer>
    </div>
  )
}
