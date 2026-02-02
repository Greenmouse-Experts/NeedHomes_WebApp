import { useAuth, set_user_value } from "@/store/authStore";
import { Avatar, AvatarFallback } from "./ui/Avatar";
import { Button } from "./ui/Button";
import { Label } from "./ui/Label";
import { Input } from "./ui/Input";
import { PhoneInput } from "./CountryPhoneInput";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import apiClient from "@/api/simpleApi";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";
import ProfilePicture from "./ProfilePic";

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default function UserProfile() {
  const [userProfile] = useAuth();
  const user = userProfile?.user;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      const response = await apiClient.put("users/profile", data);
      return response.data;
    },
    onSuccess: (resp) => {
      if (userProfile) {
        set_user_value({
          ...userProfile,
          user: resp.data,
        });
      }
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    toast.promise(mutation.mutateAsync(data), {
      loading: "Updating profile...",
      success: "Profile updated successfully",
      error: extract_message,
    });
  };

  return (
    <div>
      <div className="mb-4 md:mb-6">
        <h3 className="text-xs md:text-sm font-semibold text-gray-500 uppercase mb-3 md:mb-4">
          PROFILE
        </h3>
      </div>
      <ProfilePicture />
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
        {/* Profile Picture */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm">
              First Name
            </Label>
            <Input
              id="firstName"
              {...register("firstName", { required: "First name is required" })}
              placeholder="First Name"
              className="text-sm md:text-base"
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm">
              Last Name
            </Label>
            <Input
              id="lastName"
              {...register("lastName", { required: "Last name is required" })}
              placeholder="Last Name"
              className="text-sm md:text-base"
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2 mt-4 md:mt-6">
          <Label htmlFor="email" className="text-sm">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            disabled
            {...register("email")}
            placeholder="testmail@gmail.com"
            className="text-sm md:text-base"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-sm">
              Phone Number
            </Label>
            <Controller
              control={control}
              name="phone"
              render={(states) => {
                return (
                  <>
                    <PhoneInput
                      // id="phoneNumber"
                      {...register("phone")}
                      defaultCountry="NG"
                      value={states.field.value}
                      className="text-sm md:text-base"
                      onPhoneChange={(e) => {
                        states.field.onChange(e);
                      }}
                    />
                  </>
                );
              }}
            ></Controller>
          </div>

          {/* Date of Birth */}
          {/*<div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="text-sm">
              Date of Birth
            </Label>
            <div className="relative">
              <Input
                id="dateOfBirth"
                type="date"
                {...register("dateOfBirth")}
                placeholder="20/01/2028"
                className="text-sm md:text-base"
              />
            </div>
          </div>*/}
        </div>

        {/* Save Button */}
        <div className="pt-4 md:pt-6">
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="bg-brand-orange hover:bg-brand-orange-dark text-white px-6 md:px-12 text-sm md:text-base w-full sm:w-auto"
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
