import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IconMap } from "@tabler/icons-react";

interface MapFloatingButtonProps {
  className?: string;
}

export const MapFloatingButton: React.FC<MapFloatingButtonProps> = ({
  className = "",
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show the button if we're already on the map page
  if (location.pathname.includes("/properties/map")) {
    return null;
  }

  const handleClick = () => {
    // Preserve current search params when navigating to map
    const searchParams = new URLSearchParams(location.search);
    navigate(`/properties/map?${searchParams.toString()}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-6 right-6 z-[1000] bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 group ${className}`}
      title="View properties on map"
    >
      <IconMap
        size={24}
        className="group-hover:scale-110 transition-transform"
      />

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        View on Map
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </button>
  );
};

export default MapFloatingButton;
