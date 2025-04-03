import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Helmet } from "react-helmet";
import { UNIVERSITY_NAMES } from "@/lib/data";
import { Car, Users, UserPlus, LogIn } from "lucide-react";
import { insertUserSchema, loginSchema } from "@shared/schema";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [location, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const [isDriver, setIsDriver] = useState(false);

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      university: "",
      phone: "",
      bio: "",
      isDriver: false,
      carModel: "",
      licensePlate: "",
    },
  });

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const onLoginSubmit = (data) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        // Force redirect to home page on successful login
        setTimeout(() => navigate('/'), 300);
      }
    });
  };

  const onRegisterSubmit = (data) => {
    const { confirmPassword, ...registerData } = data;
    registerData.isDriver = isDriver;
    registerMutation.mutate(registerData, {
      onSuccess: () => {
        // Force redirect to home page on successful registration
        setTimeout(() => navigate('/'), 300);
      }
    });
  };

  const handleDriverToggle = (value) => {
    setIsDriver(value);
    registerForm.setValue("isDriver", value);
  };

  return (
    <>
      <Helmet>
        <title>Sign In or Register | TripSync - Carpooling for Students</title>
        <meta name="description" content="Join TripSync and start carpooling with students from your university. Save money, make friends, and help the environment." />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <div className="flex md:flex-row flex-col min-h-[calc(100vh-64px)]">
            <div className="md:w-1/2 w-full bg-white flex items-center justify-center">
              <div className="max-w-md w-full p-6">
                <div className="mb-8 text-center">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to TripSync</h1>
                  <p className="text-gray-600">The student carpooling platform that saves you money and connects you with classmates</p>
                </div>

                <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-2 mb-6">
                    <TabsTrigger value="login" className="flex items-center">
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger value="register" className="flex items-center">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Register
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <Card>
                      <CardHeader>
                        <CardTitle>Sign In</CardTitle>
                        <CardDescription>
                          Enter your credentials to access your account
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Form {...loginForm}>
                          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                            <FormField
                              control={loginForm.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your username" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={loginForm.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Enter your password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button 
                              type="submit" 
                              className="w-full" 
                              disabled={loginMutation.isPending}
                            >
                              {loginMutation.isPending ? "Signing in..." : "Sign In"}
                            </Button>
                          </form>
                        </Form>
                      </CardContent>
                      <CardFooter className="flex flex-col space-y-2">
                        <div className="text-sm text-gray-500 text-center">
                          Don't have an account?{" "}
                          <button 
                            className="text-primary hover:underline" 
                            onClick={() => setActiveTab("register")}
                          >
                            Register here
                          </button>
                        </div>
                      </CardFooter>
                    </Card>
                  </TabsContent>

                  <TabsContent value="register">
                    <Card>
                      <CardHeader>
                        <CardTitle>Create an Account</CardTitle>
                        <CardDescription>
                          Sign up to start carpooling with students from your university
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Form {...registerForm}>
                          <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                            <FormField
                              control={registerForm.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Create a username" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={registerForm.control}
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
                            <FormField
                              control={registerForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input type="email" placeholder="Your email address" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={registerForm.control}
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
                            <FormField
                              control={registerForm.control}
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
                                      {UNIVERSITY_NAMES.map((uni, index) => (
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
                              control={registerForm.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Create a password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={registerForm.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Confirm Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Confirm your password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="space-y-2">
                              <Label>Are you a driver?</Label>
                              <div className="grid grid-cols-2 gap-2">
                                <Button
                                  type="button"
                                  variant={isDriver ? "default" : "outline"}
                                  className="flex items-center justify-center"
                                  onClick={() => handleDriverToggle(true)}
                                >
                                  <Car className="mr-2 h-4 w-4" />
                                  Yes, I'm a Driver
                                </Button>
                                <Button
                                  type="button"
                                  variant={!isDriver ? "default" : "outline"}
                                  className="flex items-center justify-center"
                                  onClick={() => handleDriverToggle(false)}
                                >
                                  <Users className="mr-2 h-4 w-4" />
                                  No, Just Passenger
                                </Button>
                              </div>
                            </div>
                            
                            {isDriver && (
                              <div className="space-y-4">
                                <FormField
                                  control={registerForm.control}
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
                                  control={registerForm.control}
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
                            )}
                            
                            <FormField
                              control={registerForm.control}
                              name="bio"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Bio (optional)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Tell us a bit about yourself" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <Button 
                              type="submit" 
                              className="w-full" 
                              disabled={registerMutation.isPending}
                            >
                              {registerMutation.isPending ? "Creating account..." : "Create Account"}
                            </Button>
                          </form>
                        </Form>
                      </CardContent>
                      <CardFooter className="flex flex-col space-y-2">
                        <div className="text-sm text-gray-500 text-center">
                          Already have an account?{" "}
                          <button 
                            className="text-primary hover:underline" 
                            onClick={() => setActiveTab("login")}
                          >
                            Sign in here
                          </button>
                        </div>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            <div className="md:w-1/2 w-full bg-primary relative hidden md:block">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2760%27%20height%3D%2760%27%20viewBox%3D%270%200%2060%2060%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cg%20fill%3D%27none%27%20fill-rule%3D%27evenodd%27%3E%3Cg%20fill%3D%27%23ffffff%27%20fill-opacity%3D%270.05%27%3E%3Cpath%20d%3D%27M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%27%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]"></div>
              <div className="relative h-full flex flex-col justify-center px-8 z-10">
                <div className="bg-primary-800/60 rounded-lg p-8 backdrop-blur-sm">
                  <h2 className="text-3xl font-bold text-white mb-4">Join the TripSync Community</h2>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="ml-3 text-white">Save up to 70% on transportation costs</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="ml-3 text-white">Verified student profiles for safety</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="ml-3 text-white">Make connections with classmates</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="ml-3 text-white">Real-time ride tracking for security</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="ml-3 text-white">Reduce your carbon footprint</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-8">
                  <div className="relative">
                    <img 
                      src="https://images.unsplash.com/photo-1499083097717-a156f85f0516?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                      alt="Students carpooling" 
                      className="rounded-lg shadow-lg" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black opacity-60 rounded-lg"></div>
                    <div className="absolute bottom-0 left-0 p-6">
                      <p className="text-white text-lg font-medium">Join 5,000+ students already saving</p>
                      <div className="flex -space-x-2 mt-2">
                        <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" />
                        <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" />
                        <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" />
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-700 flex items-center justify-center">
                          <span className="text-xs font-medium text-white">+4k</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
