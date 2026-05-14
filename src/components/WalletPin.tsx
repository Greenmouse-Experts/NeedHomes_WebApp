import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient, { type ApiResponse } from "@/api/simpleApi";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";
import {
  Shield,
  Lock,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  KeyRound,
} from "lucide-react";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import LocalSelect from "@/simpleComps/inputs/LocalSelect";
import { Controller, useForm } from "react-hook-form";
import QueryCompLayout from "@/components/layout/QueryCompLayout";

type View = "status" | "setup" | "reset-verify" | "reset-pin";

interface PinStatus {
  isSetUp: boolean;
  securityQuestion?: string;
  isLocked?: boolean;
  lockedUntil?: string;
}

interface SecurityQuestion {
  id: string;
  question: string;
}

function useCountdown(lockedUntil?: string) {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    if (!lockedUntil) {
      setRemaining("");
      return;
    }
    const tick = () => {
      const diff = new Date(lockedUntil).getTime() - Date.now();
      if (diff <= 0) {
        setRemaining("");
        return;
      }
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setRemaining(`${mins}m ${secs}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lockedUntil]);

  return remaining;
}

export default function WalletPin() {
  const queryClient = useQueryClient();
  const [view, setView] = useState<View>("status");
  const [setupStep, setSetupStep] = useState(1);
  const [setupPin, setSetupPin] = useState("");
  const [resetToken, setResetToken] = useState<string | null>(null);

  const statusQuery = useQuery<ApiResponse<PinStatus>>({
    queryKey: ["withdrawal-pin-status"],
    queryFn: async () => {
      const res = await apiClient.get("/withdrawal-pin/status");
      return res.data;
    },
  });

  const questionsQuery = useQuery<SecurityQuestion[]>({
    queryKey: ["withdrawal-pin-questions"],
    queryFn: async () => {
      const res = await apiClient.get("/withdrawal-pin/questions");
      return res.data;
    },
    enabled: view === "setup",
  });

  const status = statusQuery.data?.data;
  const countdown = useCountdown(status?.lockedUntil);
  const questions = questionsQuery.data ?? [];

  const pinForm = useForm({ defaultValues: { pin: "" } });
  const setupForm = useForm({
    defaultValues: { securityQuestion: "", securityAnswer: "" },
  });
  const verifyForm = useForm({ defaultValues: { securityAnswer: "" } });
  const resetPinForm = useForm({
    defaultValues: { newPin: "", confirmPin: "" },
  });

  const setupMutation = useMutation({
    mutationFn: async (data: {
      pin: string;
      securityQuestion: string;
      securityAnswer: string;
    }) => {
      const res = await apiClient.post("/withdrawal-pin/setup", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawal-pin-status"] });
      setView("status");
      setSetupStep(1);
      setSetupPin("");
      pinForm.reset();
      setupForm.reset();
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (data: { securityAnswer: string }) => {
      const res = await apiClient.post("/withdrawal-pin/verify-answer", data);
      return res.data;
    },
    onSuccess: (data) => {
      setResetToken(data.data.resetToken);
      setView("reset-pin");
      verifyForm.reset();
    },
  });

  const resetMutation = useMutation({
    mutationFn: async (data: { resetToken: string; newPin: string }) => {
      const res = await apiClient.post("/withdrawal-pin/reset", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawal-pin-status"] });
      setView("status");
      setResetToken(null);
      resetPinForm.reset();
    },
  });

  if (statusQuery.isLoading) {
    return (
      <div className="flex justify-center p-8">
        <span className="loading loading-spinner loading-md" />
      </div>
    );
  }

  // ── STATUS ──────────────────────────────────────────────────────────────────
  if (view === "status") {
    if (!status?.isSetUp) {
      return (
        <div className="space-y-4 max-w-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <KeyRound className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Withdrawal PIN</h3>
              <p className="text-sm text-gray-500">
                Secure your withdrawals with a PIN
              </p>
            </div>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                PIN not set up
              </p>
              <p className="text-xs text-amber-700 mt-1">
                You need a withdrawal PIN before making withdrawals.
              </p>
            </div>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setView("setup")}
          >
            Set Up Withdrawal PIN
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4 max-w-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Shield className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Withdrawal PIN</h3>
            <p className="text-sm text-gray-500">
              Your withdrawals are protected with a PIN
            </p>
          </div>
        </div>

        {status.isLocked ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <Lock className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">PIN Locked</p>
              <p className="text-xs text-red-700 mt-1">
                Too many failed attempts.{" "}
                {countdown ? `Unlocks in ${countdown}.` : "Locked."} Reset your
                PIN using your security question.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-800">PIN Active</p>
              <p className="text-xs text-green-700 mt-1">
                Your withdrawal PIN is set up and active.
              </p>
            </div>
          </div>
        )}

        <button
          className="btn btn-outline btn-sm gap-2"
          onClick={() => setView("reset-verify")}
        >
          <RotateCcw className="w-4 h-4" />
          Reset PIN
        </button>
      </div>
    );
  }

  // ── SETUP — STEP 1 (PIN) ────────────────────────────────────────────────────
  if (view === "setup" && setupStep === 1) {
    return (
      <div className="space-y-4 max-w-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Create Withdrawal PIN</h3>
          <span className="text-xs text-gray-400">Step 1 of 2</span>
        </div>
        <p className="text-sm text-gray-500">
          Enter a 4–6 digit PIN to secure your withdrawals.
        </p>
        <form
          onSubmit={pinForm.handleSubmit((data) => {
            setSetupPin(data.pin);
            setSetupStep(2);
          })}
          className="space-y-4"
        >
          <Controller
            name="pin"
            control={pinForm.control}
            rules={{
              required: "PIN is required",
              pattern: {
                value: /^\d{4,6}$/,
                message: "PIN must be 4–6 digits",
              },
            }}
            render={({ field, fieldState }) => (
              <div className="space-y-1">
                <SimpleInput
                  {...field}
                  label="Withdrawal PIN"
                  type="password"
                  placeholder="••••"
                  maxLength={6}
                />
                {fieldState.error && (
                  <p className="text-error text-xs">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setView("status")}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Continue
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ── SETUP — STEP 2 (SECURITY QUESTION) ──────────────────────────────────────
  if (view === "setup" && setupStep === 2) {
    return (
      <div className="space-y-4 max-w-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Security Question</h3>
          <span className="text-xs text-gray-400">Step 2 of 2</span>
        </div>
        <p className="text-sm text-gray-500">
          Choose a question you can answer if you forget your PIN.
        </p>
        <form
          onSubmit={setupForm.handleSubmit((data) => {
            toast.promise(
              setupMutation.mutateAsync({
                pin: setupPin,
                securityQuestion: data.securityQuestion,
                securityAnswer: data.securityAnswer,
              }),
              {
                loading: "Saving PIN...",
                success: "Withdrawal PIN set up successfully.",
                error: extract_message,
              },
            );
          })}
          className="space-y-4"
        >
          <QueryCompLayout
            query={questionsQuery}
            loadingText="Loading questions..."
            customLoading={
              <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
                <span className="loading loading-spinner loading-xs" />
                Loading questions...
              </div>
            }
          >
            {(data) => (
              <div className="space-y-1">
                {/*<select>
                  <option value="">Select a question</option>
                  {data.map((q) => (
                    <option key={q.id} value={q.question}>
                      {q.question}
                    </option>
                  ))}
                </select>*/}
                <LocalSelect
                  {...setupForm.register("securityQuestion", {
                    required: "Please select a question",
                  })}
                  label="Security Question"
                >
                  <option value="">Select a question</option>
                  {data.data.map((q) => (
                    <option key={q.id} value={q.question}>
                      {q.question}
                    </option>
                  ))}
                </LocalSelect>
                {setupForm.formState.errors.securityQuestion && (
                  <p className="text-error text-xs">
                    {
                      setupForm.formState.errors.securityQuestion
                        .message as string
                    }
                  </p>
                )}
              </div>
            )}
          </QueryCompLayout>
          <Controller
            name="securityAnswer"
            control={setupForm.control}
            rules={{
              required: "Answer is required",
              minLength: { value: 2, message: "At least 2 characters" },
              maxLength: { value: 100, message: "Max 100 characters" },
            }}
            render={({ field, fieldState }) => (
              <div className="space-y-1">
                <SimpleInput
                  {...field}
                  label="Your Answer"
                  placeholder="Your answer"
                />
                {fieldState.error && (
                  <p className="text-error text-xs">
                    {fieldState.error.message}
                  </p>
                )}
                <p className="text-xs text-gray-400">
                  Remember this — you'll need it to reset your PIN.
                </p>
              </div>
            )}
          />
          {setupMutation.isError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-700">
                {extract_message(setupMutation.error as any) ||
                  "An error occurred."}
              </p>
            </div>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setSetupStep(1)}
            >
              Back
            </button>
            <button
              type="submit"
              className={`btn btn-primary btn-sm ${setupMutation.isPending ? "loading" : ""}`}
              disabled={setupMutation.isPending}
            >
              {setupMutation.isPending ? "Saving..." : "Save PIN"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ── RESET — VERIFY ANSWER ───────────────────────────────────────────────────
  if (view === "reset-verify") {
    return (
      <div className="space-y-4 max-w-sm">
        <h3 className="font-semibold text-gray-900">Reset Withdrawal PIN</h3>
        <p className="text-sm text-gray-500">
          Answer your security question to verify your identity.
        </p>
        {status?.securityQuestion && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Security Question</p>
            <p className="text-sm font-medium text-gray-800">
              {status.securityQuestion}
            </p>
          </div>
        )}
        <form
          onSubmit={verifyForm.handleSubmit((data) => {
            toast.promise(verifyMutation.mutateAsync(data), {
              loading: "Verifying...",
              success: "Identity verified. Set your new PIN.",
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
                <SimpleInput
                  {...field}
                  label="Your Answer"
                  placeholder="Your answer"
                />
                {fieldState.error && (
                  <p className="text-error text-xs">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
          {verifyMutation.isError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-700">
                {extract_message(verifyMutation.error as any) ||
                  "An error occurred."}
              </p>
            </div>
          )}
          <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg">
            <p className="text-xs text-gray-600">
              Forgotten your security answer?{" "}
              <span className="font-medium text-gray-800">
                Contact customer support — we'll verify your identity and send a
                recovery link to your registered email.
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setView("status")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn-primary btn-sm ${verifyMutation.isPending ? "loading" : ""}`}
              disabled={verifyMutation.isPending}
            >
              {verifyMutation.isPending ? "Verifying..." : "Continue"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ── RESET — NEW PIN ─────────────────────────────────────────────────────────
  if (view === "reset-pin") {
    return (
      <div className="space-y-4 max-w-sm">
        <h3 className="font-semibold text-gray-900">Set New PIN</h3>
        <p className="text-sm text-gray-500">
          Enter and confirm your new 4–6 digit withdrawal PIN.
        </p>
        <form
          onSubmit={resetPinForm.handleSubmit((data) => {
            if (data.newPin !== data.confirmPin) {
              resetPinForm.setError("confirmPin", {
                message: "PINs do not match",
              });
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
            control={resetPinForm.control}
            rules={{
              required: "PIN is required",
              pattern: {
                value: /^\d{4,6}$/,
                message: "PIN must be 4–6 digits",
              },
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
                  <p className="text-error text-xs">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
          <Controller
            name="confirmPin"
            control={resetPinForm.control}
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
                  <p className="text-error text-xs">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
          {resetMutation.isError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-700">
                {extract_message(resetMutation.error as any) ||
                  "An error occurred."}
              </p>
            </div>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setView("reset-verify")}
            >
              Back
            </button>
            <button
              type="submit"
              className={`btn btn-primary btn-sm ${resetMutation.isPending ? "loading" : ""}`}
              disabled={resetMutation.isPending}
            >
              {resetMutation.isPending ? "Saving..." : "Save New PIN"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return null;
}
