import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertRideSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { MapPin, Calendar as CalendarIcon, Clock, Car, Users, Check, DollarSign } from "lucide-react";
import { z } from "zod";

// Extend the insertRideSchema to handle the form date and time separately
const offerRideSchema = z.object({
  origin: z.string().min(3, {
    message: "Origin must be at least 3 characters",
  }),
  destination: z.string().min(3, {
    message: "Destination must be at least 3 characters",
  }),
  departureDate: z.date(),
  departureTime: z.string(),
  price: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "Price must be a positive number",
  }),
  availableSeats: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0 && parseInt(val) <= 10, {
    message: "Available seats must be between 1 and 10",
  }),
  description: z.string().optional(),
  recurring: z.boolean().default(false),
  recurringDays: z.array(z.string()).optional(),
});

export default function OfferRide() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isRecurring, setIsRecurring] = useState(false);
  
  // Array of days of the week
  const daysOfWeek = [
    { id: "monday", label: "Monday" },
    { id: "tuesday", label: "Tuesday" },
    { id: "wednesday", label: "Wednesday" },
    { id: "thursday", label: "Thursday" },
    { id: "friday", label: "Friday" },
    { id: "saturday", label: "Saturday" },
    { id: "sunday", label: "Sunday" },
  ];

  const form = useForm({
    resolver: zodResolver(offerRideSchema),
    defaultValues: {
      origin: "",
      destination: "",
      departureDate: new Date(),
      departureTime: format(new Date(), "HH:mm"),
      price: "",
      availableSeats: "4",
      description: "",
      recurring: false,
      recurringDays: [],
    },
  });

  const createRideMutation = useMutation({
    mutationFn: async (values) => {
      // Combine date and time into a single datetime
      const dateTimeString = `${format(values.departureDate, "yyyy-MM-dd")}T${values.departureTime}:00`;
      const departureTime = new Date(dateTimeString);
      
      // Prepare data for API
      const rideData = {
        origin: values.origin,
        destination: values.destination,
        departureTime,
        price: parseInt(values.price),
        availableSeats: parseInt(values.availableSeats),
        description: values.description || undefined,
        recurring: values.recurring,
        recurringDays: values.recurringDays?.length > 0 ? values.recurringDays.join(",") : undefined,
      };
      
      const res = await apiRequest("POST", "/api/rides", rideData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/rides/driver/${user?.id}`] });
      toast({
        title: "Success",
        description: "Your ride has been offered successfully!",
      });
      navigate("/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to offer a ride",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    if (!user.isDriver) {
      toast({
        title: "Error",
        description: "You need to be registered as a driver to offer rides. Please update your profile.",
        variant: "destructive",
      });
      return;
    }
    
    createRideMutation.mutate(values);
  };

  return (
    <>
      <Helmet>
        <title>Offer a Ride | TripSync</title>
        <meta name="description" content="Offer a ride to fellow students and help them get to their destinations while earning some extra money." />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="md:flex md:items-center md:justify-between mb-8">
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold leading-tight text-gray-900">Offer a Ride</h1>
                <p className="mt-1 text-lg text-gray-500">Share your journey with other students and split costs</p>
              </div>
              <div className="mt-4 flex md:mt-0 md:ml-4">
                <Button variant="outline" onClick={() => navigate("/dashboard")}>
                  Cancel
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Ride Details</CardTitle>
                    <CardDescription>
                      Enter the details of the ride you want to offer.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="origin"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Origin</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                                    <Input className="pl-10" placeholder="Starting location" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="destination"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Destination</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                                    <Input className="pl-10" placeholder="Where are you going?" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="departureDate"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Departure Date</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        className="pl-3 text-left font-normal flex justify-between items-center"
                                      >
                                        <div className="flex items-center">
                                          <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                                          {field.value ? (
                                            format(field.value, "PPP")
                                          ) : (
                                            <span>Pick a date</span>
                                          )}
                                        </div>
                                        <div>▼</div>
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      initialFocus
                                      disabled={(date) => date < new Date()}
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="departureTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Departure Time</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Clock className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                                    <Input
                                      className="pl-10"
                                      type="time"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price per Seat (₱)</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <DollarSign className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                                    <Input
                                      className="pl-10"
                                      type="number"
                                      min="1"
                                      placeholder="Amount in PHP"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  How much will each passenger pay?
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="availableSeats"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Available Seats</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Users className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                                    <Input
                                      className="pl-10"
                                      type="number"
                                      min="1"
                                      max="10"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  How many passengers can you take?
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description (Optional)</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Add any additional information about your trip"
                                  className="resize-none h-20"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Add pickup details, allowed luggage, etc.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="recurring"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Recurring Ride?</FormLabel>
                                <FormDescription>
                                  Will this be a recurring ride on specific days?
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={(checked) => {
                                    field.onChange(checked);
                                    setIsRecurring(checked);
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        {isRecurring && (
                          <FormField
                            control={form.control}
                            name="recurringDays"
                            render={() => (
                              <FormItem>
                                <div className="mb-4">
                                  <FormLabel className="text-base">Select Days</FormLabel>
                                  <FormDescription>
                                    On which days will this ride be available?
                                  </FormDescription>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                  {daysOfWeek.map((day) => (
                                    <FormField
                                      key={day.id}
                                      control={form.control}
                                      name="recurringDays"
                                      render={({ field }) => {
                                        return (
                                          <FormItem
                                            key={day.id}
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                          >
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value?.includes(day.id)}
                                                onCheckedChange={(checked) => {
                                                  return checked
                                                    ? field.onChange([...field.value, day.id])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                          (value) => value !== day.id
                                                        )
                                                      );
                                                }}
                                              />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                              {day.label}
                                            </FormLabel>
                                          </FormItem>
                                        );
                                      }}
                                    />
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        <Button
                          type="submit"
                          className="w-full md:w-auto"
                          disabled={createRideMutation.isPending}
                        >
                          {createRideMutation.isPending ? "Publishing..." : "Publish Ride"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Tips for Drivers</CardTitle>
                    <CardDescription>
                      Make the most of your ride offer
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-gray-600">Be specific about your pickup and drop-off points</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-gray-600">Set a fair price based on distance and current fuel prices</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-gray-600">Add details about your car and any special conditions</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-gray-600">Be punctual and communicate with your passengers</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-gray-600">For recurring rides, make sure your schedule is consistent</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter className="border-t bg-gray-50 p-4">
                    <div className="flex items-center">
                      <Car className="h-5 w-5 text-primary mr-2" />
                      <p className="text-sm text-gray-600">
                        You're registered as a driver with a {user?.carModel || "vehicle"}
                      </p>
                    </div>
                  </CardFooter>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Safety First</CardTitle>
                    <CardDescription>
                      Remember these important safety tips
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-xs font-bold text-red-600">!</span>
                        </div>
                        <span className="text-sm text-gray-600">Verify your passengers' identities</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-xs font-bold text-red-600">!</span>
                        </div>
                        <span className="text-sm text-gray-600">Share your trip details with a trusted friend</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-xs font-bold text-red-600">!</span>
                        </div>
                        <span className="text-sm text-gray-600">Ensure your vehicle is in good condition</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-xs font-bold text-red-600">!</span>
                        </div>
                        <span className="text-sm text-gray-600">Follow traffic rules and drive safely</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
