import ThemeProvider from "@/simpleComps/ThemeProvider";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Building2,
  Users,
  Home,
  Map,
  Wallet,
} from "lucide-react";

const property_option = [
  {
    name: "Co-Development",
    path: "/dashboard/properties/new/co-development",
    description: "Partner with us to develop high-value real estate projects.",
    icon: <Building2 className="w-6 h-6" />,
  },
  {
    name: "Fractional Ownership",
    path: "/dashboard/properties/new/fractional",
    description: "Invest in shares of premium properties and earn dividends.",
    icon: <Users className="w-6 h-6" />,
  },
  {
    name: "Outright Purchases",
    path: "/dashboard/properties/new/outright",
    description: "Buy properties directly with full ownership rights.",
    icon: <Home className="w-6 h-6" />,
  },
  {
    name: "Land Banking",
    path: "/dashboard/properties/new/land-banking",
    description: "Secure strategic land parcels for future appreciation.",
    icon: <Map className="w-6 h-6" />,
  },
  {
    name: "Save to Own",
    path: "/dashboard/properties/new/save-to-own",
    description: "Flexible payment plans to help you own your dream home.",
    icon: <Wallet className="w-6 h-6" />,
  },
];

export const Route = createFileRoute("/dashboard/properties/new/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ThemeProvider>
      <div className="py-10 px-6  mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-base-content">
            Investment Path
          </h1>
          <p className="text-base-content/60 mt-3 text-lg max-w-2xl">
            Choose the investment model that best aligns with your financial
            goals and property ownership strategy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {property_option.map((option) => (
            <Link
              key={option.name}
              to={option.path}
              className="group relative flex flex-col justify-between p-8 bg-base-100 border border-base-300 rounded-2xl transition-all duration-300 hover:border-primary hover:shadow-2xl hover:shadow-primary/5 active:scale-[0.99]"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-content transition-colors duration-300">
                  {option.icon}
                </div>
                <h2 className="text-2xl font-bold text-base-content mb-3">
                  {option.name}
                </h2>
                <p className="text-base-content/70 leading-relaxed text-base">
                  {option.description}
                </p>
              </div>

              <div className="mt-8 flex items-center text-sm font-semibold text-primary">
                <span>Select Path</span>
                <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ThemeProvider>
  );
}
