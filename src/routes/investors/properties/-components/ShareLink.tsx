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
    <button
      onClick={handleShare}
      className="btn btn-outline w-full sm:w-auto gap-2"
    >
      {copied ? (
        <Check className="w-4 h-4 text-success" />
      ) : (
        <Share2 className="w-4 h-4" />
      )}
      {copied ? "Copied!" : "Share"}
    </button>
  );
}
