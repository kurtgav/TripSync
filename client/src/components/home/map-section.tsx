import { MAP_FEATURES } from "@/lib/data";
import { Route, Bell, Shield, Car, Navigation, Map } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

export default function MapSection() {
  const { user } = useAuth();
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [coordinates, setCoordinates] = useState({
    latitude: "14.5000",
    longitude: "121.0000"
  });
  
  // Sample nearby rides data - in a real app, this would come from an API
  const nearbyRides = [
    { id: 1, lat: 14.42, lng: 121.03, university: "MMCL", driverName: "Kurt G.", seats: 3 },
    { id: 2, lat: 14.56, lng: 121.08, university: "UST", driverName: "Maria L.", seats: 2 },
    { id: 3, lat: 14.48, lng: 120.98, university: "DLSU", driverName: "John D.", seats: 1 }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "route":
        return <Route className="h-5 w-5" />;
      case "bell":
        return <Bell className="h-5 w-5" />;
      case "shield":
        return <Shield className="h-5 w-5" />;
      default:
        return <Route className="h-5 w-5" />;
    }
  };

  // Simulate loading the map
  useEffect(() => {
    // Simulate map loading delay
    const timer = setTimeout(() => {
      setMapLoaded(true);
      // Set some sample coordinates
      setCoordinates({
        latitude: "14.5642",
        longitude: "121.0614"
      });
    }, 1500);
    
    // Simulate real-time updates
    let movementTimer: NodeJS.Timeout;
    if (mapLoaded) {
      movementTimer = setInterval(() => {
        setCoordinates(prev => {
          const lat = parseFloat(prev.latitude);
          const lng = parseFloat(prev.longitude);
          return {
            latitude: (lat + (Math.random() * 0.002 - 0.001)).toFixed(4),
            longitude: (lng + (Math.random() * 0.002 - 0.001)).toFixed(4)
          };
        });
      }, 4000);
    }
    
    return () => {
      clearTimeout(timer);
      if (movementTimer) clearInterval(movementTimer);
    };
  }, [mapLoaded]);

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="lg:w-1/2 lg:pr-8">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Real-Time Tracking
            </h2>
            <p className="mt-3 max-w-lg text-lg text-gray-500">
              Our interactive map shows nearby rides and provides real-time location sharing during your journey for added safety and convenience.
            </p>
            
            {mapLoaded && (
              <div className="mt-4 mb-6">
                <Badge variant="outline" className="mb-2 bg-blue-50 text-blue-700 border-blue-200">
                  <Map className="h-3 w-3 mr-1" /> Current position: {coordinates.latitude}, {coordinates.longitude}
                </Badge>
                <div className="text-sm text-gray-500">
                  Click on a car marker to view available rides near you
                </div>
              </div>
            )}
            
            <div className="mt-8 space-y-4">
              {MAP_FEATURES.map((feature, idx) => (
                <div key={idx} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary">
                      {getIcon(feature.icon)}
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                    <p className="mt-2 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <Link href="/find-ride">
                <Button className="bg-primary hover:bg-primary/90">
                  <Car className="h-4 w-4 mr-2" />
                  Find Nearby Rides
                </Button>
              </Link>
            </div>
          </div>
          <div className="mt-8 lg:mt-0 lg:w-1/2">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <div className="bg-white p-2">
                <div 
                  ref={mapContainer} 
                  className="h-96 w-full rounded relative"
                  style={{ 
                    backgroundColor: '#e9ecef',
                    backgroundImage: mapLoaded ? 
                      `url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/121.0,14.5,9,0/800x500?access_token=${import.meta.env.MAPBOX_ACCESS_TOKEN}')` : 
                      'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {!mapLoaded ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
                      <div className="text-center">
                        <Navigation className="h-10 w-10 mx-auto mb-2 text-primary animate-pulse" />
                        <p className="text-gray-700">Loading map...</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Static map with markers */}
                      <div className="absolute top-4 left-4 bg-white shadow-md rounded-md p-2">
                        <div className="flex space-x-2">
                          <button className="p-1 rounded bg-primary text-white">
                            <Route className="h-4 w-4" />
                          </button>
                          <button className="p-1 rounded bg-gray-200 text-gray-600 hover:bg-gray-300">
                            <Bell className="h-4 w-4" />
                          </button>
                          <button className="p-1 rounded bg-gray-200 text-gray-600 hover:bg-gray-300">
                            <Shield className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Simulated car markers */}
                      {nearbyRides.map((ride, index) => (
                        <div 
                          key={ride.id}
                          className="absolute animate-pulse" 
                          style={{ 
                            top: `${40 + (index * 15)}%`, 
                            left: `${30 + (index * 20)}%`,
                            transition: 'all 0.5s ease-in-out' 
                          }}
                        >
                          <div className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center shadow-md">
                            <Car className="h-4 w-4" />
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white px-2 py-1 rounded shadow-sm text-xs whitespace-nowrap">
                            {ride.university}
                          </div>
                        </div>
                      ))}
                      
                      <div className="absolute bottom-4 right-4">
                        <button className="bg-white p-2 rounded-full shadow-md">
                          <Navigation className="h-5 w-5 text-primary" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-medium">Nearby drivers</h3>
                <div className="mt-2 space-y-2">
                  {nearbyRides.map(ride => (
                    <div key={ride.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <div className="font-medium">{ride.driverName}</div>
                        <div className="text-sm text-gray-500">{ride.university} • {ride.seats} seats</div>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
