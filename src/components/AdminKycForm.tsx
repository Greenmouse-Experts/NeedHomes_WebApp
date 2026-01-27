import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Loader2,
  Eye,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import apiClient from "@/api/simpleApi";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/api/simpleApi";

export default function AdminKycForm({ id }: { id: string }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
      </div>
    );
  }

  const kycData = kycResponse || {};
  return (
    <div>
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
          {/* ID Type Display */}
          <div className="space-y-2">
            <Label>ID Type</Label>
            <Input
              value={kycData.idType || "N/A"}
              readOnly
              className="bg-gray-50"
            />
          </div>

          {/* Address Display */}
          <div className="space-y-2">
            <Label>Address</Label>
            <Input
              value={kycData.address || "N/A"}
              readOnly
              className="bg-gray-50"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Front ID */}
          <div className="space-y-2">
            <Label>ID Front View</Label>
            <div className="relative group overflow-hidden rounded-xl border-2 border-gray-100 aspect-video bg-gray-50 flex items-center justify-center">
              {kycData.frontUpload ? (
                <>
                  <img
                    src={kycData.frontUpload}
                    alt="ID Front"
                    className="object-cover w-full h-full"
                  />
                  <a
                    href={kycData.frontUpload}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2"
                  >
                    <Eye className="w-5 h-5" /> View Full Size
                  </a>
                </>
              ) : (
                <p className="text-gray-400 text-sm">No image uploaded</p>
              )}
            </div>
          </div>

          {/* Back ID */}
          <div className="space-y-2">
            <Label>ID Back View</Label>
            <div className="relative group overflow-hidden rounded-xl border-2 border-gray-100 aspect-video bg-gray-50 flex items-center justify-center">
              {kycData.backUpload ? (
                <>
                  <img
                    src={kycData.backUpload}
                    alt="ID Back"
                    className="object-cover w-full h-full"
                  />
                  <a
                    href={kycData.backUpload}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2"
                  >
                    <Eye className="w-5 h-5" /> View Full Size
                  </a>
                </>
              ) : (
                <p className="text-gray-400 text-sm">No image uploaded</p>
              )}
            </div>
          </div>
        </div>
        {/* Utility Bill */}
        <div className="space-y-2">
          <Label>Utility Bill (Proof of Address)</Label>
          <div className="relative group overflow-hidden rounded-xl border-2 border-gray-100 h-48 bg-gray-50 flex items-center justify-center">
            {kycData.utilityBill ? (
              <>
                <img
                  src={kycData.utilityBill}
                  alt="Utility Bill"
                  className="object-cover w-full h-full"
                />
                <a
                  href={kycData.utilityBill}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2"
                >
                  <Eye className="w-5 h-5" /> View Document
                </a>
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
              disabled={verifyMutation.isPending}
              onClick={() => verifyMutation.mutate("REJECTED")}
            >
              Reject
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="px-12"
              disabled={verifyMutation.isPending}
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
