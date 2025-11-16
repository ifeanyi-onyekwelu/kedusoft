import { Link } from "react-router-dom";
import { Button } from "../../Button";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa6";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { label: "Browse Properties", path: "/listings" },
      { label: "Shortlet Rentals", path: "/shortlets" },
      { label: "Map View", path: "/listings" },
      { label: "Services", path: "/services" },
    ],
    company: [
      { label: "About Us", path: "/about-us" },
      { label: "How It Works", path: "/how-it-works" },
      { label: "Contact Us", path: "/contact-us" },
      { label: "Blog", path: "/blog" },
    ],
    forLandlords: [
      { label: "List Your Property", path: "/auth/register?role=landlord" },
      { label: "Pricing Plans", path: "#" },
      { label: "Property Management", path: "/property-management" },
      { label: "Resources", path: "/resources" },
    ],
    forTenants: [
      { label: "Find a Home", path: "/listings" },
      { label: "How to Apply", path: "/how-to-apply" },
      { label: "Tenant Guide", path: "/tenant-guide" },
      { label: "FAQs", path: "/faqs" },
    ],
    legal: [
      { label: "Terms of Service", path: "/terms-of-service" },
      { label: "Privacy Policy", path: "/privacy-policy" },
      { label: "Cookie Policy", path: "/cookie-policy" },
      { label: "Fair Housing", path: "/fair-housing" },
    ],
  };

  const socialLinks = [
    { icon: FaFacebook, label: "Facebook", url: "#" },
    { icon: FaTwitter, label: "Twitter", url: "#" },
    { icon: FaInstagram, label: "Instagram", url: "#" },
    { icon: FaLinkedin, label: "LinkedIn", url: "#" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-max-window mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section - Brand and Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10 border-b border-gray-700">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center"
              >
                <motion.img
                  src="/images/brand/logo_cropped.png"
                  alt="PropConnect Logo"
                  className="h-14 w-auto object-contain"
                />
              </motion.div>
            </Link>

            <p className="text-gray-400 mb-4 leading-relaxed">
              Your trusted platform for finding the perfect rental home.
              Connecting landlords and tenants seamlessly.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  to={social.url}
                  aria-label={social.label}
                  target="_blank"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <span className="text-lg">
                    <social.icon />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-2">
            <h4 className="text-lg font-semibold text-white mb-3">
              Stay Updated
            </h4>
            <p className="text-gray-400 mb-4">
              Subscribe to get the latest property listings and rental tips
              delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
              />
              <Button
                label="Subscribe"
                variant="filled"
                className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                onClick={(e) => {
                  e.preventDefault();
                  // Handle newsletter subscription
                }}
              />
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 py-10">
          {/* Platform */}
          <div>
            <h5 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              Platform
            </h5>
            <ul className="space-y-2.5">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h5 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              Company
            </h5>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Landlords */}
          <div>
            <h5 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              For Landlords
            </h5>
            <ul className="space-y-2.5">
              {footerLinks.forLandlords.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-green-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Tenants */}
          <div>
            <h5 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              For Tenants
            </h5>
            <ul className="space-y-2.5">
              {footerLinks.forTenants.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-green-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h5 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              Legal
            </h5>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400 text-center md:text-left">
              © {currentYear} GetMeLeased. All rights reserved. Built with ❤️
              for renters and landlords.
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
              <span>🇳🇬 Nigeria</span>
              <span>•</span>
              <span>Available 24/7</span>
              <span>•</span>
              <span>
                <a
                  href="tel:+2348123456789"
                  className="hover:text-blue-400 transition-colors"
                >
                  +234 812 345 6789
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
