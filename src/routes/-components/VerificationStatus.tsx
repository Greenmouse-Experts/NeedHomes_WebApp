import { useEffect } from "react";
import { useKyc } from "@/store/authStore";
import { toast } from "sonner";
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { Link } from "@tanstack/react-router";

export default function VerificationStatus() {
  const [kyc] = useKyc();

  if (!kyc) return null;

  const isVerified = kyc.account_verification_status === "VERIFIED";

  return (
    <div>
      {isVerified ? (
        <>
          {/*<div className="badge badge-success gap-1.5 py-3 px-3 ring-1 ring-success/30 badge-soft font-medium">
            <CheckCircleIcon className="w-3.5 h-3.5" />
            Verified
          </div>*/}
        </>
      ) : (
        <div className="space-y-3">
          <div className="p-3 ring-1 ring-error/20 rounded-box bg-error/5 flex flex-col gap-1">
            <section className="flex items-center w-full ">
              <div className="badge badge-error gap-1.5 py-3 px-3 ring-1 ring-error/30 badge-soft font-medium">
                <XCircleIcon className="w-3.5 h-3.5" />
                Not Verified
              </div>
              <Link
                to="settings"
                className="btn btn-sm ml-auto btn-primary btn-soft ring"
              >
                Complete KYC
              </Link>
            </section>
            <div className="text-sm text-error/80 font-medium px-1">
              Please complete your KYC verification
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
