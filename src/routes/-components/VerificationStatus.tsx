import { useEffect } from "react";
import { useKyc } from "@/store/authStore";
import { toast } from "sonner";
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

export default function VerificationStatus() {
  const [kyc] = useKyc();

  useEffect(() => {
    if (!kyc) {
      toast.info("Please reauthenticate to receive updates", {
        duration: Infinity,
      });
      return;
    }
    const isVerified = kyc.account_verification_status === "VERIFIED";
    if (!isVerified) {
      toast.error("Verification Required", {
        description: "Please complete your verification",
        duration: Infinity,
      });
    }
  }, [kyc]);

  if (!kyc)
    return (
      <div className="flex items-center gap-3 p-4 rounded-box ring bg-info/10 text-info border border-info/20">
        <InformationCircleIcon className="w-5 h-5 shrink-0" />
        <span className="text-sm font-medium">
          Please reauthenticate to receive updates
        </span>
      </div>
    );

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
            <div className="badge badge-error gap-1.5 py-3 px-3 ring-1 ring-error/30 badge-soft font-medium">
              <XCircleIcon className="w-3.5 h-3.5" />
              Not Verified
            </div>
            <div className="text-sm text-error/80 font-medium px-1">
              Please complete your verification
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
