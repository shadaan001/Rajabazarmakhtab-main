import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Chalkboard, Info } from '@phosphor-icons/react'
import { getTeacherByCredentials, createSession } from '@/lib/auth'
import { toast } from 'sonner'

interface TeacherLoginProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function TeacherLogin({ open, onClose, onSuccess }: TeacherLoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = () => {
    setError('')
    
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    setLoading(true)

    setTimeout(() => {
      const teacher = getTeacherByCredentials(email, password)
      
      if (teacher) {
        createSession(teacher.id, 'teacher', teacher.name, teacher.contact, 'credentials')
        toast.success(`Welcome, ${teacher.name}!`)
        onSuccess()
      } else {
        setError('Invalid credentials or account is disabled. Contact admin for access.')
      }
      
      setLoading(false)
    }, 500)
  }

  const handleClose = () => {
    setEmail('')
    setPassword('')
    setError('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="glass-card sm:max-w-md shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl calligraphy-text">
            <Chalkboard size={28} weight="duotone" className="text-primary" />
            Teacher Login
          </DialogTitle>
          <DialogDescription>
            Enter your credentials to access the teacher dashboard
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="teacher-email">Email Address</Label>
            <Input
              id="teacher-email"
              type="email"
              placeholder="your.email@rajabazar.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="border-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacher-password">Password</Label>
            <Input
              id="teacher-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="border-2"
            />
          </div>

          <Alert className="bg-primary/10 border-2 border-primary/30">
            <Info size={20} weight="duotone" className="text-primary" />
            <AlertDescription className="text-xs">
              Teacher accounts must be enabled by admin. Default password: <strong>teacher123</strong><br />
              Contact administration if you don't have access.
            </AlertDescription>
          </Alert>

          <Button
            onClick={handleLogin}
            className="w-full"
            size="lg"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'LOGIN'}
          </Button>

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
