import SimpleContainer from "@/simpleComps/SimpleContainer";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm, FormProvider } from "react-hook-form";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import { Eye } from "lucide-react";
import apiClient from "@/api/simpleApi";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";

interface SearchProps {
  token: string;
  email: string; // Although email is not used in the API call, keep it for consistency with the route definition if needed elsewhere.
}
export const Route = createFileRoute("/forgot-password/reset/")({
  component: RouteComponent,
  validateSearch: (search: SearchProps): SearchProps => {
    return {
      token: search.token,
      email: search.email,
    };
  },
});

function RouteComponent() {
  const { token, email } = Route.useSearch();
  const navigate = useNavigate();

  if (!token || !email) {
    return (
      <SimpleContainer>
        <div className="flex-1 grid place-items-center">
          <div className="text-error text-lg">
            Invalid or missing token and/or email. Both are required.
          </div>
          <button
            type="button"
            className="btn btn-block btn-primary"
            onClick={() => navigate({ to: "/forgot-password" })}
          >
            Go Back
          </button>
        </div>
      </SimpleContainer>
    );
  }

  const methods = useForm({
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const {
    handleSubmit,
    register,
    watch,
    setError,
    formState: { errors },
  } = methods;

  const newPassword = watch("newPassword");

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: {
      newPassword: string;
      confirmNewPassword: string;
      token: string;
    }) => {
      const response = await apiClient.post("auth/password/reset", {
        newPassword: data.newPassword,
        confirmPassword: data.confirmNewPassword,
        token: data.token,
      });
      return response.data;
    },
    onSuccess: () => {
      navigate({ to: "/login" });
    },
    onError: (error: any) => {},
  });

  const onSubmit = (data: {
    newPassword: string;
    confirmNewPassword: string;
  }) => {
    if (data.newPassword !== data.confirmNewPassword) {
      setError("confirmNewPassword", {
        type: "manual",
        message: "Passwords do not match.",
      });
      return;
    }
    toast.promise(
      resetPasswordMutation.mutateAsync({
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
        token: token,
      }),
      {
        loading: "Resetting password...",
        success: "Password reset successfully!",
        error: extract_message,
      },
    );
  };

  return (
    <SimpleContainer>
      <div className="flex-1 grid place-items-center">
        <div className="card w-full max-w-md bg-base-100 shadow-xl p-8 ring fade">
          <h2 className="card-title text-2xl mb-6 text-center">
            Reset Password
          </h2>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <SimpleInput
                label="New Password"
                type="password"
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                })}
                icon={<Eye size={16} />}
              />
              <SimpleInput
                label="Confirm New Password"
                type="password"
                {...register("confirmNewPassword", {
                  required: "Please confirm your new password",
                  validate: (value) =>
                    value === newPassword || "Passwords do not match",
                })}
                icon={<Eye size={16} />}
              />
              <button
                type="submit"
                className="btn btn-primary w-full mt-6"
                disabled={resetPasswordMutation.isPending}
              >
                {resetPasswordMutation.isPending
                  ? "Resetting..."
                  : "Reset Password"}
              </button>
            </form>
          </FormProvider>
        </div>
      </div>
    </SimpleContainer>
  );
}
