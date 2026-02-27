import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building,
  BarChart3,
  Zap,
  Shield,
  Target,
  Smartphone,
  FileText,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Clock,
  Users,
  Home,
  Key,
  Award,
  ChevronRight,
  Globe,
  Layers,
  Sparkles,
} from "lucide-react";

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const services = {
    landlords: [
      {
        icon: <BarChart3 className="w-6 h-6" />,
        title: "Property Analytics",
        description:
          "Track rental performance, occupancy rates, and market insights. Make data-driven decisions with real-time property analytics and reporting.",
        tag: "Insights",
      },
      {
        icon: <Shield className="w-6 h-6" />,
        title: "Tenant Screening",
        description:
          "Verify tenant credentials with comprehensive background checks and credit assessments. Reduce risk with verified applicant profiles.",
        tag: "Security",
      },
      {
        icon: <Zap className="w-6 h-6" />,
        title: "Payment Management",
        description:
          "Receive secure rent payments directly. Automated invoicing, payment reminders, and transaction history all in one place.",
        tag: "Efficiency",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-[#f8fafc]">
        {/* Subtle Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-indigo-50/50 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[30%] h-[50%] bg-blue-50/50 blur-[100px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-8">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-semibold tracking-wide uppercase text-slate-600">
                Smart Property Management
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.05]">
              Simplified Property
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                Rental Experience
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Connect property seekers with landlords seamlessly. Browse
              listings, apply instantly, manage leases, and streamline payments
              all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                Book Enterprise Demo <ArrowRight className="w-4 h-4" />
              </button>
              <button className="px-8 py-4 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all">
                View Capabilities
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- LOGO / TRUST STRIP --- */}
      <section className="py-12 border-y border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-8">
            Trusted by Global Leaders
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale">
            {/* Replace these with actual partner logos if you have them */}
            <div className="font-black text-2xl text-slate-800 italic">
              EQUITY
            </div>
            <div className="font-black text-2xl text-slate-800">METRO</div>
            <div className="font-black text-2xl text-slate-800 italic tracking-tighter">
              BEACON
            </div>
            <div className="font-black text-2xl text-slate-800 tracking-widest">
              ASSET
            </div>
          </div>
        </div>
      </section>

      {/* --- SERVICES / BENTO SECTION --- */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Section Header Left */}
          <div className="lg:col-span-4 sticky top-32">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-6">
              Everything You Need to Manage Properties
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              From listing properties to managing applications and payments, we
              provide all the tools landlords and tenants need for a smooth
              rental experience.
            </p>
            <ul className="space-y-4">
              {[
                "Verified Listings",
                "Instant Notifications",
                "24/7 Support",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-sm font-semibold text-slate-700"
                >
                  <div className="p-1 rounded-full bg-indigo-100 text-indigo-600">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Service Cards Right */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Featured Bento Card */}
            <div className="md:col-span-2 p-10 rounded-[32px] bg-gradient-to-br from-indigo-600 to-indigo-800 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <div className="p-3 bg-white/10 w-fit rounded-2xl backdrop-blur-md mb-6">
                  <Layers className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4">
                  Complete Property Hub
                </h3>
                <p className="text-indigo-100 max-w-md mb-8">
                  List properties, manage applications, screen tenants, and
                  track payments all from one intuitive dashboard.
                </p>
                <button className="flex items-center gap-2 font-bold text-sm bg-white text-indigo-600 px-6 py-3 rounded-xl hover:bg-indigo-50 transition-all">
                  Explore Hub <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-[-20%] right-[-10%] opacity-20 transform group-hover:scale-110 transition-transform duration-700">
                <Building className="w-64 h-64" />
              </div>
            </div>

            {/* Standard Cards */}
            {services.landlords.map((service, i) => (
              <div
                key={i}
                className="p-8 rounded-[32px] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 group"
              >
                <div className="flex justify-between items-start mb-10">
                  <div className="p-4 rounded-2xl bg-white border border-slate-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    {service.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {service.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>
                <div className="h-px w-full bg-slate-200 mb-6 group-hover:bg-indigo-100" />
                <button className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:gap-3 transition-all">
                  Technical Details <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- METRICS SECTION --- */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              {
                label: "Active Listings",
                value: "5,000+",
                sub: "Properties Available",
              },
              {
                label: "Verified Users",
                value: "50,000+",
                sub: "Tenants & Landlords",
              },
              {
                label: "Success Rate",
                value: "95%",
                sub: "Tenant-Landlord Match",
              },
            ].map((metric, i) => (
              <div key={i}>
                <div className="text-5xl font-extrabold mb-2 tracking-tighter">
                  {metric.value}
                </div>
                <div className="text-indigo-400 font-bold text-sm uppercase tracking-widest mb-1">
                  {metric.label}
                </div>
                <div className="text-slate-400 text-sm">{metric.sub}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/20 blur-[120px] rounded-full" />
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto rounded-[48px] bg-[#f1f5f9] p-12 md:p-24 text-center border border-white">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight">
            Find Your Perfect Property <br /> or Tenant Today.
          </h2>
          <p className="text-slate-600 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
            Join thousands of property seekers and landlords already finding
            success on Letsten.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-10 py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
              Get Started Now
            </button>
            <button className="px-10 py-5 bg-white text-slate-900 border border-slate-200 font-bold rounded-2xl hover:bg-slate-50 transition-all">
              Talk to Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
