import { Card, CardContent } from "@/components/ui/card";
import { HOW_IT_WORKS_ITEMS } from "@/lib/data";
import { 
  UserPlus, 
  MapPin, 
  Handshake, 
  Shield, 
  Calendar, 
  CreditCard,
  MessageCircle,
  Star
} from "lucide-react";

export default function HowItWorks() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "user-plus":
        return <UserPlus className="h-6 w-6" />;
      case "map-pin":
        return <MapPin className="h-6 w-6" />;
      case "handshake":
        return <Handshake className="h-6 w-6" />;
      default:
        return <UserPlus className="h-6 w-6" />;
    }
  };

  const additionalInfo = [
    {
      title: "Verified Profiles",
      description: "We verify all student profiles through university email addresses and student IDs to ensure a trusted community.",
      icon: <Shield className="h-6 w-6 text-blue-500" />
    },
    {
      title: "Flexible Scheduling",
      description: "Set up one-time rides or create recurring trips that match your class schedule each semester.",
      icon: <Calendar className="h-6 w-6 text-green-500" />
    },
    {
      title: "Easy Payments",
      description: "Split costs fairly with our integrated payment system. No more awkward conversations about money.",
      icon: <CreditCard className="h-6 w-6 text-purple-500" />
    },
    {
      title: "In-app Messaging",
      description: "Communicate safely with other riders through our secure messaging system without sharing personal contact details.",
      icon: <MessageCircle className="h-6 w-6 text-amber-500" />
    },
    {
      title: "Community Ratings",
      description: "Build trust through our rating system. Higher-rated drivers and passengers get priority matching.",
      icon: <Star className="h-6 w-6 text-teal-500" />
    }
  ];

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            How TripSync Works
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Quick, easy, and safe carpooling for students
          </p>
        </div>

        {/* Main steps */}
        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {HOW_IT_WORKS_ITEMS.map((item, idx) => (
              <Card key={idx} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-md ${item.bgColor} flex items-center justify-center ${item.textColor} mb-4`}>
                    {getIcon(item.icon)}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-base text-gray-500">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional features */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Features That Make TripSync Special
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalInfo.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-start">
                  <div className="mt-1 mr-4">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety information */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-primary-50 p-8 rounded-lg border border-blue-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Your Safety Is Our Priority
          </h3>
          <p className="text-gray-700 mb-6">
            TripSync is committed to creating a safe carpooling environment for all university students.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white bg-opacity-80 p-5 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Before The Ride</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Student ID verification for all users</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Driver's license and vehicle registration validation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Transparent driver and passenger profiles with ratings</span>
                </li>
              </ul>
            </div>
            <div className="bg-white bg-opacity-80 p-5 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">During The Ride</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Real-time ride tracking shared with emergency contacts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>One-tap emergency button connected to campus security</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Direct line to 24/7 TripSync support team</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
