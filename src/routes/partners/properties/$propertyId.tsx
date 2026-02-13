import apiClient, { type ApiResponse } from "@/api/simpleApi";
import Modal from "@/components/modals/DialogModal";
import { Button } from "@/components/ui/Button";
import { extract_message } from "@/helpers/apihelpers";
import { useModal } from "@/store/modals";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Copy, Megaphone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Promotion {
  id: string;
  propertyId: string;
  partnerId: string;
  promotionLink: string;
  clicks: number;
  conversions: number;
  createdAt: string;
}

export const Route = createFileRoute("/partners/properties/$propertyId")({
  component: PropertyLayout,
});

function PropertyLayout() {
  const navigate = useNavigate();
  const { ref, showModal } = useModal();
  const [promoLink, setPromoLink] = useState<string>("");
  const { propertyId } = Route.useParams();

  const mutation = useMutation<ApiResponse<Promotion>>({
    mutationFn: async () => {
      let resp = await apiClient.post("/partners/promotions", {
        propertyId: propertyId,
      });
      return resp.data;
    },
    onSuccess: (resp: ApiResponse<Promotion>) => {
      setPromoLink(resp.data.promotionLink);
      showModal();
    },
  });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(promoLink);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="property-container space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <Button
          variant="outline"
          leftIcon={<ChevronLeft className="w-5 h-5" />}
          onClick={() => navigate({ to: "/partners/properties" })}
          className="w-full sm:w-auto"
        >
          Back to Properties
        </Button>

        <Button
          variant="primary"
          disabled={mutation.isPending}
          rightIcon={<Megaphone className="w-5 h-5" />}
          onClick={() => {
            toast.promise(mutation.mutateAsync(), {
              loading: "Generating link...",
              success: "Link generated!",
              error: extract_message,
            });
          }}
          className="w-full sm:w-auto"
        >
          Promote Now
        </Button>
      </div>

      <Modal ref={ref} title="Share Property">
        <div className="space-y-6">
          {/* Social Icons Placeholder */}
          <div className="flex items-center gap-4 justify-start">
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(promoLink)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white hover:opacity-90 transition-opacity"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(promoLink)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-[#0077b5] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(promoLink)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-[#1877f2] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href={`https://www.reddit.com/submit?url=${encodeURIComponent(promoLink)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-[#ff4500] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.056 1.597.04.282.063.567.063.856 0 2.83-3.185 5.132-7.114 5.132-3.929 0-7.114-2.302-7.114-5.132 0-.285.022-.566.06-.844a1.752 1.752 0 0 1-1.05-1.609c0-.968.786-1.754 1.754-1.754.463 0 .875.18 1.179.472 1.187-.813 2.787-1.355 4.553-1.447l.88-4.126a.175.175 0 0 1 .192-.135l2.72.573a1.25 1.25 0 0 1 1.156-.744zM8.967 12.846c-.703 0-1.282.58-1.282 1.281 0 .702.58 1.282 1.282 1.282.701 0 1.281-.58 1.281-1.282 0-.701-.58-1.281-1.281-1.281zm6.066 0c-.702 0-1.282.58-1.282 1.281 0 .702.58 1.282 1.282 1.282.702 0 1.281-.58 1.281-1.282 0-.701-.58-1.281-1.281-1.281zm-6.014 3.204s1.059 1.215 3.147 1.215 3.147-1.215 3.147-1.215a.131.131 0 0 0-.02-.182.135.135 0 0 0-.19.035s-.842.969-2.937.969c-2.096 0-2.937-.969-2.937-.969a.135.135 0 0 0-.189-.035.13.13 0 0 0-.02.182z" />
              </svg>
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(promoLink)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-[#25d366] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
            >
              <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">
                Property Link
              </label>
              <button
                onClick={copyToClipboard}
                className="text-sm flex items-center gap-1 text-pink-500 font-semibold hover:text-pink-600"
              >
                <Copy size={14} />
                Copy link
              </button>
            </div>
            <div className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl break-all text-sm text-gray-600">
              {promoLink}
            </div>
          </div>
        </div>
      </Modal>

      {/* This renders index.tsx or photos.tsx */}
      <Outlet />
    </div>
  );
}
