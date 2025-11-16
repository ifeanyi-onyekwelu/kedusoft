import { Link } from "react-router-dom";
import { IconHome, IconBuilding } from "@tabler/icons-react";

export default function SignupRoleSelector() {
  const roles = [
    {
      id: "tenant",
      title: "I'm looking for a property",
      subtitle: "Find your dream home",
      icon: IconHome,
      features: [
        "Browse thousands of properties",
        "Save favorites and get alerts",
        "Apply online instantly",
        "Verified landlords",
      ],
      color: "blue",
      iconBg: "bg-blue-600",
      borderColor: "hover:border-blue-400",
      textColor: "text-blue-600",
    },
    {
      id: "landlord",
      title: "I'm a property owner",
      subtitle: "List and manage properties",
      icon: IconBuilding,
      features: [
        "List unlimited properties",
        "Find quality tenants",
        "Manage rent payments",
        "Analytics dashboard",
      ],
      color: "green",
      iconBg: "bg-green-600",
      borderColor: "hover:border-green-400",
      textColor: "text-green-600",
    },
  ];

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Join GetMeLeased
        </h2>
        <p className="text-gray-600 text-sm">Choose your account type</p>
      </div>

      <div className="space-y-3">
        {roles.map((role) => (
          <Link
            key={role.id}
            to={`/auth/register?role=${role.id}`}
            className="block group"
          >
            <div
              className={`bg-gray-50 rounded-lg p-4 border-2 border-gray-200 ${role.borderColor} transition-all duration-200 hover:shadow-md hover:bg-white`}
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div
                  className={`w-12 h-12 ${role.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  <role.icon size={24} className="text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-gray-900 mb-0.5">
                    {role.title}
                  </h3>
                  <p className={`${role.textColor} text-sm font-medium`}>
                    {role.subtitle}
                  </p>
                </div>

                {/* Arrow */}
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
