// // frontend/pages/api/proxy/[...path].js
// export default async function handler(req, res) {
//   const path = req.query.path.join('/');
//   const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`;

//   try {
//     const response = await fetch(backendUrl, {
//       method: req.method,
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': req.headers.authorization || ''
//       },
//       body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
//     });

//     const data = await response.json();
//     res.status(response.status).json(data);
//   } catch (error) {
//     res.status(500).json({ message: 'Internal server error' });
//   }
// }
import axios from 'axios';

export default async function handler(req, res) {
  const pathSegments = req.query.path || [];
  const backendPath = pathSegments.join('/');
  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${backendPath}`;
  
  // Clone headers and remove problematic ones
  const headers = { ...req.headers };
  delete headers['content-type'];
  delete headers['content-length'];
  delete headers.host;
  delete headers.connection;

  try {
    const axiosConfig = {
      method: req.method,
      url: backendUrl,
      headers: {
        ...headers,
        'Accept': 'application/json',
        'Authorization': headers.authorization || ''
      },
      params: req.query,
      
      data: req.method !== 'GET' ? req.body : undefined
    };

    
    if (req.method === 'GET') {
      
      delete axiosConfig.data;
    }

    const response = await axios(axiosConfig);

    // Forward the response from the backend
    res.status(response.status).json(response.data);
  } catch (error) {
    
    if (error.response) {
      const { status, data } = error.response;
      return res.status(status).json(data);
    }
    
    
    console.error('Proxy error:', {
      url: backendUrl,
      method: req.method,
      error: error.message
    });
    
    res.status(500).json({ 
      message: 'Proxy to backend failed',
      error: error.message,
      backendUrl
    });
  }
}