// components/layout.js
import Head from 'next/head'
import AuthButton from './AuthButton'

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Google Event Call Alerts</title>
        <meta name="description" content="Get phone call reminders for your Google Calendar events" />
      </Head>
      <div className="min-h-screen flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">Google Event Call Alerts</h1>
            <AuthButton />
          </div>
        </header>
        <main className="flex-grow max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
        <footer className="bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Google Event Call Alerts
          </div>
        </footer>
      </div>
    </>
  )
}