import { useState } from "react";
import {
  UploadCloud,
  XCircle,
  FileText,
  ExternalLink,
  Eye,
  Plus,
  Trash2,
} from "lucide-react";

interface Documents<T = any> {
  propertyDocument?: T | File | string;
}

export interface TitleDocument {
  type: string;
  file: File | string | null;
}

const TITLE_DOC_TYPES = [
  { value: "CERTIFICATE_OF_OCCUPANCY", label: "Certificate of Occupancy (C of O)" },
  { value: "GOVERNORS_CONSENT", label: "Governor's Consent" },
  { value: "GAZETTE", label: "Gazette" },
  { value: "REGISTERED_DEED_OF_ASSIGNMENT", label: "Registered Deed of Assignment" },
  { value: "DEED_OF_CONVEYANCE", label: "Deed of Conveyance" },
  { value: "OTHERS", label: "Others" },
];


function FileRow({
  file,
  prevUrl,
  onUpload,
  onRemove,
}: {
  file: File | string | null | undefined;
  prevUrl?: string;
  onUpload: (f: File) => void;
  onRemove: () => void;
}) {
  return file ? (
    <div className="flex items-center justify-between gap-3 bg-white p-2 rounded-md border">
      <div className="flex items-center gap-2 grow min-w-0">
        <FileText className="h-5 w-5 text-blue-500 shrink-0" />
        <span className="text-sm text-gray-800 truncate">
          {typeof file === "string"
            ? file.split("/").pop()
            : (file as File).name}
        </span>
      </div>
      <div className="flex items-center gap-1">
        {typeof file === "string" && (
          <a
            href={file}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <ExternalLink className="h-5 w-5" />
          </a>
        )}
        <button
          type="button"
          onClick={onRemove}
          className="p-1 rounded-full text-red-600 hover:bg-red-100 transition-colors"
        >
          <XCircle className="h-5 w-5" />
        </button>
      </div>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      {prevUrl && (
        <a
          href={prevUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
        >
          <Eye className="h-3.5 w-3.5" />
          Preview Previous
        </a>
      )}
      <label className="btn btn-primary btn-soft fade ring flex-1">
        <UploadCloud className="h-5 w-5" />
        Upload File
        <input
          type="file"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onUpload(f);
          }}
        />
      </label>
    </div>
  );
}

export const DocumentUpload = (props: {
  useDocUpload: ReturnType<typeof useDocumentUpload>;
}) => {
  const {
    documents,
    handleFileChange,
    removeFile,
    prevDocs,
    buildingPermitNumber,
    setBuildingPermitNumber,
    titleDocuments,
    addTitleDoc,
    removeTitleDoc,
    updateTitleDoc,
  } = props.useDocUpload;

  return (
    <div className="flex flex-col gap-6 fade p-6 border rounded-lg shadow-md bg-white">
      <h3 className="text-xl font-bold text-gray-800">Upload Documents</h3>

      {/* ── Building Permit Number ── */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Building Permit Number
          <span className="ml-1 text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="e.g. BP/2024/LAG/00123"
          value={buildingPermitNumber}
          onChange={(e) => setBuildingPermitNumber(e.target.value)}
        />
      </div>

      {/* ── Property Document ── */}
      <div className="flex flex-col gap-2 p-3 fade border rounded-md bg-gray-50">
        <span className="text-sm font-medium text-gray-700">
          Property Document
          <span className="ml-1 text-gray-400 font-normal">(optional)</span>
        </span>
        <FileRow
          file={documents.propertyDocument as File | string | null}
          prevUrl={prevDocs.propertyDocument as string | undefined}
          onUpload={(f) => handleFileChange("propertyDocument", f)}
          onRemove={() => removeFile("propertyDocument")}
        />
      </div>

      {/* ── Property Title Documents ── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Property Title Documents
            <span className="ml-1 text-gray-400 font-normal">(optional)</span>
          </span>
          <button
            type="button"
            className="btn btn-sm btn-outline gap-1"
            onClick={addTitleDoc}
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {titleDocuments.length === 0 && (
          <p className="text-sm text-gray-400">
            No title documents added. Click Add to include one.
          </p>
        )}

        {titleDocuments.map((td, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-2 p-3 border rounded-md bg-gray-50 fade"
          >
            <div className="flex items-center gap-2">
              <select
                className="select select-bordered flex-1 text-sm"
                value={td.type}
                onChange={(e) => updateTitleDoc(idx, "type", e.target.value)}
              >
                <option value="" disabled>
                  Select document type
                </option>
                {TITLE_DOC_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-sm btn-ghost text-red-500 hover:bg-red-50"
                onClick={() => removeTitleDoc(idx)}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <FileRow
              file={td.file}
              onUpload={(f) => updateTitleDoc(idx, "file", f)}
              onRemove={() => updateTitleDoc(idx, "file", null)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const useDocumentUpload = (prev?: Documents) => {
  const [documents, setDocuments] = useState<Documents>(prev || {});
  const [prevDocs, setPrevDocs] = useState<Documents<string>>(prev || {});
  const [buildingPermitNumber, setBuildingPermitNumber] = useState("");
  const [titleDocuments, setTitleDocuments] = useState<TitleDocument[]>([]);

  const handleFileChange = (docType: keyof Documents, file?: File) => {
    setDocuments((prev) => ({ ...prev, [docType]: file }));
  };

  const removeFile = (docType: keyof Documents) => {
    setDocuments((prev) => {
      const next = { ...prev };
      delete next[docType];
      return next;
    });
  };

  const addTitleDoc = () => {
    setTitleDocuments((prev) => [...prev, { type: "", file: null }]);
  };

  const removeTitleDoc = (idx: number) => {
    setTitleDocuments((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateTitleDoc = (
    idx: number,
    field: keyof TitleDocument,
    value: string | File | null,
  ) => {
    setTitleDocuments((prev) =>
      prev.map((td, i) => (i === idx ? { ...td, [field]: value } : td)),
    );
  };

  return {
    documents,
    prevDocs,
    setPrevDocs,
    handleFileChange,
    removeFile,
    buildingPermitNumber,
    setBuildingPermitNumber,
    titleDocuments,
    addTitleDoc,
    removeTitleDoc,
    updateTitleDoc,
  };
};
