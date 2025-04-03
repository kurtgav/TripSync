import { TESTIMONIALS } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Star, StarHalf } from "lucide-react";

// Define our own testimonials to ensure they display correctly
const localTestimonials = [
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

export default function Testimonials() {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="text-yellow-400 fill-current h-4 w-4" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="text-yellow-400 fill-current h-4 w-4" />);
    }
    
    return stars;
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            What Students Say
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Join thousands of students who are already saving money and making friends through TripSync.
          </p>
        </div>
        <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
          {localTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="flex flex-col">
              <CardContent className="flex-1 p-6">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                  <p className="text-xl font-semibold text-gray-900">"{testimonial.text.substring(0, 20)}..."</p>
                  <p className="mt-3 text-base text-gray-500">
                    {testimonial.text}
                  </p>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <img 
                      className="h-10 w-10 rounded-full" 
                      src={testimonial.image} 
                      alt={`${testimonial.name} testimonial`} 
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.university} Student, {testimonial.year}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
