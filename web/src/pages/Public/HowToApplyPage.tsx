import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Search,
  FileText,
  Send,
  Clock,
  PenTool,
  CheckCircle2,
  AlertCircle,
  FileStack,
  ShieldCheck,
} from "lucide-react";

const HowToApplyPage = () => {
  const navigate = useNavigate();

  const steps = [
    {
      id: "01",
      title: "Digital Profile Setup",
      description:
        "Landlords prioritize complete profiles. We help you build a 'Tenant Resume'.",
      details: [
        "Complete KYC verification",
        "Upload professional profile photo",
        "Verify work email for trust",
      ],
      icon: <UserPlus className="w-6 h-6" />,
    },
    {
      id: "02",
      title: "Targeted Search",
      description:
        "Use our 'Smart Match' filters to find properties that fit your specific lifestyle.",
      details: [
        "Filter by power hours/security level",
        "Save searches for instant alerts",
        "Compare neighborhood stats",
      ],
      icon: <Search className="w-6 h-6" />,
    },
    {
      id: "03",
      title: "Document Preparation",
      description:
        "Have your 'Rental Vault' ready to move faster than other applicants.",
      details: [
        "Digital ID (NIN/Passport)",
        "6-month verified bank statements",
        "Valid Guarantor commitment",
      ],
      icon: <FileStack className="w-6 h-6" />,
    },
    {
      id: "04",
      title: "One-Click Application",
      description:
        "Submit a comprehensive application package instantly through the portal.",
      details: [
        "Automated cover letter generation",
        "Direct document attachment",
        "Timestamped submission",
      ],
      icon: <Send className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Professional Navy Hero */}
      <div className="bg-[#0f172a] py-24 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Apply <span className="text-blue-500 text-shadow-sm">Fast.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
            In a competitive market, speed is everything. Follow our verified
            pipeline to secure your new home before anyone else.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* Left: The Stepper */}
          <div className="lg:col-span-8 space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-8 relative group">
                {/* Connecting Line */}
                {index !== steps.length - 1 && (
                  <div className="absolute top-16 left-8 w-px h-[calc(100%+48px)] bg-gray-100 group-hover:bg-blue-200 transition-colors" />
                )}

                <div className="flex-shrink-0 w-16 h-16 bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center text-[#0f172a] group-hover:border-blue-600 group-hover:text-blue-600 transition-all shadow-sm">
                  {step.icon}
                </div>

                <div className="pt-2">
                  <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-tighter">
                    Step {step.id}
                  </span>
                  <h3 className="text-2xl font-bold text-[#0f172a] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-xl">
                    {step.description}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {step.details.map((detail, dIdx) => (
                      <div
                        key={dIdx}
                        className="flex items-center gap-2 text-sm text-gray-500"
                      >
                        <CheckCircle2 className="w-4 h-4 text-blue-500" />
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Sidebar Requirements */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 space-y-6">
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                <h4 className="text-xl font-bold text-[#0f172a] mb-6 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                  The Essentials
                </h4>
                <div className="space-y-4">
                  {[
                    { t: "Valid ID", d: "Digital copy of NIN or Passport" },
                    { t: "Income Proof", d: "Last 3-6 months bank statements" },
                    { t: "Employment", d: "Signed offer letter or ID card" },
                    { t: "Guarantor", d: "Verified contact and ID" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
                    >
                      <p className="font-bold text-sm text-[#0f172a]">
                        {item.t}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{item.d}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0f172a] text-white rounded-3xl p-8 shadow-xl">
                <AlertCircle className="w-8 h-8 text-blue-500 mb-4" />
                <h4 className="text-lg font-bold mb-2">Pro Tip</h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Apply within the first 24 hours of a listing going live.
                  Verified profiles are 4x more likely to be contacted by
                  landlords.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToApplyPage;
