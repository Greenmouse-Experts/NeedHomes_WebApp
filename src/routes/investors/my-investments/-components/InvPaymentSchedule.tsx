import apiClient from "@/api/simpleApi";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import { useQuery } from "@tanstack/react-query";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import { type Actions } from "@/components/tables/pop-up";
import { useState } from "react";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";

// 1. Define the interface for an installment
export interface Installment {
  id: string;
  investmentId: string;
  amount: number;
  dueDate: string;
  paidDate: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

const columns: columnType<Installment>[] = [
  {
    key: "dueDate",
    label: "Due Date",
    render: (value) => new Date(value).toLocaleDateString(),
  },
  {
    key: "amount",
    label: "Amount",
    render: (value) => value.toLocaleString(),
  },
  {
    key: "status",
    label: "Status",
    render: (value, item) => (
      <span
        className={
          "badge " +
          (item.status === "PENDING"
            ? "badge-warning badge-soft ring fade"
            : item.status === "PAID"
              ? "badge-success badge-soft ring fade"
              : "badge-soft ring fade")
        }
      >
        {item.status}
      </span>
    ),
  },
  {
    key: "paidDate",
    label: "Paid Date",
    render: (value) => (value ? new Date(value).toLocaleDateString() : "-"),
  },
];

const getActions = (refetch: () => void): Actions<Installment>[] => [
  {
    key: "pay",
    label: "Pay Now",
    action: async (item) => {
      // Only allow paying if status is PENDING
      if (item.status !== "PENDING") return;
      toast.promise(
        async () => {
          let resp = await apiClient.post(
            `investments/installments/${item.id}/pay`,
          );
          return resp.data;
        },
        {
          loading: "Paying...",
          success: "Payment successful!",
          error: extract_message,
        },
      );
      refetch();
    },
    // render: (item) =>
    //   item.status === "PENDING" ? (
    //     <span className="text-success">Pay Now</span>
    //   ) : (
    //     <span className="text-base-content/40">Pay Now</span>
    //   ),
    disabled: (item) => item.status !== "PENDING",
  },
];

export default function InvPaymentSchedule({ id }: { id: string }) {
  const query = useQuery({
    queryKey: ["inv-schedule" + id],
    queryFn: async () => {
      let resp = await apiClient.get(`investments/${id}/installments`);
      return resp.data;
    },
  });

  return (
    <ThemeProvider className="my-4 ring fade rounded-box ">
      <h2 className="p-4 text-lg font-bold fade border-b text-current/70">
        Installment Schedule
      </h2>
      <QueryCompLayout query={query}>
        {(data) => (
          <CustomTable
            data={data.data as Installment[]}
            columns={columns}
            actions={getActions(query.refetch)}
          />
        )}
      </QueryCompLayout>
    </ThemeProvider>
  );
}
