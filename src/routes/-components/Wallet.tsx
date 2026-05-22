import apiClient, { type ApiResponse } from "@/api/simpleApi";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/modals/DialogModal";
import { useAuth } from "@/store/authStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import WalletSkeleton from "./WalletSkeleton";
import { useModal } from "@/store/modals";
import PageLoader from "@/components/layout/PageLoader";
import { extract_message } from "@/helpers/apihelpers";
import PaystackPop from "@paystack/inline-js";
import { useNavigate } from "@tanstack/react-router";
import { NairaIcon } from "@/components/NairaIcon";
import PriceInput, { parsePriceInput } from "@/components/inputs/PriceInput";
import {
  InvestorInflowOutflow,
  PartnerInflowOutflow,
} from "@/routes/-components/UserInflowOutflow";
interface PinStatus {
  isSetUp: boolean;
  securityQuestion?: string;
  isLocked?: boolean;
  lockedUntil?: string;
}

interface WalletTransaction {
  id: string;
  walletId: string;
  amount: number;
  type: "DEPOSIT" | "WITHDRAWAL" | "PROMOTION";
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

const paystackInstance = new PaystackPop();

export default function UserWallet() {
  const nav = useNavigate();
  const [auth] = useAuth();
  const queryClient = useQueryClient();
  const userID = auth?.user?.id;
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [modalType, setModalType] = useState<"deposit" | "withdraw">("deposit");
  const [lockedCountdown, setLockedCountdown] = useState("");

  const { ref: modalRef, showModal, closeModal } = useModal();

  const pinStatusQuery = useQuery<ApiResponse<PinStatus>>({
    queryKey: ["withdrawal-pin-status"],
    queryFn: async () => {
      const res = await apiClient.get("/withdrawal-pin/status");
      return res.data;
    },
  });

  const pinStatus = pinStatusQuery.data?.data;

  useEffect(() => {
    if (!pinStatus?.lockedUntil) {
      setLockedCountdown("");
      return;
    }
    const tick = () => {
      const diff = new Date(pinStatus.lockedUntil!).getTime() - Date.now();
      if (diff <= 0) {
        setLockedCountdown("");
        return;
      }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setLockedCountdown(`${m}m ${s}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [pinStatus?.lockedUntil]);

  const query = useQuery<ApiResponse<WalletData>>({
    queryKey: ["wallet", userID],
    queryFn: async () => {
      let resp = await apiClient.get("/wallet");
      return resp.data;
    },
    retry: 1,
  });

  const depositMutation = useMutation({
    mutationFn: async (amount: number) => {
      const resp = await apiClient.post("/wallet/deposit/initialize", {
        amount: amount * 100,
      });
      return resp.data;
    },

    onSuccess: async (data) => {
      const { access_code } = data.data;
      closeModal();
      paystackInstance.resumeTransaction(access_code, {
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["wallet", userID] });
        },
      });
    },

    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Deposit failed");
    },
  });

  const withdrawalMutation = useMutation({
    mutationFn: async ({ amount, pin }: { amount: number; pin: string }) => {
      const resp = await apiClient.post("/withdrawals", {
        amount: amount * 100,
        pin,
      });
      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet", userID] });
      queryClient.invalidateQueries({ queryKey: ["withdrawal-pin-status"] });
      toast.success("Withdrawal successful");
      closeModal();
      setAmount("");
      setPin("");
      setPinError("");
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || "Withdrawal failed";
      setPinError(message);
      // Re-fetch pin status in case it just got locked
      pinStatusQuery.refetch();
    },
  });

  const handleOpenModal = (type: "deposit" | "withdraw") => {
    setModalType(type);
    setAmount("");
    setPin("");
    setPinError("");
    showModal();
  };

  const handleSubmit = () => {
    const numericAmount = parsePriceInput(amount);
    if (!amount || !numericAmount) {
      return toast.error("Please enter a valid amount");
    }

    if (modalType === "deposit") {
      toast.promise(depositMutation.mutateAsync(numericAmount), {
        loading: "Processing deposit...",
        success: "Deposit processed",
        error: extract_message,
      });
    } else {
      if (!pin) return toast.error("Please enter your withdrawal PIN");
      setPinError("");
      withdrawalMutation.mutate({ amount: numericAmount, pin });
    }
  };

  const error = query.error as AxiosError<ApiResponse>;
  const error_status = error?.status == 404;

  const isPending = depositMutation.isPending || withdrawalMutation.isPending;
  const isPartner = auth?.user.accountType == "PARTNER";
  const settingsPath = isPartner ? "/partners/settings" : "/investors/settings";
  return (
    <>
      <PageLoader customLoading={<WalletSkeleton />} query={query}>
        {(data) => {
          const walletData = data.data;

          const income =
            walletData.walletTransactions
              .filter(
                (t) =>
                  (t.type === "DEPOSIT" || t.type === "PROMOTION") &&
                  t.status === "SUCCESS",
              )
              .reduce((acc, curr) => acc + curr.amount, 0) / 100;

          const withdrawals =
            walletData.walletTransactions
              .filter((t) => t.type === "WITHDRAWAL" && t.status === "SUCCESS")
              .reduce((acc, curr) => acc + curr.amount, 0) / 100;
          return (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ">
                <div className="p-4 md:p-6 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900">
                    Wallet
                  </h3>
                  <button
                    onClick={() =>
                      nav({
                        to: isPartner
                          ? "/partners/transactions"
                          : "/investors/transactions",
                      })
                    }
                    className="btn btn-ghost btn-primary"
                  >
                    View All
                  </button>
                </div>

                {/* Balance */}
                <div className="p-4 md:p-6 bg-linear-to-br from-gray-700 to-gray-900 text-white">
                  <p className="text-xs text-gray-300 font-semibold mb-2 tracking-wide">
                    TOTAL BALANCE
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl md:text-3xl font-bold flex gap-2">
                      <NairaIcon className="w-8" />
                      {(walletData?.balance / 100)?.toLocaleString() || 0}
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
                  {isPartner ? (
                    <PartnerInflowOutflow />
                  ) : (
                    <InvestorInflowOutflow />
                  )}

                  <div className="space-y-2 md:space-y-3">
                    {auth?.user.accountType != "PARTNER" && (
                      <>
                        <Button
                          variant="outline"
                          className="w-full text-sm md:text-base"
                          onClick={() => handleOpenModal("deposit")}
                        >
                          Deposit
                        </Button>
                      </>
                    )}
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
                            className={`w-8 h-8 md:w-10 md:h-10 ${
                              transaction.type === "WITHDRAWAL"
                                ? "bg-red-100"
                                : transaction.type === "PROMOTION"
                                  ? "bg-purple-100"
                                  : "bg-green-100"
                            } rounded-full flex items-center justify-center shrink-0`}
                          >
                            <svg
                              className={`w-6 h-6 md:w-7 md:h-7 ${
                                transaction.type === "WITHDRAWAL"
                                  ? "text-red-600"
                                  : transaction.type === "PROMOTION"
                                    ? "text-purple-600"
                                    : "text-green-600"
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={
                                  transaction.type === "WITHDRAWAL"
                                    ? "M19 13l-4 4-4-4m4 4V7"
                                    : "M5 13l4 4L19 7"
                                }
                              />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs md:text-sm font-medium text-gray-900">
                              {transaction.type === "DEPOSIT"
                                ? "Deposit"
                                : transaction.type === "PROMOTION"
                                  ? "Promotion Reward"
                                  : "Withdrawal"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(
                                transaction.createdAt,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs flex md:text-sm font-semibold text-gray-900">
                              {transaction.type === "WITHDRAWAL" ? "-" : "+"}{" "}
                              <NairaIcon className="w-5" />{" "}
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

                  <Button
                    className="w-full"
                    onClick={() => {
                      if (!isPartner) {
                        return nav({
                          to: "/investors/transactions",
                        });
                      }
                      return nav({ to: "/partners/transactions" });
                    }}
                  >
                    View All
                  </Button>
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
                    {/* Hide confirm for withdraw when PIN not actionable */}
                    {modalType === "deposit" ||
                    (pinStatus?.isSetUp && !pinStatus?.isLocked) ? (
                      <Button
                        disabled={isPending}
                        className="flex-1 bg-(--color-orange) text-white"
                        onClick={handleSubmit}
                      >
                        {isPending ? "Processing..." : "Confirm"}
                      </Button>
                    ) : (
                      <Button
                        className="flex-1"
                        onClick={() => {
                          closeModal();
                          nav({ to: settingsPath });
                        }}
                      >
                        Go to Settings
                      </Button>
                    )}
                  </div>
                }
              >
                {modalType === "deposit" ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                      Enter the amount you wish to deposit into your wallet.
                    </p>
                    <PriceInput
                      value={amount}
                      onChange={setAmount}
                      placeholder="0.00"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pinStatusQuery.isLoading ? (
                      <div className="flex justify-center py-4">
                        <span className="loading loading-spinner loading-sm" />
                      </div>
                    ) : !pinStatus?.isSetUp ? (
                      /* PIN not set up */
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
                        <p className="text-sm font-medium text-amber-800">
                          Withdrawal PIN not set up
                        </p>
                        <p className="text-xs text-amber-700">
                          You need to set up a withdrawal PIN before making
                          withdrawals. Go to Settings → Wallet PIN to get
                          started.
                        </p>
                      </div>
                    ) : pinStatus?.isLocked ? (
                      /* PIN locked */
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-2">
                        <p className="text-sm font-medium text-red-800">
                          PIN Locked
                        </p>
                        <p className="text-xs text-red-700">
                          Too many failed attempts.{" "}
                          {lockedCountdown
                            ? `Unlocks in ${lockedCountdown}.`
                            : "Your PIN is locked."}{" "}
                          Go to Settings → Wallet PIN to reset using your
                          security question.
                        </p>
                      </div>
                    ) : (
                      /* PIN active — normal withdraw form */
                      <>
                        <p className="text-sm text-gray-500">
                          Enter the amount and your withdrawal PIN.
                        </p>
                        <PriceInput
                          value={amount}
                          onChange={setAmount}
                          placeholder="0.00"
                        />
                        <div className="space-y-1">
                          <label className="text-sm font-semibold">
                            Withdrawal PIN
                          </label>
                          <div className="input input-md input-bordered flex items-center w-full">
                            <input
                              type="password"
                              className="grow"
                              placeholder="••••"
                              maxLength={6}
                              value={pin}
                              onChange={(e) => {
                                setPin(e.target.value);
                                setPinError("");
                              }}
                            />
                          </div>
                        </div>
                        {pinError && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-xs text-red-700">{pinError}</p>
                          </div>
                        )}
                        <button
                          type="button"
                          className="text-xs text-gray-500 hover:text-gray-700 underline"
                          onClick={() => {
                            closeModal();
                            nav({ to: settingsPath });
                          }}
                        >
                          Forgot your PIN? Reset using your security question
                        </button>
                      </>
                    )}
                  </div>
                )}
              </Modal>
            </>
          );
        }}
      </PageLoader>
    </>
  );
}
