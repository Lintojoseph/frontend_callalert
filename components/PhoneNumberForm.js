import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/utils/auth'

export default function PhoneNumberForm() {
  const { user } = useAuth()
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  
  if (!phoneNumber || !phoneNumber.startsWith('+')) {
    setError('Please enter a valid phone number starting with +');
    return;
  }

  try {
    setLoading(true);
    setError(null);
    
    const response = await axios.post('/api/proxy/auth/phone', { phoneNumber }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    
    
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  } catch (err) {
    let errorMsg = 'Failed to save phone number. Please try again.';
    
    
    if (err.response?.data?.message) {
      errorMsg = err.response.data.message;
    }
    
    setError(errorMsg);
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Phone Call Reminders</h2>
      <p className="mb-4">
        Enter your phone number to receive automated call reminders for upcoming events.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+1234567890"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-primary text-black rounded hover:bg-primary-dark transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Phone Number'}
        </button>
        {success && (
          <p className="text-green-600">Phone number saved successfully!</p>
        )}
        {error && (
          <p className="text-red-500">{error}</p>
        )}
      </form>
    </div>
  )
}