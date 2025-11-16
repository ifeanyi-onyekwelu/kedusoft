// Shared Property interface that matches the backend model
interface Property {
  id: string;
  name: string;
  description: string;

  listing_type: string; // 'rent', 'short-let', 'lease', 'sale'
  bedrooms: number;
  bathrooms: number;
  toilets?: number;
  kitchens: number;
  floors_no: number;
  size_sqft: number;
  year_built: number;
  furnished: string; // 'fully', 'semi', 'unfurnished'

  furnishing_details: string[];
  water_source: string;
  has_water_heater: boolean;

  neighborhood_security: string;
  has_parking: boolean;
  parking_type: string;
  parking_security: string;
  parking_spaces: number;

  // Location
  address: string;
  street: string;
  area: string;
  city: string;
  state: string;
  zipcode: number;
  latitude?: number;
  longitude?: number;
  closest_landmark: string;

  accessibility_features: string[];

  // Financial
  payment_structure: string; // 'Daily', 'Weekly', 'monthly', 'yearly', 'quarterly'
  rent_amount: number;
  caution_fee?: number;
  agreement_fee?: number;

  // Availability
  available_from: string;
  minimum_lease_duration: string;
  is_available: boolean;
  status: "available" | "occupied" | "maintenance" | "draft";

  // Media
  cover_image?: string;
  gallery: string[];
  video_tour?: string;

  // Status
  verification_status: string;
  is_verified: boolean;
  flagged: boolean;
  deleted: boolean;

  // Promotion
  is_featured: boolean;
  featured_priority: number;
  featured_until?: string;

  // Relationships
  landlord_id: string;
  category_id: string;
  tenant_id?: string;

  // Amenities and features
  amenities?: {
    generator?: boolean;
    borehole?: boolean;
    water_tank?: boolean;
    security?: string[];
    common_areas?: string[];
    swimming_pool?: boolean;
    gym?: boolean;
    laundry?: boolean;
    waste_disposal?: boolean;
    visitors_room?: boolean;
    [key: string]: any;
  };
  security_features?: {
    fence?: boolean;
    gate?: boolean;
    cctv?: boolean;
    security_guards?: boolean;
    alarm?: boolean;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;

  // Nested objects (populated from relationships)
  landlord?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone_number: string;
    profile_picture?: string;
    joined_at: string;
    last_active: string;
  };
  category?: {
    id: string;
    name: string;
  };
  tenant?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

// Additional interfaces for map functionality
interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

// Simplified property interface for map markers (optional optimization)
interface PropertyMarker {
  id: string;
  latitude: number;
  longitude: number;
  rent_amount: number;
  bedrooms: number;
  bathrooms: number;
  name: string;
  cover_image?: string;
  gallery: string[];
  listing_type: string;
  area: string;
  city: string;
}
