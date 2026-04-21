import { FileText, ExternalLink } from "lucide-react";
import type { ADMIN_PROPERTY_LISTING } from "@/types.d.ts";

const TITLE_DOC_LABELS: Record<string, string> = {
  CERTIFICATE_OF_OCCUPANCY: "Certificate of Occupancy (C of O)",
  GOVERNORS_CONSENT: "Governor's Consent",
  GAZETTE: "Gazette",
  REGISTERED_DEED_OF_ASSIGNMENT: "Registered Deed of Assignment",
  DEED_OF_CONVEYANCE: "Deed of Conveyance",
  OTHERS: "Others",
};

function DocLink({ url }: { url: string }) {
  const name = url.split("/").pop() ?? "Document";
  return (
    <div className="flex items-center justify-between gap-3 bg-white p-2 rounded-md border">
      <div className="flex items-center gap-2 grow min-w-0">
        <FileText className="h-5 w-5 text-blue-500 shrink-0" />
        <span className="text-sm text-gray-800 truncate">{name}</span>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="p-1 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
      >
        <ExternalLink className="h-5 w-5" />
      </a>
    </div>
  );
}

function EmptyDoc() {
  return <p className="text-sm text-gray-400 italic">No document uploaded.</p>;
}

export function LoadDocuments({
  property_data,
}: {
  property_data: ADMIN_PROPERTY_LISTING;
}) {
  const titleDocs = property_data.propertyTitleDocuments ?? [];

  return (
    <div className="flex flex-col gap-6 fade p-6 border rounded-lg shadow-md bg-white">
      <h3 className="text-xl font-bold text-gray-800">Documents</h3>

      {/* Building Permit Number */}
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">
          Building Permit Number
        </span>
        {property_data.buildingPermitNumber ? (
          <span className="text-sm text-gray-900 font-mono bg-gray-50 border rounded px-3 py-1.5 w-fit">
            {property_data.buildingPermitNumber}
          </span>
        ) : (
          <span className="text-sm text-gray-400 italic">Not provided.</span>
        )}
      </div>

      {/* Property Document */}
      <div className="flex flex-col gap-2 p-3 border rounded-md bg-gray-50">
        <span className="text-sm font-medium text-gray-700">
          Property Document
        </span>
        {property_data.propertyDocument ? (
          <DocLink url={property_data.propertyDocument} />
        ) : (
          <EmptyDoc />
        )}
      </div>

      {/* Property Title Documents */}
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-gray-700">
          Property Title Documents
        </span>

        {titleDocs.length === 0 ? (
          <p className="text-sm text-gray-400 italic">
            No title documents uploaded.
          </p>
        ) : (
          titleDocs.map((td, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-2 p-3 border rounded-md bg-gray-50 fade"
            >
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {TITLE_DOC_LABELS[td.type] ?? td.type}
              </span>
              <DocLink url={td.documentUrl} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
