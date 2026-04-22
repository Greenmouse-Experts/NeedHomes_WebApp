import { useState } from "react";
import { Share2, Check } from "lucide-react";

export default function ShareLink({ route }: { route: string }) {
  const [copied, setCopied] = useState(false);
  const trim_investors = route.replace("/investors", "");

  const handleShare = async () => {
    const url = window.location.origin + trim_investors;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — silently ignore
    }
  };

  return (
    <div
      className="tooltip tooltip-bottom"
      data-tip={copied ? "Copied!" : "Copy share link"}
    >
      <button
        onClick={handleShare}
        className="btn btn-primary btn-soft  fade ring"
      >
        {copied ? (
          <Check className="w-5 h-5 text-success" />
        ) : (
          <Share2 className="w-5 h-5" />
        )}{" "}
        Share
      </button>
    </div>
  );
}
