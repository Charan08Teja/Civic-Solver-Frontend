import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import API from '../api/axios';
import CategoryBadge from '../components/CategoryBadge';

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map bounds fitting
function FitBounds({ issues, userLocation, locateMe, setLocateMe }) {
  const map = useMap();

  useEffect(() => {
    if (locateMe && userLocation) {
      map.setView(userLocation, 12);
      setLocateMe(false); // Reset after centering
      return;
    }

    if (issues.length === 0) {
      // No issues, use default center
      map.setView([17.385, 78.486], 12);
      return;
    }

    if (issues.length === 1) {
      // Single issue, center on it
      const issue = issues[0];
      const lat = parseFloat(issue.latitude);
      const lng = parseFloat(issue.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        map.setView([lat, lng], 12);
      }
      return;
    }

    // Multiple issues, fit bounds
    const bounds = issues
      .map(issue => {
        const lat = parseFloat(issue.latitude);
        const lng = parseFloat(issue.longitude);
        return !isNaN(lat) && !isNaN(lng) ? [lat, lng] : null;
      })
      .filter(coord => coord !== null);

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [20, 20], animate: true });
    }
  }, [issues, userLocation, locateMe, map, setLocateMe]);

  return null;
}

function MapView() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locateMe, setLocateMe] = useState(false);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.warn('Geolocation error:', error);
        }
      );
    }

    // Fetch issues
    const fetchIssues = async () => {
      try {
        const response = await API.get('/issues');
        const validIssues = response.data.filter(issue => {
          const lat = parseFloat(issue.latitude);
          const lng = parseFloat(issue.longitude);
          return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
        });
        setIssues(validIssues);
      } catch (err) {
        setError('Failed to load issues');
        console.error('Error fetching issues:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const handleLocateMe = () => {
    if (userLocation) {
      setLocateMe(true);
    } else {
      alert('User location not available');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Issue Map</h1>
            <p className="text-gray-600 mt-1">View all reported civic issues on the map</p>
          </div>

          <div className="relative">
            <MapContainer
              style={{ height: '80vh', width: '100%' }}
              className="rounded-b-xl"
            >
              <FitBounds issues={issues} userLocation={userLocation} locateMe={locateMe} setLocateMe={setLocateMe} />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MarkerClusterGroup>
                {issues.map((issue) => (
                  <Marker
                    key={issue.id}
                    position={[parseFloat(issue.latitude), parseFloat(issue.longitude)]}
                  >
                    <Popup>
                      <div className="max-w-sm">
                        {issue.imageUrl && (
  <img
    src={
      issue.imageUrl.startsWith("/")
        ? `https://civic-solver-backend.onrender.com${issue.imageUrl}`
        : `https://civic-solver-backend.onrender.com/${issue.imageUrl}`
    }
    alt={issue.title}
    className="w-full h-32 object-cover rounded-lg mb-3"
  />
)}
                        <h3 className="font-semibold text-gray-900 mb-2">{issue.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{issue.description}</p>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                            {issue.status}
                          </span>
                          {issue.category && <CategoryBadge category={issue.category} />}
                          <span className="text-sm text-gray-500">
                            👍 {issue._count?.upvotes || 0}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">Reported by {issue.user?.name || 'Anonymous'}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
            </MapContainer>

            <button
              onClick={handleLocateMe}
              className="absolute top-4 right-4 z-[1000] bg-white hover:bg-gray-50 border border-gray-300 rounded-lg p-3 shadow-lg transition-colors"
              title="Locate Me"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          {issues.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-500">No issues to display on the map.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MapView;