import { useState, useEffect } from "react";
import PropertyCard from "../../../../components/shared/Dashboard/PropertyCard";

function AdminRecentListings() {
  const [recentListings, setRecentListings] = useState<Property[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // const response = await getAllAvailableProperties();
        // const mapped = response.map((property: any) => ({
        //   ...property,
        //   coverImage:
        //     property.gallery && property.gallery.length > 0
        //       ? property.gallery[0]
        //       : "",
        // }));
        // console.log("Mapped Property", mapped);
        // setRecentListings(mapped);
      } catch (error) {
        console.log("FETCH ALL RECENT LISTINGS ERROR: ", error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {recentListings.length &&
          recentListings.map((property, index) => (
            <PropertyCard propertyData={property} />
          ))}
      </div>
    </div>
  );
}

export default AdminRecentListings;
