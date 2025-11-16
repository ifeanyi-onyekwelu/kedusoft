import {
  IconSearch,
  IconBell,
  IconSettings,
  IconChevronDown,
  IconLogout,
  IconInfoCircle,
  IconClock,
  IconHeartFilled,
  IconHome,
  IconUser,
  IconBookmark,
  IconMapPin,
  IconFileText,
  IconStar,
  IconBellRinging,
} from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthOperations } from "../../../apis/authApi";
import { useUser } from "../../../context/UserContext";
import { BiPlusCircle } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { useState, useEffect } from "react";

type HeaderProps = {
  role: string;
  opened: boolean;
  toggle: () => void;
};

const Header = ({ role, opened, toggle }: HeaderProps) => {
  const { logout, user } = useUser();
  const navigate = useNavigate();
  const [showVerificationToast, setShowVerificationToast] = useState(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { logout: apiLogout } = useAuthOperations();

  // Show verification toast when user is not verified
  useEffect(() => {
    if (user && !user.is_verified) {
      setShowVerificationToast(true);
      // Auto-hide toast after 10 seconds
      const timer = setTimeout(() => {
        setShowVerificationToast(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Format current date
  const formattedDate = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleLogout = async () => {
    try {
      logout();
      await apiLogout();
      navigate("/auth/login");
    } catch (err) {
      console.error("Error logging out", err);
    }
  };

  const handleCompleteVerification = () => {
    // Navigate to document upload/verification page
    navigate("/settings/verification");
    setShowVerificationToast(false);
  };

  return (
    <>
      {/* Document Verification Toast.tsx Notification */}
      {user && !user?.is_verified && showVerificationToast && (
        <div className="fixed top-4 right-4 z-[9999] max-w-sm animate-in slide-in-from-right duration-300">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <IconInfoCircle className="text-blue-600 mt-0.5" size={20} />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-800">
                  Complete Account Verification
                </h4>
                <p className="text-sm text-blue-700 mt-1">
                  Upload your identity documents to verify your account and
                  access all features.
                </p>
                <button
                  onClick={handleCompleteVerification}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 text-sm mt-2 font-medium transition-colors"
                >
                  Upload Documents
                </button>
              </div>
              <button
                onClick={() => setShowVerificationToast(false)}
                className="text-blue-500 hover:text-blue-700"
              >
                <IoMdClose size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className="h-16 px-4 sm:px-6 lg:px-8 fixed w-full z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between h-full">
          {/* Left Section - Logo & Burger */}
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-600" onClick={toggle}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    opened ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>

            <div className="flex items-center gap-1">
              <IconHome className="text-blue-600" size={24} />
              <span className="text-lg font-semibold text-gray-900">
                Homies
              </span>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IconSearch className="text-gray-400" size={16} />
              </div>
              <input
                type="text"
                placeholder="Search properties, landlords..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Right Section - User Controls */}
          <div className="flex items-center gap-4">
            {/* Date - Hidden on mobile */}
            <div className="hidden sm:block text-sm text-gray-500">
              {formattedDate}
            </div>

            {/* Notification Bell */}
            <button className="p-1 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100">
              <IconBell size={20} />
            </button>

            {/* Add Property Button (Landlord only) */}
            {role === "landlord" && (
              <Link
                to="/property-owner/properties/add"
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                <BiPlusCircle size={16} />
                <span>Add Property</span>
              </Link>
            )}

            {/* User Menu */}
            <div className="relative group">
              <button
                className="flex items-center gap-2 focus:outline-none"
                onClick={() => setUserMenuOpened(!userMenuOpened)}
              >
                {/* Profile Photo or Initials */}
                {user?.profile_picture ? (
                  <img
                    src={user.profile_picture}
                    alt="Profile"
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    {!user?.is_verified && (
                      <span className="px-1.5 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full font-medium">
                        Unverified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 capitalize">{role}</p>
                </div>
                <IconChevronDown className="text-gray-500" size={16} />
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute right-0 mt-2 w-[25rem] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
                  userMenuOpened ? "block" : "hidden"
                }`}
              >
                {/* Document verification reminder for unverified users */}
                {!user?.is_verified && (
                  <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
                    <div className="flex items-center gap-2">
                      <IconInfoCircle className="text-blue-600" size={16} />
                      <div>
                        <p className="text-sm font-medium text-blue-800">
                          Documents Required
                        </p>
                        <button
                          onClick={handleCompleteVerification}
                          className="text-xs text-blue-700 underline hover:text-blue-800"
                        >
                          Upload identity documents
                        </button>
                      </div>
                    </div>
                  </div>
                )}{" "}
                {/* 2-Column Grid Layout */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Left Column - Main Navigation */}
                    <div className="space-y-1">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        My Homies
                      </h3>

                      {role === "tenant" && (
                        <>
                          <Link
                            to="/tenants/liked"
                            className="flex items-center gap-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                            onClick={() => setUserMenuOpened(false)}
                          >
                            <IconHeartFilled
                              size={16}
                              className="text-gray-400"
                            />
                            <span>Favorites</span>
                          </Link>
                          <Link
                            to="#"
                            className="flex items-center gap-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                            onClick={() => setUserMenuOpened(false)}
                          >
                            <IconBookmark size={16} className="text-gray-400" />
                            <span>Saved Searches</span>
                          </Link>
                          <Link
                            to="#"
                            className="flex items-center gap-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                            onClick={() => setUserMenuOpened(false)}
                          >
                            <IconClock size={16} className="text-gray-400" />
                            <span>Pending Screenings</span>
                          </Link>
                          <Link
                            to="#"
                            className="flex items-center gap-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                            onClick={() => setUserMenuOpened(false)}
                          >
                            <IconMapPin size={16} className="text-gray-400" />
                            <span>Appointments</span>
                          </Link>
                        </>
                      )}

                      {role === "landlord" && (
                        <>
                          <Link
                            to="/property-owner/properties"
                            className="flex items-center gap-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                            onClick={() => setUserMenuOpened(false)}
                          >
                            <IconHome size={16} className="text-gray-400" />
                            <span>My Properties</span>
                          </Link>
                          <Link
                            to="#"
                            className="flex items-center gap-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                            onClick={() => setUserMenuOpened(false)}
                          >
                            <IconFileText size={16} className="text-gray-400" />
                            <span>Applications</span>
                          </Link>
                          <Link
                            to="#"
                            className="flex items-center gap-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                            onClick={() => setUserMenuOpened(false)}
                          >
                            <IconUser size={16} className="text-gray-400" />
                            <span>Tenants</span>
                          </Link>
                          <Link
                            to="#"
                            className="flex items-center gap-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                            onClick={() => setUserMenuOpened(false)}
                          >
                            <IconStar size={16} className="text-gray-400" />
                            <span>Reviews</span>
                          </Link>
                        </>
                      )}
                    </div>

                    {/* Right Column - Settings */}
                    <div className="space-y-1">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Settings
                      </h3>

                      <Link
                        to="#"
                        className="flex items-center gap-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                        onClick={() => setUserMenuOpened(false)}
                      >
                        <IconBellRinging size={16} className="text-gray-400" />
                        <span>Notifications</span>
                      </Link>
                      <Link
                        to="/settings/profile"
                        className="flex items-center gap-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                        onClick={() => setUserMenuOpened(false)}
                      >
                        <IconSettings size={16} className="text-gray-400" />
                        <span>Account Settings</span>
                      </Link>
                      <button
                        onClick={() => {
                          setUserMenuOpened(false);
                          handleLogout();
                        }}
                        className="flex w-full items-center gap-3 px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <IconLogout size={16} className="text-red-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
