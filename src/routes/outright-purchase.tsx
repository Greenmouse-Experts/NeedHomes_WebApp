import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Home,
  Key,
  Shield,
  TrendingUp,
  Award,
  CheckCircle2,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export const Route = createFileRoute("/outright-purchase")({
  component: OutrightPurchasePage,
});

function OutrightPurchasePage() {
  const features = [
    {
      icon: <Key className="w-6 h-6" />,
      title: "Full Ownership",
      description:
        "100% ownership rights with complete control over your property",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Verified Properties",
      description:
        "All properties come with clear titles and proper documentation",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Capital Appreciation",
      description: "Benefit from full property value appreciation over time",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Premium Selection",
      description:
        "Access to exclusive, high-quality properties in prime locations",
    },
    {
      icon: <Home className="w-6 h-6" />,
      title: "Immediate Possession",
      description: "Move in or rent out immediately after purchase completion",
    },
    {
      icon: <CheckCircle2 className="w-6 h-6" />,
      title: "Hassle-Free Process",
      description: "We handle all legal and documentation processes for you",
    },
  ];

  const benefits = [
    "Complete ownership and control",
    "No shared decision-making",
    "Full rental income potential",
    "Maximum capital appreciation",
    "Immediate possession rights",
    "Flexible usage options",
    "Generational asset building",
    "Tax benefits on ownership",
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Browse Properties",
      description:
        "Explore our curated selection of premium properties for outright purchase",
    },
    {
      step: "2",
      title: "Schedule Viewing",
      description:
        "Book a property tour and inspect the property with our agents",
    },
    {
      step: "3",
      title: "Make Offer",
      description: "Submit your offer and complete the payment process",
    },
    {
      step: "4",
      title: "Own & Enjoy",
      description:
        "Complete documentation and take full possession of your property",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-[#333d42] text-white py-20 md:py-32">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Home className="w-8 h-8" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Investment Option
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Outright Purchase
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Own your dream property outright. Enjoy complete ownership, full
              control, and maximum returns on your investment.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                variant="secondary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Outright Purchase?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the benefits of complete property ownership
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-[var(--color-orange)] hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-[var(--color-orange)] mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Purchase your property in four simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-6 rounded-xl border border-gray-200 h-full">
                  <div className="w-12 h-12 bg-[var(--color-orange)] rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-[var(--color-orange)]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Key Benefits
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Outright purchase gives you complete freedom and control over
                your property investment, with no restrictions or shared
                decision-making.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop"
                alt="Outright Purchase"
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Own Your Dream Property?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join successful property owners who have secured their future
            through outright purchase
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              <Link to="/signup">Create Account</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              <Link to="/contact-us">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
