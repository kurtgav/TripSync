import { TESTIMONIALS } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Star, StarHalf } from "lucide-react";

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
          {TESTIMONIALS.map((testimonial) => (
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
