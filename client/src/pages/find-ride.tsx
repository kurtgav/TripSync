import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import RideCard from "@/components/rides/ride-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Ride } from "@shared/schema";
import { UNIVERSITIES } from "@/lib/data";
import { format, isWithinInterval, addDays, parseISO } from "date-fns";
import {
  Search,
  Calendar as CalendarIcon,
  Filter,
  MapPin,
  X,
  DollarSign,
  Clock,
} from "lucide-react";

export default function FindRide() {
  const [location, setLocation] = useLocation();
  
  // Parse URL parameters
  const params = new URLSearchParams(location.split("?")[1]);
  const urlUniversity = params.get("university") || "";
  const urlTime = params.get("time") || "";
  
  // Filter states
  const [university, setUniversity] = useState(urlUniversity);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState(urlTime ? new Date(urlTime) : undefined);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [activeFilters, setActiveFilters] = useState([]);
  
  // Filtered rides
  const [filteredRides, setFilteredRides] = useState([]);
  
  // Get all rides
  const { data: rides = [], isLoading } = useQuery<Ride[]>({
    queryKey: ["/api/rides"],
  });
  
  // Filter rides based on selected filters
  useEffect(() => {
    if (!rides || rides.length === 0) return;
    
    let filtered = [...rides];
    let newActiveFilters = [];
    
    // Filter by university
    if (university) {
      filtered = filtered.filter(ride => {
        // In a real app, we'd check if the driver is from this university
        // For now, we'll assume all rides match the selected university
        return true;
      });
      newActiveFilters.push({ id: "university", label: university, value: university });
    }
    
    // Filter by origin
    if (origin) {
      filtered = filtered.filter(ride => 
        ride.origin.toLowerCase().includes(origin.toLowerCase())
      );
      newActiveFilters.push({ id: "origin", label: "From", value: origin });
    }
    
    // Filter by destination
    if (destination) {
      filtered = filtered.filter(ride => 
        ride.destination.toLowerCase().includes(destination.toLowerCase())
      );
      newActiveFilters.push({ id: "destination", label: "To", value: destination });
    }
    
    // Filter by departure date
    if (departureDate) {
      filtered = filtered.filter(ride => {
        const rideDate = new Date(ride.departureTime);
        return isWithinInterval(rideDate, {
          start: departureDate,
          end: addDays(departureDate, 1),
        });
      });
      newActiveFilters.push({ 
        id: "date", 
        label: "Date", 
        value: format(departureDate, "MMM d, yyyy") 
      });
    }
    
    // Filter by price range
    filtered = filtered.filter(ride => 
      ride.price >= priceRange[0] && ride.price <= priceRange[1]
    );
    
    if (priceRange[0] > 0 || priceRange[1] < 500) {
      newActiveFilters.push({ 
        id: "price", 
        label: "Price", 
        value: `₱${priceRange[0]} - ₱${priceRange[1]}` 
      });
    }
    
    setFilteredRides(filtered);
    setActiveFilters(newActiveFilters);
  }, [rides, university, origin, destination, departureDate, priceRange]);
  
  const clearFilter = (filterId) => {
    switch (filterId) {
      case "university":
        setUniversity("");
        break;
      case "origin":
        setOrigin("");
        break;
      case "destination":
        setDestination("");
        break;
      case "date":
        setDepartureDate(undefined);
        break;
      case "price":
        setPriceRange([0, 500]);
        break;
      default:
        break;
    }
  };
  
  const clearAllFilters = () => {
    setUniversity("");
    setOrigin("");
    setDestination("");
    setDepartureDate(undefined);
    setPriceRange([0, 500]);
  };

  return (
    <>
      <Helmet>
        <title>Find a Ride | TripSync</title>
        <meta name="description" content="Search for available rides to your destination with TripSync, the carpooling platform for students." />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <div className="bg-primary py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-bold text-white">Find a Ride</h1>
              <p className="text-indigo-100">Browse available rides to your destination</p>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-1">
                  <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">University</label>
                  <Select value={university} onValueChange={setUniversity}>
                    <SelectTrigger id="university">
                      <SelectValue placeholder="Select university" />
                    </SelectTrigger>
                    <SelectContent>
                      {UNIVERSITIES.map((uni, index) => (
                        <SelectItem key={index} value={uni}>
                          {uni}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="lg:col-span-1">
                  <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">From</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="origin"
                      placeholder="Origin"
                      className="pl-10"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="lg:col-span-1">
                  <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="destination"
                      placeholder="Destination"
                      className="pl-10"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="lg:col-span-1">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                        id="date"
                      >
                        <div className="flex items-center">
                          <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                          {departureDate ? (
                            format(departureDate, "PPP")
                          ) : (
                            <span className="text-gray-500">Pick a date</span>
                          )}
                        </div>
                        <div className="text-xs">▼</div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={departureDate}
                        onSelect={setDepartureDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="lg:col-span-1">
                  <div className="h-8 flex items-end mb-1">
                    <Button 
                      variant="secondary" 
                      className="rounded-full h-8 w-8 p-0 ml-auto"
                      onClick={() => clearAllFilters()}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Clear all filters</span>
                    </Button>
                  </div>
                  <Button 
                    className="w-full flex items-center justify-center"
                    onClick={() => setLocation("/find-ride")}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Search Rides
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <Badge
                  key={filter.id}
                  variant="outline"
                  className="bg-primary-50 text-primary border-primary-200 flex items-center h-8 px-3"
                >
                  <span className="font-medium mr-1">{filter.label}:</span>
                  <span>{filter.value}</span>
                  <button
                    className="ml-2 text-gray-400 hover:text-gray-600"
                    onClick={() => clearFilter(filter.id)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove filter</span>
                  </button>
                </Badge>
              ))}
            </div>
            
            <div className="my-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium">Filters</h2>
                    <Filter className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                        Price Range
                      </h3>
                      <div className="mt-4 px-2">
                        <Slider
                          value={priceRange}
                          min={0}
                          max={500}
                          step={50}
                          onValueChange={setPriceRange}
                        />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                        <span>₱{priceRange[0]}</span>
                        <span>₱{priceRange[1]}</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-500" />
                        Time of Day
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            id="morning"
                            name="time"
                            type="checkbox"
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label htmlFor="morning" className="ml-2 text-sm text-gray-600">
                            Morning (6:00 AM - 12:00 PM)
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="afternoon"
                            name="time"
                            type="checkbox"
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label htmlFor="afternoon" className="ml-2 text-sm text-gray-600">
                            Afternoon (12:00 PM - 5:00 PM)
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="evening"
                            name="time"
                            type="checkbox"
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label htmlFor="evening" className="ml-2 text-sm text-gray-600">
                            Evening (5:00 PM - 10:00 PM)
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Driver Rating</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            id="rating-4"
                            name="rating"
                            type="checkbox"
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label htmlFor="rating-4" className="ml-2 text-sm text-gray-600 flex items-center">
                            4+ Stars
                            <div className="ml-2 flex text-yellow-400">
                              {[...Array(4)].map((_, i) => (
                                <svg key={i} className="h-3 w-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                              ))}
                              <svg className="h-3 w-3 text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                            </div>
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="rating-3"
                            name="rating"
                            type="checkbox"
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label htmlFor="rating-3" className="ml-2 text-sm text-gray-600 flex items-center">
                            3+ Stars
                            <div className="ml-2 flex text-yellow-400">
                              {[...Array(3)].map((_, i) => (
                                <svg key={i} className="h-3 w-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                              ))}
                              {[...Array(2)].map((_, i) => (
                                <svg key={i} className="h-3 w-3 text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                              ))}
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-3">
                {isLoading ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading available rides...</p>
                  </div>
                ) : filteredRides.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                      <MapPin className="h-6 w-6 text-gray-600" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No rides found</h3>
                    <p className="mt-2 text-sm text-gray-500">Try adjusting your search filters or checking back later.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredRides.map((ride) => (
                      <RideCard key={ride.id} ride={ride} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
