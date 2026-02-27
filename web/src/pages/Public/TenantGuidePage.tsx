import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Info,
  MapPin,
  ShieldCheck,
  FileText,
  Key,
  Home,
} from "lucide-react";

const TenantGuidePage = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "1. Financial Readiness",
      icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
      content: [
        {
          subtitle: "The 40% Rule & Hidden Costs",
          points: [
            "Aim for rent to be 30-40% of your net income.",
            "Account for 'Service Charges' (Security, waste, water).",
            "Budget for the 'Caution Fee' (usually 10% of rent) for damages.",
            "Verify if the legal/agency fees are within standard limits.",
          ],
        },
      ],
    },
    {
      title: "2. The Search Strategy",
      icon: <MapPin className="w-8 h-8 text-blue-600" />,
      content: [
        {
          subtitle: "Neighborhood Vetting",
          points: [
            "Check for flood history in the specific street.",
            "Visit the area at 8:00 PM to assess noise and security.",
            "Test mobile signal strength inside the specific room.",
            "Verify proximity to reliable power grids or transformer health.",
          ],
        },
      ],
    },
    {
      title: "3. Inspection Master-List",
      icon: <Info className="w-8 h-8 text-blue-600" />,
      content: [
        {
          subtitle: "What Landlords Don't Tell You",
          points: [
            "Flush all toilets and run all taps simultaneously.",
            "Check for 'fresh paint' smells that might hide dampness/mold.",
            "Inspect the roof/ceiling for water stain rings.",
            "Ask about the previous tenant's reason for leaving.",
          ],
        },
      ],
    },
    {
      title: "4. Legal & Documentation",
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      content: [
        {
          subtitle: "Signing Safely",
          points: [
            "Ensure the agreement includes a 'Right to Quiet Enjoyment'.",
            "Verify the landlord's proof of ownership before paying.",
            "Confirm the notice period for both parties (standard is 6 months).",
            "Take time-stamped photos of every room before moving in.",
          ],
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Navy Hero */}
      <div className="bg-[#0f172a] py-24 border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="text-blue-500 font-mono text-sm uppercase tracking-widest mb-4 block">
            Resource Center
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            The Ultimate Tenant Handbook
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about navigating the Nigerian rental
            market with confidence and legal protection.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 gap-12">
          {sections.map((section, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    {section.icon}
                  </div>
                  <h2 className="text-3xl font-bold text-[#0f172a]">
                    {section.title}
                  </h2>
                </div>

                <div className="grid md:grid-cols-1 gap-8">
                  {section.content.map((item, idx) => (
                    <div key={idx}>
                      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="w-8 h-px bg-blue-600"></span>
                        {item.subtitle}
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {item.points.map((point, pIdx) => (
                          <div
                            key={pIdx}
                            className="flex gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100"
                          >
                            <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 text-sm leading-relaxed">
                              {point}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white border-t border-gray-200 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#0f172a] mb-6">
            Ready to find your next home?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/properties")}
              className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              Browse Verified Listings
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="px-8 py-4 bg-transparent border-2 border-[#0f172a] text-[#0f172a] font-bold rounded-xl hover:bg-gray-50 transition-all"
            >
              Talk to a Rental Expert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantGuidePage;
