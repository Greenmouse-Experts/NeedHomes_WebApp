import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Loader2,
  Eye,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  FileText,
  User,
  MapPin,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import apiClient from "@/api/simpleApi";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/api/simpleApi";
import Modal from "@/components/modals/DialogModal";
import { useState } from "react";
import { useModal } from "@/store/modals";
import type { ADMIN_KYC_RESPONSE } from "@/types";
import { cn } from "@/lib/utils";

export default function AdminKycForm({ id }: { id: string }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { ref: modalRef, showModal } = useModal();
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const { data: kycResponse, isLoading } = useQuery<
    ApiResponse<{
      verification: ADMIN_KYC_RESPONSE;
      kycStatus: string;
    }>
  >({
    queryKey: ["kyc-verification", id],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/verifications/${id}`);
      return response.data;
    },
  });
  const kycData = kycResponse?.data?.verification;

  const kycId = kycData?.id;
  const verifyMutation = useMutation({
    mutationFn: async (status: "APPROVED" | "REJECTED") => {
      const endpoint =
        status === "APPROVED"
          ? `/admin/verifications/${kycId}/accept`
          : `/admin/verifications/${kycId}/reject`;
      return apiClient.post(endpoint);
    },
    onSuccess: (_, status) => {
      toast.success(
        `KYC ${status === "APPROVED" ? "Approved" : "Rejected"} successfully`,
      );
      queryClient.invalidateQueries({ queryKey: ["kyc-verification", id] });
      navigate({
        to: "/dashboard/investors/$investorId",
        params: { investorId: id },
      });
    },
    onError: (error: AxiosError<ApiResponse>) => {
      toast.error(extract_message(error));
    },
  });

  const handleViewImage = (url: string, title: string) => {
    setSelectedImage({ url, title });
    showModal();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-96 items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-brand-orange" />
        <p className="text-gray-500 font-medium">
          Fetching verification data...
        </p>
      </div>
    );
  }

  // const isPending = kycData?.status === "PENDING";
  const isPending = true;
  const InfoCard = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value?: string;
  }) => (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
      <div className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm">
        <Icon className="w-4 h-4 text-gray-500" />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-900">
          {value || "Not Provided"}
        </p>
      </div>
    </div>
  );

  const DocPreview = ({
    url,
    label,
  }: {
    url?: string | null;
    label: string;
  }) => (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <FileText className="w-4 h-4 text-brand-orange" /> {label}
      </p>
      <div className="relative group overflow-hidden rounded-2xl border border-gray-200 aspect-4/3 bg-gray-100 flex items-center justify-center transition-all hover:ring-2 hover:ring-brand-orange/20">
        {url ? (
          <>
            <img src={url} alt={label} className="object-cover w-full h-full" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleViewImage(url, label)}
              >
                <Eye className="w-4 h-4 mr-2" /> View Document
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center p-4">
            <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-400">No document uploaded</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <Modal ref={modalRef} title={selectedImage?.title}>
        {selectedImage && (
          <div className="space-y-4">
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="w-full rounded-lg"
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open(selectedImage.url, "_blank")}
            >
              <Eye className="w-4 h-4 mr-2" /> Open Original
            </Button>
          </div>
        )}
      </Modal>

      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          onClick={() =>
            navigate({
              to: "/dashboard/investors/$investorId",
              params: { investorId: id },
            })
          }
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Profile
        </Button>
        <div
          className={cn(
            "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border",
            kycData?.status === "VERIFIED"
              ? "bg-green-50 text-green-700 border-green-200"
              : kycData?.status === "REJECTED"
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-amber-50 text-amber-700 border-amber-200",
          )}
        >
          {kycData?.status}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Submission Details
          </h3>
          <InfoCard icon={User} label="Identity Type" value={kycData?.idType} />
          <InfoCard
            icon={MapPin}
            label="Residential Address"
            value={kycData?.address}
          />
          <InfoCard
            icon={ShieldCheck}
            label="Verification Type"
            value={kycData?.verificationType}
          />
          {kycData?.RejectionReason && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100">
              <p className="text-xs font-bold text-red-400 uppercase mb-1">
                Rejection Reason
              </p>
              <p className="text-sm text-red-700">{kycData.RejectionReason}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              Uploaded Documents
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <DocPreview url={kycData?.frontPage} label="ID Front View" />
              <DocPreview url={kycData?.backPage} label="ID Back View" />
              <div className="sm:col-span-2">
                <DocPreview
                  url={kycData?.utilityBill}
                  label="Utility Bill / Proof of Address"
                />
              </div>
            </div>
          </div>

          {isPending && (
            <div className="flex items-center justify-end gap-4 p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              <div className="mr-auto">
                <p className="font-bold text-gray-900">
                  Review this submission
                </p>
                <p className="text-sm text-gray-500">
                  Ensure all details match the provided documents.
                </p>
              </div>
              <Button
                variant="ghost"
                className="text-red-600 hover:bg-red-100 hover:text-red-700 font-bold"
                disabled={verifyMutation.isPending}
                onClick={() => verifyMutation.mutate("REJECTED")}
              >
                <XCircle className="w-4 h-4 mr-2" /> Reject
              </Button>
              <Button
                className="bg-brand-orange hover:bg-brand-orange/90 text-white px-8 font-bold shadow-lg shadow-brand-orange/20"
                disabled={
                  verifyMutation.isPending ||
                  kycResponse?.data.kycStatus === "VERIFIED"
                }
                onClick={() => verifyMutation.mutate("APPROVED")}
              >
                {verifyMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" /> Approve
                    {/*Verification*/}
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
