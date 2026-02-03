import { useForm } from "react-hook-form";
import { toast } from "sonner";
import apiClient from "@/api/simpleApi";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/Button";
import ThemeProvider from "@/simpleComps/ThemeProvider";

export default function ChangePassword() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPasswprd: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: any) => apiClient.post("auth/password/change", values),
    onSuccess: () => {
      toast.success("Password updated successfully");
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update password");
    },
  });

  const onSubmit = (values: any) => {
    if (values.newPassword !== values.confirmPasswprd) {
      return toast.error("Passwords do not match");
    }
    mutate(values);
  };

  return (
    <>
      <ThemeProvider>
        <div className="mb-4 md:mb-6">
          <h3 className="text-xs md:text-sm font-semibold text-gray-500 uppercase mb-3 md:mb-4">
            Change Password
          </h3>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-2xl space-y-4 md:space-y-6"
        >
          {/* Old Password */}
          <SimpleInput
            label="Old Password"
            type="password"
            placeholder="**********"
            {...register("oldPassword", {
              required: "Old password is required",
            })}
          />

          {/* New Password */}
          <SimpleInput
            label="New Password"
            type="password"
            placeholder="**********"
            {...register("newPassword", {
              required: "New password is required",
              minLength: { value: 6, message: "Minimum 6 characters" },
            })}
          />

          {/* Confirm Password */}
          <SimpleInput
            label="Confirm Password"
            type="password"
            placeholder="**********"
            {...register("confirmPasswprd", {
              required: "Please confirm your password",
              validate: (val: string) => {
                if (watch("newPassword") !== val) {
                  return "Your passwords do not match";
                }
              },
            })}
          />

          {/* Submit Button */}
          <div className="pt-2 md:pt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-brand-orange hover:bg-brand-orange-dark text-white px-6 md:px-12 text-sm md:text-base w-full sm:w-auto"
            >
              {isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </ThemeProvider>
    </>
  );
}
