import type { ApiResponse } from "@/api/simpleApi";
import type { AxiosError } from "axios";

export const extract_message = (data: AxiosError<ApiResponse>) => {
  const api_error = data.response?.data?.message;
  if (!api_error) {
    return data.message;
  }
  return api_error;
};
