import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient, { type ApiResponse } from "@/api/simpleApi"; // Assuming simpleApi.ts exports apiClient
import { set_temp_user_value } from "@/store/authStore";
import type { AxiosError } from "axios";
import { extract_message } from "@/helpers/apihelpers";

export const Route = createFileRoute("/signup")({
  component: SignUpPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      type: (search.type as "individual" | "investor") || "individual",
    };
  },
});

type UserType = "individual" | "investor";

function SignUpPage() {
  const navigate = useNavigate();
  const { type } = Route.useSearch();
  const [userType, setUserType] = useState<UserType>(type || "individual");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form state - investor fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    hearAboutUs: "",
  });

  // Corporate form state
  const [corporateData, setCorporateData] = useState({
    companyName: "",
    corporateEmail: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    hearAboutUs: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCorporateInputChange = (field: string, value: string) => {
    setCorporateData((prev) => ({ ...prev, [field]: value }));
  };

  const signupMutation = useMutation({
    mutationFn: (data: any) => {
      return apiClient.post("/auth/register?accountType=INDIVIDUAL", data);
    },
    onSuccess: (data) => {
      console.log("Signup successful:", data);
      // toast.success("Signup successful! Please verify your email.", {
      //   duration: 2000,
      // });
      // Set temp user email and navigate to verification page
      if (userType === "investor") {
        set_temp_user_value(formData.email);
      } else {
        set_temp_user_value(corporateData.corporateEmail);
      }
      navigate({
        to: "/verify",
        search: {
          email:
            userType === "investor"
              ? formData.email
              : corporateData.corporateEmail,
        },
      });
    },
    onError: (error: AxiosError<ApiResponse>) => {
      if (error.status == 409) {
        toast.error("Email already exists", { duration: 1500 });
        return navigate({
          to: "/login",
        });
        // toast.error("check email for otp", { duration: 1500 });
        // return navigate({
        //   to: `/verify?email=${formData.email}`,
        // });
      }
      console.error("Signup error:", error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userType === "investor") {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match!", { duration: 1500 });
        return;
      }

      const investorPayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phoneNumber,
        password: formData.password,
        referral_source: formData.hearAboutUs,
        // accountType: "INDIVIDUAL",
        // user_type: "investor", // Assuming this field is needed by the backend
      };
      toast.promise(signupMutation.mutateAsync(investorPayload), {
        loading: "signing up",
        success: "success",
        error: extract_message,
      });
    } else {
      // Validate passwords match for corporate
      if (corporateData.password !== corporateData.confirmPassword) {
        toast.error("Passwords do not match!", { duration: 1500 });
        return;
      }

      const corporatePayload = {
        companyName: corporateData.companyName,
        email: corporateData.corporateEmail,
        phone: corporateData.phoneNumber,
        password: corporateData.password,
        referral_source: corporateData.hearAboutUs,
        user_type: "partner", // Assuming this field is needed by the backend
      };
      signupMutation.mutate(corporatePayload);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/assets/Rectangle 21299(1).png"
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
            {/* Mobile Logo */}
            <div className="lg:hidden flex flex-col items-center mb-4">
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
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Sign Up
              </h1>
              <p className="text-sm sm:text-base text-gray-300">
                Fill in your details
              </p>
            </div>

            {/* User Type Toggle */}
            <div className="flex gap-2 p-1 bg-white/10 rounded-xl">
              <button
                type="button"
                onClick={() => setUserType("investor")}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all cursor-pointer ${
                  userType === "investor"
                    ? "bg-[var(--color-orange)] text-white shadow-lg"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Individual
              </button>
              <button
                type="button"
                onClick={() => setUserType("partner")}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all cursor-pointer ${
                  userType === "partner"
                    ? "bg-[var(--color-orange)] text-white shadow-lg"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Corporate
              </button>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {userType === "investor" ? (
                <>
                  {/* Investor Form Fields */}
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-white">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Chika"
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
                        placeholder="Chuke"
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
                      placeholder="Chikachu@gmail.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-white">
                      Phone Number
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="Enter Phone Number"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20"
                    />
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
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
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
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
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

                  {/* Where did you hear about us */}
                  <div className="space-y-2">
                    <Label htmlFor="hearAboutUs" className="text-white">
                      Where did you hear about us ?
                    </Label>
                    <select
                      id="hearAboutUs"
                      value={formData.hearAboutUs}
                      onChange={(e) =>
                        handleInputChange("hearAboutUs", e.target.value)
                      }
                      className="flex w-full rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm px-4 py-3 text-base text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] focus:bg-white/20 transition-all duration-300"
                    >
                      <option value="" className="bg-gray-800"></option>
                      <option value="social-media" className="bg-gray-800">
                        Social Media
                      </option>
                      <option value="friend" className="bg-gray-800">
                        Friend
                      </option>
                      <option value="advertisement" className="bg-gray-800">
                        Advertisement
                      </option>
                      <option value="other" className="bg-gray-800">
                        Other
                      </option>
                    </select>
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
                      By creating an account, you agree to Needhomes Privacy
                      Policy, Terms and Conditions
                    </label>
                  </div>
                </>
              ) : (
                <>
                  {/* Corporate Form Fields */}
                  {/* Company Name */}
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-white">
                      Company Name
                    </Label>
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="Greenmouse"
                      value={corporateData.companyName}
                      onChange={(e) =>
                        handleCorporateInputChange(
                          "companyName",
                          e.target.value,
                        )
                      }
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20"
                    />
                  </div>

                  {/* Corporate Email */}
                  <div className="space-y-2">
                    <Label htmlFor="corporateEmail" className="text-white">
                      Corporate Email
                    </Label>
                    <Input
                      id="corporateEmail"
                      type="email"
                      placeholder="Greenmouse@gmail.com"
                      value={corporateData.corporateEmail}
                      onChange={(e) =>
                        handleCorporateInputChange(
                          "corporateEmail",
                          e.target.value,
                        )
                      }
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label htmlFor="corporatePhone" className="text-white">
                      Phone Number
                    </Label>
                    <Input
                      id="corporatePhone"
                      type="tel"
                      placeholder="Enter Phone Number"
                      value={corporateData.phoneNumber}
                      onChange={(e) =>
                        handleCorporateInputChange(
                          "phoneNumber",
                          e.target.value,
                        )
                      }
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="corporatePassword" className="text-white">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="corporatePassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={corporateData.password}
                        onChange={(e) =>
                          handleCorporateInputChange("password", e.target.value)
                        }
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="corporateConfirmPassword"
                      className="text-white"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="corporateConfirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={corporateData.confirmPassword}
                        onChange={(e) =>
                          handleCorporateInputChange(
                            "confirmPassword",
                            e.target.value,
                          )
                        }
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
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

                  {/* Where did you hear about us */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="corporateHearAboutUs"
                      className="text-white"
                    >
                      Where did you hear about us ?
                    </Label>
                    <select
                      id="corporateHearAboutUs"
                      value={corporateData.hearAboutUs}
                      onChange={(e) =>
                        handleCorporateInputChange(
                          "hearAboutUs",
                          e.target.value,
                        )
                      }
                      className="flex w-full rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm px-4 py-3 text-base text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] focus:bg-white/20 transition-all duration-300"
                    >
                      <option value="" className="bg-gray-800"></option>
                      <option value="social-media" className="bg-gray-800">
                        Social Media
                      </option>
                      <option value="friend" className="bg-gray-800">
                        Friend
                      </option>
                      <option value="advertisement" className="bg-gray-800">
                        Advertisement
                      </option>
                      <option value="other" className="bg-gray-800">
                        Other
                      </option>
                    </select>
                  </div>

                  {/* Terms checkbox */}
                  <div className="flex items-start space-x-3 pt-2">
                    <input
                      type="checkbox"
                      id="corporateTerms"
                      required
                      className="mt-1 h-4 w-4 rounded border-white/20 bg-white/10 text-[var(--color-orange)] focus:ring-[var(--color-orange)]"
                    />
                    <label
                      htmlFor="corporateTerms"
                      className="text-sm text-gray-300 leading-tight"
                    >
                      By creating an account, you agree to Needhomes Privacy
                      Policy, Terms and Conditions
                    </label>
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-full bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white text-base sm:text-lg py-2.5 mt-4 sm:mt-6"
                disabled={signupMutation.isPending}
              >
                {signupMutation.isPending ? "Signing Up..." : "Done"}
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
