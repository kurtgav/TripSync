import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format, formatDistanceToNow } from 'date-fns';
import { Link } from 'wouter';
import { Ride, Booking, User } from '@shared/schema';
import { Calendar, Clock, Users, MessageCircle, ArrowLeft } from 'lucide-react';

export default function RideDetailsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, params] = useRoute('/ride-details/:id');
  const rideId = params ? parseInt(params.id) : null;
  const [passengerData, setPassengerData] = useState<Record<number, User | null>>({});
  const [loadingPassengers, setLoadingPassengers] = useState<Record<number, boolean>>({});

  // Fetch ride details
  const { data: ride, isLoading: isLoadingRide } = useQuery<Ride>({
    queryKey: [`/api/rides/${rideId}`],
    enabled: !!rideId,
  });

  // Fetch bookings for this ride
  const { data: bookings, isLoading: isLoadingBookings } = useQuery<Booking[]>({
    queryKey: [`/api/bookings/ride/${rideId}`],
    enabled: !!rideId && !!user,
  });

  // Load passenger data when bookings are available
  useEffect(() => {
    if (bookings && bookings.length > 0) {
      // Create a list of passenger IDs
      const passengerIds: number[] = [];
      bookings.forEach(booking => {
        if (!passengerIds.includes(booking.passengerId)) {
          passengerIds.push(booking.passengerId);
        }
      });
      
      // Initialize loading state for each passenger
      const initialLoadingState: Record<number, boolean> = {};
      passengerIds.forEach(id => {
        initialLoadingState[id] = true;
      });
      setLoadingPassengers(initialLoadingState);
      
      // Fetch data for each passenger
      passengerIds.forEach(async (passengerId) => {
        try {
          const response = await fetch(`/api/users/${passengerId}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch passenger data: ${response.statusText}`);
          }
          const userData = await response.json();
          setPassengerData(prev => ({ ...prev, [passengerId]: userData }));
        } catch (error) {
          console.error(`Error fetching passenger ${passengerId}:`, error);
          setPassengerData(prev => ({ ...prev, [passengerId]: null }));
        } finally {
          setLoadingPassengers(prev => ({ ...prev, [passengerId]: false }));
        }
      });
    }
  }, [bookings]);

  // Mutation to update booking status
  const updateBookingStatus = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: number; status: string }) => {
      const res = await apiRequest('PUT', `/api/bookings/${bookingId}/status`, { status });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/bookings/ride/${rideId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/rides'] });
      toast({
        title: 'Booking updated',
        description: 'The booking status has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleConfirmBooking = (bookingId: number) => {
    updateBookingStatus.mutate({ bookingId, status: 'confirmed' });
  };

  const handleCancelBooking = (bookingId: number) => {
    updateBookingStatus.mutate({ bookingId, status: 'cancelled' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Confirmed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Cancelled</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Check if user is authorized to view this page
  if (user && ride && user.id !== ride.driverId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">You don't have permission to view this page.</p>
            <Link href="/dashboard">
              <Button>Return to Dashboard</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" className="p-0 flex items-center text-gray-500 hover:text-gray-700">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {isLoadingRide ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading ride details...</p>
            </div>
          ) : !ride ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <h3 className="mt-4 text-lg font-medium text-gray-900">Ride not found</h3>
              <p className="mt-2 text-sm text-gray-500">The ride you're looking for doesn't exist.</p>
            </div>
          ) : (
            <>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Ride Details</CardTitle>
                  <CardDescription>
                    View information about this ride and its bookings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Route Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <div className="flex flex-col items-center mr-4">
                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                            <div className="w-0.5 h-10 bg-gray-300"></div>
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-700">{ride.origin}</p>
                            <p className="text-sm text-gray-500 mt-6">{ride.destination}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Trip Details</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">
                            {format(new Date(ride.departureTime), "MMMM d, yyyy")}
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
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Passenger Bookings</h3>
                      <p className="text-sm text-gray-500">Manage who's coming with you on this trip</p>
                    </div>
                    <Badge variant="outline" className={`
                      ${ride.status === "active" ? "bg-green-100 text-green-800 border-green-200" : 
                        "bg-red-100 text-red-800 border-red-200"}
                    `}>
                      {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                    </Badge>
                  </div>

                  {isLoadingBookings ? (
                    <div className="text-center py-6">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-gray-500">Loading bookings...</p>
                    </div>
                  ) : !bookings || bookings.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No bookings yet for this ride.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Passenger</TableHead>
                            <TableHead>Booked</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bookings.map((booking) => {
                            const passenger = passengerData[booking.passengerId];
                            const isLoadingPassenger = loadingPassengers[booking.passengerId];
                            
                            return (
                              <TableRow key={booking.id}>
                                <TableCell>
                                  <div className="flex items-center space-x-3">
                                    {isLoadingPassenger ? (
                                      <Avatar>
                                        <AvatarFallback className="animate-pulse">
                                          ...
                                        </AvatarFallback>
                                      </Avatar>
                                    ) : (
                                      <Avatar>
                                        <AvatarImage 
                                          src={passenger?.profileImage || undefined} 
                                          alt={passenger?.fullName || "Passenger"} 
                                        />
                                        <AvatarFallback>
                                          {passenger?.fullName?.charAt(0) || "P"}
                                        </AvatarFallback>
                                      </Avatar>
                                    )}
                                    <div>
                                      <p className="text-sm font-medium">
                                        {isLoadingPassenger 
                                          ? "Loading..." 
                                          : passenger?.fullName || "Unknown Passenger"}
                                      </p>
                                      {!isLoadingPassenger && passenger?.rating && (
                                        <p className="text-xs text-gray-500">
                                          Rating: ⭐ {passenger.rating.toFixed(1)} ({passenger.reviewCount || 0})
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="text-xs text-gray-500">
                                    {booking.createdAt ? formatDistanceToNow(new Date(booking.createdAt), { addSuffix: true }) : "Unknown"}
                                  </span>
                                </TableCell>
                                <TableCell>{getStatusBadge(booking.status)}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex space-x-2 justify-end">
                                    <Link href={`/messages/${booking.passengerId}`}>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                      >
                                        <MessageCircle className="h-4 w-4 mr-1" />
                                        Chat
                                      </Button>
                                    </Link>
                                    
                                    {booking.status === 'pending' && (
                                      <>
                                        <Button
                                          size="sm"
                                          variant="default"
                                          onClick={() => handleConfirmBooking(booking.id)}
                                          disabled={updateBookingStatus.isPending}
                                        >
                                          Confirm
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="destructive"
                                          onClick={() => handleCancelBooking(booking.id)}
                                          disabled={updateBookingStatus.isPending}
                                        >
                                          Reject
                                        </Button>
                                      </>
                                    )}
                                    
                                    {booking.status === 'confirmed' && (
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleCancelBooking(booking.id)}
                                        disabled={updateBookingStatus.isPending}
                                      >
                                        Cancel
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
} 