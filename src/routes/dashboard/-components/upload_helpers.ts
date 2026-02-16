import { uploadImage } from "@/api/imageApi";
import type { useImages, useSelectImage } from "@/helpers/images";
import type { useDocumentUpload } from "./DocumentUpload";
import { uploadFile } from "@/api/fileApi";
import type { useVideoUpload } from "./VideoUpload";
import type { DocProps } from "@/types/form";

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

  return {
    certificate: uploaded_docs.certificate,
    surveyPlan: uploaded_docs.surveyPlan,
    transferOfOwnershipDocument: uploaded_docs.transferOfOwnershipDocument,
    brochureFactSheet: uploaded_docs.brochureFactSheet,
  };
};

export const video_helper = async (
  videoUpload: ReturnType<typeof useVideoUpload>,
) => {
  let videoUrl;
  if (videoUpload.videoFile) {
    const uploaded = await uploadImage(videoUpload.videoFile); // Assuming uploadImage can handle video files
    if (uploaded.data?.url) {
      return (videoUrl = uploaded.data.url);
    }
  }
  return videoUrl;
};

export const gallery_helper = async (
  useImageProps: ReturnType<typeof useImages>,
) => {
  let uploadedGalleryUrls: string[] = [];
  const { newImages, images } = useImageProps;
  if (newImages && newImages.length > 0) {
    for (const img of newImages) {
      const uploaded = await uploadImage(img);
      if (uploaded.data?.url) uploadedGalleryUrls.push(uploaded.data.url);
    }
  }
  const allGallery = [
    ...(images || []).map((img) => img.url),
    ...uploadedGalleryUrls,
  ];
  return allGallery;
};
