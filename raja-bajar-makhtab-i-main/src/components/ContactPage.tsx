import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Envelope, Phone, MapPin, Clock } from '@phosphor-icons/react'

interface ContactPageProps {
  onBack: () => void
}

export default function ContactPage({ onBack }: ContactPageProps) {
  return (
    <div className="min-h-screen madarsa-bg">
      <div className="container max-w-4xl mx-auto px-4 py-8">
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
            <h1 className="text-4xl font-bold text-primary calligraphy-text">CONTACT US</h1>
            <p className="text-muted-foreground">Get in touch with us</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="glass-card shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone size={24} weight="duotone" className="text-primary" />
                Phone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-primary">9073040640</p>
              <p className="text-sm text-muted-foreground mt-2">
                Available during office hours
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Envelope size={24} weight="duotone" className="text-primary" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold break-all text-primary">shadaan001@gmail.com</p>
              <p className="text-sm text-muted-foreground mt-2">
                We'll respond within 24 hours
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin size={24} weight="duotone" className="text-primary" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-foreground">Raja Bajar, Kolkata</p>
              <p className="text-sm text-muted-foreground mt-2">
                West Bengal, India
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock size={24} weight="duotone" className="text-primary" />
                Office Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">Monday - Saturday</p>
              <p className="text-lg mt-1">9:00 AM - 5:00 PM</p>
              <p className="text-sm text-muted-foreground mt-2">
                Closed on Sundays and holidays
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Raja Bajar Makhtab</CardTitle>
            <CardDescription>Islamic Education Center, Kolkata</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-card-foreground">
              Raja Bajar Makhtab is a premier Islamic education institution in Kolkata, dedicated to
              providing quality Islamic education to students. We offer comprehensive programs in
              Quran memorization (Hifz), Islamic studies (Alim), and advanced scholarship (Fazil).
            </p>
            <p className="text-card-foreground">
              For admission inquiries, course information, or any other questions, please feel free
              to contact us using the information provided above. Our administration team is ready
              to assist you.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
