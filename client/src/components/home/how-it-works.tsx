import { Card, CardContent } from "@/components/ui/card";
import { HOW_IT_WORKS_ITEMS } from "@/lib/data";
import { UserPlus, MapPin, Handshake } from "lucide-react";

export default function HowItWorks() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "user-plus":
        return <UserPlus className="h-6 w-6" />;
      case "map-pin":
        return <MapPin className="h-6 w-6" />;
      case "handshake":
        return <Handshake className="h-6 w-6" />;
      default:
        return <UserPlus className="h-6 w-6" />;
    }
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            How TripSync Works
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Quick, easy, and safe carpooling for students
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {HOW_IT_WORKS_ITEMS.map((item, idx) => (
              <Card key={idx} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-md ${item.bgColor} flex items-center justify-center ${item.textColor} mb-4`}>
                    {getIcon(item.icon)}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-base text-gray-500">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
