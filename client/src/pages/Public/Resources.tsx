import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  ClipboardCheck,
  HelpCircle,
  Settings,
  Search,
  Umbrella,
  MapPin,
  Building2,
  ExternalLink,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

const Resources = () => {
  const navigate = useNavigate();

  const guides = [
    {
      title: "Tenant Handbook",
      desc: "Expert rental advice.",
      link: "/tenant-guide",
      icon: <BookOpen />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Application Guide",
      desc: "Master the process.",
      link: "/how-to-apply",
      icon: <ClipboardCheck />,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Platform FAQs",
      desc: "Quick solutions.",
      link: "/faqs",
      icon: <HelpCircle />,
      color: "bg-cyan-50 text-cyan-600",
    },
    {
      title: "How It Works",
      desc: "Full platform tour.",
      link: "/how-it-works",
      icon: <Settings />,
      color: "bg-slate-50 text-slate-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal Header */}
      <div className="bg-white border-b border-gray-200 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-[#0f172a] tracking-tight mb-4">
            Knowledge <span className="text-blue-600">Hub</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Your centralized portal for rental guides, legal tools, and property
            management resources.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Featured Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {guides.map((guide, i) => (
            <button
              key={i}
              onClick={() => navigate(guide.link)}
              className="bg-white p-8 rounded-[2rem] border border-gray-100 hover:border-blue-600 transition-all text-left shadow-sm group relative overflow-hidden"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${guide.color}`}
              >
                {guide.icon}
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-2">
                {guide.title}
              </h3>
              <p className="text-gray-500 text-sm">{guide.desc}</p>
              <ChevronRight className="absolute bottom-8 right-8 text-gray-300 group-hover:text-blue-600 transition-colors" />
            </button>
          ))}
        </div>

        {/* Tools & Links Section */}
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Column 1: Tenant Tools */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-blue-600 mb-8 flex items-center gap-2">
              <span className="w-8 h-px bg-blue-600"></span>
              For Tenants
            </h4>
            {[
              {
                label: "HD Property Search",
                url: "/listings",
                icon: <Search className="w-4 h-4" />,
              },
              {
                label: "Vacation Shortlets",
                url: "/shortlet",
                icon: <Umbrella className="w-4 h-4" />,
              },
              {
                label: "Neighborhood Directory",
                url: "/browse-locations",
                icon: <MapPin className="w-4 h-4" />,
              },
            ].map((link, i) => (
              <button
                key={i}
                onClick={() => navigate(link.url)}
                className="flex items-center justify-between w-full p-5 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-blue-600">{link.icon}</span>
                  <span className="font-bold text-[#0f172a]">{link.label}</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-blue-600" />
              </button>
            ))}
          </div>

          {/* Column 2: Landlord Tools */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-8 flex items-center gap-2">
              <span className="w-8 h-px bg-indigo-600"></span>
              For Landlords
            </h4>
            {[
              {
                label: "Listing Portal",
                url: "/auth/register?role=landlord",
                icon: <Building2 className="w-4 h-4" />,
              },
              {
                label: "Agent Services",
                url: "/agents",
                icon: <ExternalLink className="w-4 h-4" />,
              },
              {
                label: "Management Tools",
                url: "/property-management",
                icon: <Settings className="w-4 h-4" />,
              },
            ].map((link, i) => (
              <button
                key={i}
                onClick={() => navigate(link.url)}
                className="flex items-center justify-between w-full p-5 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-indigo-600">{link.icon}</span>
                  <span className="font-bold text-[#0f172a]">{link.label}</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-indigo-600" />
              </button>
            ))}
          </div>

          {/* Column 3: Legal & Support */}
          <div className="bg-[#0f172a] rounded-[3rem] p-10 text-white flex flex-col justify-between">
            <div>
              <h4 className="text-xl font-bold mb-6">Need Legal Help?</h4>
              <ul className="space-y-4">
                {[
                  "Terms of Service",
                  "Privacy Policy",
                  "Fair Housing Info",
                ].map((txt, i) => (
                  <li key={i}>
                    <button className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm">
                      <ChevronRight className="w-3 h-3 text-blue-500" />
                      {txt}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12 pt-12 border-t border-gray-800">
              <p className="text-sm text-gray-400 mb-6 italic">
                “The rental process should be transparent for everyone.”
              </p>
              <button
                onClick={() => navigate("/contact-us")}
                className="w-full py-4 bg-blue-600 rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
