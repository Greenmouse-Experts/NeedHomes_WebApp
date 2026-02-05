import apiClient, { type ApiResponse } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import Modal from "@/components/modals/DialogModal";
import CustomTable from "@/components/tables/CustomTable";
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

  const updateMutation = useMutation({
    mutationFn: async (updatedPlan: SUBSCRIPTIONS) => {
      const resp = await apiClient.patch(
        `admin/subscriptions/${updatedPlan.id}`,
        updatedPlan,
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
      <Modal title="Add Plan" ref={modal.ref}>
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

      <Modal title="Edit Plan" ref={editModal.ref}>
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

      <Modal title="View Plan" ref={viewModal.ref}>
        {selectedPlan && (
          <ViewPlanForm plan={selectedPlan} closeModal={viewModal.closeModal} />
        )}
      </Modal>

      <div className="flex items-center">
        <h2 className="font-bold">Subscription Plan</h2>
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
    <div className="space-y-4">
      <div>
        <span className="font-semibold">Name:</span> {plan.name}
      </div>
      <div>
        <span className="font-semibold">Type:</span> {plan.type}
      </div>
      <div>
        <span className="font-semibold">Description:</span> {plan.description}
      </div>
      <div>
        <span className="font-semibold">Price:</span> {plan.price}
      </div>
      <div>
        <span className="font-semibold">Validity:</span> {plan.validity}{" "}
        Month(s)
      </div>
      <div>
        <span className="font-semibold">Can View Premium:</span>{" "}
        {plan.canViewPremiumProperty ? "Yes" : "No"}
      </div>
      <div>
        <span className="font-semibold">Max Investments:</span>{" "}
        {plan.maxInvestments}
      </div>
      <div className="flex justify-end">
        <button className="btn btn-ghost" onClick={closeModal}>
          Close
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
  const { register, handleSubmit, watch, setValue } = useForm<
    Omit<SUBSCRIPTIONS, "id">
  >({
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
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <SimpleInput
        label="Plan Name"
        {...register("name", { required: "Name is required" })}
      />

      <LocalSelect
        {...register("type", { required: "Type is required" })}
        label="Plan Type"
      >
        <option value="FREE">Free</option>
        <option value="BASIC">Basic</option>
        <option value="PREMIUM">Premium</option>
      </LocalSelect>

      <SimpleTextArea
        label="Description"
        {...register("description", { required: "Description is required" })}
      />

      {planType !== "FREE" && (
        <SimpleInput
          label="Price"
          type="number"
          {...register("price", {
            required: "Price is required",
            valueAsNumber: true,
          })}
        />
      )}

      <SimpleInput
        label="Plan Validity (Months)"
        type="number"
        {...register("validity", {
          required: "Validity is required",
          valueAsNumber: true,
        })}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium">Benefits</label>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="canViewPremium"
            className="checkbox checkbox-primary checkbox-sm"
            {...register("canViewPremiumProperty")}
          />
          <label htmlFor="canViewPremium" className="text-sm">
            Can view/invest on premium properties
          </label>
        </div>
      </div>

      <SimpleInput
        label="Number of Investments Allowed"
        type="number"
        {...register("maxInvestments", {
          required: "Max investments is required",
          valueAsNumber: true,
        })}
      />

      <div className="flex justify-end gap-2">
        <button className="btn btn-ghost" type="button" onClick={closeModal}>
          Cancel
        </button>
        <button className="btn btn-primary" type="submit" disabled={isLoading}>
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
