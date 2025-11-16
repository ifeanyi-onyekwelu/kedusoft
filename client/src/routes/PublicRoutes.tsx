import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import NotFound from "../pages/Errors/NotFound";
import Home from "../pages/Public/Home";
import SearchResults from "../pages/Public/SearchResults";
import ListingDetails from "../pages/Public/ListingDetails";
import Listings from "../pages/Public/Listings";
import BrowseByLocation from "../pages/Public/BrowseByLocation";
import ShortletsPage from "@/pages/Public/ShortletsPage";
import ServicesPage from "@/pages/Public/ServicesPage";
import AgentsPage from "@/pages/Public/AgentsPage";

import HowToApplyPage from "@/pages/Public/HowToApplyPage";
import TenantGuidePage from "@/pages/Public/TenantGuidePage";
import FAQsPage from "@/pages/Public/FAQsPage";
import TermsOfServicePage from "@/pages/Public/TermsOfServicePage";
import PrivacyPolicyPage from "@/pages/Public/PrivacyPolicyPage";
import CookiePolicyPage from "@/pages/Public/CookiePolicyPage";
import FairHousingPage from "@/pages/Public/FairHousingPage";

import AboutUs from "@/pages/Public/AboutUs";
import Blog from "@/pages/Public/Blog";
import HowItWorks from "@/pages/Public/HowItWorks";
import Resources from "@/pages/Public/Resources";
import PropertyManagement from "@/pages/Public/PropertyManagement";
import ContactUs from "@/pages/Public/ContactUs";

function PublicRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="browse-locations" element={<BrowseByLocation />} />
        <Route path="shortlet" element={<ShortletsPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="agents" element={<AgentsPage />} />

        <Route path="about-us" element={<AboutUs />} />
        <Route path="blog" element={<Blog />} />
        <Route path="how-it-works" element={<HowItWorks />} />
        <Route path="resources" element={<Resources />} />
        <Route path="property-management" element={<PropertyManagement />} />
        <Route path="contact-us" element={<ContactUs />} />

        <Route path="how-to-apply" element={<HowToApplyPage />} />
        <Route path="tenant-guide" element={<TenantGuidePage />} />
        <Route path="faqs" element={<FAQsPage />} />
        <Route path="terms-of-service" element={<TermsOfServicePage />} />
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="cookie-policy" element={<CookiePolicyPage />} />
        <Route path="fair-housing" element={<FairHousingPage />} />

        <Route path="listings">
          <Route index element={<Listings />} />
          <Route path=":id" element={<ListingDetails />} />
        </Route>
        <Route path="search" element={<SearchResults />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default PublicRoutes;
