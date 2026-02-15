import { uploadImage } from "@/api/imageApi";
import type { useSelectImage } from "@/helpers/images";
import type { useDocumentUpload } from "./DocumentUpload";
import { uploadFile } from "@/api/fileApi";

export const get_cover_image = async (
  selectImageProps: ReturnType<typeof useSelectImage>,
) => {
  selectImageProps.prev;
  // Handle Cover Image Upload
  if (selectImageProps.image) {
    console.log("uploading cover_image");
    const uploaded = await uploadImage(selectImageProps.image);
    return uploaded.data.url;
  } else if (selectImageProps.prev) {
    return selectImageProps.prev;
  }
};

export const doc_helper = async (
  data: ReturnType<typeof useDocumentUpload>,
) => {
  const { documents, prevDocs } = data;
  const doc_keys = Object.keys({ ...documents, ...prevDocs }) as Array<
    keyof typeof documents
  >;

  const uploaded_docs: Record<string, string> = {};

  for (const key of doc_keys) {
    const current_doc = documents[key];
    const old_doc = prevDocs[key];

    if (current_doc instanceof File) {
      console.log(`uploading ${key}`);
      const uploaded = await uploadFile(current_doc);
      uploaded_docs[key] = uploaded;
    } else if (typeof current_doc === "string") {
      uploaded_docs[key] = current_doc;
    } else if (typeof old_doc === "string") {
      uploaded_docs[key] = old_doc;
    }
  }

  return uploaded_docs;
};

export const stripped_unneeded = (data: Record<string, any>) => {
  delete data.id;
  delete data.createdAt;
  delete data.updatedAt;
  return data;
};

export const strip_co_dev = (data: Record<string, any>) => {
  const cleaned = stripped_unneeded(data);
  delete cleaned.investmentModel;
  delete cleaned.paymentOption;
  delete cleaned.installmentDuration;
  delete cleaned.totalShares;
  delete cleaned.pricePerShare;
  delete cleaned.minimumShares;
  delete cleaned.exitWindow;
  delete cleaned.plotSize;
  delete cleaned.pricePerPlot;
  delete cleaned.holdingPeriod;
  delete cleaned.buyBackOption;
  delete cleaned.targetPropertyPrice;
  delete cleaned.savingsFrequency;
  delete cleaned.savingsDuration;
  delete cleaned.published;
  delete cleaned.deletedAt;
  delete cleaned.systemCharges;
  delete cleaned.coDevelopmentProgress;
  return cleaned;
};
