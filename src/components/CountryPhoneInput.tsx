import React, { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import PhoneInputWithCountry, { type Value } from "react-phone-number-input";
import "react-phone-number-input/style.css";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-xl border-2 border-gray-200 bg-white/90 backdrop-blur-sm px-4 py-3 text-base",
          "placeholder:text-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange focus:bg-white",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
          "transition-all duration-300 shadow-sm hover:shadow-md",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export interface PhoneInputProps extends Omit<
  InputProps,
  "onChange" | "value"
> {
  value?: string;
  onPhoneChange?: (fullNumber: string) => void;
  defaultCountry?: any;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    { className, value, onPhoneChange, defaultCountry = "US", ...props },
    ref,
  ) => {
    return (
      <div className="phone-input-container">
        <PhoneInputWithCountry
          {...props}
          international
          defaultCountry={defaultCountry}
          value={value as Value}
          onChange={(val) => onPhoneChange?.(val || "")}
          inputComponent={Input}
          className={cn(
            "[&_.PhoneInputCountry]:flex [&_.PhoneInputCountry]:items-center [&_.PhoneInputCountry]:justify-center [&_.PhoneInputCountry]:min-w-27.5 [&_.PhoneInputCountry]:rounded-xl [&_.PhoneInputCountry]:border-2 [&_.PhoneInputCountry]:border-gray-200 [&_.PhoneInputCountry]:bg-white/90 [&_.PhoneInputCountry]:px-3 [&_.PhoneInputCountry]:mr-2 [&_.PhoneInputCountry]:transition-all [&_.PhoneInputCountry]:duration-300 [&_.PhoneInputCountry]:hover:shadow-md",
            "[&_.PhoneInputCountrySelect]:cursor-pointer",
            className,
          )}
        />
      </div>
    );
  },
);

PhoneInput.displayName = "PhoneInput";
