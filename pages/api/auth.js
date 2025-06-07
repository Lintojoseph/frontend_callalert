import axios from 'axios'

export default async function handler(req, res) {
  const { method, headers, body } = req
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  try {
    // Handle GET /api/auth/me
    if (method === 'GET' && req.url.includes('/api/auth/me')) {
      const response = await axios.get(`${backendUrl}/auth/me`, {
        headers: { Authorization: headers.authorization }
      })
      return res.status(200).json(response.data)
    }

    // Handle POST /api/auth/phone
    if (method === 'POST' && req.url.includes('/api/auth/phone')) {
      const response = await axios.post(`${backendUrl}/auth/phone`, body, {
        headers: { Authorization: headers.authorization }
      })
      return res.status(200).json(response.data)
    }

    // Handle other routes
    res.status(404).json({ message: 'Not found' })
  } catch (error) {
    console.error('API route error:', error)
    
    // More detailed error response
    const status = error.response?.status || 500
    const message = error.response?.data?.message || 
                    error.message || 
                    'Internal server error'
    
    res.status(status).json({ message })
  }
}