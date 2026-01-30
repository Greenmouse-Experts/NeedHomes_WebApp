import { createFileRoute, Link } from "@tanstack/react-router";
import {
  PieChart,
  TrendingUp,
  Shield,
  Users,
  DollarSign,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Footer from "@/components/home/Footer";

export const Route = createFileRoute("/fractional-ownership")({
  component: FractionalOwnershipPage,
});

function FractionalOwnershipPage() {
  const features = [
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Low Entry Cost",
      description:
        "Start your property investment journey with as little as ₦500,000",
    },
    {
      icon: <PieChart className="w-6 h-6" />,
      title: "Diversified Portfolio",
      description:
        "Own fractions of multiple properties instead of putting all your money in one",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Passive Income",
      description:
        "Earn rental income proportional to your ownership percentage",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Investment",
      description:
        "All properties are legally registered with proper documentation",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Shared Ownership",
      description: "Co-own premium properties with other verified investors",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Flexible Exit",
      description: "Sell your shares anytime through our marketplace platform",
    },
  ];

  const benefits = [
    "Own a fraction of high-value properties",
    "Start with minimal capital investment",
    "Earn proportional rental income",
    "Diversify your investment portfolio",
    "No property management hassles",
    "Transparent ownership structure",
    "Potential for capital appreciation",
    "Liquidity through secondary market",
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Browse Properties",
      description:
        "Explore our curated selection of premium properties available for fractional ownership",
    },
    {
      step: "2",
      title: "Choose Your Share",
      description:
        "Select the percentage of ownership you want to purchase based on your budget",
    },
    {
      step: "3",
      title: "Complete Purchase",
      description: "Make payment and complete the legal documentation process",
    },
    {
      step: "4",
      title: "Earn Returns",
      description:
        "Start earning rental income and benefit from property appreciation",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-[#333d42] text-white py-20 md:py-32">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="w-8 h-8" />
                <span className="text-sm font-semibold uppercase tracking-wider">
                  Investment Option
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Fractional Ownership
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Own a piece of premium real estate without breaking the bank.
                Start building your property portfolio with fractional
                ownership.
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
                Why Choose Fractional Ownership?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Unlock the benefits of property ownership with a fraction of the
                cost
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
                Get started with fractional ownership in four simple steps
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
                  Fractional ownership opens doors to premium real estate
                  investments that were previously out of reach for individual
                  investors.
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
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"
                  alt="Fractional Ownership"
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
              Ready to Start Your Investment Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of investors who are building wealth through
              fractional property ownership
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
      <Footer />
    </>
  );
}
