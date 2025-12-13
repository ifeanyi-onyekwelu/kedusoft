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
} from "lucide-react";

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track scroll progress for hero parallax
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = heroRef.current?.offsetHeight || 0;
      const progress = Math.min((scrollY / heroHeight) * 100, 100);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const servicesData = {
    landlords: [
      {
        icon: <Building className="w-6 h-6" />,
        title: "Intelligent Property Listings",
        description:
          "AI-optimized listings that attract premium tenants with precision targeting",
        features: [
          "Automated market analysis",
          "Professional media optimization",
          "Multi-platform syndication",
        ],
        stats: "98% faster tenant acquisition",
      },
      {
        icon: <BarChart3 className="w-6 h-6" />,
        title: "Performance Analytics",
        description:
          "Real-time insights and predictive analytics for maximum ROI",
        features: [
          "Occupancy rate optimization",
          "Rental yield forecasting",
          "Competitive benchmarking",
        ],
        stats: "Increase yield by 27%",
      },
      {
        icon: <Zap className="w-6 h-6" />,
        title: "Automated Operations",
        description: "End-to-end property management automation",
        features: [
          "Smart maintenance scheduling",
          "Automated payment processing",
          "AI-driven document handling",
        ],
        stats: "Reduce overhead by 65%",
      },
      {
        icon: <Shield className="w-6 h-6" />,
        title: "Advanced Tenant Screening",
        description:
          "Comprehensive verification with predictive risk assessment",
        features: [
          "AI-powered credit analysis",
          "Employment & income verification",
          "Behavioral pattern analysis",
        ],
        stats: "99.8% reliability rate",
      },
    ],
    tenants: [
      {
        icon: <Target className="w-6 h-6" />,
        title: "Predictive Property Matching",
        description:
          "Machine learning algorithms that understand your preferences",
        features: [
          "Personal lifestyle matching",
          "Neighborhood compatibility scoring",
          "Commute optimization",
        ],
        stats: "92% match accuracy",
      },
      {
        icon: <Smartphone className="w-6 h-6" />,
        title: "Immersive Virtual Experience",
        description: "High-fidelity property exploration from anywhere",
        features: [
          "Photorealistic 3D tours",
          "Live VR walkthroughs",
          "Interactive floor planning",
        ],
        stats: "85% tour completion rate",
      },
      {
        icon: <FileText className="w-6 h-6" />,
        title: "Streamlined Applications",
        description: "Paperless process with instant verification",
        features: [
          "Single-application submission",
          "Secure document vault",
          "Real-time status tracking",
        ],
        stats: "Application time reduced by 80%",
      },
      {
        icon: <MessageSquare className="w-6 h-6" />,
        title: "Intelligent Communication Hub",
        description: "Seamless landlord-tenant interaction platform",
        features: [
          "Smart messaging system",
          "Automated scheduling",
          "Priority request handling",
        ],
        stats: "Response time under 2h",
      },
    ],
  };

  const testimonials = [
    {
      name: "Michael Rodriguez",
      role: "Property Portfolio Manager",
      company: "Urban Estates",
      content:
        "The analytics platform transformed how we manage our 200+ properties. ROI increased by 34% in the first quarter.",
      rating: 5,
    },
    {
      name: "Sarah Chen",
      role: "Tenant",
      content:
        "Found my perfect apartment in 3 days. The virtual tour showed me everything I needed to know before visiting.",
      rating: 5,
    },
    {
      name: "James Wilson",
      role: "Real Estate Investor",
      company: "Wilson Holdings",
      content:
        "Automated tenant screening saved us 40 hours per month. The AI predictions are remarkably accurate.",
      rating: 5,
    },
  ];

  const features = [
    {
      icon: <CheckCircle className="w-5 h-5" />,
      text: "End-to-end encryption",
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      text: "24/7 Priority support",
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      text: "Smart contract integration",
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      text: "Real-time market data",
    },
    { icon: <CheckCircle className="w-5 h-5" />, text: "Automated compliance" },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      text: "Multi-currency support",
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section - Minimalist & Professional */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0f1419 0%, #1a1f2e 25%, #0d3b66 50%, #1a1f2e 75%, #0f1419 100%)",
        }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {/* Gradient orbs */}
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl opacity-40 animate-pulse" />
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl opacity-30 animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-600/5 rounded-full filter blur-3xl opacity-20" />

          {/* Subtle animated grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(1deg,transparent_60%,rgba(255,255,255,0.02)_61%,rgba(255,255,255,0.02)_64%,transparent_65%)] bg-[size:100px_100px]" />

          {/* Top accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{ transform: `translateY(${scrollProgress}px)` }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8 border border-white/20">
            <Award className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">
              Industry Leader Since 2018
            </span>
          </div>

          <h1 className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tight mb-6">
            <span className="block text-white">REINVENTING</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/80">
              REAL ESTATE
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
            Enterprise-grade platform transforming property management and
            tenant acquisition through artificial intelligence and automation.
          </p>

          {/* Key Metrics */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">50K+</div>
              <div className="text-sm text-gray-400 font-medium">
                Premium Properties
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">99.1%</div>
              <div className="text-sm text-gray-400 font-medium">
                Satisfaction Rate
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">24/7</div>
              <div className="text-sm text-gray-400 font-medium">
                Support Coverage
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">120+</div>
              <div className="text-sm text-gray-400 font-medium">Countries</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate("/demo")}
              className="group px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-50 transition-all duration-300 border border-white flex items-center gap-2 min-w-[200px] justify-center"
            >
              Request Demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/listings")}
              className="group px-8 py-4 bg-transparent border border-white/30 text-white font-bold rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center gap-2 min-w-[200px] justify-center backdrop-blur-sm"
            >
              Explore Platform
              <TrendingUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-px h-20 bg-gradient-to-b from-white/50 to-transparent">
            <div
              className="w-px h-8 bg-white"
              style={{ transform: `translateY(${scrollProgress * 0.2}px)` }}
            />
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-black text-white text-sm font-medium rounded-full mb-4">
              ENTERPRISE FEATURES
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Platform Capabilities
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools designed for modern real estate operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="text-black">{feature.icon}</div>
                <span className="text-gray-700 font-medium">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>

          {/* Landlord Services */}
          <div className="mb-24">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1 bg-gray-200" />
              <div className="flex items-center gap-3">
                <Building className="w-6 h-6 text-gray-700" />
                <h3 className="text-3xl font-bold text-gray-900">
                  For Property Owners
                </h3>
              </div>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {servicesData.landlords.map((service, index) => (
                <div
                  key={index}
                  className="group p-8 border border-gray-200 rounded-2xl hover:border-black transition-all duration-500 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-black transition-colors">
                      <div className="text-gray-700 group-hover:text-white transition-colors">
                        {service.icon}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-gray-900 px-3 py-1 bg-gray-100 rounded-full">
                      {service.stats}
                    </div>
                  </div>

                  <h4 className="text-2xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h4>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <span className="w-1.5 h-1.5 bg-black rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button className="text-black font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tenant Services */}
          <div>
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1 bg-gray-200" />
              <div className="flex items-center gap-3">
                <Home className="w-6 h-6 text-gray-700" />
                <h3 className="text-3xl font-bold text-gray-900">
                  For Residents
                </h3>
              </div>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {servicesData.tenants.map((service, index) => (
                <div
                  key={index}
                  className="group p-8 bg-gray-50 rounded-2xl hover:bg-white border border-transparent hover:border-gray-300 transition-all duration-500 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-3 bg-white rounded-lg group-hover:bg-black transition-colors">
                      <div className="text-gray-700 group-hover:text-white transition-colors">
                        {service.icon}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-gray-900 px-3 py-1 bg-white rounded-full">
                      {service.stats}
                    </div>
                  </div>

                  <h4 className="text-2xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h4>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <span className="w-1.5 h-1.5 bg-black rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button className="text-black font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-black text-white text-sm font-medium rounded-full mb-4">
              TESTIMONIALS
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Trusted by Industry Leaders
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl border border-gray-200"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-bold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {testimonial.role}
                  </div>
                  {testimonial.company && (
                    <div className="text-gray-500 text-sm">
                      {testimonial.company}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm text-white text-sm font-medium rounded-full mb-6 border border-white/20">
            ENTERPRISE SOLUTIONS
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Transform Your Real Estate Operations
          </h2>

          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Schedule a personalized demo to see how our platform can optimize
            your portfolio management and tenant experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/enterprise/demo")}
              className="group px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2 min-w-[200px]"
            >
              Request Enterprise Demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/contact/sales")}
              className="group px-8 py-4 bg-transparent border border-white/30 text-white font-bold rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 min-w-[200px] backdrop-blur-sm"
            >
              Contact Sales
              <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-wrap justify-center gap-8 text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>SOC 2 Type II Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>99.9% Uptime SLA</span>
              </div>
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                <span>Enterprise Security</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
