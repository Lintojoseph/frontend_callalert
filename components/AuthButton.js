// import { useAuth } from '@/utils/auth'
// import { FcGoogle } from 'react-icons/fc'
// import { useRouter } from 'next/router'

// export default function AuthButton() {
//   const { user, logout } = useAuth()
//   const router = useRouter()

//   const handleGoogleLogin = () => {
//     window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`
//   }

//   if (user) {
//     return (
//       <div className="flex items-center space-x-4">
//         <span className="text-gray-700">Hello, {user.name}</span>
//         <button
//           onClick={logout}
//           className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
//         >
//           Logout
//         </button>
//       </div>
//     )
//   }

//   return (
//     <button
//       onClick={handleGoogleLogin}
//       className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
//     >
//       <FcGoogle className="w-5 h-5 mr-2" />
//       Sign in with Google
//     </button>
//   )
// }
import { useAuth } from '@/utils/auth'
import { FcGoogle } from 'react-icons/fc'

export default function AuthButton() {
  const { user, logout } = useAuth()

  const handleGoogleLogin = () => {
   
    localStorage.removeItem('token')
    
    
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`
  }

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-gray-700 hidden md:inline">Hello, {user.name}</span>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
        >
          Logout
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      <FcGoogle className="w-5 h-5 mr-2" />
      Sign in with Google
    </button>
  )
}