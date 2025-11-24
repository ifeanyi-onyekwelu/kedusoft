/**
 * ServicesPage Component
 *
 * Displays the platform's services for both landlords and tenants.
 * Clean, minimal MVP approach with core information.
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mantine/core";

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();

  const landlordServices = [
    {
      icon: "🏠",
      title: "Property Listing",
      description:
        "List your properties with detailed information, photos, and pricing to reach thousands of potential tenants.",
    },
    {
      icon: "👥",
      title: "Tenant Management",
      description:
        "Screen applications, communicate with tenants, and manage lease agreements all in one place.",
    },
    {
      icon: "💰",
      title: "Payment Processing",
      description:
        "Receive rent payments securely online with automated tracking and reminders.",
    },
    {
      icon: "📊",
      title: "Performance Analytics",
      description:
        "Track property views, applications, and occupancy rates with detailed insights.",
    },
  ];

  const tenantServices = [
    {
      icon: "🔍",
      title: "Property Search",
      description:
        "Browse verified listings with advanced filters to find your perfect home quickly.",
    },
    {
      icon: "🗺️",
      title: "Interactive Maps",
      description:
        "Explore properties on interactive maps to find the best location for your needs.",
    },
    {
      icon: "📝",
      title: "Easy Applications",
      description:
        "Submit rental applications online with all your documents in one secure place.",
    },
    {
      icon: "💬",
      title: "Direct Communication",
      description:
        "Message landlords directly to schedule viewings and ask questions instantly.",
    },
  ];

  const additionalServices = [
    {
      icon: "✅",
      title: "Property Verification",
      description:
        "All listings are verified to ensure authenticity and accuracy.",
    },
    {
      icon: "🔒",
      title: "Secure Platform",
      description:
        "Your data and transactions are protected with bank-level security.",
    },
    {
      icon: "📱",
      title: "Mobile Friendly",
      description: "Access the platform anywhere, anytime from any device.",
    },
    {
      icon: "🤝",
      title: "Support",
      description: "Get help from our customer support team when you need it.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80')`,
          }}
        >
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Content */}
        <div className="relative h-full flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <div className="inline-block mb-6 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30">
              What We Offer
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
              Our Services
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto leading-relaxed mb-8">
              Comprehensive solutions for landlords and tenants to make renting
              seamless and stress-free
            </p>

            {/* Quick navigation buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button
                label="Browse Properties"
                onClick={() => navigate("/listings")}
                type="button"
                variant="none"
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg"
              />
              <Button
                label="Get Started"
                onClick={() => navigate("/auth/register")}
                type="button"
                variant="outlined"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-window mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* For Landlords Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-3">
              For Property Owners
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              For Landlords
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to manage your properties efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {landlordServices.map((service, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-2xl hover:border-blue-300 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              label="Get Started as Landlord"
              onClick={() => navigate("/auth/register?role=landlord")}
              type="button"
              variant="filled"
              iconRight={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              }
              className="px-10 py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            />
          </div>
        </section>

        {/* For Tenants Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-3">
              For Renters
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              For Tenants
            </h2>
            <p className="text-lg text-gray-600">
              Find and secure your dream home with ease
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tenantServices.map((service, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-2xl hover:border-green-300 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:bg-green-200 group-hover:scale-110 transition-all duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              label="Get Started as Tenant"
              onClick={() => navigate("/auth/register?role=tenant")}
              type="button"
              variant="none"
              iconRight={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              }
              className="px-10 py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            />
          </div>
        </section>

        {/* Additional Services Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-3">
              Our Commitment
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Why Choose Us
            </h2>
            <p className="text-lg text-gray-600">
              Built with your needs in mind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-2xl hover:border-purple-300 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:bg-purple-200 group-hover:scale-110 transition-all duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative bg-black rounded-2xl p-12 md:p-16 text-center text-white shadow-2xl">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <pattern
                  id="grid"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 10 0 L 0 0 0 10"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of landlords and tenants who trust our platform for
              their rental needs
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                label="Browse Properties"
                onClick={() => navigate("/listings")}
                type="button"
                variant="none"
                className="px-10 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg"
              />
              <Button
                label="Sign Up Free"
                onClick={() => navigate("/auth/register")}
                type="button"
                variant="outlined"
                className="px-10 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ServicesPage;
