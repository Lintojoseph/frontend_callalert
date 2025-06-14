// pages/_app.js
import '../pages/globals.css';

import { AuthProvider } from '@/utils/auth'
import Layout from '@/components/layout'
import { useEffect } from 'react'
function MyApp({ Component, pageProps }) {
  
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