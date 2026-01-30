import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Wallet,
  Calendar,
  TrendingUp,
  Shield,
  Target,
  Heart,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Footer from "@/components/home/Footer";

export const Route = createFileRoute("/save-to-own")({
  component: SaveToOwnPage,
});

function SaveToOwnPage() {
  const features = [
    {
      icon: <Wallet className="w-6 h-6" />,
      title: "Flexible Payments",
      description:
        "Pay in installments that fit your budget - weekly, monthly, or quarterly",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Customizable Timeline",
      description: "Choose your payment duration from 6 months to 5 years",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Lock-in Prices",
      description:
        "Secure today's property prices and pay over time without price increases",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Savings",
      description:
        "Your payments are held securely and earn interest until completion",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Build Equity",
      description: "Start building equity from your first payment",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "No Credit Check",
      description: "Accessible to everyone regardless of credit history",
    },
  ];

  const benefits = [
    "Affordable payment plans",
    "No large upfront payment required",
    "Lock in current property prices",
    "Flexible payment schedules",
    "Interest earned on savings",
    "No credit history required",
    "Early completion bonuses",
    "Transparent fee structure",
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Choose Property",
      description:
        "Select your desired property and review the save-to-own plan options",
    },
    {
      step: "2",
      title: "Select Plan",
      description: "Choose a payment plan that fits your budget and timeline",
    },
    {
      step: "3",
      title: "Start Saving",
      description: "Make regular payments according to your chosen schedule",
    },
    {
      step: "4",
      title: "Own Property",
      description: "Complete payments and take full ownership of your property",
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
                <Wallet className="w-8 h-8" />
                <span className="text-sm font-semibold uppercase tracking-wider">
                  Investment Option
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Save to Own
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Make property ownership accessible with flexible payment plans.
                Save at your own pace and own your dream property without
                financial stress.
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
                Why Choose Save to Own?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Achieve property ownership with payments that work for your
                budget
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
                Start your save-to-own journey in four simple steps
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
                  Save to Own makes property ownership accessible to everyone by
                  offering flexible payment plans that fit any budget, without
                  the need for large upfront payments or perfect credit.
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
                  alt="Save to Own"
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
              Ready to Start Saving for Your Dream Home?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands who are achieving property ownership through our
              flexible save-to-own plans
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
