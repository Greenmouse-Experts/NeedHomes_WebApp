import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/Card";
import { ArrowRight, User, Mail, Phone, MapPin } from "lucide-react";
import Footer from "@/components/home/Footer";

export const Route = createFileRoute("/about-us")({
  component: RouteComponent,
});

function RouteComponent() {
  const values = [
    {
      title: "Our Vision",
      description:
        "To be the leading real estate investment partner in Africa, recognized for creating sustainable wealth through property.",
    },
    {
      title: "Our Mission",
      description:
        "To provide accessible property investment opportunities by leveraging technology, market expertise, and transparent processes.",
    },
    {
      title: "Our Promise",
      description:
        "We are committed to securing your future by delivering high-yield real estate assets and exceptional value to our investors.",
    },
  ];

  const tiips = [
    { letter: "M", label: "Market Intelligence" },
    { letter: "R", label: "Regulatory Rigor" },
    { letter: "T", label: "Technological Edge" },
    { letter: "S", label: "Synergistic Partners" },
    { letter: "I", label: "Investor Legacy" },
  ];

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <section className="bg-[#333d42] py-20">
          <div className="contain mx-auto px-6">
            <h1 className="text-5xl md:text-6xl font-serif font-medium text-white">
              About Us<span className="text-brand-orange">.</span>
            </h1>
          </div>
        </section>

        {/* Intro Section */}
        <section className="py-20 bg-[#f8f8f8]">
          <div className="contain mx-auto px-6 grid md:grid-cols-2 gap-12 items-start">
            <h2 className="text-3xl md:text-4xl font-serif font-medium leading-tight text-[#333d42]">
              In a world where home ownership feels out of reach, NeedHomes
              stands as a vibrant force of change
              <span className="text-brand-orange">.</span>
            </h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                We are not just a property company; we are your dedicated
                partners on a journey of wealth creation through strategic real
                estate investments.
              </p>
              <p>
                For us, success is not merely about square footage; it's about
                the financial security and legacy that property ownership
                provides.
              </p>
            </div>
          </div>
        </section>

        {/* Investment Stats Section */}
        <section className="py-24 border-y border-gray-100">
          <div className="contain mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="p-10 bg-[#333d42] text-white">
                <p className="text-brand-orange font-medium mb-2">
                  Track Record
                </p>
                <h3 className="text-4xl font-serif mb-4">Over ₦500 Million</h3>
                <p className="text-gray-300">
                  Invested so far into the company by partners who trust our
                  vision for the African real estate market.
                </p>
              </div>
              <div className="p-10 bg-brand-orange text-white">
                <p className="text-[#333d42] font-medium mb-2">Current Round</p>
                <h3 className="text-4xl font-serif mb-4">
                  $1.33m (₦2 Billion)
                </h3>
                <p className="text-white/90">
                  Our target raise for this round to scale our property
                  portfolio and deliver even greater value to our investors.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Nautilus Section */}
        <section className="py-24">
          <div className="contain mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-4xl font-serif font-medium text-[#333d42]">
                  The Keystone: The Foundation of Lasting Wealth
                  <span className="text-brand-orange">.</span>
                </h2>
                <div className="space-y-6 text-muted-foreground leading-relaxed">
                  <p>
                    In ancient architecture, the Keystone is the most critical
                    piece of an arch. It locks all other stones into position,
                    allowing the structure to bear weight and stand the test of
                    time.
                  </p>
                  <p>
                    At NeedHomes, we view strategic real estate as the Keystone
                    of your financial portfolio. It is the stabilizing force
                    that turns scattered investments into a unified, unbreakable
                    legacy.
                  </p>
                  <p>
                    Our approach ensures that every property you acquire through
                    us isn't just a piece of land, but a structural necessity
                    for your long-term prosperity.
                  </p>
                </div>
              </div>
              <div className="relative flex justify-center">
                {/* Using a structural/architectural image */}
                <img
                  src="https://images.unsplash.com/photo-1515263487990-61b07816b324?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Architectural Archway"
                  className="w-full max-w-md grayscale opacity-80"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Symbols Matter & Vision/Mission Cards */}
        <section className="py-24 bg-[#f8f8f8]">
          <div className="contain mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 mb-20">
              <h2 className="text-4xl font-serif font-medium text-[#333d42]">
                Why structural integrity matters
                <span className="text-brand-orange">.</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-8 text-muted-foreground text-sm leading-relaxed">
                <p>
                  Just as an arch distributes weight evenly to prevent collapse,
                  NeedHomes utilizes technology and market data to distribute
                  risk and maximize yield for our partners.
                </p>
                <p>
                  When you choose NeedHomes, you are building on a foundation of
                  mathematical precision and architectural permanence. We don't
                  just sell property; we engineer wealth.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {values.map((value, i) => (
                <Card
                  key={i}
                  className="border-none bg-white rounded-none shadow-none relative overflow-hidden"
                >
                  <CardContent className="p-10 space-y-6">
                    <h3 className="text-2xl font-serif font-medium text-[#333d42]">
                      {value.title}
                      <span className="text-brand-orange">.</span>
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-orange" />
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Blueprint Section */}
        <section className="py-24">
          <div className="contain mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <h2 className="text-4xl font-serif font-medium text-[#333d42]">
                The Blueprint: Precision in Every Square Foot
                <span className="text-brand-orange">.</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-8 text-muted-foreground text-sm leading-relaxed">
                <p>
                  Success in the African real estate market requires more than
                  optimism—it requires a blueprint. This is our commitment to
                  transparency and calculated growth.
                </p>
                <p>
                  Every investment round and development project follows a
                  rigorous structural plan, ensuring that as your portfolio
                  scales, its integrity remains uncompromised and its value
                  remains undeniable.
                </p>
              </div>
            </div>
            <div className="w-full h-64 bg-[#f8f8f8] relative overflow-hidden flex items-center justify-center">
              {/* Visualizing a Grid/Blueprint Pattern instead of a Spiral */}
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 h-full w-full text-brand-orange/10"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.2"
              >
                <defs>
                  <pattern
                    id="grid"
                    width="10"
                    height="10"
                    patternUnits="userSpaceOnUse"
                  >
                    <path d="M 10 0 L 0 0 0 10" />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#grid)" />
                <path
                  d="M 10 90 L 50 10 L 90 90"
                  strokeWidth="1"
                  className="text-brand-orange/30"
                />
                <path
                  d="M 30 50 L 70 50"
                  strokeWidth="1"
                  className="text-brand-orange/30"
                />
              </svg>
              <span className="relative z-10 font-serif italic text-[#333d42]/40 text-lg">
                Engineering Sustainable Wealth
              </span>
            </div>
          </div>
        </section>

        {/* The Pillars of Prosperity Section */}
        <section className="py-24 bg-[#f8f8f8]">
          <div className="contain mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-serif font-medium text-[#333d42]">
                  M R T S I: The Pillars of Prosperity
                  <span className="text-brand-orange">.</span>
                </h2>
                <p className="text-muted-foreground mt-4 leading-relaxed">
                  Our culture is built on five structural pillars. Like the
                  columns of a great estate, these values provide the strength,
                  stability, and integrity required to build lasting African
                  wealth.
                </p>
              </div>
              <Link
                to="/contact-us"
                className="flex items-center gap-2 text-sm font-medium hover:text-brand-orange transition-all group"
              >
                Build with us{" "}
                <ArrowRight className="w-4 h-4 text-brand-orange group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-gray-200 border border-gray-200">
              {tiips.map((item, i) => (
                <div
                  key={i}
                  className="bg-white group relative p-8 flex flex-col h-[320px] justify-between transition-all hover:bg-[#333d42]"
                >
                  {/* Column Numbering / Top Detail */}
                  <span className="text-xs font-medium tracking-widest text-brand-orange uppercase opacity-60">
                    Pillar 0{i + 1}
                  </span>

                  <div className="space-y-4">
                    <span className="text-6xl font-serif text-[#333d42] group-hover:text-white transition-colors block">
                      {item.letter}
                    </span>
                    <h3 className="text-xl font-serif font-medium text-[#333d42] group-hover:text-brand-orange transition-colors">
                      {item.label}
                    </h3>
                  </div>

                  {/* Subtle Decorative Line (The "Pillar" Base) */}
                  <div className="w-8 h-1 bg-brand-orange group-hover:w-full transition-all duration-500" />

                  {/* Hover Overlay Text (Optional - adds "Smart" depth) */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end bg-[#333d42] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="text-brand-orange text-xs font-bold mb-2 uppercase tracking-tighter">
                      0{i + 1} — {item.label}
                    </span>
                    <p className="text-white/80 text-xs leading-relaxed">
                      {i === 0 &&
                        "Our base layer: deep-dive research into African urban migration and land value trends."}
                      {i === 1 &&
                        "The protective layer: ensuring every asset is 100% verified and legally bulletproof.Transparent processes that protect your capital and trust."}
                      {i === 2 &&
                        "The efficiency layer: using digital tools to streamline property management and reporting."}
                      {i === 3 &&
                        "The growth layer: collaborating with top-tier developers to ensure high-yield delivery."}
                      {i === 4 &&
                        "The surface layer: the visible wealth and financial freedom enjoyed by our partners."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners & Advisors Section */}
        <section className="py-24">
          <div className="contain mx-auto px-6">
            <h2 className="text-4xl font-serif font-medium text-[#333d42] mb-6">
              Partners & Advisors<span className="text-brand-orange">.</span>
            </h2>
            <p className="text-muted-foreground mb-12 max-w-3xl leading-relaxed">
              We work with trusted contractors, legal advisors, escrow trustees, PropTech partners, and
              financial institutions to ensure secure delivery and investor protection.
            </p>

            {/* Legal & Governance */}
            <div className="bg-[#f8f8f8] p-8 md:p-12 rounded-lg">
              <h3 className="text-2xl font-serif font-medium text-[#333d42] mb-6">
                Legal & Governance
              </h3>
              <ul className="grid md:grid-cols-2 gap-4">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-brand-orange rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-muted-foreground">Incorporated with CAC Nigeria</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-brand-orange rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-muted-foreground">Escrow-backed investments</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-brand-orange rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-muted-foreground">Quarterly investor reporting</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-brand-orange rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-muted-foreground">Strong compliance and due-diligence framework</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Investment Section */}
        <section className="py-24 bg-[#f8f8f8]">
          <div className="contain mx-auto px-6">
            <h2 className="text-4xl font-serif font-medium text-[#333d42] mb-6">
              Investment<span className="text-brand-orange">.</span>
            </h2>
            <p className="text-muted-foreground mb-12 max-w-3xl leading-relaxed">
              Invest directly in verified Needhomes projects through outright purchase or fractional (co-ownership) investment via our PropTech platform.
            </p>

            <div>
              <h3 className="text-2xl font-serif font-medium text-[#333d42] mb-6">
                Available Investment Options
              </h3>
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg border-l-4 border-brand-orange">
                  <h4 className="font-bold text-lg mb-2">Co-Develop</h4>
                  <p className="text-muted-foreground">
                    Join a network of forward-thinking investors turning development opportunities into profitable assets
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Help Center Section */}
        {/* <section className="py-24 bg-[#f8f8f8]">
          <div className="contain mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-medium text-[#333d42]">
                Help Center<span className="text-brand-orange">.</span>
              </h2>
              <p className="text-muted-foreground mt-4">
                Quick access to FAQs, guides, and platform walkthroughs.
              </p>
            </div>
          </div>
        </section> */}

        {/* Contact Us Section */}
        {/* <section className="py-24 bg-white">
          <div className="contain mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-medium text-[#333d42]">
                Contact Us<span className="text-brand-orange">.</span>
              </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex items-start gap-4 p-6 bg-[#f8f8f8] rounded-lg">
                <MapPin className="w-6 h-6 text-brand-orange flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Address</h3>
                  <p className="text-muted-foreground">
                    9 Orchid Road, Lekki, Lagos
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-[#f8f8f8] rounded-lg">
                <Phone className="w-6 h-6 text-brand-orange flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Phone & WhatsApp Support</h3>
                  <p className="text-muted-foreground">
                    +234 702 500 5857
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-[#f8f8f8] rounded-lg">
                <Mail className="w-6 h-6 text-brand-orange flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Email</h3>
                  <p className="text-muted-foreground">
                    support@needhomes.ng
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section> */}
      </div>
      <Footer />
    </>
  );
}
