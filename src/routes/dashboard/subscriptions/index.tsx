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
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/subscriptions/")({
  component: RouteComponent,
});

interface SUBSCRIPTIONS {
  id: string;
  name: string;
  type: string;
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
  const nav = useNavigate();

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
      action: (item: SUBSCRIPTIONS, nav: any) => {
        setSelectedPlan(item);
        viewModal.showModal();
      },
    },
    {
      key: "edit",
      label: "Edit",
      action: (item: SUBSCRIPTIONS, nav: any) => {
        setSelectedPlan(item);
        editModal.showModal();
      },
    },
  ];

  const columns = [
    { key: "name", label: "Name" },
    { key: "type", label: "Type" },
    { key: "description", label: "Description" },
    { key: "price", label: "Price" },
    { key: "validity", label: "Validity" },
  ];

  return (
    <ThemeProvider className="p-6 bg-white shadow rounded-xl space-y-6">
      <Modal title="Add Plan" ref={modal.ref}>
        <PlanForm
          onSubmit={(values) => {
            toast.promise(createMutation.mutateAsync(values), {
              loading: "Creating plan...",
              success: () => {
                return "Plan created successfully!";
              },
              error: (error: any) => {
                return `Failed to create plan: ${error.message}`;
              },
            });
          }}
          isLoading={createMutation.isPending}
        />
      </Modal>

      <Modal title="Edit Plan" ref={editModal.ref}>
        {selectedPlan && (
          <EditPlanForm
            plan={selectedPlan}
            closeModal={editModal.closeModal}
            onSubmit={(values) => {
              toast.promise(
                updateMutation.mutateAsync({ ...selectedPlan, ...values }),
                {
                  loading: "Updating plan...",
                  success: () => {
                    return "Plan updated successfully!";
                  },
                  error: (error: any) => {
                    return `Failed to update plan: ${error.message}`;
                  },
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
        {(data) => {
          return (
            <>
              <div className="">
                <CustomTable
                  data={data.data || []}
                  columns={columns}
                  actions={actions}
                />
              </div>
            </>
          );
        }}
      </PageLoader>
    </ThemeProvider>
  );
}

const EditPlanForm = ({
  plan,
  closeModal,
  onSubmit,
  isLoading,
}: {
  plan: SUBSCRIPTIONS;
  closeModal: () => void;
  onSubmit: (values: Partial<SUBSCRIPTIONS>) => void;
  isLoading: boolean;
}) => {
  const { register, handleSubmit } = useForm<Partial<SUBSCRIPTIONS>>({
    defaultValues: {
      name: plan.name,
      type: plan.type,
      description: plan.description,
      price: plan.price,
      validity: plan.validity,
      canViewPremiumProperty: plan.canViewPremiumProperty,
      maxInvestments: plan.maxInvestments,
      isActive: plan.isActive,
    },
  });

  const submitHandler = (data: Partial<SUBSCRIPTIONS>) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <SimpleInput label="Name" {...register("name")} />
      <SimpleInput label="Type" {...register("type")} />
      <SimpleTextArea label="Description" {...register("description")} />
      <SimpleInput label="Price" type="number" {...register("price")} />
      <SimpleInput label="Validity" type="number" {...register("validity")} />
      {/* Add other input fields as needed */}
      <div className="flex justify-end">
        <button className="btn btn-ghost" type="button" onClick={closeModal}>
          Cancel
        </button>
        <button className="btn btn-primary" type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update"}
        </button>
      </div>
    </form>
  );
};

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
        <span className="font-semibold">Validity:</span> {plan.validity}
      </div>
      {/* Display other plan details */}
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
}: {
  onSubmit: (values: Omit<SUBSCRIPTIONS, "id">) => void;
  isLoading: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<SUBSCRIPTIONS, "id">>();

  const submitHandler = (data: Omit<SUBSCRIPTIONS, "id">) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <SimpleInput
        label="Name"
        {...register("name", { required: "Name is required" })}
      />
      <LocalSelect
        {...register("type", { required: "Type is required" })}
        label="Type"
      >
        <option value={"BASIC"}>Basic</option>
      </LocalSelect>
      <SimpleTextArea
        label="Description"
        {...register("description", { required: "Description is required" })}
      />
      <SimpleInput
        label="Price"
        type="number"
        {...register("price", {
          required: "Price is required",
          valueAsNumber: true,
        })}
      />
      <SimpleInput
        label="Validity"
        type="number"
        {...register("validity", {
          required: "Validity is required",
          valueAsNumber: true,
        })}
      />

      <div className="flex justify-end">
        <button className="btn btn-ghost" type="button">
          Cancel
        </button>
        <button className="btn btn-primary" type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
};
