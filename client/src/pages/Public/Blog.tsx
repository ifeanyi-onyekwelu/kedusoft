import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Text,
  Group,
  Box,
  Badge,
  TextInput,
  Button,
} from "@mantine/core";
import {
  IconSearch,
  IconArrowRight,
  IconClock,
  IconCalendar,
} from "@tabler/icons-react";
import { PageHero } from "@/components/shared/public/PageHero";

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
    <div className="min-h-screen bg-white font-inter">
      <PageHero
        badgeText="Knowledge Hub"
        title="Insights for the"
        highlightText="Modern Resident."
        subtitle="Stay informed with expert real estate guides, market trends, and property management tips tailored for Nigeria."
        bgImageUrl="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
      >
        {/* Search Bar passed as children */}
        <div className="max-w-md bg-white p-2 rounded-2xl flex items-center shadow-2xl">
          <div className="pl-4 text-gray-400">
            <IconSearch size={20} />
          </div>
          <input
            type="text"
            placeholder="Search articles..."
            className="flex-1 px-4 py-2 outline-none text-gray-900 font-medium"
          />
          <Button className="bg-primary rounded-xl px-6">Search</Button>
        </div>
      </PageHero>

      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <Container size="lg">
          <div className="flex items-center gap-2 overflow-x-auto py-6 no-scrollbar">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap border-2 ${
                  selectedCategory === category.id
                    ? "bg-primary border-primary text-white shadow-lg shadow-blue-900/20"
                    : "bg-transparent border-transparent text-gray-500 hover:text-primary"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </Container>
      </div>

      {/* 3. Articles Grid */}
      <section className="py-24">
        <Container size="lg">
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
              {filteredArticles.map((article) => (
                <article
                  key={article.id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/blog/${article.id}`)}
                >
                  {/* Card Image */}
                  <div className="relative aspect-[16/10] mb-6 overflow-hidden rounded-[2.5rem] bg-gray-100 shadow-sm border border-gray-50">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-6 left-6">
                      <Badge
                        size="lg"
                        className="bg-white/90 backdrop-blur text-primary rounded-xl font-bold border-none py-4 px-5 shadow-sm uppercase"
                      >
                        {article.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="px-2">
                    <Group
                      gap="xs"
                      className="mb-4 text-gray-400 font-bold text-[11px] uppercase tracking-widest"
                    >
                      <Group gap={4}>
                        <IconCalendar size={14} /> {article.date}
                      </Group>
                      <span>•</span>
                      <Group gap={4}>
                        <IconClock size={14} /> {article.readTime}
                      </Group>
                    </Group>

                    <h2 className="text-2xl font-montserrat font-extrabold text-primary mb-3 leading-snug group-hover:text-secondary transition-colors">
                      {article.title}
                    </h2>

                    <p className="text-gray-500 leading-relaxed mb-6 line-clamp-2">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-primary font-bold text-xs">
                        {article.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <span className="font-bold text-sm text-primary">
                        {article.author}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-[3rem]">
              <Text size="xl" fw={700} color="dimmed">
                No articles found in this category.
              </Text>
              <Button
                variant="subtle"
                mt="md"
                onClick={() => setSelectedCategory("all")}
              >
                View all articles
              </Button>
            </div>
          )}
        </Container>
      </section>

      {/* 4. Captivating Newsletter Section */}
      <section className="pb-24">
        <Container size="lg">
          <div className="relative bg-primary rounded-[3rem] p-8 md:p-20 overflow-hidden text-center shadow-2xl shadow-blue-900/30">
            {/* Decorative Elements */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-secondary/10 rounded-full" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent/10 rounded-full" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <Text className="text-secondary font-bold uppercase tracking-[0.2em] mb-4 text-sm">
                Newsletter
              </Text>
              <h2 className="text-4xl md:text-5xl font-montserrat font-extrabold text-white mb-6">
                Stay ahead of the market.
              </h2>
              <p className="text-blue-100/70 text-lg mb-10">
                Get weekly property insights and exclusive platform updates
                delivered straight to your inbox.
              </p>

              <form className="flex flex-col sm:flex-row gap-4 p-2 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 bg-transparent px-6 py-4 text-white outline-none placeholder:text-blue-200/50"
                  required
                />
                <button className="bg-secondary hover:bg-white hover:text-primary text-white font-extrabold px-10 py-4 rounded-2xl transition-all">
                  Subscribe
                </button>
              </form>
              <Text size="xs" color="blue.2" mt="md" className="opacity-50">
                No spam. Just value. Unsubscribe anytime.
              </Text>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Blog;
