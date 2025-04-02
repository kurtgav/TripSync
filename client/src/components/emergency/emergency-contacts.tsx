import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Edit, Trash2, AlertCircle, UserMinus } from "lucide-react";
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
import { Input } from "@/components/ui/input";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EmergencyContact } from "@shared/schema";

// Emergency contact form schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  relationship: z.string().min(2, { message: "Relationship must be at least 2 characters" }),
  phone: z.string().min(7, { message: "Phone number is required" }),
  email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal("")),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function EmergencyContacts() {
  const { toast } = useToast();
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isEditContactOpen, setIsEditContactOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<EmergencyContact | null>(null);
  
  // Fetch emergency contacts
  const { data: contacts = [], isLoading } = useQuery<EmergencyContact[]>({
    queryKey: ['/api/emergency-contacts'],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/emergency-contacts");
      return res.json();
    }
  });
  
  // Add contact form
  const addContactForm = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      relationship: "",
      phone: "",
      email: "",
    },
  });
  
  // Edit contact form
  const editContactForm = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      relationship: "",
      phone: "",
      email: "",
    },
  });
  
  // Reset form when dialog closes
  useEffect(() => {
    if (!isAddContactOpen) {
      addContactForm.reset();
    }
  }, [isAddContactOpen, addContactForm]);
  
  // Set form values when editing a contact
  useEffect(() => {
    if (currentContact && isEditContactOpen) {
      editContactForm.reset({
        name: currentContact.name,
        relationship: currentContact.relationship,
        phone: currentContact.phone,
        email: currentContact.email || "",
      });
    }
  }, [currentContact, isEditContactOpen, editContactForm]);
  
  // Create contact mutation
  const createContactMutation = useMutation({
    mutationFn: async (values: ContactFormValues) => {
      const res = await apiRequest("POST", "/api/emergency-contacts", values);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/emergency-contacts'] });
      setIsAddContactOpen(false);
      toast({
        title: "Contact added",
        description: "Emergency contact has been added successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error adding contact",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update contact mutation
  const updateContactMutation = useMutation({
    mutationFn: async ({ id, values }: { id: number; values: ContactFormValues }) => {
      const res = await apiRequest("PUT", `/api/emergency-contacts/${id}`, values);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/emergency-contacts'] });
      setIsEditContactOpen(false);
      setCurrentContact(null);
      toast({
        title: "Contact updated",
        description: "Emergency contact has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating contact",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete contact mutation
  const deleteContactMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/emergency-contacts/${id}`);
      return res.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/emergency-contacts'] });
      toast({
        title: "Contact deleted",
        description: "Emergency contact has been removed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting contact",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onAddContactSubmit = (values: ContactFormValues) => {
    createContactMutation.mutate(values);
  };
  
  const onEditContactSubmit = (values: ContactFormValues) => {
    if (currentContact) {
      updateContactMutation.mutate({ id: currentContact.id, values });
    }
  };
  
  const handleEdit = (contact: EmergencyContact) => {
    setCurrentContact(contact);
    setIsEditContactOpen(true);
  };
  
  const handleDelete = (id: number) => {
    deleteContactMutation.mutate(id);
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Emergency Contacts</CardTitle>
            <CardDescription>
              Add people to contact in case of emergency during your trips
            </CardDescription>
          </div>
          <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <PlusCircle className="h-4 w-4" />
                <span>Add Contact</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Emergency Contact</DialogTitle>
                <DialogDescription>
                  Add someone who can be contacted in case of emergency
                </DialogDescription>
              </DialogHeader>
              <Form {...addContactForm}>
                <form onSubmit={addContactForm.handleSubmit(onAddContactSubmit)} className="space-y-4">
                  <FormField
                    control={addContactForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Contact's full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={addContactForm.control}
                    name="relationship"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Parent, Sibling, Friend" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={addContactForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Contact's phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={addContactForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Contact's email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={createContactMutation.isPending}
                    >
                      {createContactMutation.isPending ? "Adding..." : "Add Contact"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border rounded-md border-dashed border-gray-300">
            <UserMinus className="h-10 w-10 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No emergency contacts</h3>
            <p className="mt-1 text-sm text-gray-500 mb-4">
              You have not added any emergency contacts yet.
            </p>
            <Button 
              variant="outline" 
              className="mt-2" 
              onClick={() => setIsAddContactOpen(true)}
            >
              Add your first contact
            </Button>
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Relationship</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell>{contact.relationship}</TableCell>
                    <TableCell>
                      <div>{contact.phone}</div>
                      {contact.email && (
                        <div className="text-sm text-gray-500">{contact.email}</div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(contact)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-red-500" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete emergency contact</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this emergency contact? This action
                                cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleDelete(contact.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t bg-gray-50 text-sm text-gray-500">
        <div className="flex items-center">
          <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
          These contacts will be notified in case you trigger an emergency alert
        </div>
      </CardFooter>
      
      {/* Edit Contact Dialog */}
      <Dialog open={isEditContactOpen} onOpenChange={setIsEditContactOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Emergency Contact</DialogTitle>
            <DialogDescription>
              Update your emergency contact's information
            </DialogDescription>
          </DialogHeader>
          <Form {...editContactForm}>
            <form onSubmit={editContactForm.handleSubmit(onEditContactSubmit)} className="space-y-4">
              <FormField
                control={editContactForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Contact's full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editContactForm.control}
                name="relationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Parent, Sibling, Friend" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editContactForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Contact's phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editContactForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Contact's email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={updateContactMutation.isPending}
                >
                  {updateContactMutation.isPending ? "Updating..." : "Update Contact"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}