import apiClient, { type ApiResponse } from "@/api/simpleApi";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/modals/DialogModal";
import { useAuth } from "@/store/authStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";
import WalletSkeleton from "./WalletSkeleton";
import { useModal } from "@/store/modals";
import PageLoader from "@/components/layout/PageLoader";
import { extract_message } from "@/helpers/apihelpers";
import { PaystackButton } from "react-paystack";
import PaystackPop from "@paystack/inline-js";

import { usePaystackPayment } from "react-paystack";
interface WalletTransaction {
  id: string;
  walletId: string;
  amount: number;
  type: "DEPOSIT" | "WITHDRAWAL";
  status: "PENDING" | "SUCCESS" | "FAILED";
  reference: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface WalletData {
  id: string;
  userId: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  walletTransactions: WalletTransaction[];
}

export default function UserWallet() {
  const paystackInstance = new PaystackPop();
  const onSuccess = (reference) => {
    toast.success("Payment successful");
    // Implementation for whatever you want to do with reference and after success call.
    console.log(reference);
  };

  // you can call this function anything
  const onClose = () => {
    console.log("closed");
  };
  const config = {
    reference: new Date().getTime().toString(),
    email: "user@example.com",
    amount: 20000, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
    publicKey: "pk_test_77297b93cbc01f078d572fed5e2d58f4f7b518d7",
  };
  const payStack_key = import.meta.env.VITE_PAYSTACK_KEY;
  const initializePayment = usePaystackPayment(config as any);
  const [auth] = useAuth();
  const queryClient = useQueryClient();
  const userID = auth?.user?.id;
  const [amount, setAmount] = useState("");
  const [modalType, setModalType] = useState<"deposit" | "withdraw">("deposit");

  const { ref: modalRef, showModal, closeModal } = useModal();

  const query = useQuery<ApiResponse<WalletData>>({
    queryKey: ["wallet", userID],
    queryFn: async () => {
      let resp = await apiClient.get("/wallet");
      return resp.data;
    },
    retry: 1,
  });

  // const depositMutation = useMutation({
  //   mutationFn: async (amount: number) => {
  //     const resp = await apiClient.post("/wallet/deposit/initialize", {
  //       amount: amount * 100,
  //     });
  //     return resp.data;
  //   },
  //   onSuccess: async (
  //     data: ApiResponse<{
  //       authorization_url?: string;
  //       access_code: string;
  //       reference: string;
  //     }>,
  //   ) => {
  //     if (data.data.authorization_url) {
  //       //@paystack checkout
  //       //
  //       closeModal();
  //       const ref = data.data.reference;

  //       const new_config = { ...config, reference: ref };
  //       queryClient.invalidateQueries({ queryKey: ["wallet", userID] });
  //       toast.success("Deposit initialized");
  //       setAmount("");
  //       window.open(data.data.authorization_url, "_blank", "noreferrer");
  //     }
  //   },
  //   onError: (err: any) => {
  //     toast.error(err?.response?.data?.message || "Deposit failed");
  //   },
  // });

  const depositMutation = useMutation({
    mutationFn: async (amount: number) => {
      const resp = await apiClient.post("/wallet/deposit/initialize", {
        amount: amount * 100,
      });
      return resp.data;
    },

    onSuccess: async (data) => {
      const { access_code, reference } = data.data;
      console.log("passing");
      const config = {
        reference,
        email: auth?.user?.email,
        publicKey: payStack_key,
        access_code,
      };
      closeModal();
      paystackInstance.resumeTransaction(access_code, {
        onSuccess(tranx) {
          query.refetch();
        },
      });
    },

    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Deposit failed");
    },
  });

  const withdrawalMutation = useMutation({
    mutationFn: async (amount: number) => {
      const resp = await apiClient.post("/withdrawals", {
        amount: amount * 100,
      });
      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet", userID] });
      toast.success("Withdrawal successful");
      closeModal();
      setAmount("");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Withdrawal failed");
    },
  });

  const handleOpenModal = (type: "deposit" | "withdraw") => {
    setModalType(type);
    showModal();
  };

  const handleSubmit = () => {
    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount)) {
      return toast.error("Please enter a valid amount");
    }

    const mutation =
      modalType === "deposit" ? depositMutation : withdrawalMutation;

    toast.promise(mutation.mutateAsync(numericAmount), {
      loading: "Processing transaction...",
      success: `${modalType.charAt(0).toUpperCase() + modalType.slice(1)} processed`,
      error: extract_message,
    });
  };

  const error = query.error as AxiosError<ApiResponse>;
  const error_status = error?.status == 404;

  const isPending = depositMutation.isPending || withdrawalMutation.isPending;
  const modal = useModal();

  return (
    <>
      <PageLoader customLoading={<WalletSkeleton />} query={query}>
        {(data) => {
          const walletData = data.data;

          const income =
            walletData.walletTransactions
              .filter((t) => t.type === "DEPOSIT" && t.status === "SUCCESS")
              .reduce((acc, curr) => acc + curr.amount, 0) / 100;

          const withdrawals =
            walletData.walletTransactions
              .filter((t) => t.type === "WITHDRAWAL" && t.status === "SUCCESS")
              .reduce((acc, curr) => acc + curr.amount, 0) / 100;

          return (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 md:p-6 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900">
                    Wallet
                  </h3>
                  <button className="text-xs md:text-sm text-gray-500 hover:text-gray-700 font-medium">
                    Monthly ▼
                  </button>
                </div>

                {/* Balance */}
                <div className="p-4 md:p-6 bg-linear-to-br from-gray-700 to-gray-900 text-white">
                  <p className="text-xs text-gray-300 font-semibold mb-2 tracking-wide">
                    TOTAL BALANCE
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl md:text-3xl font-bold">
                      N {(walletData?.balance / 100)?.toLocaleString() || 0}
                    </p>
                    <button
                      onClick={() => handleOpenModal("deposit")}
                      className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 md:w-5 md:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Income/Withdraw */}
                <div className="p-4 md:p-6">
                  <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4">
                    <div className="bg-green-50 rounded-lg p-2 md:p-3 border border-green-200">
                      <p className="text-xs text-gray-600 font-semibold mb-1">
                        INCOME
                      </p>
                      <p className="text-base md:text-lg font-bold text-gray-900">
                        N {error_status ? 0 : income.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-2 md:p-3 border border-red-200">
                      <p className="text-xs text-gray-600 font-semibold mb-1">
                        WITHDRAW
                      </p>
                      <p className="text-base md:text-lg font-bold text-gray-900">
                        N {withdrawals.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    <Button
                      variant="outline"
                      className="w-full text-sm md:text-base"
                      onClick={() => handleOpenModal("deposit")}
                    >
                      Deposit
                    </Button>
                    <Button
                      className="w-full bg-(--color-orange) hover:bg-(--color-orange-dark) text-white text-sm md:text-base"
                      onClick={() => handleOpenModal("withdraw")}
                    >
                      Withdraw
                    </Button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="p-4 md:p-6 border-t border-gray-200">
                  <h4 className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                    Recent
                  </h4>
                  {walletData?.walletTransactions?.length > 0 ? (
                    walletData.walletTransactions
                      .slice(0, 5)
                      .map((transaction: WalletTransaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-start gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg mb-2"
                        >
                          <div
                            className={`w-8 h-8 md:w-10 md:h-10 ${transaction.type === "DEPOSIT" ? "bg-green-100" : "bg-red-100"} rounded-full flex items-center justify-center shrink-0`}
                          >
                            <svg
                              className={`w-6 h-6 md:w-7 md:h-7 ${transaction.type === "DEPOSIT" ? "text-green-600" : "text-red-600"}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={
                                  transaction.type === "DEPOSIT"
                                    ? "M5 13l4 4L19 7"
                                    : "M19 13l-4 4-4-4m4 4V7"
                                }
                              />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs md:text-sm font-medium text-gray-900">
                              {transaction.type === "DEPOSIT"
                                ? "Deposit"
                                : "Withdrawal"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(
                                transaction.createdAt,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs md:text-sm font-semibold text-gray-900">
                              {transaction.type === "DEPOSIT" ? "+" : "-"} N{" "}
                              {(transaction.amount / 100).toLocaleString()}
                            </p>
                            <p
                              className={`text-xs ${transaction.status === "SUCCESS" ? "text-green-600" : transaction.status === "PENDING" ? "text-orange-600" : "text-red-600"} font-medium mt-1`}
                            >
                              {transaction.status.toLowerCase()}
                            </p>
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="text-xs text-gray-400 text-center py-4">
                      No recent activity
                    </p>
                  )}
                </div>
              </div>

              <Modal
                ref={modalRef}
                title={
                  modalType === "deposit" ? "Deposit Funds" : "Withdraw Funds"
                }
                actions={
                  <div className="flex gap-3 w-full">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={closeModal}
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={isPending}
                      className="flex-1 bg-(--color-orange) text-white"
                      onClick={handleSubmit}
                    >
                      Confirm
                    </Button>
                  </div>
                }
              >
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    Enter the amount you wish to {modalType} from your wallet.
                  </p>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                      N
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                </div>
              </Modal>
            </>
          );
        }}
      </PageLoader>
    </>
  );
}
