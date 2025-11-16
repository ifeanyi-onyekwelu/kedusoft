import { IconPhone, IconArrowRight, IconStarFilled } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 750);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="relative h-[90vh] min-h-[600px] flex items-center justify-center bg-no-repeat bg-cover bg-center"
      style={{
        backgroundImage: `url(/images/HeroBg.jpeg)`,
        backgroundAttachment: isMobile ? "scroll" : "fixed",
      }}
    >
      {/* Dark overlay with reduced opacity */}
      <div className="absolute w-full h-full bg-black/60"></div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center z-10 relative max-w-7xl">
        <div className="flex flex-col justify-center h-full w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-primary/70 text-blue-500 px-4 py-2 rounded-full w-max flex items-center gap-2 backdrop-blur-sm"
            >
              <IconStarFilled className="w-4 h-4" />
              <span className="text-sm font-semibold">
                Trusted by thousands
              </span>
            </motion.div>

            {/* Heading Section */}
            <div className="space-y-6">
              <h1
                className={`text-white font-bold ${
                  isMobile ? "text-[42px]" : "text-[72px]"
                } leading-tight`}
              >
                We're{" "}
                <span className="text-secondary relative">
                  <span className="relative z-10">Reimagining</span>
                  <span className="absolute bottom-0 left-0 w-full h-2 bg-secondary/40 -rotate-1 -skew-x-6 z-0"></span>
                </span>{" "}
                Real Estate
              </h1>

              <p
                className={`text-white/90 max-w-2xl ${
                  isMobile ? "text-lg" : "text-xl"
                } leading-relaxed`}
              >
                Our innovative platform combines cutting-edge technology with
                deep market expertise to transform your property experience from
                discovery to closing.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  href="#contact"
                  className={`flex items-center gap-2 ${
                    isMobile ? "px-6 py-3 text-base" : "px-8 py-4 text-lg"
                  } rounded-lg font-medium text-white bg-secondary hover:shadow-lg transition-all shadow-md`}
                >
                  <Link
                    to="/auth/signup"
                    className="flex items-center gap-2 justify-center"
                  >
                    Get Started
                    <IconArrowRight className="w-5 h-5" />
                  </Link>
                </motion.a>

                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  href="#contact"
                  className={`flex items-center gap-2 ${
                    isMobile ? "px-6 py-3 text-base" : "px-8 py-4 text-lg"
                  } rounded-lg font-medium text-white border-2 border-white hover:bg-white/10 transition-all`}
                >
                  <Link
                    to="/contact-us"
                    className="flex items-center gap-2 justify-center"
                  >
                    <IconPhone className="w-5 h-5" />
                    Contact Us
                  </Link>
                </motion.a>
              </div>
            </div>

            {/* Stats */}
            {!isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-8 pt-12"
              >
                <div className="border-l-2 border-primary pl-4">
                  <p className="text-white text-xl font-bold">10,000+</p>
                  <p className="text-gray-200 text-sm">Properties Listed</p>
                </div>
                <div className="border-l-2 border-primary pl-4">
                  <p className="text-white text-xl font-bold">$5B+</p>
                  <p className="text-gray-200 text-sm">In Transactions</p>
                </div>
                <div className="border-l-2 border-primary pl-4">
                  <p className="text-white text-xl font-bold">98%</p>
                  <p className="text-gray-200 text-sm">Client Satisfaction</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Scrolling indicator */}
      {!isMobile && (
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="flex flex-col items-center text-white/80 hover:text-white transition-colors">
            <span className="mb-2 text-sm">Scroll Down</span>
            <IconArrowRight className="w-5 h-5 rotate-90" />
          </div>{" "}
        </motion.div>
      )}
    </div>
  );
}

export default Hero;
