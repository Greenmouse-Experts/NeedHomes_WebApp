import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Search, Calendar, User, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/blogs")({
  component: RouteComponent,
});

function RouteComponent() {
  const categories = [
    "All",
    "Market Trends",
    "Home Improvement",
    "Real Estate Tips",
    "Lifestyle",
    "News",
  ];

  const blogPosts = [
    {
      id: 1,
      title: "The Future of Sustainable Housing in 2024",
      description:
        "Discover how eco-friendly materials and smart technology are reshaping the modern home landscape.",
      category: "Market Trends",
      author: "Sarah Jenkins",
      date: "Oct 24, 2023",
      image:
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 2,
      title: "10 Tips for First-Time Home Buyers",
      description:
        "Navigating the real estate market can be daunting. Here is everything you need to know before signing.",
      category: "Real Estate Tips",
      author: "Michael Chen",
      date: "Oct 22, 2023",
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 3,
      title: "Interior Design Trends: Minimalist vs. Maximalist",
      description:
        "Which style suits your personality? We break down the biggest design movements of the season.",
      category: "Lifestyle",
      author: "Emma Wilson",
      date: "Oct 20, 2023",
      image:
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 px-6">
        <div className="contain mx-auto text-center">
          <Badge variant="info" className="mb-4">
            Our Journal
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Insights, News &{" "}
            <span className="text-[var(--color-orange)]">Real Estate</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Stay updated with the latest trends, expert advice, and news in the
            housing market to help you find your perfect home.
          </p>

          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search articles, news, or tips..."
              className="pl-12 h-14 shadow-xl border-none ring-1 ring-gray-200"
            />
          </div>
        </div>
      </section>

      <div className="contain mx-auto px-6">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-12 justify-center">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={cat === "All" ? "primary" : "ghost"}
              size="sm"
              className="rounded-full"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <Card className="overflow-hidden border-none bg-white shadow-2xl group cursor-pointer">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-64 md:h-auto overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200"
                  alt="Featured"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <CardContent className="p-8 md:p-12 flex flex-col justify-center">
                <Badge variant="warning" className="w-fit mb-4">
                  Featured Article
                </Badge>
                <h2 className="text-3xl font-bold mb-4 group-hover:text-[var(--color-orange)] transition-colors">
                  How to Maximize Your Property Value Before Selling
                </h2>
                <p className="text-gray-600 mb-6 text-lg">
                  Learn the strategic renovations and staging techniques that
                  can increase your home's market value by up to 20%.
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
                  <span className="flex items-center gap-1">
                    <User size={16} /> David Miller
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={16} /> Oct 26, 2023
                  </span>
                </div>
                <Button variant="outline" className="w-fit group/btn">
                  Read Full Article{" "}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card
              key={post.id}
              className="flex flex-col h-full group border-none shadow-md hover:shadow-2xl transition-all"
            >
              <div className="relative h-48 overflow-hidden rounded-t-2xl">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <Badge className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-gray-900">
                  {post.category}
                </Badge>
              </div>
              <CardHeader className="flex-grow">
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {post.date}
                  </span>
                </div>
                <CardTitle className="text-xl group-hover:text-[var(--color-orange)] transition-colors line-clamp-2">
                  {post.title}
                </CardTitle>
                <CardDescription className="mt-3 line-clamp-3">
                  {post.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  variant="ghost"
                  className="p-0 h-auto text-[var(--color-orange)] hover:bg-transparent font-bold group/link"
                >
                  Read More{" "}
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Section */}
        <Card className="mt-20 bg-gradient-to-r from-gray-900 to-black text-white border-none p-8 md:p-12 text-center overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Subscribe to our Newsletter
            </h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Get the latest news and property updates delivered directly to
              your inbox every week.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <Input
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:bg-white/20"
              />
              <Button variant="primary" className="whitespace-nowrap">
                Subscribe Now
              </Button>
            </div>
          </div>
          {/* Decorative background element */}
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[var(--color-orange)] opacity-20 blur-3xl rounded-full"></div>
        </Card>
      </div>
    </div>
  );
}
