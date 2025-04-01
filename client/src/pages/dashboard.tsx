import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Helmet } from "react-helmet";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDistanceToNow, format } from "date-fns";
import { Booking, Ride } from "@shared/schema";
import { Inbox, UserCircle, Car, Calendar, MapPin, Clock, Users, Star, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upcoming");
  
  const { data: myBookings = [], isLoading: isLoadingBookings } = useQuery({
    queryKey: ["/api/bookings/passenger"],
    enabled: !!user,
  });
  
  const { data: myRides = [], isLoading: isLoadingRides } = useQuery({
    queryKey: [`/api/rides/driver/${user?.id}`],
    enabled: !!user && user.isDriver,
  });

  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [upcomingRides, setUpcomingRides] = useState([]);
  const [pastRides, setPastRides] = useState([]);
  
  useEffect(() => {
    const now = new Date();
    
    if (myBookings && myBookings.length > 0) {
      const upcoming = [];
      const past = [];
      
      for (const booking of myBookings) {
        const ride = booking.ride;
        if (ride) {
          const departureTime = new Date(ride.departureTime);
          if (departureTime > now) {
            upcoming.push(booking);
          } else {
            past.push(booking);
          }
        }
      }
      
      setUpcomingBookings(upcoming);
      setPastBookings(past);
    }
    
    if (myRides && myRides.length > 0) {
      const upcoming = [];
      const past = [];
      
      for (const ride of myRides) {
        const departureTime = new Date(ride.departureTime);
        if (departureTime > now) {
          upcoming.push(ride);
        } else {
          past.push(ride);
        }
      }
      
      setUpcomingRides(upcoming);
      setPastRides(past);
    }
  }, [myBookings, myRides]);

  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId) => {
      const res = await apiRequest("PUT", `/api/bookings/${bookingId}/status`, { status: "cancelled" });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings/passenger"] });
      toast({
        title: "Booking cancelled",
        description: "Your ride booking has been cancelled successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error cancelling booking",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const cancelRideMutation = useMutation({
    mutationFn: async (rideId) => {
      const res = await apiRequest("PUT", `/api/rides/${rideId}`, { status: "cancelled" });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/rides/driver/${user?.id}`] });
      toast({
        title: "Ride cancelled",
        description: "Your offered ride has been cancelled successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error cancelling ride",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCancelBooking = (bookingId) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      cancelBookingMutation.mutate(bookingId);
    }
  };

  const handleCancelRide = (rideId) => {
    if (confirm("Are you sure you want to cancel this ride? All bookings will be cancelled as well.")) {
      cancelRideMutation.mutate(rideId);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case "confirmed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Confirmed</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard | TripSync</title>
        <meta name="description" content="Manage your rides and bookings on TripSync" />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-lg text-gray-600">Manage your rides and bookings</p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <Link href="/find-ride">
                  <Button variant="outline" className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    Find a Ride
                  </Button>
                </Link>
                <Link href="/offer-ride">
                  <Button className="flex items-center">
                    <Car className="mr-2 h-4 w-4" />
                    Offer a Ride
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Upcoming Rides</CardTitle>
                  <CardDescription>Rides you've booked or offered</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {upcomingBookings.length + upcomingRides.length}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Completed Rides</CardTitle>
                  <CardDescription>Total rides completed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {pastBookings.filter(b => b.status === "completed").length + 
                     pastRides.filter(r => r.status === "completed").length}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Your Rating</CardTitle>
                  <CardDescription>Based on {user.reviewCount} reviews</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="text-3xl font-bold text-primary mr-2">
                      {user.rating.toFixed(1)}
                    </div>
                    <div className="flex text-yellow-400">
                      {Array(5).fill(0).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${i < Math.floor(user.rating) ? "fill-current" : ""}`} 
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="upcoming">Upcoming Rides</TabsTrigger>
                <TabsTrigger value="past">Past Rides</TabsTrigger>
                {user.isDriver && <TabsTrigger value="offered">Rides You Offered</TabsTrigger>}
              </TabsList>

              <TabsContent value="upcoming">
                {isLoadingBookings ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading your upcoming bookings...</p>
                  </div>
                ) : upcomingBookings.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                      <Calendar className="h-6 w-6 text-gray-600" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No upcoming rides</h3>
                    <p className="mt-2 text-sm text-gray-500">You haven't booked any upcoming rides yet.</p>
                    <div className="mt-6">
                      <Link href="/find-ride">
                        <Button>Find a Ride</Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <Card key={booking.id} className="overflow-hidden">
                        <div className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div className="flex items-center mb-4 sm:mb-0">
                              <Avatar className="h-10 w-10 mr-4">
                                <AvatarImage src={booking.ride?.driver?.profileImage} />
                                <AvatarFallback>{booking.ride?.driver?.fullName?.charAt(0) || "D"}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {booking.ride?.origin} to {booking.ride?.destination}
                                </h3>
                                <div className="text-sm text-gray-500">
                                  Driver: {booking.ride?.driver?.fullName || "Loading..."}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              {getStatusBadge(booking.status)}
                              <div className="text-lg font-semibold text-primary">₱{booking.ride?.price}</div>
                            </div>
                          </div>
                          
                          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center">
                              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-600">
                                {format(new Date(booking.ride?.departureTime), "MMM d, yyyy")}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-600">
                                {format(new Date(booking.ride?.departureTime), "h:mm a")}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Users className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-600">
                                {booking.ride?.availableSeats} seat(s) available
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-6 flex flex-col sm:flex-row justify-between">
                            <div className="flex flex-col">
                              <div className="text-sm text-gray-500">Departure in</div>
                              <div className="text-base font-medium">
                                {formatDistanceToNow(new Date(booking.ride?.departureTime))}
                              </div>
                            </div>
                            <div className="mt-4 sm:mt-0 flex space-x-3">
                              <Button
                                variant="outline"
                                className="w-full sm:w-auto"
                                onClick={() => handleCancelBooking(booking.id)}
                                disabled={booking.status === "cancelled" || cancelBookingMutation.isPending}
                              >
                                {cancelBookingMutation.isPending ? "Cancelling..." : "Cancel Booking"}
                              </Button>
                              <Link href={`/messages/${booking.ride?.driverId}`}>
                                <Button className="w-full sm:w-auto">
                                  <Inbox className="mr-2 h-4 w-4" />
                                  Message Driver
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="past">
                {isLoadingBookings ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading your past bookings...</p>
                  </div>
                ) : pastBookings.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                      <Calendar className="h-6 w-6 text-gray-600" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No past rides</h3>
                    <p className="mt-2 text-sm text-gray-500">You haven't completed any rides yet.</p>
                    <div className="mt-6">
                      <Link href="/find-ride">
                        <Button>Find a Ride</Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pastBookings.map((booking) => (
                      <Card key={booking.id} className="overflow-hidden">
                        <div className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div className="flex items-center mb-4 sm:mb-0">
                              <Avatar className="h-10 w-10 mr-4">
                                <AvatarImage src={booking.ride?.driver?.profileImage} />
                                <AvatarFallback>{booking.ride?.driver?.fullName?.charAt(0) || "D"}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {booking.ride?.origin} to {booking.ride?.destination}
                                </h3>
                                <div className="text-sm text-gray-500">
                                  Driver: {booking.ride?.driver?.fullName || "Loading..."}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              {getStatusBadge(booking.status)}
                              <div className="text-lg font-semibold text-primary">₱{booking.ride?.price}</div>
                            </div>
                          </div>
                          
                          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center">
                              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-600">
                                {format(new Date(booking.ride?.departureTime), "MMMM d, yyyy 'at' h:mm a")}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Users className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-600">
                                {booking.ride?.availableSeats} seat(s) available
                              </span>
                            </div>
                          </div>
                          
                          {booking.status === "completed" && (
                            <div className="mt-6 flex justify-end">
                              <Link href={`/review/${booking.ride?.driverId}?rideId=${booking.ride?.id}`}>
                                <Button variant="outline" className="flex items-center">
                                  <Star className="mr-2 h-4 w-4" />
                                  Leave a Review
                                </Button>
                              </Link>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {user.isDriver && (
                <TabsContent value="offered">
                  {isLoadingRides ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-4 text-gray-500">Loading your offered rides...</p>
                    </div>
                  ) : upcomingRides.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                        <Car className="h-6 w-6 text-gray-600" />
                      </div>
                      <h3 className="mt-4 text-lg font-medium text-gray-900">No rides offered</h3>
                      <p className="mt-2 text-sm text-gray-500">You haven't offered any rides yet.</p>
                      <div className="mt-6">
                        <Link href="/offer-ride">
                          <Button>Offer a Ride</Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingRides.map((ride) => (
                        <Card key={ride.id} className="overflow-hidden">
                          <div className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {ride.origin} to {ride.destination}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {ride.description || `${format(new Date(ride.departureTime), "EEEE")} ride`}
                                </p>
                              </div>
                              <div className="mt-2 sm:mt-0 flex items-center space-x-3">
                                <Badge variant="outline" className={`
                                  ${ride.status === "active" ? "bg-green-100 text-green-800 border-green-200" : 
                                    "bg-red-100 text-red-800 border-red-200"}
                                `}>
                                  {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                                </Badge>
                                <div className="text-lg font-semibold text-primary">₱{ride.price}</div>
                              </div>
                            </div>
                            
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="flex items-center">
                                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                                <span className="text-sm text-gray-600">
                                  {format(new Date(ride.departureTime), "MMM d, yyyy")}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                                <span className="text-sm text-gray-600">
                                  {format(new Date(ride.departureTime), "h:mm a")}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Users className="h-5 w-5 text-gray-400 mr-2" />
                                <span className="text-sm text-gray-600">
                                  {ride.availableSeats} seat(s) available
                                </span>
                              </div>
                            </div>
                            
                            <div className="mt-6 flex flex-col sm:flex-row justify-between">
                              <div className="flex flex-col">
                                <div className="text-sm text-gray-500">Departure in</div>
                                <div className="text-base font-medium">
                                  {formatDistanceToNow(new Date(ride.departureTime))}
                                </div>
                              </div>
                              <div className="mt-4 sm:mt-0 flex space-x-3">
                                <Button
                                  variant="outline"
                                  className="w-full sm:w-auto"
                                  onClick={() => handleCancelRide(ride.id)}
                                  disabled={ride.status === "cancelled" || cancelRideMutation.isPending}
                                >
                                  {cancelRideMutation.isPending ? "Cancelling..." : "Cancel Ride"}
                                </Button>
                                <Link href={`/ride-details/${ride.id}`}>
                                  <Button className="w-full sm:w-auto">
                                    View Bookings
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
