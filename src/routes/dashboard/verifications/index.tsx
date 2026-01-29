import apiClient, { type ApiResponse } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import Modal from "@/components/modals/DialogModal";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import type { Actions } from "@/components/tables/pop-up";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { useModal } from "@/store/modals";
import type { VERIFICATION_REQUEST } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/verifications/")({
  component: RouteComponent,
});

const KYCViewer = ({ data }: { data: VERIFICATION_REQUEST | null }) => {
  if (!data) return null;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500">Full Name</p>
          <p className="font-medium">{`${data.user.firstName} ${data.user.lastName}`}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Email</p>
          <p className="font-medium break-all">{data.user.email}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">ID Type</p>
          <p className="font-medium">{data.idType}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Submitted At</p>
          <p className="font-medium">
            {new Date(data.submitedAt).toLocaleString()}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-xs text-gray-500 mb-2">ID Document Preview</p>
        <div className="w-full h-48 sm:h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 p-4 text-center">
          <span className="text-gray-400 italic text-sm">
            Document Image Placeholder (Dummy)
          </span>
        </div>
      </div>
      <div>
        <p className="text-xs text-gray-500">Residential Address</p>
        <p className="font-medium">{data.address || "N/A"}</p>
      </div>
    </div>
  );
};

function RouteComponent() {
  const queryClient = useQueryClient();
  const { ref: modalRef, showModal } = useModal();
  const [selectedKyc, setSelectedKyc] = useState<VERIFICATION_REQUEST | null>(
    null,
  );

  const query = useQuery<ApiResponse<VERIFICATION_REQUEST[]>>({
    queryKey: ["verifications-admin"],
    queryFn: async () => {
      let resp = await apiClient.get("admin/verifications");
      return resp.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      const resp = await apiClient.post(`admin/verifications/${id}/accept`);
      return resp.data;
    },
    onSuccess: () => {
      toast.success("Verification approved successfully");
      queryClient.invalidateQueries({ queryKey: ["verifications-admin"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to approve verification",
      );
    },
  });

  const columns: columnType<VERIFICATION_REQUEST>[] = [
    {
      key: "user",
      label: "User",
      render: (_, item) => (
        <div className="flex flex-col">
          <span className="font-medium">{`${item.user.firstName} ${item.user.lastName}`}</span>
          <span className="text-xs opacity-60">{item.user.email}</span>
        </div>
      ),
    },
    {
      key: "verificationType",
      label: "Type",
      render: (val) => (
        <span className="badge badge-ghost badge-sm">{val}</span>
      ),
    },
    {
      key: "idType",
      label: "ID Type",
    },
    {
      key: "address",
      label: "Address",
    },
    {
      key: "submitedAt",
      label: "Submitted At",
      render: (val) => new Date(val).toLocaleDateString(),
    },
  ];

  const actions: Actions[] = [
    {
      key: "view",
      label: "Quick View",
      action: (item) => {
        setSelectedKyc(item);
        showModal();
      },
    },
    {
      key: "details",
      label: "Full Details",
      action: (item, nav) => {
        nav({
          to: "/dashboard/verifications/$id" as any,
          params: { id: item.id } as any,
        });
      },
    },
    {
      key: "approve",
      label: "Approve KYC",
      action: (item) => {
        approveMutation.mutate(item.id);
      },
    },
  ];

  return (
    <ThemeProvider>
      <>
        <section className="p-6 bg-base-100 rounded-xl ring fade">
          <div className="mb-6 ">
            <h1 className="text-xl font-bold">Verification Requests</h1>
            <p className="text-base-content/60">
              Manage and review user identity verification submissions.
            </p>
          </div>
          <PageLoader query={query}>
            {(resp) => {
              return (
                <div className="">
                  <CustomTable
                    data={resp.data}
                    columns={columns}
                    actions={actions}
                  />
                </div>
              );
            }}
          </PageLoader>
        </section>

        <Modal
          ref={modalRef}
          title="KYC Verification Details"
          actions={
            <div className="flex gap-2">
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (selectedKyc) approveMutation.mutate(selectedKyc.id);
                }}
              >
                Approve Now
              </button>
            </div>
          }
        >
          <KYCViewer data={selectedKyc} />
        </Modal>
      </>
    </ThemeProvider>
  );
}
