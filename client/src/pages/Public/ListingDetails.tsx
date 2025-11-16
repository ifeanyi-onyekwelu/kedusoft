import { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useParams } from "react-router-dom";
import ImageGallery from "../../components/screens/Public/ImageGallery";
import { usePublicOperations } from "../../apis/publicApi";
import { useTenantOperations } from "../../apis/tenantApi";
import useAuth from "../../hooks/useAuth";
import { useLoading } from "../../hooks/useLoading";
import { ErrorState } from "../../components/ErrorState";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import ShareListingModal from "../../components/screens/Public/ShareListingModal";
import { ScheduleTourModal } from "../../components/screens/Public/ScheduleTourModal";

import PropertyBreadcrumbs from "../../components/screens/Public/ListingDetails/PropertyBreadcrumbs";
import PropertyHeader from "../../components/screens/Public/ListingDetails/PropertyHeader";
import PropertyFeatures from "../../components/screens/Public/ListingDetails/PropertyFeatures";
import PropertyOverviewSection from "../../components/screens/Public/ListingDetails/PropertyOverviewSection";
import PropertyAmenitiesSection from "../../components/screens/Public/ListingDetails/PropertyAmenitiesSection";
import PropertyLocationSection from "../../components/screens/Public/ListingDetails/PropertyLocationSection";
import Sidebar from "../../components/screens/Public/ListingDetails/Sidebar";
import { ApplyModal } from "../../components/screens/Public/ApplyModal";

import { toast } from "react-hot-toast";

export interface PropertyWithViews extends Property {
  views?: number;
}

function PropertyDetailsComponent() {
  const [property, setProperty] = useState<PropertyWithViews>();
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const { loading, withLoading } = useLoading();

  const { getPropertyById } = usePublicOperations();
  const { checkIfLiked, likeProperty, unlikeProperty } = useTenantOperations();
  const { isAuthenticated } = useAuth();

  const [likedData, setLikedData] = useState({
    isLiked: false,
    likeId: null as string | null,
  });
  const [contactOwnerModalOpened, contactOwner] = useDisclosure(false);
  const [sharePropertyModalOpened, shareProperty] = useDisclosure(false);
  const [applyModalOpened, applyModal] = useDisclosure(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const fetchProperty = async () => {
    try {
      const response = await withLoading(getPropertyById(id!));
      setProperty(response);
    } catch (error: any) {
      setError(error?.message || "An error occurred while fetching property");
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) toast.error("Not Logged In!");
    if (likedData.isLiked) await unlikeProperty(likedData.likeId!);
    else await likeProperty(property?.id!);
    const recheck = await checkIfLiked(property?.id!);
    setLikedData(recheck);
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading)
    return <LoadingSpinner fullScreen label="Fetching property details" />;
  if (error)
    return (
      <ErrorState onRetry={fetchProperty} message={error} loading={loading} />
    );
  if (!property)
    return (
      <ErrorState
        onRetry={fetchProperty}
        message="No property data found"
        loading={loading}
      />
    );

  const handleApplyStatus = (status: string, customMessage?: string) => {
    switch (status) {
      case "success": {
        toast.success("Your application was submitted successfully");
        break;
      }
      case "error": {
        toast.error(customMessage as string);
        break;
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-100 z-50">
        <div
          className="h-full bg-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-full mx-auto px-14 py-8">
        <PropertyBreadcrumbs property={property} />

        <div className="flex flex-col lg:flex-row gap-8 mt-6">
          {/* Main Content */}
          <div className="w-full lg:w-3/4 space-y-8">
            <div className="relative group">
              <ImageGallery images={property.gallery} />
              <div className="absolute top-4 right-4 flex gap-2">
                <div className="bg-black/70 text-white px-3 py-1.5 rounded-full text-sm backdrop-blur-sm">
                  {property.gallery?.length || 0} photos
                </div>
              </div>
            </div>

            <PropertyHeader
              property={property}
              likedData={likedData}
              handleLike={handleLike}
              openSharePropertyModal={shareProperty.open}
            />

            <PropertyFeatures property={property} />
            <PropertyOverviewSection property={property} />
            <PropertyAmenitiesSection property={property} />
            <PropertyLocationSection property={property} />
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <Sidebar
              property={property}
              openContactOwnerModal={contactOwner.open}
            />
          </div>
        </div>

        {/* Floating Apply Button */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={applyModal.open}
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 font-semibold text-lg flex items-center gap-3 group"
          >
            <span>Apply Now</span>
            <div className="group-hover:translate-x-1 transition-transform duration-200">
              →
            </div>
          </button>
        </div>
      </div>

      {/* Modals */}
      <ScheduleTourModal
        opened={contactOwnerModalOpened}
        close={contactOwner.close}
        property={property}
      />
      <ShareListingModal
        opened={sharePropertyModalOpened}
        close={shareProperty.close}
        property={property}
      />
      <ApplyModal
        opened={applyModalOpened}
        close={applyModal.close}
        property={property}
        onApplySuccess={handleApplyStatus}
      />
    </div>
  );
}

export default PropertyDetailsComponent;
