import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Search,
  Calendar,
  FileCheck,
  ShieldCheck,
  Zap,
  Headphones,
} from "lucide-react";

const HowItWorks = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"tenants" | "landlords">(
    "tenants"
  );

  const steps = {
    tenants: [
      {
        id: "01",
        title: "Verified Onboarding",
        desc: "Complete our 2-minute identity check to unlock premium listings.",
        icon: <UserPlus className="w-6 h-6" />,
      },
      {
        id: "02",
        title: "Smart Search",
        desc: "Filter by power availability, water types, and verified landlord ratings.",
        icon: <Search className="w-6 h-6" />,
      },
      {
        id: "03",
        title: "Instant Booking",
        desc: "Schedule physical or virtual tours directly through our platform.",
        icon: <Calendar className="w-6 h-6" />,
      },
      {
        id: "04",
        title: "Digital Move-In",
        desc: "Sign legal leases and pay securely via our protected escrow system.",
        icon: <FileCheck className="w-6 h-6" />,
      },
    ],
    landlords: [
      {
        id: "01",
        title: "List & Verify",
        desc: "Submit your property documents for our rapid verification check.",
        icon: <Zap className="w-6 h-6" />,
      },
      {
        id: "02",
        title: "Automated Screening",
        desc: "Receive applications with pre-verified ID and income statements.",
        icon: <ShieldCheck className="w-6 h-6" />,
      },
      {
        id: "03",
        title: "Digital Contracting",
        desc: "Generate legally-binding leases and sign them with one click.",
        icon: <FileCheck className="w-6 h-6" />,
      },
      {
        id: "04",
        title: "Automated Payouts",
        desc: "Collect rent and service charges directly into your bank account.",
        icon: <UserPlus className="w-6 h-6" />,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-[#0f172a] pt-32 pb-20 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
              Renting <span className="text-blue-500">Simplified.</span>
            </h1>
            <p className="text-xl text-gray-400 mb-12 leading-relaxed">
              We’ve removed the stress of traditional house hunting. No more
              endless calls, fake agents, or hidden fees.
            </p>

            {/* Custom Tab Switcher */}
            <div className="inline-flex p-1 bg-gray-800 rounded-2xl">
              <button
                onClick={() => setActiveTab("tenants")}
                className={`px-8 py-3 rounded-xl font-bold transition-all ${
                  activeTab === "tenants"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                For Tenants
              </button>
              <button
                onClick={() => setActiveTab("landlords")}
                className={`px-8 py-3 rounded-xl font-bold transition-all ${
                  activeTab === "landlords"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                For Landlords
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Steps */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {steps[activeTab].map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector Line (Desktop) */}
              {index !== 3 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-px bg-gray-200 group-hover:bg-blue-200 transition-colors" />
              )}

              <div className="relative z-10">
                <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center mb-8 border border-gray-100 group-hover:border-blue-600 group-hover:bg-blue-50 transition-all">
                  <span className="text-blue-600">{step.icon}</span>
                </div>
                <div className="mb-4">
                  <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest">
                    Step {step.id}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#0f172a] mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <ShieldCheck className="w-10 h-10 text-blue-600" />,
                title: "Bank-Level Security",
                desc: "Your personal and financial data is encrypted and protected.",
              },
              {
                icon: <Zap className="w-10 h-10 text-blue-600" />,
                title: "Instant Decisions",
                desc: "Apply in minutes and get landlord feedback in as little as 24 hours.",
              },
              {
                icon: <Headphones className="w-10 h-10 text-blue-600" />,
                title: "Dedicated Support",
                desc: "Our local experts are available 24/7 to resolve any lease disputes.",
              },
            ].map((f, i) => (
              <div key={i} className="text-center p-8">
                <div className="inline-block mb-6">{f.icon}</div>
                <h4 className="text-xl font-bold text-[#0f172a] mb-4">
                  {f.title}
                </h4>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-[#0f172a] p-12 md:p-20 rounded-[4rem] text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Take the leap today.
            </h2>
            <p className="text-gray-400 mb-12 text-lg">
              Join Nigeria's fastest growing digital rental community.
            </p>
            <button
              onClick={() =>
                navigate(
                  activeTab === "tenants" ? "/properties" : "/auth/register"
                )
              }
              className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
