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
import { ApplyModal } from "../../components/screens/Public/ApplyModal";

import PropertyBreadcrumbs from "../../components/screens/Public/ListingDetails/PropertyBreadcrumbs";
import PropertyHeader from "../../components/screens/Public/ListingDetails/PropertyHeader";
import PropertyFeatures from "../../components/screens/Public/ListingDetails/PropertyFeatures";
import PropertyOverviewSection from "../../components/screens/Public/ListingDetails/PropertyOverviewSection";
import PropertyAmenitiesSection from "../../components/screens/Public/ListingDetails/PropertyAmenitiesSection";
import PropertyLocationSection from "../../components/screens/Public/ListingDetails/PropertyLocationSection";
import Sidebar from "../../components/screens/Public/ListingDetails/Sidebar";

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
      if (isAuthenticated) {
        const status = await checkIfLiked(response.id);
        setLikedData(status);
      }
    } catch (error: any) {
      setError(error?.message || "An error occurred while fetching property");
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) return toast.error("Please login to save properties");
    try {
      if (likedData.isLiked) await unlikeProperty(likedData.likeId!);
      else await likeProperty(property?.id!);
      const recheck = await checkIfLiked(property?.id!);
      setLikedData(recheck);
    } catch (e) {
      toast.error("Action failed");
    }
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
    if (status === "success")
      toast.success("Application submitted successfully!");
    else toast.error(customMessage || "Application failed");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-100 z-[100]">
        <div
          className="h-full bg-[#CF8205] transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-8">
        <PropertyBreadcrumbs property={property} />

        <div className="flex flex-col lg:flex-row gap-12 mt-8">
          {/* Main Content - 68% */}
          <div className="w-full lg:w-[68%] space-y-12">
            {/* Gallery Section */}
            <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <ImageGallery images={property.gallery} />
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-[#290665] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide">
                  {property.gallery?.length || 0} Photos
                </div>
              </div>
            </div>

            {/* Header with price and actions */}
            <PropertyHeader
              property={property}
              likedData={likedData}
              handleLike={handleLike}
              openSharePropertyModal={shareProperty.open}
            />

            {/* Quick Features Grid */}
            <PropertyFeatures property={property} />

            {/* Main Content Sections */}
            <div className="space-y-12">
              <PropertyOverviewSection property={property} />
              <PropertyAmenitiesSection property={property} />
              <div className="relative z-0">
                <PropertyLocationSection property={property} />
              </div>
            </div>
          </div>

          {/* Sidebar - 32% */}
          <div className="w-full lg:w-[32%]">
            <div className="sticky top-24">
              <Sidebar
                property={property}
                openContactOwnerModal={contactOwner.open}
              />
            </div>
          </div>
        </div>

        {/* Floating Apply Button */}
        <div className="fixed bottom-8 right-8 z-[90]">
          <button
            onClick={applyModal.open}
            className="bg-[#290665] text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:bg-[#1e054a] transform hover:-translate-y-1 transition-all duration-300 font-semibold text-base flex items-center gap-3 group"
          >
            <span>Apply Now</span>
            <div className="bg-[#CF8205] p-2 rounded-full group-hover:scale-110 transition-transform">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
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
