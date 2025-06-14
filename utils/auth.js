// // utils/auth.js
// import { createContext, useContext, useEffect, useState } from 'react'
// import axios from 'axios'
// import { useRouter } from 'next/router'

// const AuthContext = createContext()

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const router = useRouter()

//   useEffect(() => {
//     async function loadUser() {
//       try {
//         const token = localStorage.getItem('token')
//         if (token) {
//           const res = await axios.get('/api/auth/me', {
//             headers: { Authorization: `Bearer ${token}` }
//           })
//           setUser(res.data)
//         }
//       } catch (error) {
//         console.error('Error loading user:', error)
//         localStorage.removeItem('token')
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadUser()
//   }, [])

//   const login = async (token) => {
//     localStorage.setItem('token', token)
//     const res = await axios.get('/api/auth/me', {
//       headers: { Authorization: `Bearer ${token}` }
//     })
//     setUser(res.data)
//     router.push('/dashboard')
//   }

//   const logout = () => {
//     localStorage.removeItem('token')
//     setUser(null)
//     router.push('/login')
//   }

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// }
import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  const loadUser = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Check for token in URL
      if (typeof window === 'undefined') {
        setLoading(false)
        return
      }
      
      const params = new URLSearchParams(window.location.search)
      const urlToken = params.get('token')
      
      if (urlToken) {
        localStorage.setItem('token', urlToken)
        
        window.history.replaceState({}, document.title, window.location.pathname)
      }
      
      const token = urlToken || localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await axios.get('/api/proxy/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
      data: undefined 
    });
      
      setUser(response.data)
    } catch (error) {
      console.error('Error loading user:', error)
      setError(error.response?.data?.message || 'Authentication failed')
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      loadUser()
    }
  }, [])

  const login = (token) => {
    localStorage.setItem('token', token)
    loadUser()
    router.push('/dashboard')
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setError(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      error,
      login, 
      logout,
      reload: loadUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}