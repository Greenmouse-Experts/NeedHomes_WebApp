import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm, FormProvider } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import apiClient from "@/api/simpleApi";
import { toast } from "sonner";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import { Mail, Hash } from "lucide-react";

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

  const onSubmit = (data: VerifyFormData) => {
    mutate(data);
  };

  return (
    <div
      id="nh"
      className="flex min-h-screen items-center justify-center bg-base-100 p-4"
      data-theme="nh-light"
    >
      <div className="card w-full max-w-md bg-base-100 shadow-xl ring ring-current/20">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold">Verify Email</h2>
          <p className="text-sm text-gray-500">
            Please enter your email and the OTP sent to you.
          </p>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <SimpleInput
                label="Email Address"
                type="email"
                placeholder="emperorferdy@gmail.com"
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

              <div className="card-actions mt-6">
                <button
                  type="submit"
                  className={`btn btn-primary w-full ${isPending ? "loading" : ""}`}
                  disabled={isPending}
                >
                  {isPending ? "Verifying..." : "Verify Email"}
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
