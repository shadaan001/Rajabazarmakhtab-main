import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { ShieldCheck, Info } from '@phosphor-icons/react'
import { createOTPRecord, verifyOTP, createSession, getStudentByPhone, isOTPDemoModeEnabled } from '@/lib/auth'
import { toast } from 'sonner'

interface OTPLoginProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  role: 'student' | 'admin'
}

export default function OTPLogin({ open, onClose, onSuccess, role }: OTPLoginProps) {
  const initialStep = role === 'admin' ? 'email' : 'phone'
  const [step, setStep] = useState<'phone' | 'otp' | 'demo-fallback' | 'email'>(initialStep)
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [demoOTP, setDemoOTP] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')


  const ADMIN_EMAIL = 'shadaan001@gmail.com'
  const ADMIN_PASSWORD = 'Admin@1234' // Change this as needed (hard-coded for demo) 

  const handleAdminLogin = () => {
    setError('')

    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    setLoading(true)

    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        createSession('admin', 'admin', 'Administrator', email, 'credentials')
        toast.success('Admin login successful!')
        onSuccess()
      } else {
        setError('Invalid admin credentials')
      }

      setLoading(false)
    }, 500)
  }

  const handleSendOTP = () => {
    setError('')

    if (role === 'admin') {
      // for admin, we use hard-coded email/password login
      handleAdminLogin()
      return
    }

    setLoading(true)

    setTimeout(() => {
      const otpRecord = createOTPRecord(phone, role)
      
      if (isOTPDemoModeEnabled()) {
        setDemoOTP(otpRecord.otp)
      }
      
      setStep('otp')
      setLoading(false)
      toast.success('OTP sent successfully!')
    }, 500)
  }

  const handleVerifyOTP = () => {
    setError('')
    
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit OTP')
      return
    }

    setLoading(true)

    setTimeout(() => {
      const isValid = verifyOTP(phone, otp, role)
      
      if (isValid) {
        if (role === 'student') {
          const student = getStudentByPhone(phone)
          if (student) {
            createSession(student.id, 'student', student.name, phone, 'otp')
            toast.success(`Welcome, ${student.name}!`)
            onSuccess()
          } else {
            setError('No student found with this phone number')
            setStep('demo-fallback')
          }
        } else if (role === 'admin') {
          createSession('admin', 'admin', 'Administrator', phone, 'otp')
          toast.success('Admin login successful!')
          onSuccess()
        }
      } else {
        setError('Invalid or expired OTP. Please try again.')
      }
      
      setLoading(false)
    }, 500)
  }

  const handleDemoLogin = () => {
    setError('')
    
    if (!name || !phone) {
      setError('Please enter both name and phone number')
      return
    }

    createSession('demo-' + Date.now(), 'student', name, phone, 'demo')
    toast.success(`Welcome, ${name}! (Demo Mode)`)
    onSuccess()
  }

  const handleClose = () => {
    setStep(role === 'admin' ? 'email' : 'phone')
    setPhone('')
    setEmail('')
    setPassword('')
    setOtp('')
    setDemoOTP('')
    setName('')
    setError('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="glass-card sm:max-w-md shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl calligraphy-text">
            <ShieldCheck size={28} weight="duotone" className="text-primary" />
            {role === 'admin' ? 'Admin' : 'Student'} Login
          </DialogTitle>
          <DialogDescription>
            {step === 'phone' && 'Enter your mobile number to receive an OTP'}
            {step === 'email' && 'Enter admin email and password'}
            {step === 'otp' && 'Enter the 6-digit OTP sent to your phone'}
            {step === 'demo-fallback' && 'Quick login for testing (Demo Mode)'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {step === 'phone' && role === 'student' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone">Mobile Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter 10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  maxLength={10}
                  className="text-lg border-2"
                />
              </div>

              <Alert className="bg-primary/10 border-2 border-primary/30">
                <Info size={20} weight="duotone" className="text-primary" />
                <AlertDescription className="text-xs">
                  🔒 OTP is for authentication only. Do not share with anyone.
                  OTP expires in 5 minutes.
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleSendOTP}
                className="w-full shadow-md"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'SEND OTP'}
              </Button>

              <Button
                variant="ghost"
                onClick={() => setStep('demo-fallback')}
                className="w-full hover:bg-muted/50"
              >
                Use Demo Login
              </Button>
            </>
          )}

          {step === 'email' && role === 'admin' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-lg border-2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-lg border-2"
                />
              </div>

              {role === 'admin' && (
                <Alert className="bg-destructive/10 border-2 border-destructive/40">
                  <ShieldCheck size={20} weight="duotone" className="text-destructive" />
                  <AlertDescription className="text-sm">
                    <strong>ADMIN ACCESS RESTRICTED</strong><br />
                    Login using:<br />
                    • Email: {ADMIN_EMAIL}<br />
                    • Password: {ADMIN_PASSWORD}
                  </AlertDescription>
                </Alert>
              )}

              <Alert className="bg-primary/10 border-2 border-primary/30">
                <Info size={20} weight="duotone" className="text-primary" />
                <AlertDescription className="text-xs">
                  🔒 Admin credentials are hard-coded for this demo. Keep them secure.
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleSendOTP}
                className="w-full shadow-md"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'LOGIN'}
              </Button>
            </>
          )} 

          {step === 'otp' && (
            <>
              <div className="space-y-2">
                <Label>Enter OTP</Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              {isOTPDemoModeEnabled() && demoOTP && (
                <Alert className="bg-accent/10 border-2 border-accent/40">
                  <Info size={20} weight="duotone" className="golden-accent" />
                  <AlertDescription>
                    <strong>🧪 DEMO MODE - OTP:</strong> <span className="text-xl font-bold tracking-wider">{demoOTP}</span><br />
                    <span className="text-xs">
                      {/* TODO: Replace demo OTP with SMS provider (Twilio/MSG91) in production */}
                      This OTP is shown for testing. In production, it will be sent via SMS.
                    </span>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep('phone')
                    setOtp('')
                    setDemoOTP('')
                  }}
                  className="flex-1 border-primary/30 hover:bg-primary/5"
                >
                  Change Number
                </Button>
                <Button
                  onClick={handleVerifyOTP}
                  className="flex-1 shadow-md"
                  size="lg"
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? 'Verifying...' : 'VERIFY OTP'}
                </Button>
              </div>
            </>
          )}

          {step === 'demo-fallback' && (
            <>
              <Alert className="bg-accent/10 border-2 border-accent/40">
                <Info size={20} weight="duotone" className="golden-accent" />
                <AlertDescription className="text-xs">
                  Quick login for testing without OTP verification
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="demo-name">Your Name</Label>
                <Input
                  id="demo-name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="demo-phone">Mobile Number</Label>
                <Input
                  id="demo-phone"
                  type="tel"
                  placeholder="Enter 10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  maxLength={10}
                  className="border-2"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep('phone')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleDemoLogin}
                  className="flex-1"
                  size="lg"
                >
                  LOGIN (DEMO)
                </Button>
              </div>
            </>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
