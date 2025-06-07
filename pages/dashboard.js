import { useAuth } from '@/utils/auth'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import EventList from '@/components/EventList'
import PhoneNumberForm from '@/components/PhoneNumberForm'

export default function Dashboard() {
  const router = useRouter()
  const { user, loading, error } = useAuth()

  useEffect(() => {
    if (!loading && !user && !error) {
      router.push('/login')
    }
  }, [user, loading, error, router])

  if (loading) return <div className="text-center py-8">Loading...</div>
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>
  if (!user) return <div className="text-center py-8">Redirecting to login...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Dashboard</h1>
      <PhoneNumberForm />
      <EventList />
    </div>
  )
}