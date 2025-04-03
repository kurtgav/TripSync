import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UNIVERSITY_NAMES } from "@/lib/data";
import { Search } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function UniversitySelector() {
  const [university, setUniversity] = useState("");
  const [rideTime, setRideTime] = useState("");
  const [, navigate] = useLocation();
  const { user } = useAuth();

  const handleSearch = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    if (!university) {
      alert("Please select a university");
      return;
    }
    
    navigate(`/find-ride?university=${encodeURIComponent(university)}&time=${encodeURIComponent(rideTime)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="shadow-md">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Find Rides at Your University</h2>
          <div className="md:flex md:space-x-4 space-y-4 md:space-y-0">
            <div className="md:w-1/3">
              <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">Select Your University</label>
              <Select value={university} onValueChange={setUniversity}>
                <SelectTrigger id="university" className="w-full">
                  <SelectValue placeholder="Choose a university" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {UNIVERSITY_NAMES.map((uni, index) => (
                      <SelectItem key={index} value={uni}>
                        {uni}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="md:w-1/3">
              <label htmlFor="ride-time" className="block text-sm font-medium text-gray-700 mb-1">When do you need a ride?</label>
              <input
                type="datetime-local"
                id="ride-time"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                value={rideTime}
                onChange={(e) => setRideTime(e.target.value)}
              />
            </div>
            <div className="md:w-1/3 flex items-end">
              <Button
                onClick={handleSearch}
                className="w-full flex items-center justify-center"
              >
                <Search className="mr-2 h-4 w-4" />
                Search Available Rides
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
