import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { KeyRound, ArrowLeft, ShieldCheck } from "lucide-react";
import apiClient, { type ApiResponse } from "@/api/simpleApi";
import { extract_message } from "@/helpers/apihelpers";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import SimpleContainer from "@/simpleComps/SimpleContainer";

export const Route = createFileRoute("/withdrawal-pin/verify-answer")({
  component: RouteComponent,
});

interface PinStatus {
  isSetUp: boolean;
  securityQuestion?: string;
  isLocked?: boolean;
  lockedUntil?: string;
}

type Step = "verify" | "new-pin";

function RouteComponent() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("verify");
  const [resetToken, setResetToken] = useState<string | null>(null);

  const statusQuery = useQuery<ApiResponse<PinStatus>>({
    queryKey: ["withdrawal-pin-status"],
    queryFn: async () => {
      const res = await apiClient.get("/withdrawal-pin/status");
      return res.data;
    },
  });

  const verifyForm = useForm({ defaultValues: { securityAnswer: "" } });
  const pinForm = useForm({ defaultValues: { newPin: "", confirmPin: "" } });

  const verifyMutation = useMutation({
    mutationFn: async (data: { securityAnswer: string }) => {
      const res = await apiClient.post("/withdrawal-pin/verify-answer", data);
      return res.data;
    },
    onSuccess: (data) => {
      setResetToken(data.data.resetToken);
      setStep("new-pin");
      verifyForm.reset();
    },
  });

  const resetMutation = useMutation({
    mutationFn: async (data: { resetToken: string; newPin: string }) => {
      const res = await apiClient.post("/withdrawal-pin/reset", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Withdrawal PIN reset successfully.");
      navigate({ to: "/" });
    },
  });

  const status = statusQuery.data?.data;
  const securityQuestion = status?.securityQuestion;

  if (statusQuery.isLoading) {
    return (
      <SimpleContainer>
        <div className="flex-1 grid place-items-center">
          <span className="loading loading-spinner loading-lg" />
        </div>
      </SimpleContainer>
    );
  }

  if (!status?.isSetUp) {
    return (
      <SimpleContainer>
        <div className="flex-1 grid place-items-center">
          <div className="card w-full max-w-md bg-base-100 shadow-xl p-8 ring fade text-center space-y-4">
            <KeyRound className="w-12 h-12 text-gray-400 mx-auto" />
            <h2 className="text-xl font-semibold">No PIN Set Up</h2>
            <p className="text-sm text-gray-500">
              You haven't set up a withdrawal PIN yet.
            </p>
            <button
              className="btn btn-primary w-full"
              onClick={() => navigate({ to: "/" })}
            >
              Go Back
            </button>
          </div>
        </div>
      </SimpleContainer>
    );
  }

  if (step === "verify") {
    return (
      <SimpleContainer>
        <div className="flex-1 grid place-items-center">
          <div className="card w-full max-w-md bg-base-100 shadow-xl p-8 ring fade space-y-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="btn btn-ghost btn-sm btn-circle"
                onClick={() => navigate({ to: "/" })}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-xl font-semibold">Reset Withdrawal PIN</h2>
                <p className="text-sm text-gray-500">Step 1 of 2 — Verify identity</p>
              </div>
            </div>

            <p className="text-sm text-gray-600">
              Answer your security question to verify your identity before setting a new PIN.
            </p>

            {securityQuestion && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Your security question</p>
                <p className="text-sm font-medium text-gray-800">{securityQuestion}</p>
              </div>
            )}

            <form
              onSubmit={verifyForm.handleSubmit((data) => {
                toast.promise(verifyMutation.mutateAsync(data), {
                  loading: "Verifying...",
                  success: "Identity verified.",
                  error: extract_message,
                });
              })}
              className="space-y-4"
            >
              <Controller
                name="securityAnswer"
                control={verifyForm.control}
                rules={{ required: "Answer is required" }}
                render={({ field, fieldState }) => (
                  <div className="space-y-1">
                    <SimpleInput {...field} label="Your Answer" placeholder="Enter your answer" />
                    {fieldState.error && (
                      <p className="text-error text-xs">{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />

              <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <p className="text-xs text-amber-800">
                  Forgotten your security answer?{" "}
                  <span className="font-medium">
                    Contact customer support — we'll verify your identity and send a recovery link to your registered email.
                  </span>
                </p>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={verifyMutation.isPending}
              >
                {verifyMutation.isPending ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  "Continue"
                )}
              </button>
            </form>
          </div>
        </div>
      </SimpleContainer>
    );
  }

  return (
    <SimpleContainer>
      <div className="flex-1 grid place-items-center">
        <div className="card w-full max-w-md bg-base-100 shadow-xl p-8 ring fade space-y-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="btn btn-ghost btn-sm btn-circle"
              onClick={() => setStep("verify")}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-xl font-semibold">Set New PIN</h2>
              <p className="text-sm text-gray-500">Step 2 of 2 — New withdrawal PIN</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
            <p className="text-xs text-green-700">Identity verified. Enter your new PIN below.</p>
          </div>

          <form
            onSubmit={pinForm.handleSubmit((data) => {
              if (data.newPin !== data.confirmPin) {
                pinForm.setError("confirmPin", { message: "PINs do not match" });
                return;
              }
              toast.promise(
                resetMutation.mutateAsync({
                  resetToken: resetToken!,
                  newPin: data.newPin,
                }),
                {
                  loading: "Saving new PIN...",
                  success: "Withdrawal PIN reset successfully.",
                  error: extract_message,
                },
              );
            })}
            className="space-y-4"
          >
            <Controller
              name="newPin"
              control={pinForm.control}
              rules={{
                required: "PIN is required",
                pattern: { value: /^\d{4,6}$/, message: "PIN must be 4–6 digits" },
              }}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <SimpleInput
                    {...field}
                    label="New PIN"
                    type="password"
                    placeholder="••••"
                    maxLength={6}
                  />
                  {fieldState.error && (
                    <p className="text-error text-xs">{fieldState.error.message}</p>
                  )}
                </div>
              )}
            />
            <Controller
              name="confirmPin"
              control={pinForm.control}
              rules={{ required: "Please confirm your PIN" }}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <SimpleInput
                    {...field}
                    label="Confirm New PIN"
                    type="password"
                    placeholder="••••"
                    maxLength={6}
                  />
                  {fieldState.error && (
                    <p className="text-error text-xs">{fieldState.error.message}</p>
                  )}
                </div>
              )}
            />

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={resetMutation.isPending}
            >
              {resetMutation.isPending ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Save New PIN"
              )}
            </button>
          </form>
        </div>
      </div>
    </SimpleContainer>
  );
}
