import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const nav = useNavigate();
  return (
    <div className="flex flex-col my-2 w-fit">
      <div
        className="btn btn-primary btn-lg btn-soft ring fade"
        onClick={() => {
          window.history.back();
        }}
      >
        <ArrowLeft size={20} /> Go back
      </div>
    </div>
  );
}
