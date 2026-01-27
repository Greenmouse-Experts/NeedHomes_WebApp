import apiClient from "./simpleApi";

export const uploadImage = async (image: File | Blob) => {
  const formData = new FormData();
  formData.append("file", image);

  let resp = await apiClient.post("multimedia/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return resp.data;
};
