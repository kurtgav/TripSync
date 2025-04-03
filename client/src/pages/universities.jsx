import { Helmet } from "react-helmet";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { 
  GraduationCap, 
  MapPin, 
  Users, 
  BookOpen, 
  Clock, 
  Check, 
  Car,
  ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { UNIVERSITIES } from "@/lib/data";

// Import university assets
import mmclLogoPath from "@assets/mmcl-logo.png";
import mmclCampusPath from "@assets/mmcl-campus.png";
import dlsuLogoPath from "@assets/dlsu-logo.png";
import dlsuCampusPath from "@assets/dlsu-campus.png";
import ustLogoPath from "@assets/ust-logo.png";
import ustCampusPath from "@assets/ust-campus.png";
import feuLogoPath from "@assets/feu-logo.png";
import feuCampusPath from "@assets/feu-campus.png";
import nuLogoPath from "@assets/nu-logo.png";
import nuCampusPath from "@assets/nu-campus.png";
import bedaLogoPath from "@assets/beda-logo.png";
import bedaCampusPath from "@assets/beda-campus.png";

export default function Universities() {
  const universities = [
    {
      id: 1,
      name: "De La Salle University (DLSU)",
      location: "Manila",
      coordinates: "14.5656° N, 120.9936° E",
      students: 16000,
      established: 1911,
      description: "De La Salle University positions itself as a leader in molding human resources who serve the church and the nation. It is a Catholic coeducational institution founded by the Brothers of the Christian Schools.",
      image: dlsuLogoPath,
      campus: dlsuCampusPath,
      rides: 124,
      drivers: 45,
      passengers: 210,
      popularDestinations: ["Makati", "Quezon City", "Taguig", "Alabang", "Pasay"],
      peakTimes: ["7:00 AM - 9:00 AM", "5:00 PM - 7:00 PM"]
    },
    {
      id: 2,
      name: "University of Santo Tomas (UST)",
      location: "Manila",
      coordinates: "14.6088° N, 120.9893° E",
      students: 40000,
      established: 1611,
      description: "The University of Santo Tomas is the oldest existing university in Asia. In terms of student population, it is the largest Catholic university in the world in a single campus.",
      image: ustLogoPath,
      campus: ustCampusPath,
      rides: 187,
      drivers: 63,
      passengers: 345,
      popularDestinations: ["Quezon City", "San Juan", "Mandaluyong", "Marikina", "Pasig"],
      peakTimes: ["6:30 AM - 8:30 AM", "4:30 PM - 6:30 PM"]
    },
    {
      id: 3,
      name: "Mapúa Malayan Colleges Laguna (MMCL)",
      location: "Cabuyao, Laguna",
      coordinates: "14.2729° N, 121.0713° E",
      students: 8000,
      established: 2006,
      description: "Mapúa Malayan Colleges Laguna offers programs in engineering, architecture, business, arts and sciences, and serves as a center of excellence in education in Southern Luzon.",
      image: mmclLogoPath,
      campus: mmclCampusPath,
      rides: 98,
      drivers: 32,
      passengers: 145,
      popularDestinations: ["Santa Rosa", "Biñan", "Calamba", "Los Baños", "San Pedro"],
      peakTimes: ["7:30 AM - 9:30 AM", "4:00 PM - 6:00 PM"]
    },
    {
      id: 4,
      name: "National University Laguna (NU Laguna)",
      location: "Calamba, Laguna",
      coordinates: "14.1744° N, 121.1252° E",
      students: 5000,
      established: 2019,
      description: "National University Laguna is one of the newest university campuses in the region, offering quality education with a focus on technology and innovation.",
      image: nuLogoPath,
      campus: nuCampusPath,
      rides: 56,
      drivers: 18,
      passengers: 87,
      popularDestinations: ["Calamba", "Santa Rosa", "Cabuyao", "San Pablo", "Biñan"],
      peakTimes: ["7:15 AM - 9:15 AM", "5:15 PM - 7:15 PM"]
    },
    {
      id: 5,
      name: "Far Eastern University Alabang (FEU Alabang)",
      location: "Muntinlupa",
      coordinates: "14.4231° N, 121.0309° E",
      students: 7500,
      established: 2014,
      description: "FEU Alabang is one of the newest branches of Far Eastern University, offering diverse programs and modern learning facilities.",
      image: feuLogoPath,
      campus: feuCampusPath,
      rides: 78,
      drivers: 25,
      passengers: 112,
      popularDestinations: ["Parañaque", "Las Piñas", "Makati", "Taguig", "Laguna"],
      peakTimes: ["7:00 AM - 9:00 AM", "5:30 PM - 7:30 PM"]
    },
    {
      id: 6,
      name: "San Beda College Alabang (SBCA)",
      location: "Muntinlupa",
      coordinates: "14.4183° N, 121.0299° E",
      students: 6000,
      established: 2009,
      description: "San Beda College Alabang is an institution known for its progressive approach to education, creative programs, and commitment to community service.",
      image: bedaLogoPath,
      campus: bedaCampusPath,
      rides: 67,
      drivers: 22,
      passengers: 98,
      popularDestinations: ["Parañaque", "Las Piñas", "Makati", "Manila", "Laguna"],
      peakTimes: ["6:45 AM - 8:45 AM", "4:45 PM - 6:45 PM"]
    }
  ];
  
  return (
    <>
      <Helmet>
        <title>University Partners | TripSync</title>
        <meta name="description" content="Explore TripSync's university partners across the Philippines. Find rides to and from your campus." />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <div className="bg-primary py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <GraduationCap className="h-16 w-16 text-white mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-4">University Partners</h1>
              <p className="mt-2 text-lg text-indigo-100 max-w-3xl mx-auto">
                TripSync partners with leading universities across the Philippines to provide safe and affordable carpooling options for students and faculty.
              </p>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {universities.map(uni => (
                <Card key={uni.id} className="overflow-hidden flex flex-col h-full">
                  <div className="h-48 relative overflow-hidden">
                    <img src={uni.campus} alt={uni.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <img 
                        src={uni.image} 
                        alt={`${uni.name} logo`} 
                        className="h-24 max-h-24 p-2 bg-white rounded-full shadow-lg" 
                      />
                    </div>
                  </div>
                  <CardContent className="flex-grow p-6 flex flex-col">
                    <h2 className="text-xl font-bold mb-2">{uni.name}</h2>
                    <div className="flex items-start text-gray-500 mb-2">
                      <MapPin className="h-4 w-4 mt-1 mr-2 flex-shrink-0" />
                      <span>{uni.location}</span>
                    </div>
                    <p className="text-gray-600 mb-4 flex-grow">{uni.description}</p>
                    <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                      <div className="text-center bg-blue-50 p-2 rounded-lg">
                        <div className="font-bold text-blue-600">{uni.rides}</div>
                        <div className="text-gray-500">Rides</div>
                      </div>
                      <div className="text-center bg-green-50 p-2 rounded-lg">
                        <div className="font-bold text-green-600">{uni.drivers}</div>
                        <div className="text-gray-500">Drivers</div>
                      </div>
                      <div className="text-center bg-purple-50 p-2 rounded-lg">
                        <div className="font-bold text-purple-600">{uni.passengers}</div>
                        <div className="text-gray-500">Riders</div>
                      </div>
                    </div>
                    <Link href={`/find-ride?university=${encodeURIComponent(uni.name)}`}>
                      <Button variant="default" className="w-full mt-auto">
                        Find Rides <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-8 border border-blue-100 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Partner With TripSync?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="flex">
                  <div className="flex-shrink-0 h-12 w-12 bg-primary rounded-lg flex items-center justify-center mr-4">
                    <Car className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Reduce Campus Traffic</h3>
                    <p className="text-gray-600">Fewer cars means less congestion around your campus and reduced demand for parking spaces.</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0 h-12 w-12 bg-primary rounded-lg flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Build Community</h3>
                    <p className="text-gray-600">Encourage social connections between students who might not otherwise interact.</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0 h-12 w-12 bg-primary rounded-lg flex items-center justify-center mr-4">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Support Sustainability</h3>
                    <p className="text-gray-600">Align with your institution's environmental goals by reducing carbon emissions.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">University Success Stories</h2>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <Tabs defaultValue="mmcl">
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="mmcl">MMCL</TabsTrigger>
                    <TabsTrigger value="dlsu">DLSU</TabsTrigger>
                    <TabsTrigger value="ust">UST</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="mmcl" className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3">
                        <img 
                          src={mmclCampusPath} 
                          alt="MMCL Campus" 
                          className="rounded-lg shadow-md w-full h-auto"
                        />
                      </div>
                      <div className="md:w-2/3">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Mapúa Malayan Colleges Laguna</h3>
                        <p className="text-gray-600 mb-4">
                          Since partnering with TripSync in 2022, MMCL has seen a 30% reduction in parking congestion during peak hours. Over 500 students regularly use the platform for their daily commute.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-gray-700">35% reduction in carbon emissions from commuting</span>
                          </div>
                          <div className="flex items-center">
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-gray-700">Student satisfaction rate of 92% with carpooling options</span>
                          </div>
                          <div className="flex items-center">
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-gray-700">Average student saves ₱2,500 per month on transportation costs</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="dlsu" className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3">
                        <img 
                          src={dlsuCampusPath} 
                          alt="DLSU Campus" 
                          className="rounded-lg shadow-md w-full h-auto"
                        />
                      </div>
                      <div className="md:w-2/3">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">De La Salle University</h3>
                        <p className="text-gray-600 mb-4">
                          DLSU has been a key partner since TripSync's launch. The university has integrated the platform into its sustainability initiatives with impressive results.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-gray-700">42% of commuting students now carpool at least 3 days per week</span>
                          </div>
                          <div className="flex items-center">
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-gray-700">Campus-wide initiative resulted in 25% fewer cars on campus</span>
                          </div>
                          <div className="flex items-center">
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-gray-700">Student government recognized TripSync as "Most Impactful Campus Initiative" in 2023</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="ust" className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3">
                        <img 
                          src={ustCampusPath} 
                          alt="UST Campus" 
                          className="rounded-lg shadow-md w-full h-auto"
                        />
                      </div>
                      <div className="md:w-2/3">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">University of Santo Tomas</h3>
                        <p className="text-gray-600 mb-4">
                          With its dense student population, UST faced significant transportation challenges. TripSync helped create a more efficient commuting ecosystem.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-gray-700">Over 1,200 active monthly users across various colleges</span>
                          </div>
                          <div className="flex items-center">
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-gray-700">Average commute time reduced by 28% for participating students</span>
                          </div>
                          <div className="flex items-center">
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-gray-700">University provided preferred parking spaces for carpooling students</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Become a TripSync Partner University</h2>
              <p className="text-gray-600 mb-6 text-center max-w-2xl mx-auto">
                Join our growing network of university partners and provide your students with safe, affordable, and eco-friendly transportation options.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto">
                <Button size="lg" className="sm:w-1/2">
                  Request Partnership
                </Button>
                <Button variant="outline" size="lg" className="sm:w-1/2">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}