// import { useState, useEffect } from 'react'
// import axios from 'axios'
// import { useAuth } from '@/utils/auth'

// export default function EventList() {
//   const { user, logout } = useAuth()
//   const [events, setEvents] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     if (user) {
//       fetchEvents()
//     }
//   }, [user])

//   const fetchEvents = async () => {
//   try {
//     setLoading(true);
//     setError(null);
    
//     const res = await axios.get('/api/proxy/api/calendar/events', {
//       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//     });
    
//     setEvents(res.data.events || []);
//   } catch (err) {
//     let errorMsg = 'Failed to fetch events. Please try again.';
    
//     // Handle specific error cases
//     if (err.response?.status === 401) {
//       errorMsg = 'Authentication expired. Please log in again.';
//       logout(); // Trigger logout
//     } 
//     else if (err.response?.data?.message) {
//       errorMsg = err.response.data.message;
//     }
    
//     setError(errorMsg);
//   } finally {
//     setLoading(false);
//   }
// }
//   const formatDate = (dateString) => {
//     const options = { 
//       weekday: 'long', 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     }
//     return new Date(dateString).toLocaleDateString('en-US', options)
//   }

//   return (
//     <div className="mt-8">
//       <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
//       {loading ? (
//         <p>Loading events...</p>
//       ) : error ? (
//         <p className="text-red-500">{error}</p>
//       ) : events.length === 0 ? (
//         <p>No upcoming events found.</p>
//       ) : (
//         <div className="space-y-4">
//           {events.map((event) => (
//             <div key={event.id} className="p-4 border rounded-lg shadow-sm">
//               <h3 className="font-medium text-lg">{event.summary}</h3>
//               <p className="text-gray-600">
//                 {formatDate(event.start.dateTime || event.start.date)}
//               </p>
//               {event.description && (
//                 <p className="mt-2 text-gray-700">{event.description}</p>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '@/utils/auth'

export default function EventList() {
  const { user, logout } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  
  useEffect(() => {
    console.log("Events received:", events);
    
    
    events.forEach((event, index) => {
      console.log(`Event #${index + 1}:`, {
        id: event.id,
        summary: event.summary,
        start: event.start,
        end: event.end,
        status: event.status
      });
    });
  }, [events]);

  useEffect(() => {
    if (user) {
      fetchEvents()
    }
  }, [user])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await axios.get('/api/proxy/api/calendar/events', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setEvents(res.data.events || [])
    } catch (err) {
      let errorMsg = 'Failed to fetch events. Please try again.';
      
      
      if (err.response?.status === 401) {
        errorMsg = 'Authentication expired. Please log in again.';
        logout();
      } 
      else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      else if (err.message.includes('Network Error')) {
        errorMsg = 'Network error. Check your connection.';
      }
      
      setError(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Time not specified";
    
    try {
      const dateObj = new Date(dateString);
      return dateObj.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      console.error("Date formatting error:", e);
      return "Invalid date";
    }
  }

  const refreshEvents = () => {
    fetchEvents();
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Upcoming Events</h2>
        <button
          onClick={refreshEvents}
          disabled={loading}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2">Loading events...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700 font-medium">{error}</p>
          <button 
            onClick={fetchEvents}
            className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
          >
            Retry
          </button>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-center">
          <p>No upcoming events found.</p>
          {/* <p className="text-sm text-gray-600 mt-1">
            Create events in your Google Calendar to see them here.
          </p> */}
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="p-4 border rounded-lg shadow-sm bg-white">
              <h3 className="font-medium text-lg">
                {event.summary || 'Untitled Event'}
              </h3>
              
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Starts:</span>{' '}
                  <span className="font-medium">
                    {formatDate(event.start?.dateTime || event.start?.date)}
                  </span>
                </div>
                
                {event.end && (
                  <div>
                    <span className="text-gray-600">Ends:</span>{' '}
                    <span className="font-medium">
                      {formatDate(event.end?.dateTime || event.end?.date)}
                    </span>
                  </div>
                )}
                
                {event.location && (
                  <div className="md:col-span-2">
                    <span className="text-gray-600">Location:</span>{' '}
                    <span className="font-medium">{event.location}</span>
                  </div>
                )}
              </div>
              
              {event.description && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}