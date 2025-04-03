import { University, HowItWorksItem, Testimonial, MapFeature, UniversityPartner } from "./types";

// Import university assets
import mmclLogoPath from "@assets/mmcl-logo.png";
import mmclCampusPath from "@assets/mmcl-campus.png";
import dlsuLogoPath from "@assets/dlsu-logo.png";
import dlsuCampusPath from "@assets/dlsu-campus.png";
import ustLogoPath from "@assets/ust-logo.png";
import ustCampusPath from "@assets/ust-campus.png";
import feuLogoPath from "@assets/feu-logo.png";
import feuCampusPath from "@assets/feu-campus.png";
import nuLogoPath from "@assets/nu-logo.png";
import nuCampusPath from "@assets/nu-campus.png";
import bedaLogoPath from "@assets/beda-logo.png";
import bedaCampusPath from "@assets/beda-campus.png";

// Simple university name array for dropdowns and selects
export const UNIVERSITY_NAMES = [
  "Mapúa Malayan Colleges Laguna (MMCL)",
  "De La Salle University (DLSU)",
  "University of Santo Tomas (UST)",
  "Far Eastern University Alabang (FEU Alabang)",
  "National University Laguna (NU Laguna)",
  "San Beda College Alabang (SBCA)"
];

// Detailed university data with logos and campus images
export const UNIVERSITIES: University[] = [
  {
    id: "mmcl",
    name: "Mapúa Malayan Colleges Laguna",
    shortName: "MMCL",
    logo: mmclLogoPath,
    campus: mmclCampusPath,
    description: "Mapúa Malayan Colleges Laguna is a premier engineering and technological higher education institution in the CALABARZON region dedicated to providing quality education for the youth.",
    location: "Laguna, Philippines",
    established: "2006"
  },
  {
    id: "dlsu",
    name: "De La Salle University",
    shortName: "DLSU",
    logo: dlsuLogoPath,
    campus: dlsuCampusPath,
    description: "De La Salle University is a Catholic coeducational higher education institution run by De La Salle Brothers. It offers programs in various disciplines and is known for its excellence in business and engineering education.",
    location: "Manila, Philippines",
    established: "1911"
  },
  {
    id: "ust",
    name: "University of Santo Tomas",
    shortName: "UST",
    logo: ustLogoPath,
    campus: ustCampusPath,
    description: "The University of Santo Tomas, the Catholic University of the Philippines, is the oldest existing university in Asia. It's renowned for its medical and health sciences programs.",
    location: "Manila, Philippines",
    established: "1611"
  },
  {
    id: "feu",
    name: "Far Eastern University Alabang",
    shortName: "FEU Alabang",
    logo: feuLogoPath,
    campus: feuCampusPath,
    description: "Far Eastern University Alabang is a branch of FEU that offers various undergraduate and graduate programs with a focus on business, education, and technology.",
    location: "Alabang, Muntinlupa, Philippines",
    established: "2018"
  },
  {
    id: "nu",
    name: "National University Laguna",
    shortName: "NU Laguna",
    logo: nuLogoPath,
    campus: nuCampusPath,
    description: "National University Laguna is a leading educational institution that emphasizes innovation and quality education, offering programs in engineering, business, and computer science.",
    location: "Laguna, Philippines",
    established: "1900"
  },
  {
    id: "sbca",
    name: "San Beda College Alabang",
    shortName: "SBCA",
    logo: bedaLogoPath,
    campus: bedaCampusPath,
    description: "San Beda College Alabang is a Catholic educational institution that provides primary to tertiary education with a focus on holistic development and academic excellence.",
    location: "Alabang, Muntinlupa, Philippines",
    established: "1972"
  }
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
    name: "Georgette D.",
    university: "DLSU",
    year: "3rd Year",
    text: "TripSync has saved me so much money on transportation. I used to spend ₱200 daily on commuting, now it's down to ₱80. Plus, I've made some great friends from my university!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    id: 2,
    name: "Herim L.",
    university: "UST",
    year: "2nd Year",
    text: "As a female student, I was always worried about commuting late at night. TripSync lets me travel with verified students from my university, which gives me and my parents peace of mind.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    id: 3,
    name: "Wince R.",
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
    logo: mmclLogoPath
  },
  {
    id: 2,
    name: "De La Salle University",
    logo: dlsuLogoPath
  },
  {
    id: 3,
    name: "University of Santo Tomas",
    logo: ustLogoPath
  },
  {
    id: 4,
    name: "Far Eastern University Alabang",
    logo: feuLogoPath
  },
  {
    id: 5,
    name: "National University Laguna",
    logo: nuLogoPath
  },
  {
    id: 6,
    name: "San Beda College Alabang",
    logo: bedaLogoPath
  }
];
