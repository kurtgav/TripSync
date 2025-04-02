import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertRideSchema, insertBookingSchema, insertMessageSchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Rides routes
  app.get("/api/rides", async (req, res) => {
    try {
      const rides = await storage.getRides();
      res.json(rides);
    } catch (error) {
      console.error("Error getting rides:", error);
      res.status(500).send("Failed to get rides");
    }
  });

  app.get("/api/rides/university/:university", async (req, res) => {
    try {
      const university = req.params.university;
      const rides = await storage.getRidesByUniversity(university);
      res.json(rides);
    } catch (error) {
      console.error("Error getting university rides:", error);
      res.status(500).send("Failed to get university rides");
    }
  });

  app.get("/api/rides/driver/:driverId", async (req, res) => {
    try {
      const driverId = parseInt(req.params.driverId);
      const rides = await storage.getRidesByDriver(driverId);
      res.json(rides);
    } catch (error) {
      console.error("Error getting driver rides:", error);
      res.status(500).send("Failed to get driver rides");
    }
  });

  app.get("/api/rides/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const ride = await storage.getRide(id);
      if (!ride) {
        return res.status(404).send("Ride not found");
      }
      res.json(ride);
    } catch (error) {
      console.error("Error getting ride:", error);
      res.status(500).send("Failed to get ride");
    }
  });

  app.post("/api/rides", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("You must be logged in to create a ride");
    }

    try {
      console.log("Received ride data:", req.body);
      
      // Check if user is a driver
      if (!req.user.isDriver) {
        return res.status(403).send("Only drivers can create rides");
      }
      
      // Validate input - ensure driverId matches current user
      if (req.body.driverId && req.body.driverId !== req.user.id) {
        return res.status(400).send("Driver ID must match the current user's ID");
      }
      
      // Validate and parse the data
      // Convert departureTime string to a Date object if it's a string
      let dataToValidate = { ...req.body };
      
      if (typeof dataToValidate.departureTime === 'string') {
        console.log("Converting departure time from:", dataToValidate.departureTime);
        // Parse the ISO date string to create a Date object
        dataToValidate.departureTime = new Date(dataToValidate.departureTime);
        console.log("Converted to Date object:", dataToValidate.departureTime);
      }
      
      const validatedData = insertRideSchema.parse({
        ...dataToValidate,
        driverId: req.user.id, // Always use the authenticated user's ID
        status: "active" // Ensure status is set
      });
      
      console.log("Validated ride data:", validatedData);
      
      const ride = await storage.createRide(validatedData);
      console.log("Created ride:", ride);
      
      res.status(201).json(ride);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error:", error.errors);
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating ride:", error);
      res.status(500).send("Failed to create ride");
    }
  });

  app.put("/api/rides/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("You must be logged in to update a ride");
    }

    try {
      const id = parseInt(req.params.id);
      const ride = await storage.getRide(id);
      
      if (!ride) {
        return res.status(404).send("Ride not found");
      }
      
      // Check if user is the ride owner
      if (ride.driverId !== req.user.id) {
        return res.status(403).send("You can only update your own rides");
      }
      
      const updatedRide = await storage.updateRide(id, req.body);
      res.json(updatedRide);
    } catch (error) {
      console.error("Error updating ride:", error);
      res.status(500).send("Failed to update ride");
    }
  });

  app.delete("/api/rides/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("You must be logged in to delete a ride");
    }

    try {
      const id = parseInt(req.params.id);
      const ride = await storage.getRide(id);
      
      if (!ride) {
        return res.status(404).send("Ride not found");
      }
      
      // Check if user is the ride owner
      if (ride.driverId !== req.user.id) {
        return res.status(403).send("You can only delete your own rides");
      }
      
      // Get all bookings for this ride
      const bookings = await storage.getBookingsByRide(id);
      
      // Update all bookings to cancelled
      for (const booking of bookings) {
        if (booking.status === "confirmed" || booking.status === "pending") {
          await storage.updateBooking(booking.id, { status: "cancelled" });
        }
      }
      
      const success = await storage.deleteRide(id);
      if (success) {
        res.sendStatus(204);
      } else {
        res.status(500).send("Failed to delete ride");
      }
    } catch (error) {
      console.error("Error deleting ride:", error);
      res.status(500).send("Failed to delete ride");
    }
  });

  // Bookings routes
  app.get("/api/bookings/ride/:rideId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("You must be logged in to view bookings");
    }

    try {
      const rideId = parseInt(req.params.rideId);
      const ride = await storage.getRide(rideId);
      
      if (!ride) {
        return res.status(404).send("Ride not found");
      }
      
      // Only the ride owner can see all bookings
      if (ride.driverId !== req.user.id) {
        return res.status(403).send("You can only view bookings for your own rides");
      }
      
      const bookings = await storage.getBookingsByRide(rideId);
      res.json(bookings);
    } catch (error) {
      console.error("Error getting bookings:", error);
      res.status(500).send("Failed to get bookings");
    }
  });

  app.get("/api/bookings/passenger", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("You must be logged in to view your bookings");
    }

    try {
      const bookings = await storage.getBookingsByPassenger(req.user.id);
      res.json(bookings);
    } catch (error) {
      console.error("Error getting passenger bookings:", error);
      res.status(500).send("Failed to get passenger bookings");
    }
  });

  app.post("/api/bookings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("You must be logged in to book a ride");
    }

    try {
      // Validate input
      const validatedData = insertBookingSchema.parse(req.body);
      
      // Check if ride exists and has available seats
      const ride = await storage.getRide(validatedData.rideId);
      if (!ride) {
        return res.status(404).send("Ride not found");
      }
      
      if (ride.availableSeats < 1) {
        return res.status(400).send("No available seats for this ride");
      }
      
      // Check if user is not booking their own ride
      if (ride.driverId === req.user.id) {
        return res.status(400).send("You cannot book your own ride");
      }
      
      // Check if user has already booked this ride
      const existingBookings = await storage.getBookingsByPassenger(req.user.id);
      const alreadyBooked = existingBookings.some(booking => 
        booking.rideId === validatedData.rideId && 
        booking.status !== "cancelled"
      );
      
      if (alreadyBooked) {
        return res.status(400).send("You have already booked this ride");
      }
      
      const booking = await storage.createBooking({
        ...validatedData,
        passengerId: req.user.id
      });
      
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating booking:", error);
      res.status(500).send("Failed to create booking");
    }
  });

  app.put("/api/bookings/:id/status", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("You must be logged in to update a booking");
    }

    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
        return res.status(400).send("Invalid status");
      }
      
      const booking = await storage.getBooking(id);
      if (!booking) {
        return res.status(404).send("Booking not found");
      }
      
      const ride = await storage.getRide(booking.rideId);
      if (!ride) {
        return res.status(404).send("Ride not found");
      }
      
      // Check if user is the passenger or the driver
      if (booking.passengerId !== req.user.id && ride.driverId !== req.user.id) {
        return res.status(403).send("You can only update your own bookings");
      }
      
      // If confirming a booking, reduce available seats
      if (status === "confirmed" && booking.status !== "confirmed") {
        await storage.updateRide(ride.id, { 
          availableSeats: Math.max(0, ride.availableSeats - 1)
        });
      }
      
      // If cancelling a previously confirmed booking, increase available seats
      if (status === "cancelled" && booking.status === "confirmed") {
        await storage.updateRide(ride.id, { 
          availableSeats: ride.availableSeats + 1 
        });
      }
      
      const updatedBooking = await storage.updateBooking(id, { status });
      res.json(updatedBooking);
    } catch (error) {
      console.error("Error updating booking status:", error);
      res.status(500).send("Failed to update booking status");
    }
  });

  // Messages routes
  app.get("/api/messages/:userId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("You must be logged in to view messages");
    }

    try {
      const otherUserId = parseInt(req.params.userId);
      const messages = await storage.getMessagesBetweenUsers(req.user.id, otherUserId);
      res.json(messages);
    } catch (error) {
      console.error("Error getting messages:", error);
      res.status(500).send("Failed to get messages");
    }
  });

  app.post("/api/messages", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("You must be logged in to send messages");
    }

    try {
      // Validate input
      const validatedData = insertMessageSchema.parse(req.body);
      
      // Check if receiver exists
      const receiver = await storage.getUser(validatedData.receiverId);
      if (!receiver) {
        return res.status(404).send("Receiver not found");
      }
      
      const message = await storage.createMessage({
        ...validatedData,
        senderId: req.user.id
      });
      
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating message:", error);
      res.status(500).send("Failed to create message");
    }
  });

  app.put("/api/messages/:id/read", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("You must be logged in to mark messages as read");
    }

    try {
      const id = parseInt(req.params.id);
      const message = await storage.getMessage(id);
      
      if (!message) {
        return res.status(404).send("Message not found");
      }
      
      // Only receiver can mark as read
      if (message.receiverId !== req.user.id) {
        return res.status(403).send("You can only mark messages sent to you as read");
      }
      
      const success = await storage.markMessageAsRead(id);
      if (success) {
        res.sendStatus(204);
      } else {
        res.status(500).send("Failed to mark message as read");
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).send("Failed to mark message as read");
    }
  });

  // Reviews routes
  app.get("/api/reviews/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const reviews = await storage.getReviewsByReviewee(userId);
      res.json(reviews);
    } catch (error) {
      console.error("Error getting reviews:", error);
      res.status(500).send("Failed to get reviews");
    }
  });

  app.post("/api/reviews", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("You must be logged in to leave a review");
    }

    try {
      // Validate input
      const validatedData = insertReviewSchema.parse(req.body);
      
      // Check if reviewee exists
      const reviewee = await storage.getUser(validatedData.revieweeId);
      if (!reviewee) {
        return res.status(404).send("Reviewee not found");
      }
      
      // Check if ride exists
      const ride = await storage.getRide(validatedData.rideId);
      if (!ride) {
        return res.status(404).send("Ride not found");
      }
      
      // Check if reviewer is not reviewing themselves
      if (validatedData.revieweeId === req.user.id) {
        return res.status(400).send("You cannot review yourself");
      }
      
      // Ensure reviewer participated in the ride
      const bookings = await storage.getBookingsByPassenger(req.user.id);
      const participatedInRide = bookings.some(booking => 
        booking.rideId === validatedData.rideId && 
        booking.status === "completed"
      );
      
      const isDriver = ride.driverId === req.user.id;
      
      if (!participatedInRide && !isDriver) {
        return res.status(403).send("You can only review rides you participated in");
      }
      
      const review = await storage.createReview({
        ...validatedData,
        reviewerId: req.user.id
      });
      
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating review:", error);
      res.status(500).send("Failed to create review");
    }
  });

  // User profile route
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).send("User not found");
      }
      
      // Create a sanitized user object without the password
      const sanitizedUser = { ...user };
      delete sanitizedUser.password;
      
      res.json(sanitizedUser);
    } catch (error) {
      console.error("Error getting user:", error);
      res.status(500).send("Failed to get user");
    }
  });

  app.put("/api/users/profile", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("You must be logged in to update your profile");
    }

    try {
      // Don't allow password update through this endpoint
      const { password, ...updateData } = req.body;
      
      const updatedUser = await storage.updateUser(req.user.id, updateData);
      if (!updatedUser) {
        return res.status(404).send("User not found");
      }
      
      // Create a sanitized user object without the password
      const sanitizedUser = { ...updatedUser };
      delete sanitizedUser.password;
      
      res.json(sanitizedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).send("Failed to update profile");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
