import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Car, Search } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function HeroSection() {
  const { user } = useAuth();
  
  return (
    <div className="bg-primary bg-opacity-90 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2760%27%20height%3D%2760%27%20viewBox%3D%270%200%2060%2060%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cg%20fill%3D%27none%27%20fill-rule%3D%27evenodd%27%3E%3Cg%20fill%3D%27%23ffffff%27%20fill-opacity%3D%270.05%27%3E%3Cpath%20d%3D%27M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%27%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="md:flex md:items-center md:space-x-8">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              <span className="block">Ride Together,</span>
              <span className="block">Save Together</span>
            </h1>
            <p className="mt-3 text-base text-indigo-100 sm:mt-5 sm:text-lg md:mt-5 md:text-xl">
              TripSync connects university students with reliable carpooling options, helping you save money, reduce emissions, and make new friends.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <Link href={user ? "/offer-ride" : "/auth"}>
                <Button size="lg" variant="secondary" className="flex items-center justify-center px-8 py-3 text-base font-medium rounded-md shadow-sm text-primary-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                  <Car className="mr-2 h-5 w-5" />
                  Offer a Ride
                </Button>
              </Link>
              <Link href={user ? "/find-ride" : "/auth"}>
                <Button size="lg" className="flex items-center justify-center px-8 py-3 text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10">
                  <Search className="mr-2 h-5 w-5" />
                  Find a Ride
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <img 
                className="w-full" 
                src="https://images.unsplash.com/photo-1516733968668-dbdce39c4651?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Students carpooling" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black opacity-60"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <p className="text-white text-lg font-medium">Save up to 70% on your commute costs</p>
                <p className="text-gray-200 text-sm mt-1">Join 5,000+ students already using TripSync</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
