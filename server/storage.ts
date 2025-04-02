import { users, rides, bookings, messages, reviews, emergencyContacts, emergencyAlerts } from "@shared/schema";
import type { 
  User, InsertUser, 
  Ride, InsertRide, 
  Booking, InsertBooking, 
  Message, InsertMessage, 
  Review, InsertReview,
  EmergencyContact, InsertEmergencyContact,
  EmergencyAlert, InsertEmergencyAlert
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { eq, and, or, desc } from "drizzle-orm";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);
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
  
  // Emergency contact operations
  getEmergencyContacts(userId: number): Promise<EmergencyContact[]>;
  getEmergencyContact(id: number): Promise<EmergencyContact | undefined>;
  createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact>;
  updateEmergencyContact(id: number, contact: Partial<EmergencyContact>): Promise<EmergencyContact | undefined>;
  deleteEmergencyContact(id: number): Promise<boolean>;
  
  // Emergency alert operations
  getEmergencyAlerts(userId: number): Promise<EmergencyAlert[]>;
  getActiveEmergencyAlerts(): Promise<EmergencyAlert[]>;
  getEmergencyAlert(id: number): Promise<EmergencyAlert | undefined>;
  createEmergencyAlert(alert: InsertEmergencyAlert): Promise<EmergencyAlert>;
  resolveEmergencyAlert(id: number): Promise<boolean>;
  
  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private rides: Map<number, Ride>;
  private bookings: Map<number, Booking>;
  private messages: Map<number, Message>;
  private reviews: Map<number, Review>;
  private emergencyContacts: Map<number, EmergencyContact>;
  private emergencyAlerts: Map<number, EmergencyAlert>;
  sessionStore: session.Store;
  
  private userIdCounter: number;
  private rideIdCounter: number;
  private bookingIdCounter: number;
  private messageIdCounter: number;
  private reviewIdCounter: number;
  private emergencyContactIdCounter: number;
  private emergencyAlertIdCounter: number;

  constructor() {
    this.users = new Map();
    this.rides = new Map();
    this.bookings = new Map();
    this.messages = new Map();
    this.reviews = new Map();
    this.emergencyContacts = new Map();
    this.emergencyAlerts = new Map();
    
    this.userIdCounter = 1;
    this.rideIdCounter = 1;
    this.bookingIdCounter = 1;
    this.messageIdCounter = 1;
    this.reviewIdCounter = 1;
    this.emergencyContactIdCounter = 1;
    this.emergencyAlertIdCounter = 1;
    
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
  
  // Emergency Contact methods
  async getEmergencyContacts(userId: number): Promise<EmergencyContact[]> {
    return Array.from(this.emergencyContacts.values()).filter(
      (contact) => contact.userId === userId
    );
  }
  
  async getEmergencyContact(id: number): Promise<EmergencyContact | undefined> {
    return this.emergencyContacts.get(id);
  }
  
  async createEmergencyContact(insertContact: InsertEmergencyContact): Promise<EmergencyContact> {
    const id = this.emergencyContactIdCounter++;
    const now = new Date();
    const contact: EmergencyContact = { ...insertContact, id, createdAt: now };
    this.emergencyContacts.set(id, contact);
    return contact;
  }
  
  async updateEmergencyContact(id: number, contactData: Partial<EmergencyContact>): Promise<EmergencyContact | undefined> {
    const contact = this.emergencyContacts.get(id);
    if (!contact) return undefined;
    
    const updatedContact = { ...contact, ...contactData };
    this.emergencyContacts.set(id, updatedContact);
    return updatedContact;
  }
  
  async deleteEmergencyContact(id: number): Promise<boolean> {
    return this.emergencyContacts.delete(id);
  }
  
  // Emergency Alert methods
  async getEmergencyAlerts(userId: number): Promise<EmergencyAlert[]> {
    return Array.from(this.emergencyAlerts.values()).filter(
      (alert) => alert.userId === userId
    );
  }
  
  async getActiveEmergencyAlerts(): Promise<EmergencyAlert[]> {
    return Array.from(this.emergencyAlerts.values()).filter(
      (alert) => !alert.resolvedAt
    );
  }
  
  async getEmergencyAlert(id: number): Promise<EmergencyAlert | undefined> {
    return this.emergencyAlerts.get(id);
  }
  
  async createEmergencyAlert(insertAlert: InsertEmergencyAlert): Promise<EmergencyAlert> {
    const id = this.emergencyAlertIdCounter++;
    const now = new Date();
    const alert: EmergencyAlert = { ...insertAlert, id, resolvedAt: null, createdAt: now };
    this.emergencyAlerts.set(id, alert);
    return alert;
  }
  
  async resolveEmergencyAlert(id: number): Promise<boolean> {
    const alert = this.emergencyAlerts.get(id);
    if (!alert) return false;
    
    alert.resolvedAt = new Date();
    this.emergencyAlerts.set(id, alert);
    return true;
  }
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool: pool,
      createTableIfMissing: true 
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(
      eq(users.username, username)
    );
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(
      eq(users.email, email)
    );
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values({
      ...insertUser,
      rating: 0,
      reviewCount: 0
    }).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    // Don't allow changing id or createdAt
    const { id: _, createdAt: __, ...updateData } = userData;
    
    const [updatedUser] = await db.update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    
    return updatedUser;
  }

  // Ride methods
  async getRide(id: number): Promise<Ride | undefined> {
    const [ride] = await db.select().from(rides).where(eq(rides.id, id));
    return ride;
  }

  async getRides(): Promise<Ride[]> {
    return await db.select().from(rides).where(eq(rides.status, "active"));
  }

  async getRidesByDriver(driverId: number): Promise<Ride[]> {
    return await db.select().from(rides).where(eq(rides.driverId, driverId));
  }

  async getRidesByUniversity(university: string): Promise<Ride[]> {
    // This requires a join with the users table
    const universityDrivers = await db.select({ id: users.id })
      .from(users)
      .where(and(
        eq(users.university, university),
        eq(users.isDriver, true)
      ));
    
    const driverIds = universityDrivers.map(driver => driver.id);
    
    if (driverIds.length === 0) {
      return [];
    }
    
    return await db.select().from(rides)
      .where(and(
        eq(rides.status, "active"),
        // Use "in" operator to check if driverId is in the list of university drivers
        rides.driverId.in(driverIds)
      ));
  }

  async createRide(insertRide: InsertRide): Promise<Ride> {
    console.log("Creating ride:", insertRide);  // Debug log
    
    // Ensure all nullable fields are explicitly set to null rather than undefined
    const cleanData = {
      ...insertRide,
      status: insertRide.status || "active",
      description: insertRide.description ?? null,
      recurring: insertRide.recurring ?? false,
      recurringDays: insertRide.recurringDays ?? null
    };
    
    console.log("Clean ride data for DB:", cleanData);
    
    try {
      const [ride] = await db.insert(rides).values(cleanData).returning();
      console.log("Ride created successfully:", ride);
      return ride;
    } catch (error) {
      console.error("Database error creating ride:", error);
      throw error;
    }
  }

  async updateRide(id: number, rideData: Partial<Ride>): Promise<Ride | undefined> {
    // Don't allow changing id or createdAt
    const { id: _, createdAt: __, ...updateData } = rideData;
    
    const [updatedRide] = await db.update(rides)
      .set(updateData)
      .where(eq(rides.id, id))
      .returning();
    
    return updatedRide;
  }

  async deleteRide(id: number): Promise<boolean> {
    const result = await db.delete(rides).where(eq(rides.id, id));
    return result.count > 0;
  }

  // Booking methods
  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async getBookingsByRide(rideId: number): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.rideId, rideId));
  }

  async getBookingsByPassenger(passengerId: number): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.passengerId, passengerId));
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const [booking] = await db.insert(bookings).values(insertBooking).returning();
    
    // Update ride available seats
    const ride = await this.getRide(booking.rideId);
    if (ride) {
      await db.update(rides)
        .set({ availableSeats: ride.availableSeats - 1 })
        .where(eq(rides.id, ride.id));
    }
    
    return booking;
  }

  async updateBooking(id: number, bookingData: Partial<Booking>): Promise<Booking | undefined> {
    // Don't allow changing id, rideId, passengerId, or createdAt
    const { id: _, rideId: __, passengerId: ___, createdAt: ____, ...updateData } = bookingData;
    
    const [updatedBooking] = await db.update(bookings)
      .set(updateData)
      .where(eq(bookings.id, id))
      .returning();
    
    return updatedBooking;
  }

  async deleteBooking(id: number): Promise<boolean> {
    const booking = await this.getBooking(id);
    if (!booking) return false;
    
    // Restore ride available seats
    const ride = await this.getRide(booking.rideId);
    if (ride) {
      await db.update(rides)
        .set({ availableSeats: ride.availableSeats + 1 })
        .where(eq(rides.id, ride.id));
    }
    
    const result = await db.delete(bookings).where(eq(bookings.id, id));
    return result.count > 0;
  }

  // Message methods
  async getMessage(id: number): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message;
  }

  async getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]> {
    return await db.select().from(messages)
      .where(
        and(
          // Either user1 is the sender and user2 is the receiver
          and(eq(messages.senderId, user1Id), eq(messages.receiverId, user2Id)),
          // Or user2 is the sender and user1 is the receiver
          and(eq(messages.senderId, user2Id), eq(messages.receiverId, user1Id))
        )
      )
      .orderBy(messages.createdAt);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages)
      .values({ ...insertMessage, read: false })
      .returning();
    
    return message;
  }

  async markMessageAsRead(id: number): Promise<boolean> {
    const result = await db.update(messages)
      .set({ read: true })
      .where(eq(messages.id, id));
    
    return result.count > 0;
  }

  // Review methods
  async getReview(id: number): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review;
  }

  async getReviewsByReviewee(revieweeId: number): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.revieweeId, revieweeId));
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(insertReview).returning();
    
    // Update user rating
    const userReviews = await this.getReviewsByReviewee(review.revieweeId);
    const totalRating = userReviews.reduce((acc, review) => acc + review.rating, 0);
    const newRating = totalRating / userReviews.length;
    
    await db.update(users)
      .set({ 
        rating: parseFloat(newRating.toFixed(1)), 
        reviewCount: userReviews.length 
      })
      .where(eq(users.id, review.revieweeId));
    
    return review;
  }
  
  // Emergency Contact methods
  async getEmergencyContacts(userId: number): Promise<EmergencyContact[]> {
    return await db.select()
      .from(emergencyContacts)
      .where(eq(emergencyContacts.userId, userId));
  }
  
  async getEmergencyContact(id: number): Promise<EmergencyContact | undefined> {
    const [contact] = await db.select()
      .from(emergencyContacts)
      .where(eq(emergencyContacts.id, id));
    return contact;
  }
  
  async createEmergencyContact(insertContact: InsertEmergencyContact): Promise<EmergencyContact> {
    const [contact] = await db.insert(emergencyContacts)
      .values(insertContact)
      .returning();
    return contact;
  }
  
  async updateEmergencyContact(id: number, contactData: Partial<EmergencyContact>): Promise<EmergencyContact | undefined> {
    // Don't allow changing id, userId, or createdAt
    const { id: _, userId: __, createdAt: ___, ...updateData } = contactData;
    
    const [updatedContact] = await db.update(emergencyContacts)
      .set(updateData)
      .where(eq(emergencyContacts.id, id))
      .returning();
    
    return updatedContact;
  }
  
  async deleteEmergencyContact(id: number): Promise<boolean> {
    const result = await db.delete(emergencyContacts)
      .where(eq(emergencyContacts.id, id));
    return result.rowCount > 0;
  }
  
  // Emergency Alert methods
  async getEmergencyAlerts(userId: number): Promise<EmergencyAlert[]> {
    return await db.select()
      .from(emergencyAlerts)
      .where(eq(emergencyAlerts.userId, userId));
  }
  
  async getActiveEmergencyAlerts(): Promise<EmergencyAlert[]> {
    return await db.select()
      .from(emergencyAlerts)
      .where(eq(emergencyAlerts.status, "active"));
  }
  
  async getEmergencyAlert(id: number): Promise<EmergencyAlert | undefined> {
    const [alert] = await db.select()
      .from(emergencyAlerts)
      .where(eq(emergencyAlerts.id, id));
    return alert;
  }
  
  async createEmergencyAlert(insertAlert: InsertEmergencyAlert): Promise<EmergencyAlert> {
    const [alert] = await db.insert(emergencyAlerts)
      .values({
        ...insertAlert,
        status: "active"
      })
      .returning();
    return alert;
  }
  
  async resolveEmergencyAlert(id: number): Promise<boolean> {
    const now = new Date();
    const result = await db.update(emergencyAlerts)
      .set({ 
        status: "resolved",
        resolvedAt: now
      })
      .where(eq(emergencyAlerts.id, id));
    return result.rowCount > 0;
  }
}

// Switch to database storage
export const storage = new DatabaseStorage();
