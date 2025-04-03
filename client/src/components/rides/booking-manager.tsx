import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, MessageCircle, AlertTriangle } from 'lucide-react';
import { Booking, Ride, User } from '@shared/schema';
import { formatDistanceToNow, format } from 'date-fns';
import { Link } from 'wouter';

interface BookingManagerProps {
  rideId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingManager({ rideId, isOpen, onClose }: BookingManagerProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [passengerData, setPassengerData] = useState<Record<number, User | null>>({});
  const [loadingPassengers, setLoadingPassengers] = useState<Record<number, boolean>>({});

  // Fetch bookings for this ride
  const { data: bookings, isLoading: isLoadingBookings } = useQuery<Booking[]>({
    queryKey: [`/api/bookings/ride/${rideId}`],
    enabled: isOpen && !!rideId && !!user,
  });

  // Fetch ride details
  const { data: ride } = useQuery<Ride>({
    queryKey: [`/api/rides/${rideId}`],
    enabled: isOpen && !!rideId && !!user,
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

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Manage Bookings</DialogTitle>
          <DialogDescription>
            {ride ? (
              <span>
                {ride.origin} to {ride.destination} on{' '}
                {format(new Date(ride.departureTime), 'PPP')} at{' '}
                {format(new Date(ride.departureTime), 'p')}
              </span>
            ) : (
              'Loading ride details...'
            )}
          </DialogDescription>
        </DialogHeader>

        {isLoadingBookings ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading bookings...</span>
          </div>
        ) : !bookings || bookings.length === 0 ? (
          <div className="text-center py-8">
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
                              <AvatarFallback>
                                <Loader2 className="h-4 w-4 animate-spin" />
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
                              onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                              }}
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

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}