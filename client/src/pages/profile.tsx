import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";
import { z } from "zod";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Review } from "@shared/schema";
import { UNIVERSITIES } from "@/lib/data";
import { User, Settings, Car, Star, Shield, Clock } from "lucide-react";

// Profile update schema
const profileFormSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().optional(),
  university: z.string(),
  bio: z.string().optional(),
  isDriver: z.boolean().default(false),
  carModel: z.string().optional(),
  licensePlate: z.string().optional(),
});

// Password update schema
const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [isDriver, setIsDriver] = useState(user?.isDriver || false);
  
  // Get user reviews
  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: [`/api/reviews/user/${user?.id}`],
    enabled: !!user,
  });
  
  // Profile form
  const profileForm = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      university: user?.university || "",
      bio: user?.bio || "",
      isDriver: user?.isDriver || false,
      carModel: user?.carModel || "",
      licensePlate: user?.licensePlate || "",
    },
  });
  
  // Password form
  const passwordForm = useForm({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  // Update form when user data is available
  useEffect(() => {
    if (user) {
      profileForm.reset({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        university: user.university || "",
        bio: user.bio || "",
        isDriver: user.isDriver || false,
        carModel: user.carModel || "",
        licensePlate: user.licensePlate || "",
      });
      setIsDriver(user.isDriver || false);
    }
  }, [user, profileForm]);
  
  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (values) => {
      const res = await apiRequest("PUT", "/api/users/profile", values);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Password update mutation
  const updatePasswordMutation = useMutation({
    mutationFn: async (values) => {
      const res = await apiRequest("PUT", "/api/users/password", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      passwordForm.reset();
    },
    onError: (error) => {
      toast({
        title: "Error updating password",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onProfileSubmit = (values) => {
    updateProfileMutation.mutate(values);
  };
  
  const onPasswordSubmit = (values) => {
    updatePasswordMutation.mutate(values);
  };
  
  const handleDriverToggle = (checked) => {
    setIsDriver(checked);
    profileForm.setValue("isDriver", checked);
  };
  
  if (!user) {
    return null;
  }
  
  function getInitials(name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }
  
  function renderStars(rating) {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= Math.round(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Your Profile | TripSync</title>
        <meta name="description" content="Manage your TripSync profile and account settings" />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 mb-6 md:mb-0 md:pr-8">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col items-center">
                      <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={user.profileImage} alt={user.fullName} />
                        <AvatarFallback className="text-lg">{getInitials(user.fullName)}</AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-center">{user.fullName}</CardTitle>
                      <CardDescription className="text-center">{user.university}</CardDescription>
                      <div className="mt-2 flex items-center">
                        {renderStars(user.rating)}
                        <span className="ml-2 text-sm text-gray-500">
                          {user.rating.toFixed(1)} ({user.reviewCount} reviews)
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap justify-center gap-2">
                        {user.isDriver && (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                            Driver
                          </Badge>
                        )}
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                          Verified Student
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Username</p>
                        <p className="mt-1">{user.username}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="mt-1">{user.email}</p>
                      </div>
                      {user.phone && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Phone</p>
                          <p className="mt-1">{user.phone}</p>
                        </div>
                      )}
                      {user.isDriver && (
                        <>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Car Model</p>
                            <p className="mt-1">{user.carModel || "Not specified"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">License Plate</p>
                            <p className="mt-1">{user.licensePlate || "Not specified"}</p>
                          </div>
                        </>
                      )}
                      {user.bio && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Bio</p>
                          <p className="mt-1 text-sm">{user.bio}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-gray-50 flex justify-between">
                    <div className="text-xs text-gray-500">
                      Member since {format(new Date(user.createdAt), "MMM yyyy")}
                    </div>
                  </CardFooter>
                </Card>
                
                <div className="mt-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Account Safety</h2>
                  <Card>
                    <CardContent className="py-4">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <Shield className="h-5 w-5 text-green-500" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium">Email verification</p>
                            <p className="text-xs text-gray-500">Your email has been verified</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <Clock className="h-5 w-5 text-yellow-500" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium">Student ID verification</p>
                            <p className="text-xs text-gray-500">Submit your student ID for verification</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="md:w-2/3">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-2 md:w-[400px] mb-6">
                    <TabsTrigger value="profile" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Edit Profile
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Account Settings
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="profile">
                    <Card>
                      <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>
                          Update your profile details and preferences
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Form {...profileForm}>
                          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                            <FormField
                              control={profileForm.control}
                              name="fullName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Your full name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField
                                control={profileForm.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Your email address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={profileForm.control}
                                name="phone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Phone (optional)</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Your phone number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={profileForm.control}
                              name="university"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>University</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select your university" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {UNIVERSITIES.map((uni, index) => (
                                        <SelectItem key={index} value={uni}>
                                          {uni}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={profileForm.control}
                              name="bio"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Bio (optional)</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Tell other users about yourself..."
                                      className="resize-none h-20"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={profileForm.control}
                              name="isDriver"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                      <div className="flex items-center">
                                        <Car className="h-5 w-5 mr-2 text-primary" />
                                        Driver Status
                                      </div>
                                    </FormLabel>
                                    <FormDescription>
                                      Register as a driver to offer rides to other students
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={(checked) => {
                                        field.onChange(checked);
                                        handleDriverToggle(checked);
                                      }}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            {isDriver && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <FormField
                                    control={profileForm.control}
                                    name="carModel"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Car Model</FormLabel>
                                        <FormControl>
                                          <Input placeholder="e.g. Toyota Vios 2018" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={profileForm.control}
                                    name="licensePlate"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>License Plate</FormLabel>
                                        <FormControl>
                                          <Input placeholder="e.g. ABC 123" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>
                            )}
                            
                            <Button 
                              type="submit" 
                              className="w-full md:w-auto" 
                              disabled={updateProfileMutation.isPending}
                            >
                              {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                            </Button>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                    
                    <div className="mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Reviews</CardTitle>
                          <CardDescription>
                            Reviews from other users about your rides
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {reviews.length === 0 ? (
                            <div className="text-center py-6">
                              <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                              <p className="text-gray-500">No reviews yet</p>
                              <p className="text-sm text-gray-400 mt-1">Reviews will appear here after your rides</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {reviews.map((review) => (
                                <div key={review.id} className="border-b pb-4 last:border-0 last:pb-0">
                                  <div className="flex items-start">
                                    <Avatar className="h-8 w-8 mr-3">
                                      <AvatarFallback>
                                        {getInitials(review.reviewer?.fullName || "User")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between">
                                        <div className="font-medium">{review.reviewer?.fullName || "User"}</div>
                                        <div className="text-xs text-gray-500">
                                          {format(new Date(review.createdAt), "MMM d, yyyy")}
                                        </div>
                                      </div>
                                      <div className="mt-1 flex items-center">
                                        {renderStars(review.rating)}
                                        <span className="ml-2 text-sm text-gray-500">
                                          {review.rating.toFixed(1)}
                                        </span>
                                      </div>
                                      {review.comment && (
                                        <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="settings">
                    <Card>
                      <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                        <CardDescription>
                          Update your password to keep your account secure
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Form {...passwordForm}>
                          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                            <FormField
                              control={passwordForm.control}
                              name="currentPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Current Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Your current password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={passwordForm.control}
                              name="newPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>New Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Your new password" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    Password must be at least 6 characters long
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={passwordForm.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Confirm New Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Confirm your new password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <Button 
                              type="submit" 
                              className="w-full md:w-auto" 
                              disabled={updatePasswordMutation.isPending}
                            >
                              {updatePasswordMutation.isPending ? "Updating..." : "Update Password"}
                            </Button>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                    
                    <div className="mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Notification Preferences</CardTitle>
                          <CardDescription>
                            Choose how you want to be notified
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="font-medium">Email Notifications</p>
                                <p className="text-sm text-gray-500">Receive important updates via email</p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="font-medium">SMS Notifications</p>
                                <p className="text-sm text-gray-500">Get ride alerts on your phone</p>
                              </div>
                              <Switch />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="font-medium">Marketing Communications</p>
                                <p className="text-sm text-gray-500">Receive promotional offers and updates</p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" className="w-full">Save Preferences</Button>
                        </CardFooter>
                      </Card>
                    </div>
                    
                    <div className="mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-red-600">Danger Zone</CardTitle>
                          <CardDescription>
                            Actions that can't be undone
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 w-full">
                              Delete Account
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
