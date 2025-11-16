import { IconEye, IconHeart, IconShare, IconMapPin } from "@tabler/icons-react";
import { formatPrice } from "../../../../utils/helpers";
import formatAmount from "../../../../utils/helpers";

export default function PropertyHeader({
  property,
  likedData,
  handleLike,
  openSharePropertyModal,
}: any) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        {property.name}
      </h1>
      <div className="flex items-center text-gray-600 mb-4">
        <IconMapPin size={18} className="mr-1" />
        <span>{property.address}, Nigeria</span>
      </div>

      <div className="flex items-baseline mb-4">
        <span className="text-3xl font-bold text-blue-700">
          {formatPrice(property.rent_amount)}
        </span>
        <span className="text-gray-500 ml-2 font-medium">per annum</span>
      </div>

      <div className="flex flex-wrap items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <IconEye size={18} className="mr-2 text-gray-600" />
          <span className="text-sm text-gray-600">
            Viewed by {formatAmount(property.views || 0)} people
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md text-sm flex items-center cursor-pointer"
            onClick={handleLike}
          >
            <IconHeart
              size={18}
              className={`mr-2 ${
                likedData.isLiked
                  ? "fill-red-600 stroke-none"
                  : "fill-none stroke-2"
              }`}
            />
            {likedData.isLiked ? "Saved" : "Save"}
          </button>
          <button
            className="px-4 py-2 border border-gray-300 rounded-md text-sm flex items-center"
            onClick={openSharePropertyModal}
          >
            <IconShare size={18} className="mr-2" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
