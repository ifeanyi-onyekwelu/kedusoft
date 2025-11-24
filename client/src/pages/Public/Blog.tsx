/**
 * Blog Page Component
 *
 * Blog listing page with articles about renting, real estate tips, and platform updates.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Blog = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Articles" },
    { id: "tenants", label: "For Tenants" },
    { id: "landlords", label: "For Landlords" },
    { id: "guides", label: "Guides & Tips" },
    { id: "news", label: "Platform News" },
  ];

  const articles = [
    {
      id: 1,
      title: "10 Things to Check Before Renting an Apartment in Nigeria",
      excerpt:
        "Essential checklist for tenants to ensure they make the right choice when viewing properties.",
      category: "tenants",
      author: "Sarah Johnson",
      date: "Dec 15, 2024",
      readTime: "5 min read",
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "How to Price Your Rental Property Competitively",
      excerpt:
        "Learn the factors that affect rental pricing and how to set rates that attract quality tenants.",
      category: "landlords",
      author: "Michael Chen",
      date: "Dec 12, 2024",
      readTime: "7 min read",
      image:
        "https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Understanding Your Tenant Rights in Nigeria",
      excerpt:
        "A comprehensive guide to tenant rights, responsibilities, and legal protections.",
      category: "guides",
      author: "Amina Bello",
      date: "Dec 10, 2024",
      readTime: "10 min read",
      image:
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 4,
      title: "New Feature: Virtual Property Tours Now Available",
      excerpt:
        "Explore properties from anywhere with our new 360° virtual tour feature.",
      category: "news",
      author: "GetMeLeased Team",
      date: "Dec 8, 2024",
      readTime: "3 min read",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 5,
      title: "5 Ways to Make Your Property Listing Stand Out",
      excerpt:
        "Photography tips, description writing, and pricing strategies to attract more tenants.",
      category: "landlords",
      author: "David Okonkwo",
      date: "Dec 5, 2024",
      readTime: "6 min read",
      image:
        "https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 6,
      title: "First-Time Renter's Guide: Everything You Need to Know",
      excerpt:
        "From budgeting to lease signing, we cover everything first-time renters should know.",
      category: "guides",
      author: "Grace Adebayo",
      date: "Dec 1, 2024",
      readTime: "12 min read",
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop",
    },
  ];

  const filteredArticles =
    selectedCategory === "all"
      ? articles
      : articles.filter((article) => article.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-window mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Blog</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Tips, guides, and insights to help you navigate the rental market
          </p>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-window mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 overflow-x-auto py-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="py-16">
        <div className="max-w-window mx-auto px-4 sm:px-6 lg:px-8">
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => navigate(`/blog/${article.id}`)}
                >
                  {/* Article Image */}
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                        {
                          categories.find((c) => c.id === article.category)
                            ?.label
                        }
                      </span>
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>

                    {/* Article Meta */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium">
                            {article.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span>{article.date}</span>
                        <span>•</span>
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No articles found
              </h3>
              <p className="text-gray-600">
                Try selecting a different category
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-200">
            <div className="text-5xl mb-4">📧</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Stay Updated
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Subscribe to our newsletter for the latest rental tips, market
              insights, and platform updates
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
            <p className="text-sm text-gray-500 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
