import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm, FormProvider } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import apiClient from "@/api/simpleApi";
import { toast } from "sonner";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import { Mail, Hash, ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/verify")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): { email: string } => {
    return {
      email: (search.email as string) || "",
    };
  },
});

type VerifyFormData = {
  email: string;
  otp: string;
};

function RouteComponent() {
  const navigate = useNavigate();
  const { email } = Route.useSearch();
  const decodedEmail = decodeURIComponent(email);

  const methods = useForm<VerifyFormData>({
    defaultValues: {
      email: decodedEmail,
    },
  });
  const { register, handleSubmit } = methods;

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: VerifyFormData) => {
      const response = await apiClient.post("auth/verify-email", payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Email verified successfully!");
      navigate({ to: "/login" });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Verification failed");
    },
  });

  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  const { mutate: resendOtpMutate, isPending: isResendingOtp } = useMutation({
    mutationFn: async (payload: { email: string }) => {
      const response = await apiClient.post("auth/resend-otp", payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("OTP resent successfully! Check your email.");
      setResendCooldown(50);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to resend OTP");
    },
  });

  const onSubmit = (data: VerifyFormData) => {
    mutate(data);
  };

  const handleResendOtp = () => {
    resendOtpMutate({ email: methods.getValues("email") });
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
            Please enter the OTP sent to you.
          </p>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <SimpleInput
                label="Email Address"
                type="email"
                disabled
                placeholder="example@gmail.com"
                icon={<Mail size={18} className="opacity-70" />}
                {...register("email", { required: "Email is required" })}
              />

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
                  onClick={handleResendOtp}
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
