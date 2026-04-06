import ThemeProvider from "@/simpleComps/ThemeProvider";
import { FileText, ExternalLink } from "lucide-react";

const TITLE_DOC_LABELS: Record<string, string> = {
  CERTIFICATE_OF_OCCUPANCY: "Certificate of Occupancy (C of O)",
  GOVERNORS_CONSENT: "Governor's Consent",
  GAZETTE: "Gazette",
  REGISTERED_DEED_OF_ASSIGNMENT: "Registered Deed of Assignment",
  DEED_OF_CONVEYANCE: "Deed of Conveyance",
  OTHERS: "Others",
};

function DocRow({ label, url }: { label: string; url: string }) {
  return (
    <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-md  ring fade">
      <div className="flex items-center gap-2 min-w-0">
        <FileText className="h-5 w-5 text-blue-500 shrink-0" />
        <span className="text-sm font-medium text-gray-800 truncate">
          {label}
        </span>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline shrink-0"
      >
        <ExternalLink className="h-4 w-4" />
        View
      </a>
    </div>
  );
}

interface RenderDocumentsProps {
  documents?: { label: string; url: string | null | undefined }[];
  buildingPermitNumber?: string | null;
  propertyDocument?: string | null;
  propertyTitleDocuments?: { type: string; documentUrl: string }[] | null;
}

export function RenderDocuments({
  documents = [],
  buildingPermitNumber,
  propertyDocument,
  propertyTitleDocuments,
}: RenderDocumentsProps) {
  const simpleEntries = documents.filter((d) => !!d.url) as {
    label: string;
    url: string;
  }[];

  const hasTitleDocs =
    propertyTitleDocuments && propertyTitleDocuments.length > 0;

  const hasAnything =
    simpleEntries.length > 0 ||
    buildingPermitNumber ||
    propertyDocument ||
    hasTitleDocs;

  if (!hasAnything) {
    return <p className="text-sm text-gray-400">No documents available.</p>;
  }

  return (
    <ThemeProvider className="flex flex-col gap-3">
      {simpleEntries.map((doc) => (
        <DocRow key={doc.label} label={doc.label} url={doc.url} />
      ))}

      {buildingPermitNumber && (
        <div className="flex items-center gap-3 bg-white p-3 rounded-md border">
          <FileText className="h-5 w-5 text-gray-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Building Permit Number</p>
            <p className="text-sm font-medium text-gray-800">
              {buildingPermitNumber}
            </p>
          </div>
        </div>
      )}

      {propertyDocument && (
        <DocRow label="Property Document" url={propertyDocument} />
      )}

      {hasTitleDocs && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Title Documents
          </p>
          {propertyTitleDocuments!.map((td, i) => (
            <DocRow
              key={i}
              label={TITLE_DOC_LABELS[td.type] ?? td.type}
              url={td.documentUrl}
            />
          ))}
        </div>
      )}
    </ThemeProvider>
  );
}
