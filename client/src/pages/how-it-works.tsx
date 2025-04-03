import { Helmet } from "react-helmet";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { 
  UserPlus, 
  MapPin, 
  Handshake, 
  Shield, 
  Calendar, 
  CreditCard,
  MessageCircle,
  Star,
  Clock,
  Bell,
  Lock,
  Users,
  Activity,
  AlertTriangle,
  PhoneCall,
  Check
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

interface HowItWorksStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  details: string[];
}

interface SafetyTip {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function HowItWorksPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    // Retrieve the visit count from localStorage
    const storedCount = localStorage.getItem('howItWorksVisits');
    const currentCount = storedCount ? parseInt(storedCount) : 0;
    setVisitCount(currentCount);
    
    // Increment the count and save it back
    localStorage.setItem('howItWorksVisits', (currentCount + 1).toString());
    
    // If first time visitor, track this in analytics (mock implementation)
    if (currentCount === 0) {
      console.log('First time visitor to How It Works page');
    }
  }, []);

  const steps: HowItWorksStep[] = [
    {
      id: 1,
      title: "Create Your Profile",
      description: "Sign up and verify your university email to join our trusted network",
      icon: <UserPlus className="h-8 w-8 text-white" />,
      details: [
        "Register with your university email address",
        "Complete your profile with required details",
        "Verify your student ID through our secure system",
        "Add emergency contacts for safety purposes"
      ]
    },
    {
      id: 2,
      title: "Find or Offer Rides",
      description: "Search for available rides or offer your own to fellow students",
      icon: <MapPin className="h-8 w-8 text-white" />,
      details: [
        "Browse available rides filtered by university, time, and location",
        "View driver ratings and reviews before booking",
        "Offer your own ride by setting route, time, and available seats",
        "Set recurring rides that match your class schedule"
      ]
    },
    {
      id: 3,
      title: "Confirm & Connect",
      description: "Book your ride and communicate through our secure platform",
      icon: <Handshake className="h-8 w-8 text-white" />,
      details: [
        "Request to join a ride with just a few clicks",
        "Drivers receive notifications and can approve requests",
        "Use our in-app messaging to coordinate details",
        "Track your ride in real-time on the day of travel"
      ]
    },
    {
      id: 4,
      title: "Travel & Pay",
      description: "Enjoy your ride and handle payments securely through our system",
      icon: <CreditCard className="h-8 w-8 text-white" />,
      details: [
        "Receive pickup notifications as your ride approaches",
        "Track your journey in real-time",
        "Pay your share through our secure payment system",
        "Split costs fairly among all passengers"
      ]
    },
    {
      id: 5,
      title: "Rate & Review",
      description: "Give feedback to help build our trusted community",
      icon: <Star className="h-8 w-8 text-white" />,
      details: [
        "Rate your experience after each ride",
        "Leave detailed reviews for drivers and passengers",
        "Help others make informed decisions",
        "Build your own reputation as a reliable community member"
      ]
    }
  ];

  const safetyTips: SafetyTip[] = [
    {
      id: 1,
      title: "Verify Profiles",
      description: "Always check driver ratings and reviews before booking a ride.",
      icon: <Shield className="h-6 w-6 text-primary" />
    },
    {
      id: 2,
      title: "Share Your Trip",
      description: "Use the 'Share Trip Status' feature to let friends know your travel plans.",
      icon: <Users className="h-6 w-6 text-primary" />
    },
    {
      id: 3,
      title: "Stay on Platform",
      description: "Keep all communications and payments within the TripSync app.",
      icon: <Lock className="h-6 w-6 text-primary" />
    },
    {
      id: 4,
      title: "Arrive on Time",
      description: "Be punctual and notify others of any delays through the app.",
      icon: <Clock className="h-6 w-6 text-primary" />
    },
    {
      id: 5,
      title: "Emergency Button",
      description: "Use the SOS button in an emergency to alert your contacts and our team.",
      icon: <AlertTriangle className="h-6 w-6 text-primary" />
    },
    {
      id: 6,
      title: "Support Line",
      description: "Our support team is available 24/7 through the Help Center.",
      icon: <PhoneCall className="h-6 w-6 text-primary" />
    }
  ];

  const handleGetStarted = () => {
    if (!user) {
      navigate("/auth");
    } else {
      navigate("/find-ride");
    }
  };

  return (
    <>
      <Helmet>
        <title>How TripSync Works | TripSync</title>
        <meta name="description" content="Learn how to use TripSync to find and share rides at your university. A detailed guide to our carpooling platform." />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <div className="bg-gradient-to-r from-primary to-primary-dark py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl font-extrabold text-white mb-4">How TripSync Works</h1>
              <p className="mt-2 text-xl text-white/80 max-w-3xl mx-auto">
                A simple guide to using our university carpooling platform
              </p>
              {visitCount > 0 && (
                <Badge variant="outline" className="mt-4 bg-white/10 text-white hover:bg-white/20">
                  You've visited this page {visitCount} times
                </Badge>
              )}
            </div>
          </div>
          
          {/* Main steps section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-16">
              {steps.map((step) => (
                <Card key={step.id} className="overflow-hidden h-full flex flex-col">
                  <div className="bg-primary p-4 flex items-center justify-center">
                    <div className="bg-primary-dark rounded-full p-4">
                      {step.icon}
                    </div>
                  </div>
                  <CardContent className="p-6 flex-grow flex flex-col">
                    <div className="flex items-center mb-4">
                      <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                        {step.id}
                      </div>
                      <h3 className="text-lg font-bold">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    <div className="mt-auto">
                      <ul className="space-y-2 text-sm">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start">
                            <div className="h-5 w-5 text-primary mt-0.5 mr-2">•</div>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Video tutorial */}
            <div className="bg-gray-50 rounded-lg p-8 mb-16">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Video Tutorial</h2>
                <p className="mt-2 text-lg text-gray-600">Watch our quick guide to get started</p>
              </div>
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center p-8">
                  <Activity className="h-16 w-16 text-primary/50 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Video demonstration will be available soon. Subscribe to our channel for updates!
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs for different user types */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-8">Personalized Guide</h2>
              <Tabs defaultValue="passenger">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="passenger">For Passengers</TabsTrigger>
                  <TabsTrigger value="driver">For Drivers</TabsTrigger>
                </TabsList>
                <TabsContent value="passenger" className="p-4 bg-blue-50 rounded-lg">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-bold mb-4">Finding the Perfect Ride</h3>
                      <ol className="space-y-4">
                        <li className="flex">
                          <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">1</span>
                          <div>
                            <p className="font-medium">Enter your destination</p>
                            <p className="text-gray-600 text-sm">Use the search tool to find rides going to your destination.</p>
                          </div>
                        </li>
                        <li className="flex">
                          <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">2</span>
                          <div>
                            <p className="font-medium">Filter by time and price</p>
                            <p className="text-gray-600 text-sm">Narrow down options based on your schedule and budget.</p>
                          </div>
                        </li>
                        <li className="flex">
                          <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">3</span>
                          <div>
                            <p className="font-medium">Review driver profiles</p>
                            <p className="text-gray-600 text-sm">Check ratings, reviews, and vehicle details before booking.</p>
                          </div>
                        </li>
                        <li className="flex">
                          <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">4</span>
                          <div>
                            <p className="font-medium">Book and pay</p>
                            <p className="text-gray-600 text-sm">Request your seat and pay through our secure system.</p>
                          </div>
                        </li>
                      </ol>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-4">Passenger Etiquette</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                          <span>Be punctual for pickup times</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                          <span>Notify the driver if you're running late</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                          <span>Respect the driver's vehicle and rules</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                          <span>Keep conversation respectful and inclusive</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                          <span>Complete payment promptly after the ride</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                          <span>Leave an honest review of your experience</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="driver" className="p-4 bg-green-50 rounded-lg">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-bold mb-4">Offering Rides Successfully</h3>
                      <ol className="space-y-4">
                        <li className="flex">
                          <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">1</span>
                          <div>
                            <p className="font-medium">Verify your driver profile</p>
                            <p className="text-gray-600 text-sm">Upload your license, insurance, and vehicle details.</p>
                          </div>
                        </li>
                        <li className="flex">
                          <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">2</span>
                          <div>
                            <p className="font-medium">Create clear ride listings</p>
                            <p className="text-gray-600 text-sm">Specify pickup point, destination, time, and price.</p>
                          </div>
                        </li>
                        <li className="flex">
                          <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">3</span>
                          <div>
                            <p className="font-medium">Set a fair price</p>
                            <p className="text-gray-600 text-sm">Use our price estimator to suggest reasonable rates.</p>
                          </div>
                        </li>
                        <li className="flex">
                          <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">4</span>
                          <div>
                            <p className="font-medium">Manage bookings</p>
                            <p className="text-gray-600 text-sm">Review and approve passenger requests.</p>
                          </div>
                        </li>
                      </ol>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-4">Driver Responsibilities</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                          <span>Keep your vehicle clean and well-maintained</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                          <span>Drive safely and follow all traffic laws</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                          <span>Be punctual for pickup times</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                          <span>Communicate clearly with passengers</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                          <span>Follow the agreed-upon route</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                          <span>Rate passengers to help build community trust</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Safety Tips */}
            <div className="mb-16">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Safety First</h2>
                <p className="mt-2 text-lg text-gray-600">Your safety is our top priority</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {safetyTips.map((tip) => (
                  <Card key={tip.id} className="h-full flex flex-col">
                    <CardContent className="p-6 flex-grow">
                      <div className="flex items-start">
                        <div className="rounded-full bg-primary/10 p-3 mr-4 flex-shrink-0">
                          {tip.icon}
                        </div>
                        <div>
                          <h3 className="font-bold mb-2">{tip.title}</h3>
                          <p className="text-gray-600 text-sm">{tip.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mb-16">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
                <p className="mt-2 text-lg text-gray-600">Find answers to common questions</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">How is payment handled?</h3>
                  <p className="text-gray-600">
                    Payments are processed securely through our platform. Passengers pay when booking, 
                    and drivers receive payment after the ride is completed. We hold the payment until 
                    the ride is confirmed complete to ensure a fair system for everyone.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">What if I need to cancel?</h3>
                  <p className="text-gray-600">
                    Cancellations can be made up to 2 hours before the scheduled pickup time with no penalty. 
                    Late cancellations may incur a small fee. Drivers who cancel frequently may have their 
                    accounts restricted.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">How are drivers verified?</h3>
                  <p className="text-gray-600">
                    All drivers must verify their identity, student status, and provide valid vehicle 
                    registration and insurance. We also conduct periodic safety checks to ensure all 
                    vehicles meet our standards.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Is my data secure?</h3>
                  <p className="text-gray-600">
                    Yes, we use industry-standard encryption to protect your personal information. 
                    We never share your contact details with other users without your permission, 
                    and all communication happens through our secure platform.
                  </p>
                </div>
              </div>
            </div>

            {/* Get Started CTA */}
            <div className="bg-primary text-white rounded-lg p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="mb-6 max-w-2xl mx-auto">
                Join thousands of students already using TripSync to make their daily commute cheaper, 
                greener, and more social. It only takes a minute to sign up!
              </p>
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="bg-white text-primary hover:bg-gray-100"
              >
                {user ? "Find a Ride Now" : "Sign Up & Start Riding"}
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}