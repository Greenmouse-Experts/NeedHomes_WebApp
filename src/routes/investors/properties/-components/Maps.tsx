import { useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin } from "lucide-react";
import Modal, { type ModalHandle } from "@/components/modals/DialogModal";

// Fix default marker icons broken by bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

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
            <MapContainer
              center={[latitude!, longitude!]}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <Marker position={[latitude!, longitude!]}>
                {location && <Popup>{location}</Popup>}
              </Marker>
            </MapContainer>
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
