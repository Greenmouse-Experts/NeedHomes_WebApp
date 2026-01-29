import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import Footer from "@/components/home/Footer";

export const Route = createFileRoute("/blog")({
  component: RouteComponent,
});

function RouteComponent() {
  const [activeTab, setActiveTab] = useState<"latest" | "blog">("latest");

  const blogPosts = [
    {
      id: 1,
      title: "The Roles of Trustees in Nigeria's Financial System.",
      date: "NOVEMBER 10, 2025",
      image:
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
      type: "blog",
    },
    {
      id: 2,
      title:
        "What You Need to Know about Registrars in Nigeria: Guardians of Shareholder Transactions.",
      date: "NOVEMBER 5, 2025",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
      type: "blog",
    },
    {
      id: 3,
      title:
        "2025 Economic Outlook: Cordros Highlights Growth and Inflation Trends.",
      date: "JULY 31, 2025",
      image:
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800",
      type: "blog",
    },
  ];

  const latestUpdates = [
    {
      id: 1,
      title: "NeedHomes Expands Property Portfolio in Lekki",
      date: "JANUARY 28, 2026",
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800",
      type: "update",
    },
    {
      id: 2,
      title: "New Fractional Ownership Opportunities Available",
      date: "JANUARY 25, 2026",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
      type: "update",
    },
    {
      id: 3,
      title: "Q4 2025 Investment Report Released",
      date: "JANUARY 20, 2026",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
      type: "update",
    },
  ];

  const displayPosts = activeTab === "latest" ? latestUpdates : blogPosts;

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <section className="bg-[#3d484e] py-16 px-6">
          <div className="contain mx-auto">
            <h1 className="text-5xl md:text-6xl font-serif text-white mb-2">
              Insights<span className="text-brand-orange">.</span>
            </h1>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="bg-[#f5f5f5] border-b border-gray-200">
          <div className="contain mx-auto px-6">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("latest")}
                className={`py-4 px-2 font-medium transition-colors relative ${activeTab === "latest"
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Latest Updates
                {activeTab === "latest" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-orange" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("blog")}
                className={`py-4 px-2 font-medium transition-colors relative ${activeTab === "blog"
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Blog
                {activeTab === "blog" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-orange" />
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <section className="py-16 px-6">
          <div className="contain mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayPosts.map((post) => (
                <div
                  key={post.id}
                  className="group cursor-pointer bg-white"
                >
                  <div className="relative h-64 overflow-hidden mb-6">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      {post.date}
                    </p>
                    <h3 className="text-xl font-serif font-medium text-gray-900 leading-tight group-hover:text-brand-orange transition-colors">
                      {post.title}
                    </h3>
                    <button className="flex items-center gap-2 text-sm font-medium text-brand-orange group-hover:gap-3 transition-all">
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
