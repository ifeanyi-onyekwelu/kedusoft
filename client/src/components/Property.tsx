import { FaBath, FaBed, FaMapMarkerAlt } from "react-icons/fa";
import { MdOutlineSquareFoot } from "react-icons/md";
import { Button } from "./Button";
import { Link } from "react-router-dom";

export function Property() {
  return (
    <div className="w-full rounded-md p-4 space-y-3 bg-white">
      <Link to="/property">
        <img
          src="/images/hous.jpeg"
          alt="Green Homes"
          className="w-full object-cover h-[250px]"
        />
      </Link>

      <div className="flex space-x-5">
        <span className="border border-badge-border bg-badge px-3 rounded-full text-xs py-1">
          For Sale
        </span>
        <span className="border border-badge-border bg-badge px-3 rounded-full text-xs py-1">
          Villa
        </span>
      </div>

      {/* Property Details */}
      <div>
        <Link to="/property" className="flex space-x-2 items-center">
          <FaMapMarkerAlt className="md:block hidden" />
          <p className="text-sm md:text-md text-gray-400 flex items-center">
            Greenville Island, Abuja
          </p>
        </Link>
      </div>

      {/* Features */}
      <div className="flex justify-between md:text-md text-xs text-gray-400">
        <div className="flex items-center md:flex-row flex-col gap-2">
          <FaBath className="text-gray-400" />
          <span>6 Baths</span>
        </div>
        <div className="flex items-center md:flex-row flex-col gap-2">
          <MdOutlineSquareFoot className="text-gray-400" />
          <span>
            5x7 m/<sup>2</sup>
          </span>
        </div>
        <div className="flex items-center md:flex-row flex-col gap-2">
          <FaBed className="text-gray-400" />
          <span>6 Beds</span>
        </div>
      </div>

      <div className="flex justify-between items-center md:flex-row flex-col">
        <h4 className="font-semibold text-xl">N1, 550 000</h4>
        <Button label="View Now" variant="filled" to="/property" />
      </div>
    </div>
  );
}
