import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, MessageCircle, HelpCircle, Plus, Minus } from "lucide-react";

export const Route = createFileRoute("/faqs")({
  component: RouteComponent,
});

const questions = [
  {
    q: "What is Needhomes PropTech Platform?",
    a: "Needhomes is a property co-development and fractional home-investment platform that enables individuals to co-own, co-develop, and invest in real estate projects affordably, transparently, and digitally.",
  },
  {
    q: "How does co-development work?",
    a: "We bring multiple qualified home buyers or investors together to fund, build & own housing units collectively. Each subscriber contributes an agreed portion into the project during construction and receives full legal ownership upon completion. Example: A 12-unit estate → 12 subscribers → construction funded collectively → each owns one fully built home.",
  },
  {
    q: "Who can join Needhomes projects?",
    a: "✅ First-time home buyers\n✅ Real estate investors (local & diaspora)\n✅ Individuals seeking long-term returns on real estate assets\n✅ Anyone interested in affordable home ownership through structured payments",
  },
  {
    q: "What project types does Needhomes offer?",
    a: "Residential estates (terraces, apartments, duplexes), Smart and affordable homes, Mixed-use investment properties (New categories added as we expand regions)",
  },
  {
    q: "What is Co-Ownership vs Co-Development?",
    a: "Co-Ownership: Shares in a property after construction for investment & income with rental & capital gain returns. Co-Development: Full unit ownership before/during construction for living + equity with equity gain returns. Needhomes offers both — you choose based on your goals.",
  },
  {
    q: "How secure is my investment?",
    a: "We protect subscribers through: ✅ Verified project documentation ✅ Escrow or trustee-managed project accounts ✅ Legal title documentation ✅ Smart contract digital records (coming roadmap) ✅ Insurance on construction-related risks",
  },
  {
    q: "How much do I need to start?",
    a: "Contribution varies per project. Typical entry points: ₦500,000 – ₦5M initial deposit for co-development, ₦50,000 and above for co-ownership shares. Installment plans are available up to 18–24 months.",
  },
  {
    q: "Are there guaranteed returns?",
    a: "Real estate performance varies, but Needhomes projects are structured for: 12–25% annual capital appreciation and steady rental income (for co-ownership investments). We prioritize risk-mitigated projects only.",
  },
  {
    q: "How do I monitor my investment?",
    a: "Through your Needhomes mobile/web dashboard: Project milestone tracking, Payment records and receipts, Legal documentation, Rental income and dividends (where applicable)",
  },
  {
    q: "What are management and service fees?",
    a: "We charge a small management fee included in the subscription structure to cover: Platform support, Compliance & legal, Project oversight & reporting. Fee transparency is fully disclosed per project.",
  },
  {
    q: "Can I exit before the project completes?",
    a: "Yes. Options include: 1. Sell your position to new subscribers via the platform resale marketplace 2. Transfer to an approved buyer. Exit terms are clearly stated in your contract.",
  },
  {
    q: "What locations do Needhomes projects cover?",
    a: "Starting in Lagos, expanding to: Abuja, Port Harcourt, Ogun, Select Sub-Saharan African regions (expansion rollout)",
  },
  {
    q: "Does Needhomes provide mortgages?",
    a: "Not directly. However, we partner with mortgage banks and lenders to help subscribers secure: NHF loans, Mortgage refinancing after completion",
  },
  {
    q: "What documents do subscribers get?",
    a: "Each subscriber receives: Offer letter & subscription agreement, Payment schedule, Deed of assignment / Sublease agreement (depending on title), Allocation of home unit (upon completion)",
  },
  {
    q: "How do I get started?",
    a: "1️⃣ Download and register on the Needhomes App 2️⃣ KYC verification 3️⃣ Choose a project 4️⃣ Start your subscription and track progress digitally",
  },
  {
    q: "Can I invest from abroad (Diaspora)?",
    a: "✅ Yes — 100% digital onboarding. Accepted currencies: USD, GBP, EUR, CAD, NGN. Returns payout: Paid to your foreign/local bank",
  },
];

function RouteComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredQuestions = questions.filter((item) =>
    item.q.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background pb-20 flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-brand-orange/5 py-20 lg:py-32 flex justify-center">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-brand-orange blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-brand-orange-dark blur-3xl" />
        </div>

        <div className="contain px-6 relative z-10 text-center w-full">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-brand-orange uppercase bg-brand-orange/10 rounded-full animate-fade-in-down">
            Help Center
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 tracking-tight">
            How can we <span className="text-brand-orange">help you?</span>
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg mb-10">
            Search our knowledge base to find answers to frequently asked
            questions.
          </p>

          <div className="max-w-2xl mx-auto relative group">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand-orange transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Search for questions..."
              className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-border bg-card focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 outline-none transition-all shadow-xl shadow-brand-orange/5"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="contain px-6 -mt-12 relative z-20 w-full flex justify-center">
        <div className="max-w-4xl w-full mx-auto">
          <div className="grid grid-cols-1 gap-12">
            {/* Accordion List */}
            <div className="space-y-4">
              {filteredQuestions.map((item, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`group rounded-2xl border transition-all duration-300 ${
                      isOpen
                        ? "border-brand-orange bg-brand-orange/2 shadow-md"
                        : "border-border bg-card hover:border-brand-orange/50"
                    }`}
                  >
                    <button
                      onClick={() => toggleAccordion(idx)}
                      className="w-full flex items-center justify-between p-6 text-left"
                    >
                      <span
                        className={`text-lg font-semibold transition-colors ${
                          isOpen ? "text-brand-orange" : "text-foreground"
                        }`}
                      >
                        {item.q}
                      </span>
                      <div
                        className={`shrink-0 ml-4 p-1 rounded-full transition-all duration-300 ${
                          isOpen
                            ? "bg-brand-orange text-white rotate-180"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                      </div>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen
                          ? "max-h-[500px] opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="px-6 pb-6 text-muted-foreground leading-relaxed whitespace-pre-line">
                        {item.a}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Support Cards - Centered Below */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
              <div className="p-8 rounded-3xl bg-brand-orange text-white shadow-2xl shadow-brand-orange/20">
                <MessageCircle className="mb-4 h-10 w-10" />
                <h3 className="text-2xl font-bold mb-2">
                  Still have questions?
                </h3>
                <p className="text-white/80 mb-6">
                  Can't find the answer you're looking for? Please chat with our
                  friendly team.
                </p>
                <button className="w-full py-4 bg-white text-brand-orange font-bold rounded-xl hover:bg-opacity-90 transition-all active:scale-95">
                  Get in Touch
                </button>
              </div>

              <div className="p-8 rounded-3xl border border-border bg-card">
                <HelpCircle className="mb-4 h-10 w-10 text-brand-orange" />
                <h3 className="text-xl font-bold mb-2">Documentation</h3>
                <p className="text-muted-foreground mb-4">
                  Learn more about our platform and investment structures.
                </p>
                <a
                  href="#"
                  className="text-brand-orange font-semibold hover:underline"
                >
                  Read Docs →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
