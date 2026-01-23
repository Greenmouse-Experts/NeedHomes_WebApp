import apiClient, { type ApiResponse } from "@/api/simpleApi";
import Header from "@/components/Header";
import { extract_message } from "@/helpers/apihelpers";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import SimpleContainer from "@/simpleComps/SimpleContainer";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password/")({
  component: RouteComponent,
  validateSearch: (search: { email: string }): { email: string } => ({
    email: search.email,
  }),
});

function RouteComponent() {
  const { email } = Route.useSearch();

  const trimmed = email.trim();
  const query = useQuery<ApiResponse>({
    queryKey: ["recover", trimmed],
    queryFn: async () => {
      let resp = await apiClient.post("auth/password/forgot", {
        email: trimmed,
      });
      return resp.data;
    },
    enabled: !!trimmed,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const simple_mut = useMutation({ mutationFn: (fn: any) => fn() });
  const verify_otp = async (otp: string) => {
    let resp = await apiClient.post("auth/password/verify-otp", {
      otp,
      email: trimmed,
    });
    return resp.data;
  };
  const form = useForm({
    defaultValues: {
      email: "",
    },
  });
  const otp_form = useForm({
    defaultValues: {
      otp: "",
    },
  });
  const nav = useNavigate();
  if (!trimmed) {
    return (
      <SimpleContainer>
        <div className="flex-1  grid place-items-center">
          <div className="text-center ring p-6 shadow rounded-xl fade ">
            <h1 className="text-4xl font-bold mb-4">Forgot Password</h1>
            <p className="text-gray-600">
              Enter your email address to recover your password.
            </p>
            <form
              action=""
              data-theme="nh-light"
              className="space-y-2"
              onSubmit={form.handleSubmit((data) => {
                nav({
                  to: "/forgot-password",
                  search: {
                    email: data.email,
                  },
                });
              })}
            >
              <SimpleInput
                {...form.register("email")}
                label="Email"
                placeholder="enter email"
              />
              <button className="btn btn-block btn-primary">Submit</button>
            </form>
          </div>
        </div>
      </SimpleContainer>
    );
  }
  if (query.isLoading) {
    return (
      <SimpleContainer>
        <div className="flex-1 grid place-items-center">
          <div className="text-center ring p-6 shadow rounded-xl fade">
            <h1 className="text-4xl font-bold mb-4">Forgot Password</h1>
            <p className="text-gray-600">Sending recovery email...</p>
            <span className="loading loading-spinner loading-lg mt-4"></span>
          </div>
        </div>
      </SimpleContainer>
    );
  }
  if (query.isError) {
    return (
      <SimpleContainer>
        <div className="flex-1 grid place-items-center">
          <div className="text-center ring p-6 shadow rounded-xl fade">
            <h1 className="text-4xl font-bold mb-4">Error</h1>
            <p className="text-error">
              {extract_message(query.error) || "An unexpected error occurred."}
            </p>
            <button
              className="btn btn-primary mt-4"
              onClick={() => nav({ to: "/forgot-password" })}
            >
              Try Again
            </button>
          </div>
        </div>
      </SimpleContainer>
    );
  }
  const data = query.data;
  return (
    <SimpleContainer>
      <div className="flex-1  grid place-items-center" data-theme="nh-light">
        <div className="text-center ring p-6 rounded-box shadow fade max-w-xl">
          <h1 className="text-4xl font-bold mb-4">Forgot Password</h1>
          <div className="info">{data?.message}</div>
          <FormProvider {...otp_form}>
            <form
              action=""
              onSubmit={otp_form.handleSubmit((data) => {
                toast.promise(
                  //@ts-ignore
                  simple_mut.mutateAsync(() => verify_otp(data.otp)),
                  {
                    loading: "verifying...",
                    success: (data: ApiResponse<any>) => {
                      nav({
                        to: "/forgot-password/reset",
                        search: {
                          token: data.data.resetToken,
                          email: trimmed,
                        },
                      });
                      return "success";
                    },
                    error: extract_message,
                  },
                );
              })}
            >
              <SimpleInput
                label="OTP"
                placeholder="enter otp"
                {...otp_form.register("otp")}
              />
              <button className="btn btn-primary btn-block my-4">Verify</button>
            </form>
          </FormProvider>
        </div>
      </div>
    </SimpleContainer>
  );
}
