import { Button } from "@/components/ui/button";
import { Apple, PlayCircle } from "lucide-react";

export default function DownloadApp() {
  return (
    <div className="bg-primary py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Get the TripSync App
            </h2>
            <p className="mt-3 max-w-lg text-lg text-indigo-100">
              Download our mobile app for the best carpool experience. Book rides, chat with drivers, and track your journey on the go.
            </p>
            <div className="mt-8 flex space-x-4">
              <Button variant="secondary" size="lg" className="inline-flex items-center">
                <Apple className="h-5 w-5 mr-2" />
                App Store
              </Button>
              <Button variant="secondary" size="lg" className="inline-flex items-center">
                <PlayCircle className="h-5 w-5 mr-2" />
                Google Play
              </Button>
            </div>
          </div>
          <div className="mt-8 lg:mt-0 lg:w-1/2 flex justify-center">
            <div className="relative">
              <img 
                className="h-96 w-auto" 
                src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Phone mockup" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <PlayCircle className="h-8 w-8 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
