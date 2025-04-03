import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, Calendar, Users, Eye, X, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Ride, User } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RideCardProps {
  ride: Ride;
}

export default function RideCard({ ride }: RideCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [driver, setDriver] = useState<User | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  // Fetch driver details
  const { data: driverData } = useQuery<User>({
    queryKey: [`/api/users/${ride.driverId}`],
    enabled: !!ride.driverId,
  });

  useEffect(() => {
    if (driverData) {
      setDriver(driverData);
    }
  }, [driverData]);

  // Mutation for booking a ride
  const bookingMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("You must be logged in to book a ride");
      
      const bookingData = {
        rideId: ride.id,
        passengerId: user.id,
        status: "pending"
      };
      
      const res = await apiRequest("POST", "/api/bookings", bookingData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rides"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings/passenger"] });
      toast({
        title: "Ride booked successfully!",
        description: "Check your dashboard for details.",
      });
    },
    onError: (error: Error) => {
      let errorMessage = error.message;
      if (error.message.includes("ZodError")) {
        errorMessage = "Missing required booking information. Please try again.";
      }
      toast({
        title: "Booking failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
  
  // Mutation for cancelling a ride
  const cancelRideMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("DELETE", `/api/rides/${ride.id}`);
      return res.status === 204; // No content success
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rides"] });
      queryClient.invalidateQueries({ queryKey: [`/api/rides/driver/${user?.id}`] });
      toast({
        title: "Ride cancelled",
        description: "Your ride has been cancelled successfully.",
      });
      setIsCancelDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Cancellation failed",
        description: error.message,
        variant: "destructive",
      });
      setIsCancelDialogOpen(false);
    },
  });

  const handleBookRide = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    bookingMutation.mutate();
  };

  const formatDepartureTime = (time: Date) => {
    const date = new Date(time);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="text-yellow-400 fill-current h-3 w-3" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half-star" className="text-yellow-400 fill-current h-3 w-3" />);
    }
    
    // Add empty stars
    const emptyStars = Math.floor(5 - rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="text-gray-300 h-3 w-3" />);
    }
    
    return stars;
  };

  return (
    <Card className="overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={driver?.profileImage || undefined} alt={driver?.fullName || "Driver"} />
              <AvatarFallback>{driver?.fullName?.charAt(0) || "D"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {driver?.fullName?.split(" ").map(n => `${n.charAt(0)}.`).join(" ") || "Loading..."}
              </p>
              <div className="flex items-center">
                <div className="flex items-center">
                  {driver && driver.rating ? renderRatingStars(driver.rating) : <div className="h-3 w-12 bg-gray-200 animate-pulse rounded"></div>}
                </div>
                <span className="text-xs text-gray-500 ml-1">
                  {driver ? `${driver.rating} (${driver.reviewCount})` : ""}
                </span>
              </div>
              {driver?.university && (
                <p className="text-xs text-gray-500 mt-1">
                  {driver.university}
                </p>
              )}
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <span className="w-1 h-1 mr-1 rounded-full bg-green-500"></span>
            Active Driver
          </span>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Calendar className="text-gray-400 h-4 w-4 mr-1" />
          <span>{formatDepartureTime(ride.departureTime)}</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="flex flex-col items-center mr-4">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <div className="w-0.5 h-10 bg-gray-300"></div>
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{ride.origin}</p>
            <p className="text-sm text-gray-500 mt-6">{ride.destination}</p>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <Users className="text-gray-400 h-4 w-4 mr-1" />
            <span className="text-sm text-gray-500">{ride.availableSeats} seats available</span>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-primary">₱{ride.price} per person</p>
            <p className="text-xs text-gray-500">~{formatDistanceToNow(new Date(ride.departureTime))} from now</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-4 py-3 bg-gray-50 flex justify-between items-center">
        {user && user.id === ride.driverId ? (
          // Driver controls
          <div className="flex space-x-2">
            <Link href={`/ride-details/${ride.id}`}>
              <Button
                size="sm"
                variant="outline"
              >
                <Eye className="h-4 w-4 mr-1" />
                View Bookings
              </Button>
            </Link>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setIsCancelDialogOpen(true)}
              disabled={cancelRideMutation.isPending}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel Ride
            </Button>
          </div>
        ) : (
          // Empty div to keep flexbox spacing
          <div></div>
        )}
        
        {/* Passenger controls or general booking button */}
        {user && user.id !== ride.driverId && (
          <Button 
            size="sm"
            onClick={handleBookRide}
            disabled={bookingMutation.isPending || ride.availableSeats < 1}
          >
            {bookingMutation.isPending ? "Booking..." : "Book This Ride"}
          </Button>
        )}
      </CardFooter>

      {/* Cancel Ride Dialog */}
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this ride?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will cancel the ride and notify all passengers who have booked.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Ride</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => cancelRideMutation.mutate()}
              className="bg-red-500 hover:bg-red-600"
            >
              {cancelRideMutation.isPending ? (
                <>
                  <span className="animate-spin mr-1">⏳</span> Cancelling...
                </>
              ) : (
                "Cancel Ride"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
