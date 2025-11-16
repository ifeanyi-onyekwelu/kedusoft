/**
 * InteractivePropertyMap Component
 *
 * A fully interactive Leaflet-based map component that displays properties as custom markers.
 *
 * Features:
 * - Custom property markers showing price
 * - Interactive popups with property details
 * - Map layer switching (Street, Satellite, Terrain)
 * - Auto-focus on selected properties
 * - Bounds-based property fetching
 * - Hover and selection states
 * - "Show All" button to fit all properties in view
 *
 * The map uses OpenStreetMap tiles by default and supports multiple tile providers
 * for different viewing experiences (satellite imagery, terrain, etc.)
 */

import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { LatLngBounds, LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

/**
 * Map layer types for different viewing modes
 */
type MapLayer = "street" | "satellite";

/**
 * Interface for map geographical boundaries
 */
interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

// ============================================================================
// LEAFLET MARKER SETUP
// ============================================================================

/**
 * Fix for default Leaflet marker icons in react-leaflet
 * Leaflet expects marker images via require(), but we use ES6 imports
 * This configuration ensures markers display correctly
 */
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/**
 * Creates a custom property marker icon showing the property price
 *
 * The marker appearance changes based on state:
 * - Selected: Purple background, scaled up
 * - Hovered: Purple background, slightly scaled up
 * - Default: White background, normal size
 *
 * @param price - Property rental amount to display
 * @param isSelected - Whether this property is currently selected
 * @param isHovered - Whether user is hovering over this property
 * @returns Leaflet DivIcon with custom HTML content
 */
const createPropertyIcon = (
  price: number,
  isSelected: boolean,
  isHovered: boolean
) => {
  const markerHtml = `
    <div class="property-marker ${isSelected ? "selected" : ""} ${
    isHovered ? "hovered" : ""
  }" style="
      background: ${isSelected ? "#290665" : isHovered ? "#290665" : "#ffffff"};
      color: ${isSelected || isHovered ? "#ffffff" : "#1f2937"};
      border: 2px solid ${
        isSelected ? "#1d4ed8" : isHovered ? "#290665" : "#e5e7eb"
      };
      border-radius: 20px;
      padding: 4px 8px;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transform: ${
        isSelected ? "scale(1.15)" : isHovered ? "scale(1.05)" : "scale(1)"
      };
      transition: all 0.2s ease;
      z-index: ${isSelected ? "1000" : isHovered ? "999" : "auto"};
      text-align: center;
    ">
      ₦${price.toLocaleString()}
    </div>
  `;

  return L.divIcon({
    html: markerHtml,
    className: "custom-div-icon",
    iconSize: [110, 30],
    iconAnchor: [30, 30],
  });
};

interface InteractivePropertyMapProps {
  properties: Property[];
  selectedProperty?: Property | null;
  hoveredProperty?: Property | null;
  onPropertySelect: (property: Property) => void;
  onPropertyHover?: (property: Property | null) => void;
  onMapBoundsChange: (bounds: MapBounds) => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

/**
 * MapEventHandler Component
 *
 * A helper component that hooks into Leaflet map events
 * Must be rendered inside MapContainer to access map instance
 *
 * Listens for:
 * - moveend: When user finishes panning the map
 * - zoomend: When user finishes zooming
 *
 * These events trigger bounds updates which fetch new properties
 */
const MapEventHandler: React.FC<{
  onBoundsChange: (bounds: MapBounds) => void;
  onMapReady: (map: L.Map) => void;
}> = ({ onBoundsChange, onMapReady }) => {
  // Access the Leaflet map instance
  const map = useMap();

  // Notify parent when map is ready
  useEffect(() => {
    onMapReady(map);
  }, [map, onMapReady]);

  // Listen for map movement events
  useMapEvents({
    // Triggered when panning stops
    moveend: () => {
      const bounds = map.getBounds();
      onBoundsChange({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      });
    },
    // Triggered when zooming stops
    zoomend: () => {
      const bounds = map.getBounds();
      onBoundsChange({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      });
    },
  });

  // Component doesn't render anything
  return null;
};

/**
 * PropertyMarker Component
 *
 * Renders an individual property as a marker on the map
 * Each marker shows the property price and opens a popup with details
 *
 * Features:
 * - Custom icon showing property price
 * - Interactive hover and selection states
 * - Popup with property image and key details
 * - Click to select property
 */
const PropertyMarker: React.FC<{
  property: Property;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (property: Property) => void;
  onHover: (property: Property | null) => void;
}> = ({ property, isSelected, isHovered, onSelect, onHover }) => {
  // Create custom marker icon with property price and current state
  const icon = createPropertyIcon(property.rent_amount, isSelected, isHovered);

  // Select property image (prefer gallery, fallback to cover image)
  const propertyImage =
    property.gallery && property.gallery.length > 0
      ? property.gallery[0]
      : property.cover_image;

  return (
    <Marker
      position={[property.latitude || 0, property.longitude || 0]}
      icon={icon}
      eventHandlers={{
        click: () => onSelect(property),
        mouseover: () => onHover(property),
        mouseout: () => onHover(null),
      }}
    >
      <Popup>
        <div className="property-popup max-w-xs">
          {propertyImage && (
            <img
              src={propertyImage}
              alt={property.name}
              className="w-full h-32 object-cover rounded-md mb-2"
            />
          )}
          <h3 className="font-semibold text-sm mb-1">{property.name}</h3>
          <p className="text-xs text-gray-600 mb-2">
            {property.area}, {property.city}
          </p>
          <div className="flex justify-between items-center">
            <span className="font-bold text-blue-600">
              ₦{property.rent_amount.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500">
              {property.bedrooms}bd • {property.bathrooms}ba
            </span>
          </div>
          <div className="mt-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {property.listing_type}
            </span>
          </div>
          {property.size_sqft && (
            <div className="mt-1 text-xs text-gray-600">
              {property.size_sqft.toLocaleString()} sqft
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export const InteractivePropertyMap: React.FC<InteractivePropertyMapProps> = ({
  properties,
  selectedProperty,
  hoveredProperty,
  onPropertySelect,
  onPropertyHover,
  onMapBoundsChange,
  center = [6.5244, 3.3792], // Lagos, Nigeria default coordinates
  zoom = 12,
  className = "",
}) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  // Reference to the Leaflet map instance for programmatic control
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  // Timeout reference for debouncing map bounds changes
  const boundsChangeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  // Current active map layer (street view, satellite, or terrain)
  const [currentLayer, setCurrentLayer] = useState<MapLayer>("street");

  /**
   * Map tile layer configurations
   * Different providers offer different visual styles:
   * - Street: Standard OpenStreetMap with roads and labels
   * - Satellite: Esri World Imagery with aerial photography
   * - Terrain: OpenTopoMap with topographical details
   */
  const mapLayers = {
    street: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
    },
  };

  // ============================================================================
  // EVENT HANDLERS & EFFECTS
  // ============================================================================

  /**
   * Debounced handler for map bounds changes
   * Prevents excessive API calls during continuous pan/zoom actions
   * Only triggers parent callback after 300ms of no movement
   */
  const handleBoundsChange = useCallback(
    (bounds: MapBounds) => {
      // Clear existing timeout if user is still moving map
      if (boundsChangeTimeoutRef.current) {
        clearTimeout(boundsChangeTimeoutRef.current);
      }

      // Set new timeout to trigger callback after 300ms of stillness
      boundsChangeTimeoutRef.current = setTimeout(() => {
        onMapBoundsChange(bounds);
      }, 300);
    },
    [onMapBoundsChange]
  );

  /**
   * Auto-focus map on selected property
   * When user selects a property, smoothly pan and zoom to it
   * Ensures minimum zoom level of 15 for detailed view
   */
  useEffect(() => {
    if (selectedProperty && mapInstance) {
      const propertyLatLng = new LatLng(
        selectedProperty.latitude ?? 0,
        selectedProperty.longitude ?? 0
      );
      mapInstance.setView(propertyLatLng, Math.max(mapInstance.getZoom(), 15), {
        animate: true, // Smooth pan animation
        duration: 0.5, // Half-second animation
      });
    }
  }, [selectedProperty, mapInstance]);

  /**
   * Fit map bounds to show all properties
   * Zooms and pans the map to display all property markers
   * Useful when user first loads the map or wants overview
   */
  const fitBoundsToProperties = useCallback(() => {
    if (mapInstance && properties.length > 0) {
      // Filter to only properties with valid coordinates
      const validProperties = properties.filter(
        (p) => p.latitude && p.longitude
      );

      if (validProperties.length > 0) {
        // Create bounding box that contains all properties
        const bounds = new LatLngBounds(
          validProperties.map((p) => [
            p.latitude as number,
            p.longitude as number,
          ])
        );
        // Fit map to bounds with 20px padding on all sides
        mapInstance.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [mapInstance, properties]);

  /**
   * Cleanup: Clear timeout when component unmounts
   * Prevents memory leaks and errors from pending callbacks
   */
  useEffect(() => {
    return () => {
      if (boundsChangeTimeoutRef.current) {
        clearTimeout(boundsChangeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`property-map-container ${className} overflow-hidden`}
      style={{ touchAction: "none" }}
    >
      {/* Map Controls Panel */}
      <div className="map-controls absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        {/* Show All Properties Button */}
        <button
          onClick={fitBoundsToProperties}
          className="px-3 py-2 text-sm bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-50 transition-colors font-medium"
          title="Show all properties"
        >
          Show All
        </button>

        {/* Map Layer Switcher */}
        <div className="bg-white rounded-lg shadow-md p-2">
          <div className="text-xs font-medium text-gray-600 mb-2 px-1">
            Map View
          </div>
          <div className="flex flex-col gap-1">
            {/* Street View Button */}
            <button
              onClick={() => setCurrentLayer("street")}
              className={`px-3 py-2 text-xs rounded transition-colors text-left ${
                currentLayer === "street"
                  ? "bg-blue-600 text-white font-medium"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
              title="Standard street map"
            >
              🗺️ Street
            </button>

            {/* Satellite View Button */}
            <button
              onClick={() => setCurrentLayer("satellite")}
              className={`px-3 py-2 text-xs rounded transition-colors text-left ${
                currentLayer === "satellite"
                  ? "bg-blue-600 text-white font-medium"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
              title="Satellite imagery"
            >
              🛰️ Satellite
            </button>
          </div>
        </div>
      </div>

      {/* Leaflet Map Container */}
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{ minHeight: "400px" }}
      >
        {/* Tile Layer - Switches based on selected map view */}
        <TileLayer
          key={currentLayer} // Force re-render when layer changes
          attribution={mapLayers[currentLayer].attribution}
          url={mapLayers[currentLayer].url}
          className="z-10"
        />

        <MapEventHandler
          onBoundsChange={handleBoundsChange}
          onMapReady={setMapInstance}
        />

        {properties
          .filter((property) => property.latitude && property.longitude)
          .map((property) => (
            <PropertyMarker
              key={property.id}
              property={property}
              isSelected={selectedProperty?.id === property.id}
              isHovered={hoveredProperty?.id === property.id}
              onSelect={onPropertySelect}
              onHover={onPropertyHover || (() => {})}
            />
          ))}
      </MapContainer>

      {properties.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-90">
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              No properties found in this area
            </p>
            <button
              onClick={fitBoundsToProperties}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reset Map View
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractivePropertyMap;
