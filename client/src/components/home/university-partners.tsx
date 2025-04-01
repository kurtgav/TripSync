import { UNIVERSITY_PARTNERS } from "@/lib/data";

export default function UniversityPartners() {
  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Partner Universities
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            TripSync is officially partnered with these universities to provide safe transportation options for students.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {UNIVERSITY_PARTNERS.map((partner) => (
            <div key={partner.id} className="col-span-1 flex justify-center items-center">
              <img 
                className="h-16" 
                src={partner.logo} 
                alt={`${partner.name} logo`} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
