import { Helmet } from "react-helmet";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { 
  Shield, 
  Users, 
  UserCheck, 
  Phone, 
  MessageCircle, 
  Star, 
  AlertTriangle, 
  Check, 
  Car 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Safety() {
  return (
    <>
      <Helmet>
        <title>Safety | TripSync</title>
        <meta name="description" content="Learn about TripSync's commitment to safety and security for all users." />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <div className="bg-primary py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <Shield className="h-16 w-16 text-white mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white">Your Safety is Our Priority</h1>
              <p className="mt-4 text-lg text-indigo-100 max-w-3xl mx-auto">
                At TripSync, we've built our platform with safety as the cornerstone. We provide tools, policies, and resources to help make sure every ride is secure and comfortable.
              </p>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <UserCheck className="h-10 w-10 text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Profiles</h3>
                  <p className="text-gray-600">
                    Every driver and passenger on TripSync must verify their identity and university affiliation. Know who you're riding with.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <Star className="h-10 w-10 text-purple-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Ratings</h3>
                  <p className="text-gray-600">
                    After each ride, you can rate your experience. Our transparent rating system builds trust within our community.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6">
                  <MessageCircle className="h-10 w-10 text-green-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Messaging</h3>
                  <p className="text-gray-600">
                    Our in-app messaging system lets you communicate without sharing your personal contact information.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8 mb-16">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Before Every Ride</h2>
                  <ul className="space-y-4">
                    <li className="flex">
                      <Check className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">Verify the driver's profile and rating</span>
                    </li>
                    <li className="flex">
                      <Check className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">Check the vehicle details match what's listed in the app</span>
                    </li>
                    <li className="flex">
                      <Check className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">Share your ride details with a trusted friend</span>
                    </li>
                    <li className="flex">
                      <Check className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">Use the in-app chat to confirm meeting point</span>
                    </li>
                    <li className="flex">
                      <Check className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">Trust your instincts - if something feels wrong, cancel the ride</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Driver Requirements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                      <Car className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Vehicle Standards</h3>
                      <p className="text-gray-600">
                        All vehicles must be in good condition, clean, and no more than 15 years old. Regular maintenance is required for driver accounts to remain active.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-4 flex-shrink-0">
                      <UserCheck className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Thorough Verification</h3>
                      <p className="text-gray-600">
                        Drivers must provide valid identification, proof of university affiliation, and a valid driver's license. We verify all documents before approval.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-4 flex-shrink-0">
                      <Star className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Rating System</h3>
                      <p className="text-gray-600">
                        Drivers must maintain a minimum 4.0 rating to stay on the platform. This ensures high-quality service for all passengers.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-4 flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Zero Tolerance Policy</h3>
                      <p className="text-gray-600">
                        We have a zero tolerance policy for unsafe behavior, including speeding, driving under the influence, or harassment. Violations result in immediate removal.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-16">
              <h2 className="text-xl font-bold text-red-700 mb-4 flex items-center">
                <AlertTriangle className="h-6 w-6 mr-2" />
                In Case of Emergency
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Emergency Services</p>
                    <p className="text-sm text-gray-600">Dial 911 for immediate emergency assistance</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">TripSync Support Hotline</p>
                    <p className="text-sm text-gray-600">+63 (2) 8888-9999 (24/7 Support)</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="destructive" className="mt-2">
                  Emergency Help Center
                </Button>
              </div>
            </div>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">We're Committed to Your Safety</h2>
              <p className="text-gray-600 max-w-3xl mx-auto mb-6">
                TripSync continues to innovate and improve our safety features. We welcome your feedback and suggestions to make our platform the safest way for university students to travel together.
              </p>
              <Button size="lg" className="mt-2">
                <Shield className="h-5 w-5 mr-2" />
                Learn More About Our Safety Features
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}