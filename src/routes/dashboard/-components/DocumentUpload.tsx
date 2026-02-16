import { useState } from "react";
import {
  UploadCloud,
  XCircle,
  FileText,
  ExternalLink,
  Eye,
} from "lucide-react";

interface Documents<T = any> {
  certificate?: T | File | string;
  surveyPlanDocument?: T | File | string;
  transferOfOwnershipDocument?: T | File | string;
  brochure?: T | File | string;
}

export const DocumentUpload = (props: {
  useDocUpload: ReturnType<typeof useDocumentUpload>;
}) => {
  const { documents, handleFileChange, removeFile, prevDocs } =
    props.useDocUpload;

  const documentTypes: Array<keyof Documents> = [
    "certificate",
    "surveyPlanDocument",
    "transferOfOwnershipDocument",
    "brochure",
  ];

  const getLabel = (docType: keyof Documents) => {
    switch (docType) {
      case "certificate":
        return "Certificate of Ownership";
      case "surveyPlanDocument":
        return "Survey Plan Document";
      case "transferOfOwnershipDocument":
        return "Transfer of Ownership Document";
      case "brochure":
        return "Brochure / Fact Sheet";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col gap-6 fade p-6 border rounded-lg shadow-md bg-white">
      <h3 className="text-xl font-bold text-gray-800">Upload Documents</h3>
      {/*{JSON.stringify(prevDocs.surveyPlanDocument)}*/}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documentTypes.map((docType) => (
          <div
            key={docType}
            className="flex flex-col gap-2 p-3 fade border rounded-md bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {getLabel(docType)}:
              </span>
              {prevDocs[docType] && (
                <a
                  href={prevDocs[docType] as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Preview Previous
                </a>
              )}
            </div>
            {documents[docType] ? (
              <div className="flex items-center justify-between gap-3 bg-white p-2 rounded-md border">
                <div className="flex items-center gap-2 grow min-w-0">
                  <FileText className="h-5 w-5 text-blue-500 shrink-0" />

                  <span className="text-sm text-gray-800 truncate">
                    {typeof documents[docType] === "string"
                      ? (documents[docType] as string).split("/").pop()
                      : (documents[docType] as File).name}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {typeof documents[docType] === "string" && (
                    <a
                      href={documents[docType] as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded-full text-blue-600 hover:bg-blue-100 transition-colors duration-200"
                      title="View existing document"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(docType)}
                    className="p-1 rounded-full text-red-600 hover:bg-red-100 transition-colors duration-200"
                    aria-label={`Remove ${getLabel(docType)}`}
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <label className="btn btn-primary btn-soft fade ring">
                <UploadCloud className="h-5 w-5" />
                Upload File
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    handleFileChange(docType, e.target.files?.[0])
                  }
                />
              </label>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const useDocumentUpload = (prev?: Documents) => {
  const [documents, setDocuments] = useState<Documents>(prev || {});
  const [prevDocs, setPrevDocs] = useState<Documents<string>>(prev || {});

  const handleFileChange = (docType: keyof Documents, file?: File) => {
    setDocuments((prev) => ({
      ...prev,
      [docType]: file,
    }));
  };

  const removeFile = (docType: keyof Documents) => {
    setDocuments((prev) => {
      const newDocs = { ...prev };
      delete newDocs[docType];
      return newDocs;
    });
  };

  return { documents, prevDocs, setPrevDocs, handleFileChange, removeFile };
};
