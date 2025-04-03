import { UNIVERSITIES } from "@/lib/data";
import { MapPin } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function UniversityPartners() {
  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Partner Universities
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            TripSync is officially partnered with these universities to provide safe transportation options for students.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {UNIVERSITIES.map((university) => (
            <div key={university.id} className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={university.campus} 
                  alt={`${university.name} campus`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <div className="bg-white rounded-full p-3 w-64 h-24 flex items-center justify-center">
                    <img 
                      src={university.logo} 
                      alt={`${university.name} logo`} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold">{university.name}</h3>
                <div className="flex items-start text-gray-500 mt-2 mb-3">
                  <MapPin className="h-4 w-4 mt-1 mr-2 flex-shrink-0" />
                  <span>{university.location}</span>
                </div>
                <p className="text-gray-600 mb-4">{university.description}</p>
                <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                  <div className="text-center bg-blue-50 p-2 rounded-lg">
                    <div className="font-bold text-blue-600">98</div>
                    <div className="text-gray-500">Rides</div>
                  </div>
                  <div className="text-center bg-green-50 p-2 rounded-lg">
                    <div className="font-bold text-green-600">32</div>
                    <div className="text-gray-500">Drivers</div>
                  </div>
                  <div className="text-center bg-purple-50 p-2 rounded-lg">
                    <div className="font-bold text-purple-600">145</div>
                    <div className="text-gray-500">Riders</div>
                  </div>
                </div>
                <Link href={`/find-ride?university=${encodeURIComponent(university.name)}`}>
                  <Button variant="default" className="w-full">
                    Find Rides
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
