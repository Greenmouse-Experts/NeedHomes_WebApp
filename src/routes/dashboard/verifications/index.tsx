import apiClient, { type ApiResponse } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import Modal from "@/components/modals/DialogModal";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import type { Actions } from "@/components/tables/pop-up";
import { extract_message } from "@/helpers/apihelpers";
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
          <p className="text-xs text-gray-500">Verification Type</p>
          <p className="font-medium">{data.verificationType}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">ID Type</p>
          <p className="font-medium">{data.idType}</p>
        </div>
        {data.verificationType === "CORPORATE" && (
          <>
            <div>
              <p className="text-xs text-gray-500">Company Name</p>
              <p className="font-medium">{data.companyName || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">RC Number</p>
              <p className="font-medium">{data.rcNumber || "N/A"}</p>
            </div>
          </>
        )}
        <div>
          <p className="text-xs text-gray-500">Submitted At</p>
          <p className="font-medium">
            {new Date(data.submitedAt).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Status</p>
          <p className="font-medium">{data.status}</p>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {data.frontPage && (
          <div>
            <p className="text-xs text-gray-500 mb-2">ID Front Page</p>
            <img
              src={data.frontPage}
              alt="ID Front"
              className="w-full h-auto max-h-64 object-contain rounded-lg border"
            />
          </div>
        )}
        {data.backPage && (
          <div>
            <p className="text-xs text-gray-500 mb-2">ID Back Page</p>
            <img
              src={data.backPage}
              alt="ID Back"
              className="w-full h-auto max-h-64 object-contain rounded-lg border"
            />
          </div>
        )}
        {data.cacDocument && (
          <div>
            <p className="text-xs text-gray-500 mb-2">CAC Document</p>
            <a
              href={data.cacDocument}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-outline"
            >
              View CAC Document
            </a>
          </div>
        )}
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
    {
      key: "status",
      label: "Status",
      render: (val) => (
        <span
          className={`badge badge-sm ${
            val === "VERIFIED"
              ? "badge-success"
              : val === "PENDING"
                ? "badge-warning"
                : "badge-error"
          }`}
        >
          {val}
        </span>
      ),
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
        if (item.status !== "PENDING") {
          toast.error("Only pending verifications can be approved.");
          return;
        }
        toast.promise(approveMutation.mutateAsync(item.id), {
          loading: "Approving...",
          success: "KYC approved successfully.",
          error: (err) => extract_message(err as any) || "An error occurred.",
        });
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
                  if (selectedKyc && selectedKyc.status === "PENDING") {
                    approveMutation.mutate(selectedKyc.id);
                  } else {
                    toast.error("Only pending verifications can be approved.");
                  }
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
