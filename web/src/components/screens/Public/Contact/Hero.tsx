import { IconPhone, IconMail, IconMapPin } from "@tabler/icons-react";

export default function ContactHero() {
  return (
    <section className="relative min-h-[70vh] w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-gray-900 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/contact-bg.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-28 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight animate-fade-in">
            Let's Build Something{" "}
            <span className="text-blue-400">Together</span>
          </h1>

          <p className="text-xl text-gray-300 mb-12 max-w-2xl animate-fade-in animate-delay-100">
            Our team is ready to help you find your dream property or answer any
            questions about our services.
          </p>

          {/* Contact Methods Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/15 transition-all hover:-translate-y-1 animate-fade-in animate-delay-200">
              <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <IconPhone className="text-white w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Call Us</h3>
              <p className="text-blue-200">+234 812 345 6789</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/15 transition-all hover:-translate-y-1 animate-fade-in animate-delay-300">
              <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center mb-4">
                <IconMail className="text-white w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Email Us
              </h3>
              <p className="text-green-200">hello@rentwise.ng</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/15 transition-all hover:-translate-y-1 animate-fade-in animate-delay-400">
              <div className="w-14 h-14 bg-amber-600 rounded-full flex items-center justify-center mb-4">
                <IconMapPin className="text-white w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Visit Us
              </h3>
              <p className="text-amber-200">123 Victoria Island, Lagos</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="animate-fade-in animate-delay-500">
            <a
              href="#contact-form"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg"
            >
              <IconPhone className="w-5 h-5" />
              Send Us a Message
            </a>
          </div>
        </div>
      </div>

      {/* Floating decorative element */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-blue-500/20 blur-xl animate-pulse-slow"></div>
    </section>
  );
}
