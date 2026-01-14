import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { CurrencyDollar, QrCode, Copy, Phone, CheckCircle, Info } from '@phosphor-icons/react'
import { copyToClipboard } from '@/lib/auth'
import { getSession } from '@/lib/auth'
import { Payment } from '@/lib/types'
import { toast } from 'sonner'

interface PaymentModalProps {
  open: boolean
  onClose: () => void
}

export default function PaymentModal({ open, onClose }: PaymentModalProps) {
  const [amount, setAmount] = useState('')
  const [studentName, setStudentName] = useState('')
  const [studentClass, setStudentClass] = useState('')
  const [loading, setLoading] = useState(false)
  const session = getSession()

  const upiId = '9073040640@ybl'
  const phone = '9073040640'
  const merchantName = 'MD SHADAAN'

  const handleCopy = async (text: string, label: string) => {
    try {
      await copyToClipboard(text)
      toast.success(`${label} copied to clipboard!`)
    } catch (error) {
      toast.error('Failed to copy')
    }
  }

  const handlePayWithUPI = () => {
    const amountNum = parseFloat(amount)
    let upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&cu=INR`
    
    if (amountNum > 0) {
      upiUrl += `&am=${amountNum}`
    }

    window.location.href = upiUrl
    toast.info('Opening UPI app...')
  }

  const handleConfirmPayment = () => {
    if (!studentName || !studentClass) {
      toast.error('Please enter student name and class')
      return
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setLoading(true)

    setTimeout(() => {
      const payments: Payment[] = JSON.parse(localStorage.getItem('payments') || '[]')
      
      const newPayment: Payment = {
        id: 'p' + Date.now(),
        studentId: session?.userId || 'guest',
        studentName,
        class: studentClass,
        amount: parseFloat(amount),
        date: new Date().toISOString().split('T')[0],
        method: 'UPI',
        status: 'pending',
        transactionNote: `UPI payment to ${merchantName}`
      }

      payments.push(newPayment)
      localStorage.setItem('payments', JSON.stringify(payments))

      toast.success('Payment submitted! Admin will verify shortly.')
      setLoading(false)
      
      setAmount('')
      setStudentName('')
      setStudentClass('')
    }, 500)
  }

  const suggestedAmounts = [1100, 1200, 1600]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-card sm:max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl calligraphy-text">
            <CurrencyDollar size={28} weight="duotone" className="golden-accent" />
            Fee Payment
          </DialogTitle>
          <DialogDescription>
            Pay your fees securely using UPI
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Alert className="bg-accent/10 border-2 border-accent/40">
            <Info size={20} weight="duotone" className="golden-accent" />
            <AlertDescription className="text-sm space-y-2">
              <p><strong>Payment Information:</strong></p>
              <p>• Scan QR code or use UPI ID below</p>
              <p>• After payment, click "I HAVE PAID" button</p>
              <p>• Admin will verify and confirm your payment</p>
            </AlertDescription>
          </Alert>

          <div className="glass-card p-6 space-y-4 border-2 border-accent/20">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2 calligraphy-text">
                <QrCode size={24} weight="duotone" className="text-primary" />
                Scan to Pay
              </h3>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                {merchantName}
              </Badge>
            </div>

            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="w-48 h-48 bg-muted rounded flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <QrCode size={64} weight="duotone" />
                    <p className="text-xs mt-2">QR Code Placeholder</p>
                    <p className="text-[10px]">Place at: /public/assets/phonepe_qr_shadaan.jpeg</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-accent/20">
                <div>
                  <Label className="text-xs text-muted-foreground">UPI ID</Label>
                  <p className="font-mono font-semibold">{upiId}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(upiId, 'UPI ID')}
                  className="border-primary/30"
                >
                  <Copy size={16} />
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-accent/20">
                <div>
                  <Label className="text-xs text-muted-foreground">Phone Number</Label>
                  <p className="font-mono font-semibold">{phone}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(phone, 'Phone number')}
                  className="border-primary/30"
                >
                  <Copy size={16} />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="student-name">Student Name</Label>
              <Input
                id="student-name"
                placeholder="Enter student name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="border-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="student-class">Class</Label>
              <Input
                id="student-class"
                placeholder="e.g., Hifz-1, Alim-2"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                className="border-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border-2"
              />
              <div className="flex gap-2">
                {suggestedAmounts.map((amt) => (
                  <Button
                    key={amt}
                    size="sm"
                    variant="outline"
                    onClick={() => setAmount(amt.toString())}
                    className="text-xs"
                  >
                    ₹{amt}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handlePayWithUPI}
              className="flex-1 h-12 bg-primary hover:bg-primary/90 neon-glow"
              size="lg"
              disabled={!amount || parseFloat(amount) <= 0}
            >
              <Phone size={20} />
              PAY WITH UPI APP
            </Button>
          </div>

          <Button
            onClick={handleConfirmPayment}
            className="w-full h-14 bg-accent hover:bg-accent/90 neon-glow-accent text-accent-foreground"
            size="lg"
            disabled={loading}
          >
            <CheckCircle size={24} weight="duotone" />
            I HAVE PAID - NOTIFY ADMIN
          </Button>

          <Alert className="bg-muted/30 border-muted">
            <Info size={20} weight="duotone" />
            <AlertDescription className="text-xs">
              {/* TODO: Integrate PhonePe/Razorpay for automatic payment verification */}
              Currently using manual verification. Payments are verified by admin within 24 hours.
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  )
}
