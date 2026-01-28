import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Shield, Target, Award, Play } from "lucide-react";

export const Route = createFileRoute("/about-us")({
  component: RouteComponent,
});

function RouteComponent() {
  const stats = [
    { label: "Properties Managed", value: "10k+" },
    { label: "Happy Families", value: "8k+" },
    { label: "Cities Covered", value: "25+" },
    { label: "Years Experience", value: "12+" },
  ];

  const values = [
    {
      icon: <Shield className="w-6 h-6 text-brand-orange" />,
      title: "Trust & Transparency",
      description:
        "We believe in honest dealings and clear communication at every step of your property journey.",
    },
    {
      icon: <Target className="w-6 h-6 text-brand-orange" />,
      title: "Client-Centric",
      description:
        "Your needs are our priority. We tailor our services to match your unique lifestyle and budget.",
    },
    {
      icon: <Award className="w-6 h-6 text-brand-orange" />,
      title: "Excellence",
      description:
        "We strive for the highest standards in property selection and customer service quality.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Professional Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image with sophisticated overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"
            alt="Modern Office Space"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        </div>

        <div className="contain mx-auto px-6 relative z-10 text-center">
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/20 backdrop-blur-md mb-4">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-brand-orange text-xs font-bold tracking-widest uppercase">
                Established 2012
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
              About <span className="text-brand-orange">NeedHomes</span>
            </h1>

            <div className="h-1 w-24 bg-brand-orange mx-auto rounded-full" />

            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed font-light">
              Redefining the standard of modern living through integrity,
              innovation, and a deep commitment to the communities we serve.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-brand-orange">
        <div className="contain mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
            {stats.map((stat, i) => (
              <div key={i} className="space-y-2">
                <p className="text-3xl md:text-5xl font-bold">{stat.value}</p>
                <p className="text-orange-100 text-sm md:text-base opacity-80">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-24">
        <div className="contain mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Core Values
            </h2>
            <p className="text-muted-foreground text-lg">
              The principles that guide us in helping thousands of people find
              their dream homes every day.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <Card
                key={i}
                className="border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-card"
              >
                <CardContent className="pt-10 text-center space-y-4">
                  <div className="mx-auto w-14 h-14 bg-brand-orange/10 rounded-2xl flex items-center justify-center">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="contain mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Meet Our Leadership
              </h2>
              <p className="text-muted-foreground text-lg">
                A diverse group of experts with decades of combined experience
                in real estate, technology, and customer service.
              </p>
            </div>
            <Button
              variant="ghost"
              className="text-brand-orange hover:text-brand-orange-dark"
            >
              Join Our Team →
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[1, 2, 3, 4].map((member) => (
              <div key={member} className="group">
                <div className="relative mb-6 overflow-hidden rounded-3xl aspect-4/5">
                  <img
                    src={`https://i.pravatar.cc/600?img=${member + 10}`}
                    alt="Team Member"
                    className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                  />
                </div>
                <h4 className="text-xl font-bold">Alex Johnson</h4>
                <p className="text-brand-orange text-sm font-semibold tracking-wide uppercase">
                  Chief Executive Officer
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="contain mx-auto px-4">
          <Card className="bg-black text-white overflow-hidden relative border-none rounded-[2.5rem]">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-brand-orange/20 to-transparent pointer-events-none" />
            <CardContent className="p-12 md:p-24 text-center relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                Ready to find your next home?
              </h2>
              <p className="text-gray-400 mb-12 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
                Let our experts guide you through the process. Whether you're
                buying, selling, or renting, we're here to help.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100 h-14 px-10 text-base font-semibold"
                >
                  Get Started Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 h-14 px-10 text-base font-semibold"
                >
                  Talk to an Agent
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
