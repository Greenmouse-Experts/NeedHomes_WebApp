import { createFileRoute } from "@tanstack/react-router";
import {
  Search,
  UserPlus,
  Home,
  TrendingUp,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import Footer from "@/components/home/Footer";

export const Route = createFileRoute("/how-it-works")({
  component: RouteComponent,
});

function RouteComponent() {
  const steps = [
    {
      number: 1,
      title: "Create Your Account",
      description:
        "Sign up for free and complete a simple verification process. Choose between investor or partner account based on your goals.",
      icon: UserPlus,
    },
    {
      number: 2,
      title: "Browse Properties",
      description:
        "Explore our curated selection of verified real estate opportunities across prime African locations with detailed analytics.",
      icon: Search,
    },
    {
      number: 3,
      title: "Choose Investment Type",
      description:
        "Select from Co-Development, Fractional Ownership, Land Banking, or Outright Purchase based on your investment strategy.",
      icon: Home,
    },
    {
      number: 4,
      title: "Make Your Investment",
      description:
        "Fund your chosen property securely through our escrow-protected payment system with flexible payment plans available.",
      icon: TrendingUp,
    },
    {
      number: 5,
      title: "Track & Earn Returns",
      description:
        "Monitor your investment performance in real-time through your dashboard and receive returns as your property appreciates.",
      icon: CheckCircle,
    },
  ];

  const investmentOptions = [
    {
      title: "Co-Development",
      description:
        "Pool resources with other investors to fund property development from ground up.",
      features: [
        "Minimum investment from ₦1,000,000",
        "Projected ROI: 25-35% annually",
        "18-24 months investment period",
        "Full legal ownership upon completion",
      ],
    },
    {
      title: "Fractional Ownership",
      description:
        "Own a percentage of high-value properties that would otherwise be out of reach.",
      features: [
        "Start from as low as ₦500,000",
        "Earn rental income proportional to your stake",
        "Liquidity options through our marketplace",
        "Professional property management included",
      ],
    },
    {
      title: "Land Banking",
      description:
        "Secure strategic land parcels in high-growth corridors for long-term appreciation.",
      features: [
        "Entry point from ₦2,000,000",
        "Capital appreciation of 15-20% annually",
        "Verified title documentation",
        "Option to develop or resell",
      ],
    },
  ];

  const faqs = [
    {
      question: "How secure is my investment?",
      answer:
        "All investments are protected through escrow accounts managed by licensed trustees. Properties undergo rigorous due diligence, and all transactions are fully documented and legally binding.",
    },
    {
      question: "When do I receive returns?",
      answer:
        "Returns vary by investment type. Co-development returns are realized upon project completion, fractional ownership provides quarterly rental income, and land banking returns come from appreciation and eventual sale.",
    },
    {
      question: "Can I visit the properties?",
      answer:
        "Absolutely! We encourage site visits and can arrange inspections. Our team is available to provide guided tours and answer all your questions about any property.",
    },
    {
      question: "What are the associated fees?",
      answer:
        "Platform fees are clearly disclosed upfront and typically range from 2-5% depending on investment type. There are no hidden charges, and all costs are itemized in your investment agreement.",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <section className="bg-[#333d42] py-20">
          <div className="contain mx-auto px-6">
            <h1 className="text-5xl md:text-6xl font-serif font-medium text-white">
              How it Works<span className="text-brand-orange">.</span>
            </h1>
            <p className="text-white/80 mt-4 text-lg max-w-2xl">
              A simple, transparent process to start building wealth through
              real estate.
            </p>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-24">
          <div className="contain mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-medium text-[#333d42] mb-4">
                Your Journey to Property Wealth
                <span className="text-brand-orange">.</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From account creation to earning returns, we've streamlined
                every step of the investment process.
              </p>
            </div>

            <div className="space-y-8">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div
                    key={i}
                    className="grid md:grid-cols-12 gap-6 items-center group"
                  >
                    <div className="md:col-span-1 flex justify-center md:justify-end">
                      <div className="w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center group-hover:bg-brand-orange group-hover:scale-110 transition-all">
                        <span className="text-2xl font-serif font-bold text-brand-orange group-hover:text-white transition-colors">
                          {step.number}
                        </span>
                      </div>
                    </div>
                    <div className="md:col-span-11 bg-[#f8f8f8] p-8 group-hover:bg-white group-hover:shadow-lg transition-all border-l-4 border-brand-orange">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <Icon className="w-6 h-6 text-brand-orange" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-serif font-medium text-[#333d42] mb-2">
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Investment Options */}
        <section className="py-24 bg-[#f8f8f8]">
          <div className="contain mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-[#333d42] mb-4">
              Investment Options<span className="text-brand-orange">.</span>
            </h2>
            <p className="text-muted-foreground mb-12 max-w-3xl">
              Choose the investment strategy that aligns with your financial
              goals and risk appetite.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {investmentOptions.map((option, i) => (
                <div
                  key={i}
                  className="bg-white p-8 space-y-6 hover:shadow-xl transition-shadow"
                >
                  <div>
                    <h3 className="text-2xl font-serif font-medium text-[#333d42] mb-2">
                      {option.title}
                      <span className="text-brand-orange">.</span>
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {option.description}
                    </p>
                  </div>

                  <ul className="space-y-3">
                    {option.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-24">
          <div className="contain mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-[#333d42] mb-12">
              Frequently Asked Questions
              <span className="text-brand-orange">.</span>
            </h2>

            <div className="max-w-4xl space-y-6">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-[#f8f8f8] p-6 md:p-8 border-l-4 border-brand-orange"
                >
                  <h3 className="text-xl font-serif font-medium text-[#333d42] mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-4">
                Have more questions?
              </p>
              <a
                href="/faqs"
                className="inline-flex items-center gap-2 text-brand-orange hover:gap-3 transition-all font-medium"
              >
                View All FAQs
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-[#333d42]">
          <div className="contain mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-white mb-4">
              Ready to start investing?
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of investors building wealth through strategic real
              estate investments.
            </p>
            <a
              href="/account-type"
              className="inline-flex items-center gap-2 bg-brand-orange text-white px-8 py-4 rounded-lg font-medium hover:bg-brand-orange/90 transition-colors"
            >
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
