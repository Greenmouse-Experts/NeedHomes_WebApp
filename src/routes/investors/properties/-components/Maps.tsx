import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import Modal, { type ModalHandle } from "@/components/modals/DialogModal";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

function loadGoogleMapsScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) return resolve();
    if (document.getElementById("gmap-script")) {
      document.getElementById("gmap-script")!.addEventListener("load", () => resolve());
      return;
    }
    const script = document.createElement("script");
    script.id = "gmap-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function GoogleMap({
  latitude,
  longitude,
  location,
}: {
  latitude: number;
  longitude: number;
  location?: string;
}) {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadGoogleMapsScript().then(() => {
      if (!divRef.current) return;
      const pos = { lat: latitude, lng: longitude };
      const map = new window.google.maps.Map(divRef.current, {
        center: pos,
        zoom: 15,
      });
      new window.google.maps.Marker({ position: pos, map, title: location });
    });
  }, [latitude, longitude, location]);

  return <div ref={divRef} className="h-full w-full" />;
}

export default function Maps({
  location,
  latitude,
  longitude,
}: {
  location?: string;
  latitude?: number | null;
  longitude?: number | null;
}) {
  const modalRef = useRef<ModalHandle>(null);
  const hasCoords = latitude != null && longitude != null;

  return (
    <>
      <Modal ref={modalRef} title={location ?? "Property Location"}>
        <div className="h-96 w-full rounded-lg overflow-hidden">
          {hasCoords ? (
            <GoogleMap
              latitude={latitude!}
              longitude={longitude!}
              location={location}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
              Location coordinates not available
            </div>
          )}
        </div>
      </Modal>

      <button
        type="button"
        onClick={() => modalRef.current?.open()}
        className="btn btn-outline btn-sm gap-2"
      >
        <MapPin size={16} />
        View on Map
      </button>
    </>
  );
}
