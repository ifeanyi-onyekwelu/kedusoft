import { IconHeart, IconCode, IconHome } from "@tabler/icons-react";

const DashboardFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 px-4 py-4 mt-auto">
      <div className="max-w-full mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Left section - Brand and copyright */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-900">Letsten</span>
            </div>
            <span>© {currentYear} All rights reserved.</span>
          </div>

          {/* Center section - Quick links */}
          <div className="flex items-center gap-6 text-sm">
            <a
              href="/resources"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Resources
            </a>
            <a
              href="/privacy-policy"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms-of-service"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>

        {/* Mobile-friendly stacked version */}
        <div className="sm:hidden mt-3 pt-3 border-t border-gray-100">
          <div className="text-center text-xs text-gray-500 space-y-1">
            <div>Rental management made simple</div>
            <div className="flex items-center justify-center gap-1">
              <IconCode size={12} className="text-gray-400" />
              <span>Version 1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;
