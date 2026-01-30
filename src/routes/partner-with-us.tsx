import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/Card";
import { ArrowRight, TrendingUp, Shield, Users, Zap } from "lucide-react";
import Footer from "@/components/home/Footer";

export const Route = createFileRoute("/partner-with-us")({
  component: RouteComponent,
});

function RouteComponent() {
  const benefits = [
    {
      title: "Strategic Growth",
      description:
        "Access to prime real estate opportunities across Africa with proven ROI and sustainable growth potential.",
      icon: TrendingUp,
    },
    {
      title: "Risk Mitigation",
      description:
        "Our rigorous due diligence process and legal framework ensure your investments are protected and compliant.",
      icon: Shield,
    },
    {
      title: "Network Access",
      description:
        "Join a community of forward-thinking investors and developers shaping the future of African real estate.",
      icon: Users,
    },
    {
      title: "Fast Execution",
      description:
        "Streamlined processes and technology-driven solutions enable quick deployment and efficient management.",
      icon: Zap,
    },
  ];

  /*
  const partnershipModels = [
    {
      title: "Co-Development Partners",
      description:
        "Collaborate with us on large-scale residential and commercial projects. Share expertise, resources, and profits.",
      investment: "₦50M - ₦500M",
      duration: "12-36 months",
      returns: "25-40% ROI",
    },
    {
      title: "Financial Partners",
      description:
        "Provide capital for our vetted projects and earn competitive returns with minimal operational involvement.",
      investment: "₦10M - ₦200M",
      duration: "6-24 months",
      returns: "18-30% ROI",
    },
    {
      title: "Strategic Alliances",
      description:
        "Bring your unique value proposition—technology, market access, or expertise—and grow together.",
      investment: "Flexible",
      duration: "Long-term",
      returns: "Equity-based",
    },
  ];
  */

  const process = [
    {
      step: "01",
      title: "Initial Consultation",
      description:
        "Schedule a call with our partnership team to discuss your goals, investment capacity, and preferred partnership model.",
    },
    {
      step: "02",
      title: "Due Diligence",
      description:
        "We conduct thorough background checks and share detailed project documentation, financial projections, and legal frameworks.",
    },
    {
      step: "03",
      title: "Agreement Structuring",
      description:
        "Our legal team works with you to create a partnership agreement that protects all parties and aligns incentives.",
    },
    {
      step: "04",
      title: "Project Execution",
      description:
        "Begin collaboration with regular updates, transparent reporting, and dedicated support throughout the project lifecycle.",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-[#333d42] py-20">
          <div className="contain mx-auto px-6">
            <h1 className="text-5xl md:text-6xl font-serif font-medium text-white">
              Partner with Us<span className="text-brand-orange">.</span>
            </h1>
            <p className="text-xl text-gray-300 mt-6 max-w-2xl">
              Join forces with NeedHomes to unlock exceptional real estate
              opportunities across Africa. Together, we build wealth that lasts.
            </p>
          </div>
        </section>

        {/* Why Partner Section */}
        <section className="py-20 bg-[#f8f8f8]">
          <div className="contain mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-medium leading-tight text-[#333d42]">
                Why partner with NeedHomes
                <span className="text-brand-orange">?</span>
              </h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  At NeedHomes, we believe that the most impactful real estate
                  ventures are built on strong partnerships. Whether you're a
                  developer, investor, or institution, we offer collaborative
                  opportunities designed to maximize value and minimize risk.
                </p>
                <p>
                  Our track record speaks for itself: over ₦500 million
                  invested, multiple successful projects delivered, and a
                  growing network of satisfied partners across Africa.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <Card
                    key={i}
                    className="border-none bg-white rounded-none shadow-none relative overflow-hidden group hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-8 space-y-4">
                      <div className="w-12 h-12 bg-brand-orange/10 rounded-lg flex items-center justify-center group-hover:bg-brand-orange transition-colors">
                        <Icon className="w-6 h-6 text-brand-orange group-hover:text-white transition-colors" />
                      </div>
                      <h3 className="text-xl font-serif font-medium text-[#333d42]">
                        {benefit.title}
                        <span className="text-brand-orange">.</span>
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {benefit.description}
                      </p>
                    </CardContent>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-orange" />
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Partnership Models Section - Commented Out */}
        {/*
        <section className="py-24">
          <div className="contain mx-auto px-6">
            <div className="mb-16">
              <h2 className="text-4xl font-serif font-medium text-[#333d42] mb-4">
                Partnership Models
                <span className="text-brand-orange">.</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                We offer flexible partnership structures tailored to your
                investment goals, risk appetite, and preferred level of
                involvement.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {partnershipModels.map((model, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 p-8 space-y-6 hover:border-brand-orange transition-colors"
                >
                  <div>
                    <h3 className="text-2xl font-serif font-medium text-[#333d42] mb-3">
                      {model.title}
                      <span className="text-brand-orange">.</span>
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {model.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Investment Range
                      </span>
                      <span className="text-sm font-semibold text-[#333d42]">
                        {model.investment}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Duration</span>
                      <span className="text-sm font-semibold text-[#333d42]">
                        {model.duration}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Expected Returns
                      </span>
                      <span className="text-sm font-semibold text-brand-orange">
                        {model.returns}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        */}

        {/* Process Section */}
        <section className="py-24 bg-[#f8f8f8]">
          <div className="contain mx-auto px-6">
            <div className="mb-16">
              <h2 className="text-4xl font-serif font-medium text-[#333d42] mb-4">
                Our Partnership Process
                <span className="text-brand-orange">.</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                We've streamlined our partnership onboarding to ensure
                transparency, efficiency, and mutual success from day one.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map((item, i) => (
                <div key={i} className="relative">
                  <div className="bg-white p-8 h-full space-y-4">
                    <div className="text-6xl font-serif text-brand-orange/20">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-serif font-medium text-[#333d42]">
                      {item.title}
                      <span className="text-brand-orange">.</span>
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  {i < process.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="w-8 h-8 text-brand-orange/30" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 border-y border-gray-100">
          <div className="contain mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="p-10 bg-[#333d42] text-white">
                <p className="text-brand-orange font-medium mb-2">
                  Active Partnerships
                </p>
                <h3 className="text-4xl font-serif mb-4">50+</h3>
                <p className="text-gray-300">
                  Trusted partners across Africa contributing to our shared
                  vision of accessible real estate wealth.
                </p>
              </div>
              <div className="p-10 bg-brand-orange text-white">
                <p className="text-[#333d42] font-medium mb-2">
                  Total Partnership Value
                </p>
                <h3 className="text-4xl font-serif mb-4">₦2.5 Billion</h3>
                <p className="text-white/90">
                  Combined value of all partnership agreements, demonstrating
                  our scale and impact in the market.
                </p>
              </div>
              <div className="p-10 bg-[#333d42] text-white">
                <p className="text-brand-orange font-medium mb-2">
                  Average Partner ROI
                </p>
                <h3 className="text-4xl font-serif mb-4">28%</h3>
                <p className="text-gray-300">
                  Our partners consistently achieve above-market returns through
                  strategic collaboration and expert execution.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="contain mx-auto px-6">
            <div className="bg-gradient-to-r from-[#333d42] to-[#2a3337] p-12 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-serif font-medium text-white mb-6">
                Ready to build wealth together
                <span className="text-brand-orange">?</span>
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto mb-8">
                Let's discuss how a partnership with NeedHomes can accelerate
                your real estate investment goals and create lasting value.
              </p>
              <Link
                to="/coporate"
                className="inline-flex items-center gap-2 bg-brand-orange text-white px-8 py-4 font-medium hover:bg-brand-orange/90 transition-colors group"
              >
                Become a Partner Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
