import apiClient, { type ApiResponse } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import Modal from "@/components/modals/DialogModal";
import CustomTable from "@/components/tables/CustomTable";
import { extract_message } from "@/helpers/apihelpers";
import LocalSelect from "@/simpleComps/inputs/LocalSelect";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import SimpleTextArea from "@/simpleComps/inputs/SimpleTextArea";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { useModal } from "@/store/modals";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/subscriptions/")({
  component: RouteComponent,
});

interface SUBSCRIPTIONS {
  id: string;
  name: string;
  type: "FREE" | "BASIC" | "PREMIUM";
  description: string;
  price: number;
  validity: number;
  canViewPremiumProperty: boolean;
  maxInvestments: number;
  isActive: boolean;
}

function RouteComponent() {
  const [selectedPlan, setSelectedPlan] = useState<SUBSCRIPTIONS | null>(null);
  const query = useQuery<ApiResponse<SUBSCRIPTIONS[]>>({
    queryKey: ["admin-subs"],
    queryFn: async () => {
      let resp = await apiClient.get("admin/subscriptions");
      return resp.data;
    },
  });
  const modal = useModal();
  const editModal = useModal();
  const viewModal = useModal();

  const createMutation = useMutation({
    mutationFn: async (newPlan: Omit<SUBSCRIPTIONS, "id">) => {
      const resp = await apiClient.post("admin/subscriptions", newPlan);
      return resp.data;
    },
    onSuccess: () => {
      query.refetch();
      modal.closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const resp = await apiClient.delete("admin/subscriptions/" + id);
      return resp.data;
    },
    onSuccess: () => {
      query.refetch();
      modal.closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedPlan: SUBSCRIPTIONS) => {
      delete updatedPlan.createdAt;
      delete updatedPlan.updatedAt;
      delete updatedPlan.deletedAt;
      const without_id = { ...updatedPlan };
      delete without_id.id;
      const resp = await apiClient.patch(
        `admin/subscriptions/${updatedPlan.id}`,
        without_id,
      );
      return resp.data;
    },
    onSuccess: () => {
      query.refetch();
      editModal.closeModal();
    },
  });

  const actions = [
    {
      key: "view",
      label: "View",
      action: (item: SUBSCRIPTIONS) => {
        setSelectedPlan(item);
        viewModal.showModal();
      },
    },
    {
      key: "edit",
      label: "Edit",
      action: (item: SUBSCRIPTIONS) => {
        setSelectedPlan(item);
        editModal.showModal();
      },
    },
    {
      key: "delete",
      label: "Delete",
      action: (item: SUBSCRIPTIONS) => {
        toast.promise(deleteMutation.mutateAsync(item.id), {
          loading: "deleting",
          success: "deleted",
          error: extract_message,
        });
      },
    },
  ];

  const columns = [
    { key: "name", label: "Name" },
    { key: "type", label: "Type" },
    { key: "price", label: "Price" },
    { key: "validity", label: "Validity (Months)" },
    { key: "maxInvestments", label: "Max Investments" },
  ];

  return (
    <ThemeProvider className="p-6 bg-white shadow rounded-xl space-y-6">
      <Modal title="Add New Subscription Plan" ref={modal.ref}>
        <PlanForm
          onSubmit={(values) => {
            toast.promise(createMutation.mutateAsync(values), {
              loading: "Creating plan...",
              success: () => "Plan created successfully!",
              error: (error: any) => `Failed to create plan: ${error.message}`,
            });
          }}
          isLoading={createMutation.isPending}
          closeModal={modal.closeModal}
        />
      </Modal>

      <Modal title="Edit Subscription Plan" ref={editModal.ref}>
        {selectedPlan && (
          <PlanForm
            defaultValues={selectedPlan}
            closeModal={editModal.closeModal}
            onSubmit={(values) => {
              toast.promise(
                updateMutation.mutateAsync({
                  ...selectedPlan,
                  ...values,
                } as SUBSCRIPTIONS),
                {
                  loading: "Updating plan...",
                  success: () => "Plan updated successfully!",
                  error: (error: any) =>
                    `Failed to update plan: ${error.message}`,
                },
              );
            }}
            isLoading={updateMutation.isPending}
          />
        )}
      </Modal>

      <Modal title="Plan Details" ref={viewModal.ref}>
        {selectedPlan && (
          <ViewPlanForm plan={selectedPlan} closeModal={viewModal.closeModal} />
        )}
      </Modal>

      <div className="flex items-center">
        <h2 className="font-bold text-xl">Subscription Plans</h2>
        <button
          className="btn btn-primary ml-auto"
          onClick={() => {
            modal.showModal();
          }}
        >
          Add Plan
        </button>
      </div>
      <PageLoader query={query}>
        {(data) => (
          <div className="">
            <CustomTable
              data={data.data || []}
              columns={columns}
              actions={actions}
            />
          </div>
        )}
      </PageLoader>
    </ThemeProvider>
  );
}

const ViewPlanForm = ({
  plan,
  closeModal,
}: {
  plan: SUBSCRIPTIONS;
  closeModal: () => void;
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col card  pb-4 ring fade">
        <section className="card-body">
          {" "}
          <div className="badge  mb-2">
            {plan.type === "PREMIUM"
              ? "Premium"
              : plan.type === "BASIC"
                ? "Basic"
                : "Free"}
          </div>
          <h3 className="text-2xl font-bold">{plan.name}</h3>
          <div className="text-3xl font-black text-primary mt-2">
            ${plan.price}
            <span className="text-sm font-normal text-base-content/60 ml-1">
              / {plan.validity} Months
            </span>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-base-200/50 p-4 rounded-xl">
          <span className="text-xs font-bold uppercase opacity-50 block mb-1">
            Description
          </span>
          <p className="text-sm leading-relaxed">{plan.description}</p>
        </div>

        <div className="stats stats-vertical lg:stats-horizontal shadow-sm border border-base-200">
          <div className="stat">
            <div className="stat-title text-xs uppercase font-bold">
              Investments
            </div>
            <div className="stat-value text-2xl">{plan.maxInvestments}</div>
            <div className="stat-desc">Maximum allowed</div>
          </div>

          <div className="stat">
            <div className="stat-title text-xs uppercase font-bold">
              Premium Access
            </div>
            <div className="stat-value text-2xl">
              {plan.canViewPremiumProperty ? "Yes" : "No"}
            </div>
            <div className="stat-desc">
              {plan.canViewPremiumProperty ? "Full access" : "Limited access"}
            </div>
          </div>
        </div>
      </div>

      <div className="modal-action">
        <button className="btn btn-block" onClick={closeModal}>
          Close Details
        </button>
      </div>
    </div>
  );
};

const PlanForm = ({
  onSubmit,
  isLoading,
  defaultValues,
  closeModal,
}: {
  onSubmit: (values: Omit<SUBSCRIPTIONS, "id">) => void;
  isLoading: boolean;
  defaultValues?: Partial<SUBSCRIPTIONS>;
  closeModal: () => void;
}) => {
  const { register, handleSubmit, watch } = useForm<Omit<SUBSCRIPTIONS, "id">>({
    defaultValues: defaultValues || {
      type: "FREE",
      canViewPremiumProperty: false,
      isActive: true,
      price: 0,
    },
  });

  const planType = watch("type");

  const submitHandler = (data: Omit<SUBSCRIPTIONS, "id">) => {
    const finalData = {
      ...data,
      price: planType === "FREE" ? 0 : data.price,
    };
    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <SimpleInput
            label="Plan Name"
            placeholder="e.g. Pro Investor"
            {...register("name", { required: "Name is required" })}
          />
        </div>

        <LocalSelect
          {...register("type", { required: "Type is required" })}
          label="Plan Type"
        >
          <option value="FREE">Free</option>
          <option value="BASIC">Basic</option>
          <option value="PREMIUM">Premium</option>
        </LocalSelect>

        <SimpleInput
          label="Plan Validity (Months)"
          type="number"
          placeholder="12"
          {...register("validity", {
            required: "Validity is required",
            valueAsNumber: true,
          })}
        />

        <div className="md:col-span-2">
          <SimpleTextArea
            label="Description"
            placeholder="Enter plan details and benefits..."
            rows={3}
            {...register("description", {
              required: "Description is required",
            })}
          />
        </div>

        {planType !== "FREE" && (
          <SimpleInput
            label="Price ($)"
            type="number"
            placeholder="0.00"
            {...register("price", {
              required: "Price is required",
              valueAsNumber: true,
            })}
          />
        )}

        <SimpleInput
          label="Max Investments Allowed"
          type="number"
          placeholder="5"
          {...register("maxInvestments", {
            required: "Max investments is required",
            valueAsNumber: true,
          })}
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
        <label className="text-xs font-bold uppercase text-gray-500 block mb-3">
          Permissions & Benefits
        </label>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="canViewPremium"
            className="checkbox checkbox-primary"
            {...register("canViewPremiumProperty")}
          />
          <label
            htmlFor="canViewPremium"
            className="text-sm font-medium cursor-pointer"
          >
            Allow access to premium properties and investments
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button className="btn btn-ghost" type="button" onClick={closeModal}>
          Cancel
        </button>
        <button
          className="btn btn-primary px-8"
          type="submit"
          disabled={isLoading}
        >
          {isLoading
            ? "Saving..."
            : defaultValues
              ? "Update Plan"
              : "Create Plan"}
        </button>
      </div>
    </form>
  );
};
