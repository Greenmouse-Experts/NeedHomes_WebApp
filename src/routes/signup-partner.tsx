import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "@/api/simpleApi";

export const Route = createFileRoute("/signup-partner")({
  component: SignUpPartnerPage,
});

function SignUpPartnerPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Partner form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    partnerType: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const signupMutation = useMutation({
    mutationFn: async (payload: any) => {
      const response = await apiClient.post("partners/register", payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Account created successfully!");
      navigate({
        to: "/verify-partner",
        search: { email: formData.email },
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Signup failed. Please try again.",
      );
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const { confirmPassword, ...payload } = formData;
    signupMutation.mutate(payload);
  };

  return (
    <div className="min-h-screen lg:h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/assets/Rectangle 21299(2).png"
            alt="Start Your Investment Journey Today"
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
              Start Your Investment Journey Today
            </h2>
            <p className="text-lg text-gray-300 max-w-md">
              Create your account to access exclusive property investment
              opportunities and grow your portfolio.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 bg-[#3A3A4A] overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="w-full max-w-md space-y-4 sm:space-y-6 py-6 sm:py-8">
            {/* Form Header */}
            <div className="text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Sign Up
              </h1>
              <p className="text-sm sm:text-base text-gray-300">
                Fill in your details
              </p>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Chidiebere"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Chidiebere-Igwe"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tyler.igwe@gmail.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0920120922"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20"
                />
              </div>

              {/* Partners Type */}
              <div className="space-y-2">
                <Label htmlFor="partnerType" className="text-white">
                  Partners Type
                </Label>
                <select
                  id="partnerType"
                  value={formData.partnerType}
                  onChange={(e) =>
                    handleInputChange("partnerType", e.target.value)
                  }
                  required
                  className="flex w-full rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm px-4 py-3 text-base text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] focus:bg-white/20 transition-all duration-300"
                >
                  <option value="" className="bg-gray-800">
                    Select
                  </option>
                  <option value="REAL_ESTATE_AGENT" className="bg-gray-800">
                    Real Estate Agent
                  </option>
                  <option value="PROPERTY_DEVELOPER" className="bg-gray-800">
                    Property Developer
                  </option>
                  <option value="BROKER" className="bg-gray-800">
                    Broker
                  </option>
                  <option value="OTHER" className="bg-gray-800">
                    Other
                  </option>
                </select>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
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
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms checkbox */}
              <div className="flex items-start space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-white/10 text-[var(--color-orange)] focus:ring-[var(--color-orange)]"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-300 leading-tight"
                >
                  By creating an account, you agree to Needhomes Privacy Policy,
                  Terms and Conditions
                </label>
              </div>

              <Button
                type="submit"
                disabled={signupMutation.isPending}
                className="w-full bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white text-base sm:text-lg py-2.5 mt-4 sm:mt-6"
              >
                {signupMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center pt-2">
              <p className="text-gray-300">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[var(--color-orange)] hover:text-[var(--color-orange-light)] font-semibold transition-colors"
                >
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
