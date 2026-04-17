import { createFileRoute, redirect } from "@tanstack/react-router";

const PROPERTY_TYPE_ROUTES: Record<string, string> = {
  OUTRIGHT_PURCHASE: "/properties/$propertyId/outright/",
  FRACTIONAL_OWNERSHIP: "/properties/$propertyId/fractional/",
  LAND_BANKING: "/properties/$propertyId/land-banking/",
};

export const Route = createFileRoute("/property/")({
  validateSearch: (search: any) => {
    return {
      propertyType: search?.propertyType as string | undefined,
      id: search?.id as string,
      ref: search?.ref as string | undefined,
    };
  },
  loader: ({ location }) => {
    const search = location.search as {
      propertyType?: string;
      id: string;
      ref?: string;
    };
    const { propertyType, id, ref } = search;
    if (ref && typeof window !== "undefined") {
      localStorage.setItem(`ref_${id}`, ref);
    }
    const to =
      (propertyType && PROPERTY_TYPE_ROUTES[propertyType]) ??
      "/properties/$propertyId/default/";
    throw redirect({ to, params: { propertyId: id } });
  },
  component: () => null,
});
