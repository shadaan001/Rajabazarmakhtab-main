import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Bell, PushPin, Calendar } from '@phosphor-icons/react'
import { Notice } from '@/lib/types'

interface NoticesPageProps {
  onBack: () => void
}

export default function NoticesPage({ onBack }: NoticesPageProps) {
  const [notices, setNotices] = useState<Notice[]>([])
  const [filter, setFilter] = useState<'all' | 'general' | 'class-specific'>('all')

  useEffect(() => {
    const stored = localStorage.getItem('notices')
    if (stored) {
      const allNotices: Notice[] = JSON.parse(stored)
      const activeNotices = allNotices.filter(n => new Date(n.expiryDate) > new Date())
      setNotices(activeNotices)
    }
  }, [])

  const filteredNotices = notices.filter(n => {
    if (filter === 'all') return true
    return n.type === filter
  }).sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

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
            <h1 className="text-4xl font-bold text-primary calligraphy-text">NOTICE BOARD</h1>
            <p className="text-muted-foreground">Important announcements and updates</p>
          </div>
        </div>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="mb-6">
          <TabsList className="glass-card shadow-md">
            <TabsTrigger value="all">All Notices</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="class-specific">Class Specific</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          {filteredNotices.map((notice) => (
            <Card key={notice.id} className="glass-card shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {notice.isPinned && (
                        <PushPin size={20} weight="fill" className="golden-accent" />
                      )}
                      {notice.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar size={16} />
                        {new Date(notice.createdAt).toLocaleDateString()}
                      </span>
                      {notice.targetClass && (
                        <Badge variant="outline" className="bg-primary/10 border-primary/30">
                          {notice.targetClass}
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                  <Badge variant={notice.type === 'general' ? 'default' : 'secondary'}>
                    {notice.type === 'general' ? 'General' : 'Class Specific'}
                  </Badge>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <p className="whitespace-pre-wrap text-card-foreground">{notice.content}</p>
              </CardContent>
            </Card>
          ))}

          {filteredNotices.length === 0 && (
            <Card className="glass-card">
              <CardContent className="py-12 text-center">
                <Bell size={48} weight="duotone" className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No notices available</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
