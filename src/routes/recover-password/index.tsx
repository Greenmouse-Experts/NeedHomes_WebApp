import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import SimpleContainer from "@/simpleComps/SimpleContainer";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { useState } from "react";

export const Route = createFileRoute("/recover-password/")({
  component: RouteComponent,
});

const userTypes = [
  { type: "Investor", path: "/investor" },
  { type: "Partner", path: "/partner/recover" },
] as const;

function RouteComponent() {
  const form = useForm({
    defaultValues: {
      email: "",
      userType: "",
    },
  });
  const { handleSubmit, control, setValue } = form;

  const onSubmit = (data: {
    email: string;
    userType: (typeof userTypes)[number]["type"];
  }) => {
    if (data.userType == "Partner") {
      return nav({
        to: "/partner/recover/forgot-password",
        search: {
          email: data["email"] as string,
        },
        viewTransition: true,
      });
    }
    return nav({
      to: "/forgot-password",
      search: {
        email: data["email"] as string,
      },
      viewTransition: true,
    });

    // Handle form submission logic here
  };
  const nav = useNavigate();

  return (
    <SimpleContainer>
      <div className="grid place-items-center w-full">
        <FormProvider {...form}>
          <form
            onSubmit={handleSubmit(onSubmit as any)}
            className="p-6 ring fade shadow space-y-4 w-full max-w-lg rounded-box"
          >
            <h2>Recover Account</h2>
            <SimpleInput
              label="Email"
              placeholder="Enter your email"
              {...form.register("email")}
            />

            <div className="form-control w-full ">
              <label className="label">
                <span className="label-text">Select Account Type</span>
              </label>
              <Controller
                name="userType"
                control={control}
                rules={{ required: "Account type is required" }}
                render={({ field, fieldState: { error } }) => (
                  <div className="dropdown dropdown-bottom w-full">
                    <div
                      tabIndex={0}
                      role="button"
                      className="btn w-full justify-start"
                    >
                      {field.value ? field.value : "Select Type"}
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full"
                    >
                      {userTypes.map((typeOption) => (
                        <li key={typeOption.type}>
                          <button
                            type="button"
                            onClick={() => {
                              setValue("userType", typeOption.type, {
                                shouldValidate: true,
                              });
                            }}
                            className={
                              field.value === typeOption.type ? "active" : ""
                            }
                          >
                            {typeOption.type}
                          </button>
                        </li>
                      ))}
                    </ul>
                    {error && (
                      <p className="text-error text-sm mt-1">{error.message}</p>
                    )}
                  </div>
                )}
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Recover Password
            </button>
          </form>
        </FormProvider>
      </div>
    </SimpleContainer>
  );
}
