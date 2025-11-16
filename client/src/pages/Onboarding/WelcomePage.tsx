import { Link } from "react-router-dom";
import { FaChartLine, FaMapMarker, FaTrophy } from "react-icons/fa";

export default function WelcomePage() {
  return (
    <div className="h-full flex items-center justify-center p-4 relative font-poppins overflow-x-hidden w-full md:w-3/4">
      {/* Background shapes */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-10 left-[10%] w-64 h-64 bg-purple-500 rounded-full animate-bounce-slow shape-blur" />
        <div className="absolute top-[40%] right-[15%] w-72 h-72 bg-indigo-500 rounded-full animate-spin-slow shape-blur" />
        <div className="absolute bottom-20 left-[20%] w-56 h-56 bg-pink-500 rounded-full animate-float shape-blur" />
        <div className="absolute bottom-10 right-[25%] w-80 h-80 bg-blue-500 rounded-full animate-pulse-slow shape-blur" />
      </div>

      <div className="relative z-10 w-full">
        <div className="backdrop-blur-xl bg-white/15 rounded-3xl shadow-2xl border border-white/20 p-6 md:p-10">
          <div className="flex flex-col items-center text-center">
            {/* Logo */}
            <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-lg mb-8 animate-float">
              <div className="bg-gradient-to-br from-primary to-accent w-24 h-24 rounded-full flex items-center justify-center">
                <i className="fas fa-home text-black text-4xl"></i>
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Find Your Perfect <span className="text-accent">Apartment</span>{" "}
              with Pad Pal
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-black max-w-2xl mb-8">
              Turn your apartment search into a rewarding journey! Pad Pal makes
              finding your dream home effortless and enjoyable with personalized
              recommendations and exclusive insights.
            </p>

            {/* Benefits section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 w-full">
              <div className="transition-all duration-300 border border-white/10 rounded-xl p-6 text-center hover:-translate-y-1 hover:bg-white/25">
                <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaMapMarker />
                </div>
                <h3 className="font-bold text-black text-lg mb-2">
                  Smart Location Matching
                </h3>
                <p className="text-black/80 text-sm">
                  Find apartments in neighborhoods that match your lifestyle and
                  commute needs
                </p>
              </div>
              <div className="transition-all duration-300 border border-white/10 rounded-xl p-6 text-center hover:-translate-y-1 hover:bg-white/25">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaTrophy />
                </div>
                <h3 className="font-bold text-black text-lg mb-2">
                  Gamified Experience
                </h3>
                <p className="text-black text-sm">
                  Earn rewards and unlock insights as you progress through your
                  search
                </p>
              </div>
              <div className="transition-all duration-300 border border-white/10 rounded-xl p-6 text-center hover:-translate-y-1 hover:bg-white/25">
                <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaChartLine />
                </div>
                <h3 className="font-bold text-black text-lg mb-2">
                  Market Intelligence
                </h3>
                <p className="text-black text-sm">
                  Get data-driven insights on pricing, availability, and
                  neighborhood trends
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              className="bg-gradient-to-r from-primary via-secondary to-alternate text-white px-10 py-4 rounded-2xl font-bold text-lg mb-8 flex items-center btn-gradient"
              to={"/onboarding/property"}
            >
              <span>Begin Your Search Journey</span>
              <i className="fas fa-arrow-right ml-3"></i>
            </Link>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>
        {`
          .animate-bounce-slow {
            animation: bounce 4s infinite alternate;
          }
          .animate-spin-slow {
            animation: spin 12s linear infinite;
          }
          .animate-float {
            animation: float 6s ease-in-out infinite alternate;
          }
          .animate-pulse-slow {
            animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          .shape-blur {
            filter: blur(40px);
            opacity: 0.4;
          }
          @keyframes bounce {
            0%,100% { transform: translateY(0);}
            50% { transform: translateY(-20px);}
          }
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
          @keyframes float {
            0% { transform: translateY(0);}
            100% { transform: translateY(20px);}
          }
          @keyframes pulse-slow {
            0%,100% { opacity: 1;}
            50% { opacity: 0.7;}
          }
        `}
      </style>
    </div>
  );
}
