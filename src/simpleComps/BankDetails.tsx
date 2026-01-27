import { Label } from "@/components/ui/Label";
import { useForm } from "react-hook-form";
import SimpleInput from "./inputs/SimpleInput";
import LocalSelect from "./inputs/LocalSelect";
import { Button } from "@/components/ui/Button";
import ThemeProvider from "./ThemeProvider";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/simpleApi";

export default function BankDetails() {
  const form = useForm();
  const handleBankSubmit = () => {};
  const query = useQuery({
    queryKey: ["bank-list"],
    queryFn: async () => {
      let resp = await apiClient.get("");
      return resp.data;
    },
  });
  return (
    <div>
      <div className="mb-4 md:mb-6">
        <h3 className="text-xs md:text-sm font-semibold text-gray-500 uppercase mb-3 md:mb-4">
          Bank Details
        </h3>
      </div>

      <ThemeProvider>
        <form onSubmit={handleBankSubmit} className="max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Account Number */}
            <div className="space-y-2">
              <Label htmlFor="accountNumber" className="text-sm">
                Account Number
              </Label>
              <SimpleInput
                id="accountNumber"
                placeholder="Enter Acct Number"
                className="text-sm md:text-base"
              />
            </div>

            {/* Bank Name */}
            <div className="space-y-2">
              <Label htmlFor="bankName" className="text-sm">
                Bank Name
              </Label>
              <LocalSelect id="bankName">
                <option value="">Select</option>
                <option value="access">Access Bank</option>
                <option value="gtb">GTBank</option>
                <option value="first">First Bank</option>
                <option value="zenith">Zenith Bank</option>
                <option value="uba">UBA</option>
              </LocalSelect>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
            {/* Account Name */}
            {/*<div className="space-y-2">
              <Label htmlFor="accountName" className="text-sm">
                Account Name
              </Label>
              <SimpleInput
                id="accountName"
                // onChange={(e) => handleBankChange("accountName", e.target.value)}
                className="bg-red-50 text-sm md:text-base"
                disabled
              />
            </div>*/}

            {/* Account Type */}
            {/*<div className="space-y-2">
              <Label htmlFor="accountType" className="text-sm">
                Account Type
              </Label>
              <select
                id="accountType"
                value={bankData.accountType}
                onChange={(e) => handleBankChange("accountType", e.target.value)}
                className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="savings">Savings</option>
                <option value="current">Current</option>
              </select>
            </div>*/}
          </div>

          {/* Submit Button */}
          <div className="pt-4 md:pt-6">
            <Button
              type="submit"
              className="bg-brand-orange hover:bg-brand-orange-dark text-white px-6 md:px-12 text-sm md:text-base w-full sm:w-auto"
            >
              Submit
            </Button>
          </div>
        </form>
      </ThemeProvider>
    </div>
  );
}
