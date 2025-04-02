import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EmergencyAlert, Ride } from "@shared/schema";
import { AlertTriangle, AlertCircle, CircleDashed } from "lucide-react";

// Emergency alert form schema
const alertFormSchema = z.object({
  rideId: z.number(),
  type: z.enum(["medical", "safety", "accident", "other"], {
    required_error: "Please select an emergency type",
  }),
  description: z.string().min(10, { message: "Please provide at least 10 characters of description" }),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

export type AlertFormValues = z.infer<typeof alertFormSchema>;

interface EmergencyAlertProps {
  ride: Ride | null;
}

export default function EmergencyAlert({ ride }: EmergencyAlertProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [position, setPosition] = useState<{ latitude: string; longitude: string } | null>(null);
  
  // Create alert form
  const alertForm = useForm<AlertFormValues>({
    resolver: zodResolver(alertFormSchema),
    defaultValues: {
      rideId: ride?.id || 0,
      type: "safety",
      description: "",
      latitude: "",
      longitude: "",
    },
  });
  
  // Update form when ride data changes
  useEffect(() => {
    if (ride) {
      alertForm.setValue("rideId", ride.id);
    }
  }, [ride, alertForm]);
  
  // Get current position when dialog opens
  useEffect(() => {
    if (isAlertDialogOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition({
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          });
          alertForm.setValue("latitude", position.coords.latitude.toString());
          alertForm.setValue("longitude", position.coords.longitude.toString());
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location error",
            description: "Unable to access your current location. Location data will not be included.",
            variant: "destructive",
          });
        }
      );
    }
  }, [isAlertDialogOpen, alertForm, toast]);
  
  // Create alert mutation
  const createAlertMutation = useMutation({
    mutationFn: async (values: AlertFormValues) => {
      const res = await apiRequest("POST", "/api/emergency-alerts", values);
      return res.json();
    },
    onSuccess: () => {
      setIsAlertDialogOpen(false);
      toast({
        title: "Emergency alert sent",
        description: "Your emergency contacts have been notified.",
        variant: "destructive",
      });
      alertForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error sending alert",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmitAlert = (values: AlertFormValues) => {
    createAlertMutation.mutate(values);
  };
  
  if (!ride) {
    return null;
  }
  
  return (
    <div className="mt-4">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="w-full gap-2">
            <AlertCircle className="h-5 w-5" />
            Emergency Alert
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Emergency Alert</AlertDialogTitle>
            <AlertDialogDescription>
              This will notify your emergency contacts and alert the TripSync support team.
              Only use this feature in real emergencies.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <p className="text-red-600 font-semibold flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Are you sure you want to send an emergency alert?
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 gap-2"
              onClick={() => setIsAlertDialogOpen(true)}
            >
              <CircleDashed className="h-4 w-4" />
              Yes, I Need Help
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Alert Details Dialog */}
      <Dialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Emergency Alert Details</DialogTitle>
            <DialogDescription>
              Please provide information about your emergency situation
            </DialogDescription>
          </DialogHeader>
          <Form {...alertForm}>
            <form onSubmit={alertForm.handleSubmit(onSubmitAlert)} className="space-y-4">
              <FormField
                control={alertForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Emergency Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="medical" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Medical Emergency
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="safety" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Safety Concern
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="accident" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Accident
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="other" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Other Emergency
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={alertForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please describe your emergency situation in detail"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide as much detail as possible about your current situation
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {position && (
                <div className="text-sm">
                  <p className="text-muted-foreground">Your current location will be shared with emergency contacts</p>
                </div>
              )}
              
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={createAlertMutation.isPending}
                  className="bg-red-600 hover:bg-red-700 w-full"
                >
                  {createAlertMutation.isPending ? "Sending Alert..." : "Send Emergency Alert"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}