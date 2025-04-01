import { users, rides, bookings, messages, reviews } from "@shared/schema";
import type { User, InsertUser, Ride, InsertRide, Booking, InsertBooking, Message, InsertMessage, Review, InsertReview } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Ride operations
  getRide(id: number): Promise<Ride | undefined>;
  getRides(): Promise<Ride[]>;
  getRidesByDriver(driverId: number): Promise<Ride[]>;
  getRidesByUniversity(university: string): Promise<Ride[]>;
  createRide(ride: InsertRide): Promise<Ride>;
  updateRide(id: number, ride: Partial<Ride>): Promise<Ride | undefined>;
  deleteRide(id: number): Promise<boolean>;
  
  // Booking operations
  getBooking(id: number): Promise<Booking | undefined>;
  getBookingsByRide(rideId: number): Promise<Booking[]>;
  getBookingsByPassenger(passengerId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, booking: Partial<Booking>): Promise<Booking | undefined>;
  deleteBooking(id: number): Promise<boolean>;
  
  // Message operations
  getMessage(id: number): Promise<Message | undefined>;
  getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<boolean>;
  
  // Review operations
  getReview(id: number): Promise<Review | undefined>;
  getReviewsByReviewee(revieweeId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private rides: Map<number, Ride>;
  private bookings: Map<number, Booking>;
  private messages: Map<number, Message>;
  private reviews: Map<number, Review>;
  sessionStore: session.SessionStore;
  
  private userIdCounter: number;
  private rideIdCounter: number;
  private bookingIdCounter: number;
  private messageIdCounter: number;
  private reviewIdCounter: number;

  constructor() {
    this.users = new Map();
    this.rides = new Map();
    this.bookings = new Map();
    this.messages = new Map();
    this.reviews = new Map();
    
    this.userIdCounter = 1;
    this.rideIdCounter = 1;
    this.bookingIdCounter = 1;
    this.messageIdCounter = 1;
    this.reviewIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Add some initial data
    this.createUser({
      username: "johndoe",
      password: "password", // Will be hashed in auth.ts
      fullName: "John Doe",
      email: "john@example.com",
      university: "Mapúa Malayan Colleges Laguna (MMCL)",
      isDriver: true,
      carModel: "Toyota Vios",
      licensePlate: "ABC 123"
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { ...insertUser, id, rating: 0, reviewCount: 0, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Ride methods
  async getRide(id: number): Promise<Ride | undefined> {
    return this.rides.get(id);
  }

  async getRides(): Promise<Ride[]> {
    return Array.from(this.rides.values()).filter(ride => ride.status === "active");
  }

  async getRidesByDriver(driverId: number): Promise<Ride[]> {
    return Array.from(this.rides.values()).filter(
      (ride) => ride.driverId === driverId
    );
  }

  async getRidesByUniversity(university: string): Promise<Ride[]> {
    // This is a simplified approach - in a real app, we'd have more complex geographic matching
    const driversFromUniversity = Array.from(this.users.values())
      .filter(user => user.university === university && user.isDriver)
      .map(user => user.id);
    
    return Array.from(this.rides.values())
      .filter(ride => driversFromUniversity.includes(ride.driverId) && ride.status === "active");
  }

  async createRide(insertRide: InsertRide): Promise<Ride> {
    const id = this.rideIdCounter++;
    const now = new Date();
    const ride: Ride = { ...insertRide, id, createdAt: now };
    this.rides.set(id, ride);
    return ride;
  }

  async updateRide(id: number, rideData: Partial<Ride>): Promise<Ride | undefined> {
    const ride = this.rides.get(id);
    if (!ride) return undefined;
    
    const updatedRide = { ...ride, ...rideData };
    this.rides.set(id, updatedRide);
    return updatedRide;
  }

  async deleteRide(id: number): Promise<boolean> {
    return this.rides.delete(id);
  }

  // Booking methods
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookingsByRide(rideId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.rideId === rideId
    );
  }

  async getBookingsByPassenger(passengerId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.passengerId === passengerId
    );
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.bookingIdCounter++;
    const now = new Date();
    const booking: Booking = { ...insertBooking, id, createdAt: now };
    this.bookings.set(id, booking);
    
    // Update ride available seats
    const ride = this.rides.get(booking.rideId);
    if (ride) {
      ride.availableSeats -= 1;
      this.rides.set(ride.id, ride);
    }
    
    return booking;
  }

  async updateBooking(id: number, bookingData: Partial<Booking>): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    const updatedBooking = { ...booking, ...bookingData };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  async deleteBooking(id: number): Promise<boolean> {
    const booking = this.bookings.get(id);
    if (!booking) return false;
    
    // Restore ride available seats if cancelling
    const ride = this.rides.get(booking.rideId);
    if (ride) {
      ride.availableSeats += 1;
      this.rides.set(ride.id, ride);
    }
    
    return this.bookings.delete(id);
  }

  // Message methods
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => 
        (message.senderId === user1Id && message.receiverId === user2Id) ||
        (message.senderId === user2Id && message.receiverId === user1Id)
    ).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const now = new Date();
    const message: Message = { ...insertMessage, id, read: false, createdAt: now };
    this.messages.set(id, message);
    return message;
  }

  async markMessageAsRead(id: number): Promise<boolean> {
    const message = this.messages.get(id);
    if (!message) return false;
    
    message.read = true;
    this.messages.set(id, message);
    return true;
  }

  // Review methods
  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async getReviewsByReviewee(revieweeId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.revieweeId === revieweeId
    );
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.reviewIdCounter++;
    const now = new Date();
    const review: Review = { ...insertReview, id, createdAt: now };
    this.reviews.set(id, review);
    
    // Update user rating
    const reviewee = this.users.get(review.revieweeId);
    if (reviewee) {
      const userReviews = await this.getReviewsByReviewee(reviewee.id);
      const totalRating = userReviews.reduce((acc, curr) => acc + curr.rating, 0);
      const newRating = totalRating / userReviews.length;
      reviewee.rating = parseFloat(newRating.toFixed(1));
      reviewee.reviewCount = userReviews.length;
      this.users.set(reviewee.id, reviewee);
    }
    
    return review;
  }
}

export const storage = new MemStorage();
