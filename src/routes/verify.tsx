import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm, FormProvider } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import apiClient from "@/api/simpleApi";
import { extract_message } from "@/helpers/apihelpers";
import { toast } from "sonner";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import { Mail, Hash, ChevronLeft, Pencil, X } from "lucide-react";

export const Route = createFileRoute("/verify")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): { email: string } => {
    return {
      email: (search.email as string) || "",
    };
  },
});

type VerifyFormData = {
  otp: string;
};

function RouteComponent() {
  const navigate = useNavigate();
  const { email } = Route.useSearch();
  const decodedEmail = decodeURIComponent(email);

  const [pendingEmail, setPendingEmail] = useState(decodedEmail);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState("");
  const [changeEmailError, setChangeEmailError] = useState("");

  const methods = useForm<VerifyFormData>({ defaultValues: { otp: "" } });
  const { register, handleSubmit, setValue } = methods;

  const { mutate: verifyMutate, isPending } = useMutation({
    mutationFn: async (payload: VerifyFormData) => {
      const response = await apiClient.post("auth/verify-email", {
        email: pendingEmail,
        otp: payload.otp,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Email verified successfully!");
      navigate({ to: "/login" });
    },
    onError: (error: any) => {
      toast.error(extract_message(error));
    },
  });

  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  const { mutate: resendOtpMutate, isPending: isResendingOtp } = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post("auth/resend-otp", {
        email: pendingEmail,
        purpose: "email_verification",
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("OTP resent! Check your email.");
      setResendCooldown(60);
    },
    onError: (error: any) => {
      toast.error(extract_message(error));
    },
  });

  const { mutate: changeEmailMutate, isPending: isChangingEmail } = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post("auth/change-pending-email", {
        currentEmail: pendingEmail,
        newEmail: newEmailInput.trim(),
      });
      return response.data;
    },
    onSuccess: () => {
      setPendingEmail(newEmailInput.trim());
      setValue("otp", "");
      setResendCooldown(60);
      setShowChangeEmail(false);
      setNewEmailInput("");
      setChangeEmailError("");
      toast.success(`Verification code sent to ${newEmailInput.trim()}`);
    },
    onError: (error: any) => {
      setChangeEmailError(extract_message(error));
    },
  });

  const handleChangeEmailSubmit = () => {
    setChangeEmailError("");
    if (!newEmailInput.trim()) {
      setChangeEmailError("Please enter a new email address.");
      return;
    }
    changeEmailMutate();
  };

  return (
    <div
      id="nh"
      className="flex min-h-screen items-center justify-center bg-base-100 p-4"
      data-theme="nh-light"
    >
      <div className="card w-full max-w-md bg-base-100 shadow-xl ring ring-current/20">
        <div className="card-body">
          <button
            type="button"
            onClick={() => navigate({ to: "/login" })}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors w-fit -ml-1 mb-1"
          >
            <ChevronLeft size={16} />
            Back
          </button>
          <h2 className="card-title text-2xl font-bold">Verify Email</h2>
          <p className="text-sm text-gray-500">
            Enter the code sent to{" "}
            <span className="font-medium text-gray-700">{pendingEmail}</span>
          </p>

          {/* Change email toggle */}
          {!showChangeEmail ? (
            <button
              type="button"
              className="flex items-center gap-1 text-xs text-primary hover:underline w-fit"
              onClick={() => {
                setShowChangeEmail(true);
                setChangeEmailError("");
                setNewEmailInput("");
              }}
            >
              <Pencil size={12} /> Change Email
            </button>
          ) : (
            <div className="bg-base-200 rounded-xl p-4 space-y-3 mt-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Update your email address</p>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs btn-circle"
                  onClick={() => {
                    setShowChangeEmail(false);
                    setChangeEmailError("");
                  }}
                  disabled={isChangingEmail}
                >
                  <X size={14} />
                </button>
              </div>
              <input
                type="email"
                className="input input-bordered w-full input-sm"
                placeholder="New email address"
                value={newEmailInput}
                onChange={(e) => {
                  setNewEmailInput(e.target.value);
                  setChangeEmailError("");
                }}
                disabled={isChangingEmail}
              />
              {changeEmailError && (
                <p className="text-xs text-error">{changeEmailError}</p>
              )}
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setShowChangeEmail(false);
                    setChangeEmailError("");
                  }}
                  disabled={isChangingEmail}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`btn btn-primary btn-sm ${isChangingEmail ? "loading" : ""}`}
                  onClick={handleChangeEmailSubmit}
                  disabled={isChangingEmail}
                >
                  {isChangingEmail ? "Updating…" : "Update & Resend"}
                </button>
              </div>
            </div>
          )}

          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit((data) => verifyMutate(data))}
              className="space-y-4 mt-2"
            >
              <SimpleInput
                label="OTP Code"
                type="text"
                placeholder="175387"
                icon={<Hash size={18} className="opacity-70" />}
                {...register("otp", {
                  required: "OTP is required",
                  minLength: { value: 6, message: "OTP must be 6 digits" },
                })}
              />

              <div className="card-actions mt-6 flex flex-col gap-2">
                <button
                  type="submit"
                  className={`btn btn-primary w-full ${isPending ? "loading" : ""}`}
                  disabled={isPending}
                >
                  {isPending ? "Verifying..." : "Verify Email"}
                </button>
                <button
                  type="button"
                  onClick={() => resendOtpMutate()}
                  className={`btn btn-ghost w-full ${isResendingOtp ? "loading" : ""}`}
                  disabled={isResendingOtp || resendCooldown > 0}
                >
                  {isResendingOtp
                    ? "Resending..."
                    : resendCooldown > 0
                      ? `Resend OTP (${resendCooldown}s)`
                      : "Resend OTP"}
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
