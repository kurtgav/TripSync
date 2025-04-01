import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import RideCard from "@/components/rides/ride-card";
import { useQuery } from "@tanstack/react-query";
import { Ride } from "@shared/schema";

export default function AvailableRides() {
  const [popularRides, setPopularRides] = useState<Ride[]>([]);

  const { data: rides, isLoading, error } = useQuery<Ride[]>({
    queryKey: ["/api/rides"],
  });

  useEffect(() => {
    if (rides && rides.length > 0) {
      // In a real app, we would sort by popularity metrics
      // For now, just take the first 3 rides
      setPopularRides(rides.slice(0, 3));
    }
  }, [rides]);

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
          Popular Rides This Week
        </h2>
        
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading popular rides...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-8 text-red-500">
            <p>Failed to load rides. Please try again later.</p>
          </div>
        )}
        
        {!isLoading && !error && popularRides.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No rides available at the moment. Check back later!</p>
          </div>
        )}
        
        {!isLoading && !error && popularRides.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {popularRides.map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Link href="/find-ride">
            <Button variant="outline" className="inline-flex items-center">
              View All Available Rides
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
