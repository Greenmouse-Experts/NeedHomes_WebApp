import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import apiClient, { new_url, type ApiResponse } from "@/api/simpleApi";
import { type AUTHRECORD, set_user_value } from "@/store/authStore";
import { toast } from "sonner";
import type { USER } from "@/types";
import axios, { AxiosError } from "axios";
import { extract_message } from "@/helpers/apihelpers";

// Extend the USER interface to include access_token as it's part of the login response

interface LOGIN_RESPONSE {
  access_token: string;
  refresh_token: string;
  sessionId: string;
  user: USER;
}

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await axios.post<ApiResponse<LOGIN_RESPONSE>>(
        `${new_url}auth/login`,
        credentials,
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Combine user data with the access token
      const newUser = {
        ...data.data,
      } satisfies Partial<AUTHRECORD>;

      set_user_value(newUser as any);
      // set_user_value(data.data);
      toast.success("Login successful!", { duration: 1500 });
      navigate({ to: "/investors" });
    },
    onError: (error: AxiosError<ApiResponse>) => {
      if (error.status == 401) {
        return toast.error(extract_message(error));
      }
      if (error.status == 403) {
        toast.error(extract_message(error), { duration: 2000 });
        return navigate({
          to: "/verify",
          search: { email: email },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/assets/Rectangle 21299.png"
            alt="Property Investment"
            className="w-full h-full object-cover opacity-80"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-end p-12 text-white w-full">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight">
              Welcome Back to
              <br />
              Your Investment Journey
            </h2>
            <p className="text-lg text-gray-300 max-w-md">
              Access your dashboard to track your property investments, view
              analytics, and manage your portfolio seamlessly.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[#3A3A4A] min-h-screen lg:min-h-0">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-6">
            <Link to="/" className="inline-block">
              <img
                src="/need_homes_logo.png"
                alt="NeedHomes"
                className="h-12 sm:h-16 mb-2"
              />
            </Link>
          </div>

          {/* Form Header */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-white mb-2">Log In</h1>
            <p className="text-gray-300">
              Enter your email and password to sign in
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="text-right text-sm">
                <Link
                  to="/forgot-password"
                  search={{ email: "" }}
                  className="text-gray-300 hover:text-[var(--color-orange)] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="remember"
                checked={rememberMe}
                onCheckedChange={setRememberMe}
              />
              <Label
                htmlFor="remember"
                className="text-gray-300 cursor-pointer text-sm"
              >
                Remember me
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white text-lg py-6"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </Button>

            {/*<Button
              type="button"
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10"
              onClick={() => {
                const encodedEmail = encodeURIComponent(email);
                const encodedPass = encodeURIComponent(password);
                navigate({
                  to: `/verify`,
                  search: { email: encodedEmail, pass: encodedPass } as any,
                });
              }}
            >
              Verify Account
            </Button>*/}
          </form>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-300">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[var(--color-orange)] hover:text-[var(--color-orange-light)] font-semibold transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
