// pages/_app.js
import { AuthProvider } from '@/utils/auth'
import Layout from '@/components/layout'
import { useEffect } from 'react'

function MyApp({ Component, pageProps }) {
  // This will log when the app mounts on client side
  useEffect(() => {
    console.log('Client-side AuthProvider mounted')
  }, [])

  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  )
}

export default MyApp