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
    description:
      "Create a new listing for collaborative real estate development projects.",
    icon: <Building2 className="w-6 h-6" />,
  },
  {
    name: "Fractional Ownership",
    path: "/dashboard/properties/new/fractional",
    description:
      "Upload a property to be sold in fractional shares to multiple investors.",
    icon: <Users className="w-6 h-6" />,
  },
  {
    name: "Outright Purchases",
    path: "/dashboard/properties/new/outright",
    description: "List a property for full ownership and direct acquisition.",
    icon: <Home className="w-6 h-6" />,
  },
  {
    name: "Land Banking",
    path: "/dashboard/properties/new/land-banking",
    description:
      "Add strategic land parcels intended for long-term value appreciation.",
    icon: <Map className="w-6 h-6" />,
  },
  {
    name: "Save to Own",
    path: "/dashboard/properties/new/save-to-own",
    description:
      "Set up a property with structured payment plans for aspiring homeowners.",
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
            Add New Property
          </h1>
          <p className="text-base-content/60 mt-3 text-lg max-w-2xl">
            Select the appropriate property category to begin the upload process
            and configure investment parameters.
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
                <span>Continue to Upload</span>
                <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ThemeProvider>
  );
}
