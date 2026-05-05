import { FileText, ExternalLink } from "lucide-react";
import type { ADMIN_PROPERTY_LISTING } from "@/types.d.ts";
import ThemeProvider from "@/simpleComps/ThemeProvider";

const TITLE_DOC_LABELS: Record<string, string> = {
  CERTIFICATE_OF_OCCUPANCY: "Certificate of Occupancy (C of O)",
  GOVERNORS_CONSENT: "Governor's Consent",
  GAZETTE: "Gazette",
  REGISTERED_DEED_OF_ASSIGNMENT: "Registered Deed of Assignment",
  DEED_OF_CONVEYANCE: "Deed of Conveyance",
  OTHERS: "Others",
};

function DocLink({ url }: { url: string }) {
  const name = decodeURIComponent(url.split("/").pop() ?? "Document");
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between gap-3 p-3 rounded-xl border border-base-200 bg-base-100 hover:bg-base-200 transition-colors group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2 rounded-lg bg-primary/10 shrink-0">
          <FileText className="h-4 w-4 text-primary" />
        </div>
        <span className="text-sm font-medium truncate">{name}</span>
      </div>
      <ExternalLink className="h-4 w-4 text-base-content/40 group-hover:text-primary shrink-0 transition-colors" />
    </a>
  );
}

export function LoadDocuments({
  property_data,
}: {
  property_data: ADMIN_PROPERTY_LISTING;
}) {
  const titleDocs = property_data.propertyTitleDocuments ?? [];
  const hasAnything = !!property_data.buildingPermitNumber || titleDocs.length > 0;

  if (!hasAnything) return null;

  return (
    <ThemeProvider>
      <div className="card bg-base-100 border border-base-200 shadow-sm ring fade ring-primary/40">
        <div className="card-body gap-6">
          <h3 className="card-title text-lg">Documents</h3>

          {property_data.buildingPermitNumber && (
            <div className="flex flex-col gap-2">
              <span className="label-text font-semibold">Building Permit Number</span>
              <div className="badge badge-outline fade badge-primary badge-lg font-mono gap-1 py-4 px-3">
                {property_data.buildingPermitNumber}
              </div>
            </div>
          )}

          {titleDocs.length > 0 && (
            <>
              {property_data.buildingPermitNumber && <div className="divider my-0" />}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="label-text font-semibold">Property Title Documents</span>
                  <span className="badge badge-primary badge-sm">{titleDocs.length}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {titleDocs.map((td, idx) => (
                    <div key={idx} className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold text-base-content/50 uppercase tracking-widest pl-1">
                        {TITLE_DOC_LABELS[td.type] ?? td.type}
                      </span>
                      <DocLink url={td.documentUrl} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}
