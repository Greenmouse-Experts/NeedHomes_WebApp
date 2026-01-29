import ThemeProvider from "@/simpleComps/ThemeProvider";
import { createFileRoute, Link } from "@tanstack/react-router";

const property_option = [
  {
    name: "Co-Development",
    path: "/dashboard/properties/new/co-development",
    description: "Partner with us to develop high-value real estate projects.",
  },
  {
    name: "Fractional Ownership",
    path: "/dashboard/properties/new/fractional",
    description: "Invest in shares of premium properties and earn dividends.",
  },
  {
    name: "Outright Purchases",
    path: "/dashboard/properties/new/outright",
    description: "Buy properties directly with full ownership rights.",
  },
  {
    name: "Land Banking",
    path: "/dashboard/properties/new/land-banking",
    description: "Secure strategic land parcels for future appreciation.",
  },
  {
    name: "Save to Own",
    path: "/dashboard/properties/new/save-to-own",
    description: "Flexible payment plans to help you own your dream home.",
  },
];

export const Route = createFileRoute("/dashboard/properties/new/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ThemeProvider>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-base-content">
            New Property Investment
          </h1>
          <p className="text-base-content/70 mt-2">
            Select an investment path to get started with your next property.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {property_option.map((option) => (
            <div
              key={option.name}
              className="card bg-base-100 shadow-xl border border-base-200 ring-primary hover:ring transition-all group "
            >
              <div className="card-body">
                <h2 className="card-title text-xl capitalize group-hover:text-primary transition-colors">
                  {option.name}
                </h2>
                <p className="text-sm text-base-content/60 leading-relaxed">
                  {option.description}
                </p>
                <div className="card-actions justify-end mt-4">
                  <Link to={option.path} className="btn btn-primary btn-sm">
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ThemeProvider>
  );
}
