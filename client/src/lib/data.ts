import { HowItWorksItem, Testimonial, MapFeature, UniversityPartner } from "./types";

export const UNIVERSITIES = [
  "Mapúa Malayan Colleges Laguna (MMCL)",
  "De La Salle University (DLSU)",
  "University of Santo Tomas (UST)",
  "Far Eastern University Alabang (FEU Alabang)",
  "National University Laguna (NU Laguna)",
  "San Beda College Alabang (SBCA)"
];

export const HOW_IT_WORKS_ITEMS: HowItWorksItem[] = [
  {
    title: "1. Create Your Account",
    description: "Sign up with your university email, complete your profile, and verify your student ID.",
    icon: "user-plus",
    bgColor: "bg-primary-100",
    textColor: "text-primary-500"
  },
  {
    title: "2. Find or Offer a Ride",
    description: "Browse available rides that match your schedule or offer your own ride to help fellow students.",
    icon: "map-pin",
    bgColor: "bg-green-100",
    textColor: "text-green-600"
  },
  {
    title: "3. Connect & Save",
    description: "Coordinate through our secure messaging system, share costs, and track your ride in real-time.",
    icon: "handshake",
    bgColor: "bg-amber-100",
    textColor: "text-amber-600"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Pia M.",
    university: "DLSU",
    year: "3rd Year",
    text: "TripSync has saved me so much money on transportation. I used to spend ₱200 daily on commuting, now it's down to ₱80. Plus, I've made some great friends from my university!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    id: 2,
    name: "Jasmine T.",
    university: "UST",
    year: "2nd Year",
    text: "As a female student, I was always worried about commuting late at night. TripSync lets me travel with verified students from my university, which gives me and my parents peace of mind.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    id: 3,
    name: "Marco D.",
    university: "FEU",
    year: "4th Year",
    text: "I drive to university everyday anyway, so offering rides on TripSync helps me offset my gas expenses. I'm making around ₱2,000 extra per week just by giving rides to fellow students!",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  }
];

export const MAP_FEATURES: MapFeature[] = [
  {
    title: "Optimized Routes",
    description: "Find the most efficient paths between your university and destination.",
    icon: "route"
  },
  {
    title: "Smart Notifications",
    description: "Get alerts when your ride is nearby or if there are any schedule changes.",
    icon: "bell"
  },
  {
    title: "Emergency Features",
    description: "One-tap safety alerts and direct line to campus security when needed.",
    icon: "shield"
  }
];

export const UNIVERSITY_PARTNERS: UniversityPartner[] = [
  {
    id: 1,
    name: "Mapúa Malayan Colleges Laguna",
    logo: "https://images.unsplash.com/photo-1559103743-56bcc6b35d59?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
  },
  {
    id: 2,
    name: "De La Salle University",
    logo: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 3,
    name: "University of Santo Tomas",
    logo: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 4,
    name: "Far Eastern University Alabang",
    logo: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 5,
    name: "National University Laguna",
    logo: "https://images.unsplash.com/photo-1559103743-56bcc6b35d59?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 6,
    name: "San Beda College Alabang",
    logo: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  }
];
