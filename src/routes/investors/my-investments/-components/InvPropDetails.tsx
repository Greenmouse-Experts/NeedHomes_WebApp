import apiClient, { type ApiResponse } from "@/api/simpleApi";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import InvestmentDetails from "@/routes/dashboard/properties/$propertyId/-components/InvSpecific";
import AdditionalFees from "@/routes/partners/-components/Additionalfees";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import type { PROPERTY_TYPE } from "@/types/property";
import { useQuery } from "@tanstack/react-query";

export default function InvPropDetails({ propId }: { propId: string }) {
  const query = useQuery<ApiResponse<PROPERTY_TYPE>>({
    queryKey: ["inv", propId],
    queryFn: async () => {
      let resp = await apiClient.get("properties/" + propId);
      return resp.data;
    },
  });

  const formatCurrency = (value?: number | null) =>
    value != null
      ? new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
          maximumFractionDigits: 0,
        }).format(value)
      : "—";

  return (
    <ThemeProvider className="ring fade rounded-box shadow">
      <QueryCompLayout query={query}>
        {(data) => {
          const prop_data = data.data;
          // Design page for SINGLE_PROPERTY
          if (!prop_data)
            return (
              <div className="text-center py-8">No property data found.</div>
            );
          return (
            <div className="bg-white rounded-lg shadow-md p-6 mt-8">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="md:flex-1">
                  <div className="rounded overflow-hidden border border-gray-100">
                    <img
                      src={prop_data.coverImage || ""}
                      alt={prop_data.propertyTitle}
                      className="w-full h-72 md:h-80 object-cover bg-gray-50"
                    />
                  </div>

                  <div className="grid grid-cols-5 gap-2 mt-3">
                    {(prop_data.galleryImages &&
                    prop_data.galleryImages.length > 0
                      ? prop_data.galleryImages
                      : []
                    )
                      .slice(0, 5)
                      .map((img, idx) => (
                        <div
                          key={idx}
                          className="h-16 w-full rounded overflow-hidden border border-gray-100 bg-gray-50"
                        >
                          <img
                            src={img}
                            alt={`${prop_data.propertyTitle} gallery ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                  </div>
                </div>

                <div className="md:flex-1 md:pl-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                        {prop_data.propertyTitle}
                      </h1>
                      <p className="text-sm text-gray-500 mt-1">
                        {prop_data.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg md:text-xl font-bold text-primary">
                        {formatCurrency(prop_data.totalPrice / 100)}
                      </div>
                      <div className="text-xs text-gray-400">Target / Ask</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <div className="badge badge-primary badge-soft ring fade">
                      {prop_data.propertyType}
                    </div>
                    <div className="badge badge-success badge-soft ring fade">
                      {prop_data.investmentModel}
                    </div>
                    <div className="badge badge-neutral badge-soft ring fade">
                      {prop_data.developmentStage}
                    </div>
                    {prop_data.published && (
                      <div className="badge badge-info badge-soft ring fade">
                        Published
                      </div>
                    )}
                    {prop_data.premiumProperty && (
                      <div className="badge badge-warning badge-soft ring fade">
                        Premium
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                      <div className="text-xs text-gray-500">Base Price</div>
                      <div className="mt-1 font-medium text-gray-900">
                        {formatCurrency(prop_data.basePrice / 100)}
                      </div>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                      <div className="text-xs text-gray-500">
                        Available Units
                      </div>
                      <div className="mt-1 font-medium text-gray-900">
                        {prop_data.availableUnits ?? "—"}
                      </div>
                    </div>
                    {/*<div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                      <div className="text-xs text-gray-500">
                        Minimum Investment
                      </div>
                      <div className="mt-1 font-medium text-gray-900">
                        {formatCurrency(prop_data.minimumInvestment)}
                      </div>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                      <div className="text-xs text-gray-500">
                        Price Per Share / Plot
                      </div>
                      <div className="mt-1 font-medium text-gray-900">
                        {prop_data.pricePerShare
                          ? formatCurrency(prop_data.pricePerShare / 100)
                          : prop_data.pricePerPlot
                            ? formatCurrency(prop_data.pricePerPlot / 100)
                            : "—"}
                      </div>
                    </div>*/}

                    <div className="col-span-2">
                      <InvestmentDetails
                        type={prop_data.investmentModel}
                        inv={prop_data}
                      />
                    </div>
                  </div>
                  {/*
                  <div className="mt-6 flex gap-3">
                    <a
                      href="#invest"
                      className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium shadow-sm hover:bg-indigo-700"
                    >
                      Invest Now
                    </a>
                    <a
                      href={prop_data.brochure || "#"}
                      target={prop_data.brochure ? "_blank" : undefined}
                      rel={
                        prop_data.brochure ? "noopener noreferrer" : undefined
                      }
                      className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-gray-200 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      {prop_data.brochure
                        ? "Download Brochure"
                        : "Brochure Unavailable"}
                    </a>
                  </div>*/}
                </div>
              </div>

              {/* Description */}
              <div className="">
                <h2 className="text-lg font-semibold text-gray-900">
                  Overview
                </h2>
                <p className="mt-2 text-gray-700 leading-relaxed">
                  {prop_data.description}
                </p>
              </div>

              {/* Documents & Media */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Documents & Media
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-gray-700">
                    {prop_data.certificate && (
                      <li>
                        📄 <span className="font-medium">Certificate:</span>{" "}
                        <a
                          href={prop_data.certificate}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 underline ml-1"
                        >
                          View
                        </a>
                      </li>
                    )}
                    {prop_data.surveyPlanDocument && (
                      <li>
                        🗺️ <span className="font-medium">Survey Plan:</span>{" "}
                        <a
                          href={prop_data.surveyPlanDocument}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 underline ml-1"
                        >
                          View
                        </a>
                      </li>
                    )}
                    {prop_data.brochure && (
                      <li>
                        📘 <span className="font-medium">Brochure:</span>{" "}
                        <a
                          href={prop_data.brochure}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 underline ml-1"
                        >
                          Download
                        </a>
                      </li>
                    )}
                    {prop_data.transferDocument && (
                      <li>
                        🧾{" "}
                        <span className="font-medium">Transfer Document:</span>{" "}
                        <a
                          href={prop_data.transferDocument}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 underline ml-1"
                        >
                          View
                        </a>
                      </li>
                    )}
                    {prop_data.videos && (
                      <li>
                        🎬{" "}
                        <span className="font-medium">Video Presentation:</span>{" "}
                        <a
                          href={prop_data.videos}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 underline ml-1"
                        >
                          Watch
                        </a>
                      </li>
                    )}
                    {!prop_data.certificate &&
                      !prop_data.surveyPlanDocument &&
                      !prop_data.brochure &&
                      !prop_data.transferDocument &&
                      !prop_data.videos && (
                        <li className="text-gray-500">
                          No documents available.
                        </li>
                      )}
                  </ul>
                </div>
                {/* Additional Details */}
                <AdditionalFees fees={prop_data.additionalFees} />
              </div>

              {/* Footer meta */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500">
                <div>
                  <span className="font-medium text-gray-700">Created:</span>{" "}
                  <span className="ml-1">
                    {new Date(prop_data.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="mt-2 sm:mt-0">
                  <span className="font-medium text-gray-700">Updated:</span>{" "}
                  <span className="ml-1">
                    {new Date(prop_data.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          );
        }}
      </QueryCompLayout>
    </ThemeProvider>
  );
}
