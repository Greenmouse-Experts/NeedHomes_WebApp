import Modal, { type ModalHandle } from "@/components/modals/DialogModal";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { forwardRef, useState } from "react";

export type AppStatus = "PENDING" | "REVIEWED" | "SHORTLISTED" | "REJECTED";

interface StatusConfig {
  label: string;
  description: string;
  badge: string;
  dot: string;
}

const STATUS_CONFIG: Record<AppStatus, StatusConfig> = {
  PENDING: {
    label: "Pending",
    description: "Application received, not yet reviewed",
    badge: "bg-yellow-100 text-yellow-700 border-yellow-300",
    dot: "bg-yellow-400",
  },
  REVIEWED: {
    label: "Reviewed",
    description: "Admin has viewed the application",
    badge: "bg-blue-100 text-blue-700 border-blue-300",
    dot: "bg-blue-400",
  },
  SHORTLISTED: {
    label: "Shortlisted",
    description: "Applicant moved to next stage",
    badge: "bg-green-100 text-green-700 border-green-300",
    dot: "bg-green-400",
  },
  REJECTED: {
    label: "Rejected",
    description: "Application has been rejected",
    badge: "bg-red-100 text-red-700 border-red-300",
    dot: "bg-red-400",
  },
};

// Pipeline flow: PENDING → REVIEWED → SHORTLISTED, REJECTED from any stage
const PIPELINE: AppStatus[] = ["PENDING", "REVIEWED", "SHORTLISTED"];

interface Props {
  applicantName?: string;
  currentStatus: AppStatus;
  isPending?: boolean;
  onConfirm: (status: AppStatus) => void;
}

export interface StatusModalHandle extends ModalHandle {}

const StatusUpdateModal = forwardRef<ModalHandle, Props>(
  ({ applicantName, currentStatus, isPending, onConfirm }, ref) => {
    const [selected, setSelected] = useState<AppStatus | null>(null);

    const handleOpen = () => setSelected(null);
    const handleConfirm = () => {
      if (selected) onConfirm(selected);
    };

    return (
      <Modal
        ref={ref}
        title="Update Application Status"
      >
        <div className="space-y-5" onFocus={handleOpen}>
          {applicantName && (
            <p className="text-sm text-gray-500">
              Applicant:{" "}
              <span className="font-semibold text-gray-800">
                {applicantName}
              </span>{" "}
              — Current:{" "}
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${STATUS_CONFIG[currentStatus].badge}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[currentStatus].dot}`}
                />
                {STATUS_CONFIG[currentStatus].label}
              </span>
            </p>
          )}

          {/* Flow infographic */}
          <div className="bg-gray-50 rounded-xl p-4 border">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Review Pipeline
            </p>
            {/* Main pipeline */}
            <div className="flex items-center gap-1 flex-wrap">
              {PIPELINE.map((status, i) => (
                <div key={status} className="flex items-center gap-1">
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${STATUS_CONFIG[status].badge}`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${STATUS_CONFIG[status].dot}`}
                    />
                    {STATUS_CONFIG[status].label}
                  </div>
                  {i < PIPELINE.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  )}
                </div>
              ))}
            </div>
            {/* Rejected note */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${STATUS_CONFIG.REJECTED.badge}`}
              >
                <span className="w-2 h-2 rounded-full bg-red-400" />
                Rejected
              </div>
              <span className="text-xs text-gray-400">
                can be set from any stage
              </span>
            </div>
          </div>

          {/* Status options */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Select new status
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(STATUS_CONFIG) as AppStatus[]).map((status) => {
                const cfg = STATUS_CONFIG[status];
                const isCurrent = status === currentStatus;
                const isSelected = status === selected;
                return (
                  <button
                    key={status}
                    type="button"
                    disabled={isCurrent}
                    onClick={() => setSelected(status)}
                    className={`relative flex items-start gap-2.5 p-3 rounded-xl border-2 text-left transition-all
                      ${isCurrent ? "opacity-40 cursor-not-allowed border-transparent bg-gray-100" : "cursor-pointer hover:border-gray-300"}
                      ${isSelected ? `border-current ${cfg.badge}` : "border-transparent bg-gray-50"}
                    `}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full mt-0.5 shrink-0 ${cfg.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 leading-none mb-0.5">
                        {cfg.label}
                        {isCurrent && (
                          <span className="ml-1 text-gray-400 font-normal">
                            (current)
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 leading-snug">
                        {cfg.description}
                      </p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-current shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => (ref as any)?.current?.close()}
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-sm bg-brand-orange text-white hover:bg-brand-orange/90 border-none min-w-28"
              disabled={!selected || isPending}
              onClick={handleConfirm}
            >
              {isPending ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                "Confirm"
              )}
            </button>
          </div>
        </div>
      </Modal>
    );
  },
);

StatusUpdateModal.displayName = "StatusUpdateModal";
export default StatusUpdateModal;
