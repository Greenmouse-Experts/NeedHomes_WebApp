import React from "react";
import { Loader2 } from "lucide-react";

interface WorkInProgressProps {
  message?: string;
}

const WorkInProgress: React.FC<WorkInProgressProps> = ({
  message = "Work in progress...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-8 rounded-lg bg-base-100 shadow-md text-base-content">
      <Loader2 className="w-16 h-16 animate-spin mb-4 text-primary" />
      <h6 className="text-lg font-semibold text-center">{message}</h6>
      <p className="text-sm text-base-content/70 text-center mt-1">
        Please check back later.
      </p>
    </div>
  );
};

export default WorkInProgress;
