import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { motion } from 'framer-motion';
import { MapPin, Filter, Navigation, Eye, EyeOff, X, Search } from 'lucide-react';
import L from 'leaflet';
import API from '../api/axios';
import CategoryBadge from '../components/CategoryBadge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { Input } from '../components/ui/input';

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
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locateMe, setLocateMe] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [filters, setFilters] = useState({
    status: 'ALL',
    category: 'ALL',
    search: '',
  });

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
        setFilteredIssues(validIssues);
      } catch (err) {
        setError('Failed to load issues');
        console.error('Error fetching issues:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  useEffect(() => {
    let filtered = issues;

    // Apply status filter
    if (filters.status !== 'ALL') {
      filtered = filtered.filter(issue => issue.status === filters.status);
    }

    // Apply category filter
    if (filters.category !== 'ALL') {
      filtered = filtered.filter(issue => issue.category === filters.category);
    }

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(issue =>
        issue.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        issue.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredIssues(filtered);
  }, [issues, filters]);

  const handleLocateMe = () => {
    if (userLocation) {
      setLocateMe(true);
    } else {
      alert('User location not available');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'RESOLVED': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const categories = ['POTHOLE', 'GARBAGE', 'WATER_LEAKAGE', 'STREETLIGHT', 'ROAD_DAMAGE', 'OTHER'];
  const statuses = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'PENDING'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Map Error
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative">
      {/* Floating Control Panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-4 left-4 z-[1000] space-y-2"
      >
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowControls(!showControls)}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg"
        >
          {showControls ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>

        {showControls && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-2"
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLocateMe}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg"
              title="Locate Me"
            >
              <Navigation className="h-4 w-4" />
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg"
                  title="Filters"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filter Issues</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search issues..."
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {statuses.map((status) => (
                        <Button
                          key={status}
                          variant={filters.status === status ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFilters(prev => ({ ...prev, status }))}
                        >
                          {status === 'ALL' ? 'All' : status.replace('_', ' ')}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={filters.category === 'ALL' ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilters(prev => ({ ...prev, category: 'ALL' }))}
                      >
                        All
                      </Button>
                      {categories.map((category) => (
                        <Button
                          key={category}
                          variant={filters.category === category ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFilters(prev => ({ ...prev, category }))}
                        >
                          {category.replace('_', ' ')}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setFilters({ status: 'ALL', category: 'ALL', search: '' })}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </motion.div>
        )}
      </motion.div>

      {/* Map Container */}
      <MapContainer
        style={{ height: '100vh', width: '100%' }}
        className="z-0"
      >
        <FitBounds issues={filteredIssues} userLocation={userLocation} locateMe={locateMe} setLocateMe={setLocateMe} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MarkerClusterGroup>
          {filteredIssues.map((issue) => (
            <Marker
              key={issue.id}
              position={[parseFloat(issue.latitude), parseFloat(issue.longitude)]}
            >
              <Popup>
                <Card className="border-0 shadow-lg max-w-sm">
                  <CardContent className="p-0">
                    {issue.imageUrl && (
                      <div className="relative">
                        <img
                          src={
                            issue.imageUrl.startsWith("http")
                              ? issue.imageUrl
                              : `https://civic-solver-backend.onrender.com/${issue.imageUrl}`
                          }
                          alt={issue.title}
                          className="w-full h-32 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-2 left-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${getStatusColor(issue.status)}`}>
                            {issue.status}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {issue.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3">
                        {issue.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                        <span>By {issue.user?.name || 'Anonymous'}</span>
                        <span>👍 {issue._count?.upvotes || 0}</span>
                      </div>
                      {issue.category && (
                        <CategoryBadge category={issue.category} />
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3"
                        onClick={() => window.open(`/issue/${issue.id}`, '_blank')}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {/* Issues Count */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-4 right-4 z-[1000]"
      >
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="font-medium">{filteredIssues.length} issues</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default MapView;