export interface University {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  campus: string;
  description: string;
  location: string;
  established: string;
}

export interface HowItWorksItem {
  title: string;
  description: string;
  icon: string;
  bgColor: string;
  textColor: string;
}

export interface Testimonial {
  id: number;
  name: string;
  university: string;
  year: string;
  text: string;
  rating: number;
  image: string;
}

export interface MapFeature {
  title: string;
  description: string;
  icon: string;
}

export interface UniversityPartner {
  id: number;
  name: string;
  logo: string;
}
