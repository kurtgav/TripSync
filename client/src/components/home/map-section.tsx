import { MAP_FEATURES } from "@/lib/data";
import { Route, Bell, Shield } from "lucide-react";

export default function MapSection() {
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
          </div>
          <div className="mt-8 lg:mt-0 lg:w-1/2">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <div className="bg-white p-2">
                <div className="h-96 rounded relative overflow-hidden" style={{ 
                  backgroundImage: "url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/121.0,14.5,9,0/800x500?access_token=pk.eyJ1IjoiZGVtbzEyMzQiLCJhIjoiY2t4eHBlbnRqMjc2aDJ3cWx2ZnlhbHdjaiJ9.mJUVS6o0hjZ9d3oGkUJzMQ')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}>
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
                  <div className="absolute bottom-4 right-4">
                    <button className="bg-white p-2 rounded-full shadow-md">
                      <Route className="h-5 w-5 text-primary" />
                    </button>
                  </div>
                  {/* Car markers on map */}
                  <div className="absolute" style={{ top: '40%', left: '30%' }}>
                    <div className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center shadow-md">
                      <Route className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="absolute" style={{ top: '60%', left: '60%' }}>
                    <div className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center shadow-md">
                      <Route className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
