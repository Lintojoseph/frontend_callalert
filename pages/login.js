import AuthButton from '@/components/AuthButton'
import { useAuth } from '@/utils/auth'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Login() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading || user) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Welcome to Google Event Call Alerts</h1>
      <p className="mb-6 text-center text-gray-600">
        Sign in with Google to set up phone call reminders for your calendar events.
      </p>
      <div className="flex justify-center">
        <AuthButton />
      </div>
    </div>
  )
}