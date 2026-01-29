import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { new_url, type ApiResponse } from "@/api/simpleApi";
import { set_user_value, type AUTHRECORD } from "@/store/authStore";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";
import { useForm } from "react-hook-form";
import type { USER } from "@/types";

export const Route = createFileRoute("/admin")({
  component: AdminLoginPage,
});

interface LOGIN_RESPONSE {
  accessToken: string;
  refreshToken: string;
  sessionId: string;
  user: USER;
}

function AdminLoginPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const rememberMe = watch("rememberMe");
  const emailValue = watch("email");

  const loginMutation = useMutation({
    mutationFn: async (credentials: any) => {
      const response = await axios.post<ApiResponse<LOGIN_RESPONSE>>(
        `${new_url}admin/login`,
        {
          email: credentials.email,
          password: credentials.password,
        },
      );
      return response.data;
    },
    onSuccess: (data: ApiResponse<AUTHRECORD>) => {
      const newUser = {
        ...data.data,
      } satisfies Partial<AUTHRECORD>;

      set_user_value(newUser as any);

      toast.success("Login successful!", { duration: 1500 });
      return navigate({ to: "/dashboard" });
    },
    onError: (error: AxiosError<ApiResponse>) => {
      if (error.response?.status === 401) {
        return toast.error(extract_message(error));
      }
      if (error.response?.status === 403) {
        toast.error(extract_message(error), { duration: 2000 });
        return navigate({
          to: "/verify",
          search: { email: emailValue },
        });
      }
      console.error("Login failed:", error);
      toast.error(
        error.response?.data?.message ||
          "Login failed. Please check your credentials.",
        { duration: 2000 },
      );
    },
  });

  const onSubmit = (data: any) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-[calc(100dvh-96px)] bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-4 pt-24 relative overflow-hidden">
      {/* Creative Background Elements - Dark theme */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-(--color-orange)/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-(--color-orange)/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-(--color-orange)/5 rounded-full blur-3xl"></div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
          linear-gradient(to right, var(--color-orange) 1px, transparent 1px),
          linear-gradient(to bottom, var(--color-orange) 1px, transparent 1px)
        `,
          backgroundSize: "50px 50px",
        }}
      ></div>

      {/* Diagonal lines pattern */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 10px,
          var(--color-orange) 10px,
          var(--color-orange) 20px
        )`,
        }}
      ></div>

      {/* Floating shapes */}
      <div className="absolute top-32 right-32 w-32 h-32 border-2 border-(--color-orange)/30 rounded-lg rotate-45"></div>
      <div className="absolute bottom-32 left-32 w-24 h-24 border-2 border-(--color-orange)/30 rounded-full"></div>
      <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-(--color-orange)/20 rounded-lg rotate-12"></div>

      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-[0.08]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, var(--color-orange) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      {/* Admin Login Card */}
      <Card className="w-full max-w-md bg-gray-100 shadow-2xl border-0 relative z-10">
        <CardHeader className="space-y-4 pb-4">
          <div className="flex flex-col items-center">
            <img
              src="/logo.png"
              alt="NeedHomes Admin"
              className="h-20 mb-2 drop-shadow-md"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = "flex";
              }}
            />
          </div>

          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-brand-orange rounded flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Admin Login
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/*<div className="mb-4 p-3 bg-(--color-orange)/10 border border-(--color-orange)/30 rounded-lg">
            <p className="text-xs font-semibold text-brand-orange mb-1">
              Demo Credentials:
            </p>
            <p className="text-xs text-gray-700">Email: admin@needhomes.com</p>
            <p className="text-xs text-gray-700">Password: admin123</p>
          </div>*/}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@needhomes.com"
                {...register("email", { required: true })}
                className="border-gray-300 bg-white text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                {...register("password", { required: true })}
                className="border-gray-300 bg-white text-gray-900"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setValue("rememberMe", checked)}
              />
              <Label
                htmlFor="remember"
                className="text-gray-600 cursor-pointer"
              >
                Remember me
              </Label>
            </div>
            <Button
              type="submit"
              className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white cursor-pointer"
              disabled={isSubmitting || loginMutation.isPending}
            >
              {isSubmitting || loginMutation.isPending
                ? "Signing in..."
                : "Admin Sign in"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <a
              href="/login"
              className="text-sm text-gray-600 hover:text-brand-orange transition-colors"
            >
              Not an admin? Go to user login
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
