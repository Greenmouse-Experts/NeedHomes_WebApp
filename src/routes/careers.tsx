import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, MapPin, Clock, ArrowRight, Users } from "lucide-react";
import Footer from "@/components/home/Footer";
import { Card, CardContent } from "@/components/ui/Card";

export const Route = createFileRoute("/careers")({
  component: RouteComponent,
});

function RouteComponent() {
  const openPositions = [
    {
      title: "Senior Property Manager",
      department: "Operations",
      location: "Lagos, Nigeria",
      type: "Full-time",
      description:
        "Lead our property management team and oversee day-to-day operations across our growing portfolio of real estate assets.",
    },
    {
      title: "Real Estate Investment Analyst",
      department: "Investment",
      location: "Lagos, Nigeria",
      type: "Full-time",
      description:
        "Conduct market research, financial modeling, and due diligence for new investment opportunities in the African real estate market.",
    },
    {
      title: "Full Stack Developer",
      department: "Technology",
      location: "Remote",
      type: "Full-time",
      description:
        "Build and maintain our PropTech platform, developing features that empower investors and streamline property management.",
    },
    {
      title: "Marketing Manager",
      department: "Marketing",
      location: "Lagos, Nigeria",
      type: "Full-time",
      description:
        "Drive brand awareness and investor acquisition through strategic marketing campaigns and digital initiatives.",
    },
  ];

  const benefits = [
    {
      title: "Competitive Salary",
      description:
        "Industry-leading compensation packages with performance bonuses and equity opportunities.",
    },
    {
      title: "Professional Growth",
      description:
        "Access to training programs, conferences, and mentorship from industry leaders.",
    },
    {
      title: "Health & Wellness",
      description:
        "Comprehensive health insurance coverage for you and your immediate family.",
    },
    {
      title: "Flexible Work",
      description:
        "Hybrid work environment with flexible hours to support work-life balance.",
    },
    {
      title: "Investment Opportunities",
      description:
        "Exclusive access to NeedHomes investment deals with preferential terms for employees.",
    },
    {
      title: "Team Culture",
      description:
        "Collaborative environment with regular team events and professional development sessions.",
    },
  ];

  const values = [
    {
      title: "Innovation",
      description:
        "We constantly seek new ways to improve the real estate investment experience.",
    },
    {
      title: "Integrity",
      description:
        "Transparency and ethical conduct are the foundation of everything we do.",
    },
    {
      title: "Excellence",
      description:
        "We set high standards and consistently deliver exceptional results.",
    },
    {
      title: "Collaboration",
      description:
        "We believe the best outcomes come from diverse perspectives working together.",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <section className="bg-[#333d42] py-20">
          <div className="contain mx-auto px-6">
            <h1 className="text-5xl md:text-6xl font-serif font-medium text-white">
              Careers<span className="text-brand-orange">.</span>
            </h1>
            <p className="text-white/80 mt-4 text-lg max-w-2xl">
              Join us in transforming the future of real estate investment in
              Africa.
            </p>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-20 bg-[#f8f8f8]">
          <div className="contain mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <h2 className="text-3xl md:text-4xl font-serif font-medium leading-tight text-[#333d42]">
              Build the future of property wealth with Africa's leading PropTech
              innovators<span className="text-brand-orange">.</span>
            </h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                At NeedHomes, we're not just building properties—we're building
                futures. Our team is composed of passionate professionals
                dedicated to making real estate investment accessible and
                profitable across Africa.
              </p>
              <p>
                If you're driven by innovation, committed to excellence, and
                ready to make a meaningful impact, we want to hear from you.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-24">
          <div className="contain mx-auto px-6">
            <h2 className="text-4xl font-serif font-medium text-[#333d42] mb-4">
              Our Values<span className="text-brand-orange">.</span>
            </h2>
            <p className="text-muted-foreground mb-12 max-w-3xl">
              These core values guide everything we do and define who we are as
              a company.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, i) => (
                <Card
                  key={i}
                  className="border-none bg-[#f8f8f8] rounded-none shadow-none relative overflow-hidden"
                >
                  <CardContent className="p-8 space-y-4">
                    <h3 className="text-xl font-serif font-medium text-[#333d42]">
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

        {/* Open Positions */}
        <section className="py-24 bg-[#f8f8f8]">
          <div className="contain mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
              <div>
                <h2 className="text-4xl font-serif font-medium text-[#333d42]">
                  Open Positions<span className="text-brand-orange">.</span>
                </h2>
                <p className="text-muted-foreground mt-4">
                  Explore current opportunities to join our growing team.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-brand-orange" />
                <span className="text-muted-foreground">
                  {openPositions.length} positions available
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {openPositions.map((position, i) => (
                <div
                  key={i}
                  className="bg-white p-6 md:p-8 border-l-4 border-brand-orange hover:shadow-lg transition-shadow group cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-serif font-medium text-[#333d42] group-hover:text-brand-orange transition-colors">
                        {position.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {position.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {position.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {position.type}
                        </span>
                      </div>
                    </div>
                    <Link
                      to="/contact-us"
                      className="flex items-center gap-2 text-sm font-medium text-brand-orange hover:gap-3 transition-all whitespace-nowrap"
                    >
                      Apply Now
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {position.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits & Perks */}
        <section className="py-24">
          <div className="contain mx-auto px-6">
            <h2 className="text-4xl font-serif font-medium text-[#333d42] mb-4">
              Benefits & Perks<span className="text-brand-orange">.</span>
            </h2>
            <p className="text-muted-foreground mb-12 max-w-3xl">
              We invest in our team because we believe great people deliver
              great results.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, i) => (
                <div key={i} className="space-y-3">
                  <div className="w-12 h-12 bg-brand-orange/10 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-serif text-brand-orange">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-serif font-medium text-[#333d42]">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-[#333d42]">
          <div className="contain mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-white mb-4">
              Don't see a role that fits?
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals to join our team.
              Send us your resume and tell us how you can contribute to our
              mission.
            </p>
            <Link
              to="/contact-us"
              className="inline-flex items-center gap-2 bg-brand-orange text-white px-8 py-4 rounded-lg font-medium hover:bg-brand-orange/90 transition-colors"
            >
              Get in Touch
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
