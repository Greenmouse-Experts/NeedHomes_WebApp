import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Loader2,
  Eye,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react";
import apiClient from "@/api/simpleApi";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/api/simpleApi";
import Modal from "@/components/modals/DialogModal";
import { useState } from "react";
import { useModal } from "@/store/modals";

export default function AdminKycForm({ id }: { id: string }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { ref: modalRef, showModal } = useModal();
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
  } | null>(null);

  // Fetch KYC details
  const {
    data: kycResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["kyc-verification", id],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/verifications/${id}`);
      return response.data.data;
    },
  });

  // Mutation for approval/rejection
  const verifyMutation = useMutation({
    mutationFn: async (status: "APPROVED" | "REJECTED") => {
      const endpoint =
        status === "APPROVED"
          ? `/admin/verifications/${id}/accept`
          : `/admin/verifications/${id}/reject`;
      return apiClient.patch(endpoint);
    },
    onSuccess: () => {
      toast.success("KYC status updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["kyc-verification", id],
      });
      navigate({
        to: "/dashboard/investors/$investorId",
        params: { investorId: id },
      });
    },
    onError: (error: AxiosError<ApiResponse>) => {
      const message = extract_message(error);
      toast.error(message);
    },
  });

  const handleViewImage = (url: string, title: string) => {
    setSelectedImage({ url, title });
    showModal();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-96 items-center justify-center space-y-4">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand-orange" />
          <div className="absolute h-16 w-16 rounded-full border-4 border-brand-orange/20 border-t-transparent animate-pulse" />
        </div>
        <p className="text-gray-500 animate-pulse font-medium">
          Loading KYC Documents...
        </p>
      </div>
    );
  }

  const kycData = kycResponse || {};
  const hasDocuments = !!(
    kycData.frontUpload ||
    kycData.backUpload ||
    kycData.utilityBill
  );

  return (
    <div>
      <Modal ref={modalRef} title={selectedImage?.title}>
        {selectedImage && (
          <div className="flex flex-col items-center">
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="max-w-full h-auto rounded-lg shadow-sm"
            />
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => window.open(selectedImage.url, "_blank")}
            >
              <Eye className="w-4 h-4 mr-2" /> Open in New Tab
            </Button>
          </div>
        )}
      </Modal>

      <div className="max-w-3xl space-y-8">
        {isError && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">
              {extract_message(error as AxiosError<ApiResponse>)}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>ID Type</Label>
            <Input
              value={kycData.idType || "N/A"}
              readOnly
              className="bg-gray-50 border-gray-200"
            />
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input
              value={kycData.address || "N/A"}
              readOnly
              className="bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Front ID */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" /> ID Front View
            </Label>
            <div className="relative group overflow-hidden rounded-xl border-2 border-dashed border-gray-200 aspect-video bg-gray-50 flex items-center justify-center transition-all hover:border-brand-orange/50">
              {kycData.frontUpload ? (
                <>
                  <img
                    src={kycData.frontUpload}
                    alt="ID Front"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        handleViewImage(kycData.frontUpload, "ID Front View")
                      }
                    >
                      <Eye className="w-4 h-4 mr-2" /> Preview
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-gray-400 text-sm">No image uploaded</p>
              )}
            </div>
          </div>

          {/* Back ID */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" /> ID Back View
            </Label>
            <div className="relative group overflow-hidden rounded-xl border-2 border-dashed border-gray-200 aspect-video bg-gray-50 flex items-center justify-center transition-all hover:border-brand-orange/50">
              {kycData.backUpload ? (
                <>
                  <img
                    src={kycData.backUpload}
                    alt="ID Back"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        handleViewImage(kycData.backUpload, "ID Back View")
                      }
                    >
                      <Eye className="w-4 h-4 mr-2" /> Preview
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-gray-400 text-sm">No image uploaded</p>
              )}
            </div>
          </div>
        </div>

        {/* Utility Bill */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" /> Utility Bill (Proof
            of Address)
          </Label>
          <div className="relative group overflow-hidden rounded-xl border-2 border-dashed border-gray-200 h-48 bg-gray-50 flex items-center justify-center transition-all hover:border-brand-orange/50">
            {kycData.utilityBill ? (
              <>
                <img
                  src={kycData.utilityBill}
                  alt="Utility Bill"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      handleViewImage(kycData.utilityBill, "Utility Bill")
                    }
                  >
                    <Eye className="w-4 h-4 mr-2" /> Preview Document
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-gray-400 text-sm">No document uploaded</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="px-8"
            onClick={() =>
              navigate({
                to: "/dashboard/investors/$investorId",
                params: { investorId: id },
              })
            }
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex gap-4 ml-auto">
            <Button
              variant="ghost"
              size="lg"
              className="text-red-600 hover:bg-red-50"
              disabled={verifyMutation.isPending || !hasDocuments}
              onClick={() => verifyMutation.mutate("REJECTED")}
            >
              Reject
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="px-12"
              disabled={verifyMutation.isPending || !hasDocuments}
              onClick={() => verifyMutation.mutate("APPROVED")}
            >
              {verifyMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Approve KYC
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
