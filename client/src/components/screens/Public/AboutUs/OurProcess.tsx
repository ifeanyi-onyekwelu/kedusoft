import { IconStarFilled, IconArrowRight } from "@tabler/icons-react";
import { Link } from "react-router-dom";

function OurProcess() {
  const processSteps = [
    {
      id: 1,
      title: "Discover Listings",
      description:
        "Browse our curated collection of properties tailored to your needs.",
    },
    {
      id: 2,
      title: "Virtual Tour",
      description:
        "Experience immersive 360° virtual tours from the comfort of your home.",
    },
    {
      id: 3,
      title: "Expert Consultation",
      description:
        "Connect with our specialists for personalized advice and insights.",
    },
    {
      id: 4,
      title: "Seamless Transaction",
      description: "Enjoy a hassle-free process with our end-to-end support.",
    },
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-window mx-auto bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl m-2 p-8 md:p-12 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Our <span className="text-primary">Process</span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600">
              A streamlined journey from discovery to your dream property
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute inset-0 flex items-center justify-center">
              <div className="h-1 w-full bg-gradient-to-r from-primary via-secondary to-accent opacity-20"></div>
            </div>
            <div className="grid md:grid-cols-4 grid-cols-1 gap-8 md:gap-4 relative z-10">
              {processSteps.map((step, index) => (
                <div
                  key={step.id}
                  className="group flex flex-col items-center text-center p-4 transition-all hover:scale-105"
                >
                  <div className="mb-4 p-3 bg-primary rounded-full relative group-hover:shadow-lg group-hover:shadow-primary/20 transition-all">
                    <IconStarFilled className="w-8 h-8 text-white" />
                    <span className="absolute -top-2 -right-2 bg-secondary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base">
                    {step.description}
                  </p>
                  {index < processSteps.length - 1 && (
                    <IconArrowRight className="md:hidden w-6 h-6 text-gray-400 mt-4" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-2xl mx-auto text-center">
            <p className="text-gray-700 md:text-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
              tempus elit ac auctor varius. Suspendisse posuere velit vel
              condimentum rutrum. Porttitor lectus. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit.
            </p>
            <Link
              to="/auth/register"
              className="w-2/4 mx-auto block mt-8 px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-full hover:shadow-lg transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OurProcess;
