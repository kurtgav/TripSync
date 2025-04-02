import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  university: text("university").notNull(),
  profileImage: text("profile_image"),
  bio: text("bio"),
  rating: doublePrecision("rating").default(0),
  reviewCount: integer("review_count").default(0),
  isDriver: boolean("is_driver").default(false),
  carModel: text("car_model"),
  licensePlate: text("license_plate"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const rides = pgTable("rides", {
  id: serial("id").primaryKey(),
  driverId: integer("driver_id").notNull(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  departureTime: timestamp("departure_time").notNull(),
  price: integer("price").notNull(),
  availableSeats: integer("available_seats").notNull(),
  description: text("description"),
  recurring: boolean("recurring").default(false),
  recurringDays: text("recurring_days"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  rideId: integer("ride_id").notNull(),
  passengerId: integer("passenger_id").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, cancelled, completed
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull(),
  receiverId: integer("receiver_id").notNull(),
  content: text("content").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  reviewerId: integer("reviewer_id").notNull(),
  revieweeId: integer("reviewee_id").notNull(),
  rideId: integer("ride_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const emergencyContacts = pgTable("emergency_contacts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  relationship: text("relationship").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const emergencyAlerts = pgTable("emergency_alerts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  rideId: integer("ride_id").notNull(),
  type: text("type").notNull(), // medical, safety, accident, other
  description: text("description"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  status: text("status").notNull().default("active"), // active, resolved
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  rating: true,
  reviewCount: true,
  createdAt: true,
}).extend({
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().optional(),
  profileImage: z.string().optional(),
  bio: z.string().optional(),
  carModel: z.string().optional(),
  licensePlate: z.string().optional(),
});

export const insertRideSchema = createInsertSchema(rides).omit({
  id: true,
  createdAt: true,
}).extend({
  departureTime: z.date(),
  status: z.string().default("active"),
  recurring: z.boolean().default(false),
  recurringDays: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
}).extend({
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]).default("pending")
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  read: true,
  createdAt: true,
  senderId: true,
}).extend({
  senderId: z.number().optional(),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
}).extend({
  rating: z.number().min(1).max(5),
});

export const insertEmergencyContactSchema = createInsertSchema(emergencyContacts).omit({
  id: true,
  createdAt: true,
}).extend({
  email: z.string().email().optional(),
});

export const insertEmergencyAlertSchema = createInsertSchema(emergencyAlerts).omit({
  id: true,
  createdAt: true,
  resolvedAt: true,
}).extend({
  type: z.enum(["medical", "safety", "accident", "other"]),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  description: z.string().optional(),
});

// Auth schemas
export const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertRide = z.infer<typeof insertRideSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type InsertEmergencyContact = z.infer<typeof insertEmergencyContactSchema>;
export type InsertEmergencyAlert = z.infer<typeof insertEmergencyAlertSchema>;
export type LoginData = z.infer<typeof loginSchema>;

export type User = typeof users.$inferSelect;
export type Ride = typeof rides.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type EmergencyContact = typeof emergencyContacts.$inferSelect;
export type EmergencyAlert = typeof emergencyAlerts.$inferSelect;

// University options
export const UNIVERSITIES = [
  "Mapúa Malayan Colleges Laguna (MMCL)",
  "De La Salle University (DLSU)",
  "University of Santo Tomas (UST)",
  "Far Eastern University Alabang (FEU Alabang)",
  "National University Laguna (NU Laguna)",
  "San Beda College Alabang (SBCA)"
];
