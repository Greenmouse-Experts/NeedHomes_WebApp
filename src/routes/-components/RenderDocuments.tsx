import { FileText, ExternalLink } from "lucide-react";

interface DocumentEntry {
  label: string;
  url: string | null | undefined;
}

function DocRow({ label, url }: DocumentEntry) {
  if (!url) return null;
  return (
    <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-md border">
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
  documents: DocumentEntry[];
}

export function RenderDocuments({ documents }: RenderDocumentsProps) {
  const visible = documents.filter((d) => !!d.url);

  if (visible.length === 0) {
    return (
      <p className="text-sm text-gray-400">No documents available.</p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {visible.map((doc) => (
        <DocRow key={doc.label} label={doc.label} url={doc.url} />
      ))}
    </div>
  );
}
